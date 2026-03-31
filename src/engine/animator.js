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
    };
    this.speedMs = 300; // ms per cell
  }

  setSpeed(level) {
    // level 1-5: 1=slow(600ms), 3=normal(300ms), 5=fast(100ms)
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

    draw(this.grid, this.animState);

    for (const action of actionQueue) {
      if (!this.running) return;

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
      }

      if (!this.running) return;
    }

    // Check win condition
    if (this.running) {
      if (this.grid.allBananasCollected()) {
        this.onComplete(true);
      } else {
        const remaining = this.grid.getEntitiesByType('banana').length;
        this.onError(
          `The monkey still needs to collect ${remaining} banana${remaining > 1 ? 's' : ''}! Make sure it walks to every banana.`
        );
        this.onComplete(false);
      }
    }
  }

  async _animateStep(count) {
    const cs = getCellSize();
    for (let i = 0; i < count; i++) {
      if (!this.running) return;

      const next = this.grid.getNextCell(
        this.grid.monkey.x,
        this.grid.monkey.y,
        this.grid.monkey.direction
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

      // Tween to next cell
      const startX = this.animState.pixelX;
      const startY = this.animState.pixelY;
      const endX = next.x * cs;
      const endY = next.y * cs;

      await this._tween(startX, startY, endX, endY, this.speedMs);

      this.grid.monkey.x = next.x;
      this.grid.monkey.y = next.y;
      this.animState.pixelX = endX;
      this.animState.pixelY = endY;

      // Auto-collect banana when stepping on it
      this.grid.removeBananaAt(next.x, next.y);
      draw(this.grid, this.animState);
    }
  }

  _applyTurn(delta) {
    this.grid.monkey.direction = (this.grid.monkey.direction + delta + 4) % 4;
    this.animState.direction = this.grid.monkey.direction;
  }

  _applyTurnTo(targetX, targetY) {
    const newDir = this.grid.directionTo(
      this.grid.monkey.x,
      this.grid.monkey.y,
      targetX,
      targetY
    );
    this.grid.monkey.direction = newDir;
    this.animState.direction = newDir;
  }

  async _animateGrab() {
    const mx = this.grid.monkey.x;
    const my = this.grid.monkey.y;
    const removed = this.grid.removeBananaAt(mx, my);
    if (removed) {
      // Show sparkle
      const sparkle = { x: mx, y: my, alpha: 1, active: true };
      this.animState.sparkles.push(sparkle);
      draw(this.grid, this.animState);

      // Fade out sparkle
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
    } else {
      // No banana here -- not an error, just nothing happens
      await this._wait(100);
    }
  }

  _tween(startX, startY, endX, endY, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const frame = (now) => {
        if (!this.running) { resolve(); return; }
        const t = Math.min((now - start) / duration, 1);
        // Ease in-out
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

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
