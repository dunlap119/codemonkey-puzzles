// Direction constants: 0=right, 1=down, 2=left, 3=up
export const DIR_RIGHT = 0;
export const DIR_DOWN = 1;
export const DIR_LEFT = 2;
export const DIR_UP = 3;

export const DIR_DELTA = [
  { dx: 1, dy: 0 },  // right
  { dx: 0, dy: 1 },  // down
  { dx: -1, dy: 0 }, // left
  { dx: 0, dy: -1 }, // up
];

export class Grid {
  constructor(puzzleDef) {
    this.width = puzzleDef.gridWidth;
    this.height = puzzleDef.gridHeight;
    this.monkey = { ...puzzleDef.monkeyStart };
    this.entities = puzzleDef.entities.map(e => ({ ...e, removed: false }));
    this._initialMonkey = { ...puzzleDef.monkeyStart };
    this._initialEntities = puzzleDef.entities.map(e => ({ ...e }));

    // Actor positions (goat, cat, bear, tiger)
    this.actors = {};
    for (const e of this.entities) {
      if (e.isActor) {
        this.actors[e.type] = { x: e.x, y: e.y, direction: e.direction || 0 };
      }
    }

    // State counter for sleeping/playing mechanics
    this.stateCounter = 0;

    // Carrying state for grab/drop
    this.carrying = false;
  }

  reset() {
    this.monkey = { ...this._initialMonkey };
    this.entities = this._initialEntities.map(e => ({ ...e, removed: false }));
    this.actors = {};
    for (const e of this.entities) {
      if (e.isActor) {
        this.actors[e.type] = { x: e.x, y: e.y, direction: e.direction || 0 };
      }
    }
    this.stateCounter = 0;
    this.carrying = false;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getEntityAt(x, y) {
    return this.entities.find(e => e.x === x && e.y === y && !e.removed);
  }

  isWalkable(x, y) {
    if (!this.isInBounds(x, y)) return false;
    const entity = this.getEntityAt(x, y);
    if (entity && entity.type === 'bush') return false;
    return true;
  }

  getNextCell(fromX, fromY, direction) {
    const d = DIR_DELTA[direction];
    return { x: fromX + d.dx, y: fromY + d.dy };
  }

  allBananasCollected() {
    return this.entities
      .filter(e => e.type === 'banana' && !e.green)
      .every(e => e.removed);
  }

  getEntitiesByType(type) {
    return this.entities.filter(e => e.type === type && !e.removed);
  }

  removeBananaAt(x, y) {
    const banana = this.entities.find(
      e => e.type === 'banana' && e.x === x && e.y === y && !e.removed
    );
    if (banana) {
      banana.removed = true;
      return banana;
    }
    return null;
  }

  removeMatchAt(x, y) {
    const match = this.entities.find(
      e => e.type === 'match' && e.x === x && e.y === y && !e.removed
    );
    if (match) {
      match.removed = true;
      return true;
    }
    return false;
  }

  unfreezeAt(x, y) {
    const entity = this.entities.find(
      e => e.x === x && e.y === y && e.frozen && !e.removed
    );
    if (entity) {
      entity.frozen = false;
      return true;
    }
    return false;
  }

  directionTo(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? DIR_RIGHT : DIR_LEFT;
    } else {
      return dy >= 0 ? DIR_DOWN : DIR_UP;
    }
  }
}
