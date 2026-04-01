// Commands API: functions injected into student code scope
// Each function queues an action; distanceTo/near return values immediately

import { DIR_RIGHT, DIR_DOWN, DIR_LEFT, DIR_UP, DIR_DELTA } from './grid.js';

export function buildCommandContext(grid, puzzleDef) {
  const actionQueue = [];

  // Shadow state for simulated position tracking (needed for distanceTo/near)
  let simX = grid.monkey.x;
  let simY = grid.monkey.y;
  let simDir = grid.monkey.direction;

  // State counter for sleeping/playing queries
  let simStateCounter = 0;

  // Carrying state for grab/drop
  let simCarrying = false;

  // Track frozen state changes during interpretation
  const frozenOverrides = new Map(); // "x,y" -> boolean

  function step(n) {
    if (n === undefined) n = 1;
    n = Math.round(n);
    if (n === 0) return;
    actionQueue.push({ type: 'step', count: n });
    const d = DIR_DELTA[simDir];
    simX += d.dx * n;
    simY += d.dy * n;
  }

  function turn(direction) {
    const dir = String(direction).toLowerCase().trim();
    if (dir === 'left') {
      actionQueue.push({ type: 'turn', delta: -1 });
      simDir = (simDir + 3) % 4;
    } else if (dir === 'right') {
      actionQueue.push({ type: 'turn', delta: 1 });
      simDir = (simDir + 1) % 4;
    } else {
      throw new Error(`turn expects "left" or "right", got "${direction}"`);
    }
  }

  function turnTo(target) {
    if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
      throw new Error('turnTo expects an object like banana or turtle');
    }
    actionQueue.push({ type: 'turnTo', targetX: target.x, targetY: target.y });
    const dx = target.x - simX;
    const dy = target.y - simY;
    if (Math.abs(dx) >= Math.abs(dy)) {
      simDir = dx >= 0 ? DIR_RIGHT : DIR_LEFT;
    } else {
      simDir = dy >= 0 ? DIR_DOWN : DIR_UP;
    }
  }

  function grab() {
    actionQueue.push({ type: 'grab' });
    simCarrying = true;
  }

  function drop() {
    actionQueue.push({ type: 'drop' });
    simCarrying = false;
  }

  function distanceTo(target) {
    if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
      throw new Error('distanceTo expects an object like banana or turtle');
    }
    return Math.abs(target.x - simX) + Math.abs(target.y - simY);
  }

  function near(target) {
    if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
      throw new Error('near expects an object like banana or turtle');
    }
    // Returns true when monkey is ON the target (distance 0)
    // This makes "until near banana / step 1" walk all the way there
    return Math.abs(target.x - simX) + Math.abs(target.y - simY) === 0;
  }

  function wait() {
    actionQueue.push({ type: 'wait' });
    simStateCounter++;
  }

  // --- Entity proxy creation ---

  function createEntityProxy(entityDef) {
    const proxy = { x: entityDef.x, y: entityDef.y };

    // Always provide frozen() and green() on all entities (default false)
    const key = `${entityDef.x},${entityDef.y}`;
    proxy.frozen = () => {
      if (frozenOverrides.has(key)) return frozenOverrides.get(key);
      return entityDef.frozen || false;
    };
    proxy.green = () => entityDef.green || false;

    // Optional methods based on entity properties
    if (entityDef.hasGlasses !== undefined || entityDef.hasBowTie !== undefined) {
      proxy.hasGlasses = () => entityDef.hasGlasses || false;
      proxy.hasBowTie = () => entityDef.hasBowTie || false;
    }
    if (entityDef.sleeping !== undefined) {
      proxy.sleeping = () => simStateCounter < (entityDef.wakesAt || 0);
    }
    if (entityDef.playing !== undefined) {
      proxy.playing = () => simStateCounter < (entityDef.playsUntil || 0);
    }

    return proxy;
  }

  // --- Actor binding creation (goat, cat, bear, tiger) ---

  function createActorBinding(entityDef, actorType) {
    let actorSimX = entityDef.x;
    let actorSimY = entityDef.y;
    let actorSimDir = entityDef.direction || 0;

    const actor = createEntityProxy(entityDef);

    actor.step = (n) => {
      if (n === undefined) n = 1;
      n = Math.round(n);
      if (n === 0) return;
      actionQueue.push({ type: 'step', actor: actorType, count: n });
      const d = DIR_DELTA[actorSimDir];
      actorSimX += d.dx * n;
      actorSimY += d.dy * n;
    };

    actor.turn = (direction) => {
      const dir = String(direction).toLowerCase().trim();
      if (dir === 'left') {
        actionQueue.push({ type: 'turn', actor: actorType, delta: -1 });
        actorSimDir = (actorSimDir + 3) % 4;
      } else if (dir === 'right') {
        actionQueue.push({ type: 'turn', actor: actorType, delta: 1 });
        actorSimDir = (actorSimDir + 1) % 4;
      } else {
        throw new Error(`turn expects "left" or "right", got "${direction}"`);
      }
    };

    actor.turnTo = (target) => {
      if (!target || typeof target.x !== 'number') {
        throw new Error('turnTo expects an object');
      }
      actionQueue.push({ type: 'turnTo', actor: actorType, targetX: target.x, targetY: target.y });
      const dx = target.x - actorSimX;
      const dy = target.y - actorSimY;
      if (Math.abs(dx) >= Math.abs(dy)) {
        actorSimDir = dx >= 0 ? DIR_RIGHT : DIR_LEFT;
      } else {
        actorSimDir = dy >= 0 ? DIR_DOWN : DIR_UP;
      }
    };

    actor.goto = (target) => {
      if (!target || typeof target.x !== 'number') {
        throw new Error('goto expects an object');
      }
      // turnTo + step distanceTo combined
      actor.turnTo(target);
      const dist = Math.abs(target.x - actorSimX) + Math.abs(target.y - actorSimY);
      if (dist > 0) {
        actor.step(dist);
      }
    };

    actor.hit = (target) => {
      if (target && typeof target.x === 'number') {
        // Auto-goto the target first if not adjacent
        const dist = Math.abs(target.x - actorSimX) + Math.abs(target.y - actorSimY);
        if (dist > 1) {
          actor.goto(target);
        }
        actionQueue.push({ type: 'hit', actor: actorType, targetX: target.x, targetY: target.y });
        // Mark as unfrozen in sim state
        const key = `${target.x},${target.y}`;
        frozenOverrides.set(key, false);
      } else {
        actionQueue.push({ type: 'hit', actor: actorType, targetX: actorSimX, targetY: actorSimY });
      }
    };

    return actor;
  }

  // --- Build entity bindings ---
  const bindings = {};

  // Direction string bindings (so students can write turn left / turn right)
  bindings.left = 'left';
  bindings.right = 'right';

  // Pluralization helper
  function pluralize(name) {
    if (name === 'bush') return 'bushes';
    return name + 's';
  }

  // Entity types to create bindings for
  const entityTypes = new Set(puzzleDef.entities.map(e => e.type));

  for (const type of entityTypes) {
    const entitiesOfType = puzzleDef.entities.filter(e => e.type === type);

    // Actor entities get actor bindings
    if (entitiesOfType.some(e => e.isActor)) {
      for (const e of entitiesOfType) {
        if (e.isActor) {
          const actorBinding = createActorBinding(e, type);
          bindings[type] = actorBinding;
        }
      }
      // Also create plural array for actors
      const items = entitiesOfType.filter(e => e.isActor).map(e => createActorBinding(e, type));
      bindings[pluralize(type)] = items;
    } else {
      // Non-actor entities get simple proxies
      const items = entitiesOfType.map(e => createEntityProxy(e));
      if (items.length === 1) {
        bindings[type] = items[0];
      }
      bindings[pluralize(type)] = items;
    }
  }

  return {
    actionQueue,
    functions: { step, turn, turnTo, grab, drop, distanceTo, near, wait },
    bindings,
  };
}
