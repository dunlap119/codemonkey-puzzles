import { DIR_DELTA } from './grid.js';
import { draw, getCellSize } from '../renderer/canvas.js';

export class Animator {
  constructor(grid, onComplete, onError) {
    this.grid = grid;
    this.onComplete = onComplete;
    this.onError = onError;
    this.running = false;
    this.animState = {
      pixelX: 0,
      pixelY: 0,
      direction: 0,
      sparkles: [],
      actorStates: {}, // { goat: { pixelX, pixelY, direction }, ... }
    };
    this.speedMs = 300;
  }

  setSpeed(level) {
    this.speedMs = 700 - level * 120;
  }

  stop() {
    this.running = false;
  }

  async play(actionQueue) {
    this.running = true;
    const cs = getCellSize();
    this.animState.pixelX = this.grid.monkey.x * cs;
    this.animState.pixelY = this.grid.monkey.y * cs;
    this.animState.direction = this.grid.monkey.direction;
    this.animState.sparkles = [];

    // Initialize actor anim states
    this.animState.actorStates = {};
    for (const [type, actor] of Object.entries(this.grid.actors)) {
      this.animState.actorStates[type] = {
        pixelX: actor.x * cs,
        pixelY: actor.y * cs,
        direction: actor.direction || 0,
      };
    }

    draw(this.grid, this.animState);

    for (const action of actionQueue) {
      if (!this.running) return;

      if (action.actor) {
        // Actor-targeted actions
        switch (action.type) {
          case 'step':
            await this._animateActorStep(action.actor, action.count);
            break;
          case 'turn':
            this._applyActorTurn(action.actor, action.delta);
            draw(this.grid, this.animState);
            await this._wait(150);
            break;
          case 'turnTo':
            this._applyActorTurnTo(action.actor, action.targetX, action.targetY);
            draw(this.grid, this.animState);
            await this._wait(150);
            break;
          case 'hit':
            await this._animateHit(action.actor, action.targetX, action.targetY);
            break;
        }
      } else {
        // Monkey actions
        switch (action.type) {
          case 'step':
            await this._animateStep(action.count);
            break;
          case 'turn':
            this._applyTurn(action.delta);
            draw(this.grid, this.animState);
            await this._wait(150);
            break;
          case 'turnTo':
            this._applyTurnTo(action.targetX, action.targetY);
            draw(this.grid, this.animState);
            await this._wait(150);
            break;
          case 'grab':
            await this._animateGrab();
            break;
          case 'drop':
            await this._animateDrop();
            break;
          case 'wait':
            this.grid.stateCounter++;
            draw(this.grid, this.animState);
            await this._wait(this.speedMs);
            break;
        }
      }

      if (!this.running) return;
    }

    // Check win condition
    if (this.running) {
      if (this.grid.allBananasCollected()) {
        this.onComplete(true);
      } else {
        const remaining = this.grid.entities
          .filter(e => e.type === 'banana' && !e.green && !e.removed).length;
        if (remaining > 0) {
          this.onError(
            `The monkey still needs to collect ${remaining} banana${remaining > 1 ? 's' : ''}! Make sure it walks to every banana.`
          );
        }
        this.onComplete(false);
      }
    }
  }

  // --- Monkey movement ---

  async _animateStep(count) {
    const cs = getCellSize();
    const backward = count < 0;
    const steps = Math.abs(count);

    for (let i = 0; i < steps; i++) {
      if (!this.running) return;

      const next = this.grid.getNextCell(
        this.grid.monkey.x,
        this.grid.monkey.y,
        backward ? (this.grid.monkey.direction + 2) % 4 : this.grid.monkey.direction
      );

      if (!this.grid.isInBounds(next.x, next.y)) {
        this.running = false;
        this.onError("The monkey can't go there -- it would fall off the edge!");
        this.onComplete(false);
        return;
      }

      if (!this.grid.isWalkable(next.x, next.y)) {
        this.running = false;
        this.onError("The monkey bumped into a bush! Find a way around it.");
        this.onComplete(false);
        return;
      }

      const startX = this.animState.pixelX;
      const startY = this.animState.pixelY;
      const endX = next.x * cs;
      const endY = next.y * cs;

      await this._tween(startX, startY, endX, endY, this.speedMs);

      this.grid.monkey.x = next.x;
      this.grid.monkey.y = next.y;
      this.animState.pixelX = endX;
      this.animState.pixelY = endY;

      // Auto-collect banana when stepping on it (if autoGrab or always for non-green/non-frozen)
      const banana = this.grid.entities.find(
        e => e.type === 'banana' && e.x === next.x && e.y === next.y && !e.removed
      );
      if (banana && !banana.frozen) {
        if (banana.green) {
          // Don't auto-grab green bananas
        } else {
          banana.removed = true;
        }
      }

      // Auto-collect match
      this.grid.removeMatchAt(next.x, next.y);

      draw(this.grid, this.animState);
    }
  }

  _applyTurn(delta) {
    this.grid.monkey.direction = (this.grid.monkey.direction + delta + 4) % 4;
    this.animState.direction = this.grid.monkey.direction;
  }

  _applyTurnTo(targetX, targetY) {
    const newDir = this.grid.directionTo(
      this.grid.monkey.x, this.grid.monkey.y, targetX, targetY
    );
    this.grid.monkey.direction = newDir;
    this.animState.direction = newDir;
  }

  async _animateGrab() {
    const mx = this.grid.monkey.x;
    const my = this.grid.monkey.y;

    // Try to grab banana
    const banana = this.grid.removeBananaAt(mx, my);
    if (banana) {
      if (banana.green) {
        this.running = false;
        this.onError("You grabbed a green banana! Green bananas aren't ripe yet.");
        this.onComplete(false);
        return;
      }
      if (banana.frozen) {
        this.running = false;
        this.onError("The banana is frozen! Use the goat to break the ice first.");
        this.onComplete(false);
        return;
      }
      this.grid.carrying = true;
      const sparkle = { x: mx, y: my, alpha: 1, active: true };
      this.animState.sparkles.push(sparkle);
      draw(this.grid, this.animState);
      await this._fadeSparkle(sparkle);
    } else {
      // Try to grab match
      const match = this.grid.removeMatchAt(mx, my);
      if (match) {
        this.grid.carrying = true;
        const sparkle = { x: mx, y: my, alpha: 1, active: true };
        this.animState.sparkles.push(sparkle);
        draw(this.grid, this.animState);
        await this._fadeSparkle(sparkle);
      } else {
        await this._wait(100);
      }
    }
  }

  async _animateDrop() {
    const mx = this.grid.monkey.x;
    const my = this.grid.monkey.y;
    this.grid.carrying = false;
    const sparkle = { x: mx, y: my, alpha: 1, active: true };
    this.animState.sparkles.push(sparkle);
    draw(this.grid, this.animState);
    await this._fadeSparkle(sparkle);
  }

  // --- Actor movement ---

  async _animateActorStep(actorType, count) {
    const cs = getCellSize();
    const actorGrid = this.grid.actors[actorType];
    const actorAnim = this.animState.actorStates[actorType];
    if (!actorGrid || !actorAnim) return;

    const backward = count < 0;
    const steps = Math.abs(count);

    for (let i = 0; i < steps; i++) {
      if (!this.running) return;

      const moveDir = backward ? (actorGrid.direction + 2) % 4 : actorGrid.direction;
      const d = DIR_DELTA[moveDir];
      const nextX = actorGrid.x + d.dx;
      const nextY = actorGrid.y + d.dy;

      if (!this.grid.isInBounds(nextX, nextY)) {
        this.running = false;
        this.onError(`The ${actorType} can't go there -- it would fall off the edge!`);
        this.onComplete(false);
        return;
      }

      const startX = actorAnim.pixelX;
      const startY = actorAnim.pixelY;
      const endX = nextX * cs;
      const endY = nextY * cs;

      await this._tweenActor(actorAnim, startX, startY, endX, endY, this.speedMs);

      actorGrid.x = nextX;
      actorGrid.y = nextY;
      actorAnim.pixelX = endX;
      actorAnim.pixelY = endY;

      // Update the entity position too
      const entity = this.grid.entities.find(
        e => e.type === actorType && e.isActor && !e.removed
      );
      if (entity) {
        entity.x = nextX;
        entity.y = nextY;
      }

      draw(this.grid, this.animState);
    }
  }

  _applyActorTurn(actorType, delta) {
    const actorGrid = this.grid.actors[actorType];
    const actorAnim = this.animState.actorStates[actorType];
    if (!actorGrid || !actorAnim) return;
    actorGrid.direction = (actorGrid.direction + delta + 4) % 4;
    actorAnim.direction = actorGrid.direction;

    const entity = this.grid.entities.find(
      e => e.type === actorType && e.isActor && !e.removed
    );
    if (entity) entity.direction = actorGrid.direction;
  }

  _applyActorTurnTo(actorType, targetX, targetY) {
    const actorGrid = this.grid.actors[actorType];
    const actorAnim = this.animState.actorStates[actorType];
    if (!actorGrid || !actorAnim) return;
    const newDir = this.grid.directionTo(actorGrid.x, actorGrid.y, targetX, targetY);
    actorGrid.direction = newDir;
    actorAnim.direction = newDir;

    const entity = this.grid.entities.find(
      e => e.type === actorType && e.isActor && !e.removed
    );
    if (entity) entity.direction = newDir;
  }

  async _animateHit(actorType, targetX, targetY) {
    const cs = getCellSize();
    const actorAnim = this.animState.actorStates[actorType];
    if (!actorAnim) return;

    // Bump animation toward target
    const origX = actorAnim.pixelX;
    const origY = actorAnim.pixelY;
    const bumpX = origX + (targetX * cs - origX) * 0.3;
    const bumpY = origY + (targetY * cs - origY) * 0.3;

    // Bump forward
    await this._tweenActor(actorAnim, origX, origY, bumpX, bumpY, 100);
    draw(this.grid, this.animState);

    // Unfreeze the entity
    this.grid.unfreezeAt(targetX, targetY);

    // Sparkle at target
    const sparkle = { x: targetX, y: targetY, alpha: 1, active: true };
    this.animState.sparkles.push(sparkle);
    draw(this.grid, this.animState);

    // Bump back
    await this._tweenActor(actorAnim, bumpX, bumpY, origX, origY, 100);
    draw(this.grid, this.animState);

    await this._fadeSparkle(sparkle);
  }

  // --- Helpers ---

  async _fadeSparkle(sparkle) {
    const start = performance.now();
    await new Promise(resolve => {
      const fade = (now) => {
        const t = (now - start) / 400;
        if (t >= 1) {
          sparkle.active = false;
          draw(this.grid, this.animState);
          resolve();
          return;
        }
        sparkle.alpha = 1 - t;
        draw(this.grid, this.animState);
        requestAnimationFrame(fade);
      };
      requestAnimationFrame(fade);
    });
  }

  _tween(startX, startY, endX, endY, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const frame = (now) => {
        if (!this.running) { resolve(); return; }
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        this.animState.pixelX = startX + (endX - startX) * eased;
        this.animState.pixelY = startY + (endY - startY) * eased;
        draw(this.grid, this.animState);
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });
  }

  _tweenActor(actorAnim, startX, startY, endX, endY, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const frame = (now) => {
        if (!this.running) { resolve(); return; }
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        actorAnim.pixelX = startX + (endX - startX) * eased;
        actorAnim.pixelY = startY + (endY - startY) * eased;
        draw(this.grid, this.animState);
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(frame);
    });
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
