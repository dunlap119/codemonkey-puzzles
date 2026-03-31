// Commands API: functions injected into student code scope
// Each function queues an action; distanceTo returns a value immediately

import { DIR_RIGHT, DIR_DOWN, DIR_LEFT, DIR_UP, DIR_DELTA } from './grid.js';

export function buildCommandContext(grid, puzzleDef) {
  const actionQueue = [];

  // Shadow state for simulated position tracking (needed for distanceTo)
  let simX = grid.monkey.x;
  let simY = grid.monkey.y;
  let simDir = grid.monkey.direction;

  function step(n) {
    if (n === undefined) n = 1;
    n = Math.round(n);
    if (n < 1) return;
    actionQueue.push({ type: 'step', count: n });
    // Update simulated position
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
    // Update simulated direction
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
  }

  function distanceTo(target) {
    if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
      throw new Error('distanceTo expects an object like banana or turtle');
    }
    return Math.abs(target.x - simX) + Math.abs(target.y - simY);
  }

  // Build entity bindings: banana, bananas[], turtle, etc.
  const bindings = {};
  const bananas = puzzleDef.entities
    .filter(e => e.type === 'banana')
    .map(e => ({ x: e.x, y: e.y }));
  const turtles = puzzleDef.entities
    .filter(e => e.type === 'turtle')
    .map(e => ({ x: e.x, y: e.y }));

  // Define left/right as string variables so students can write
  // turn left instead of turn "left" (matches CodeMonkey syntax)
  bindings.left = 'left';
  bindings.right = 'right';

  if (bananas.length === 1) {
    bindings.banana = bananas[0];
  }
  bindings.bananas = bananas;

  if (turtles.length === 1) {
    bindings.turtle = turtles[0];
  }
  bindings.turtles = turtles;

  return {
    actionQueue,
    functions: { step, turn, turnTo, grab, distanceTo },
    bindings,
  };
}
