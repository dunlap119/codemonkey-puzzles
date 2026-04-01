import { buildCommandContext } from './commands.js';

const LOOP_LIMIT = 10000;

function injectLoopGuard(js) {
  // Insert a counter check into for/while loop bodies
  const guard = `if(++__guard>${LOOP_LIMIT})throw new Error("LOOP_LIMIT");`;
  // Match for(...){ or while(...){
  let guarded = js.replace(/((?:for|while)\s*\([^)]*\)\s*\{)/g, `$1\n${guard}\n`);
  return `var __guard=0;\n${guarded}`;
}

export class PuzzleError {
  constructor(type, line, message) {
    this.type = type; // 'syntax' | 'runtime'
    this.line = line;
    this.message = message;
  }
}

export function interpret(coffeeSource, grid, puzzleDef) {
  // Step 1: Compile CoffeeScript to JavaScript
  let js;
  try {
    js = CoffeeScript.compile(coffeeSource, { bare: true });
  } catch (e) {
    const line = e.location ? e.location.first_line : null;
    throw new PuzzleError('syntax', line, e.message);
  }

  // Step 2: Build command context
  const { actionQueue, functions, bindings } = buildCommandContext(grid, puzzleDef);

  // Step 3: Inject loop guard
  const guardedJs = injectLoopGuard(js);

  // Step 4: Build sandboxed function
  const paramNames = [
    'step', 'turn', 'turnTo', 'grab', 'drop', 'distanceTo', 'near', 'wait',
    ...Object.keys(bindings),
  ];
  const paramValues = [
    functions.step, functions.turn, functions.turnTo, functions.grab,
    functions.drop, functions.distanceTo, functions.near, functions.wait,
    ...Object.values(bindings),
  ];

  try {
    const fn = new Function(...paramNames, guardedJs);
    fn(...paramValues);
  } catch (e) {
    if (e.message === 'LOOP_LIMIT') {
      throw new PuzzleError(
        'runtime',
        null,
        'Your code ran too many steps! Do you have an infinite loop?'
      );
    }
    throw new PuzzleError('runtime', null, e.message);
  }

  return actionQueue;
}
