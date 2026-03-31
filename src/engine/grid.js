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
  }

  reset() {
    this.monkey = { ...this._initialMonkey };
    this.entities = this._initialEntities.map(e => ({ ...e, removed: false }));
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
      .filter(e => e.type === 'banana')
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
      return true;
    }
    return false;
  }

  directionTo(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    // Snap to the cardinal direction with greatest magnitude
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? DIR_RIGHT : DIR_LEFT;
    } else {
      return dy >= 0 ? DIR_DOWN : DIR_UP;
    }
  }
}
