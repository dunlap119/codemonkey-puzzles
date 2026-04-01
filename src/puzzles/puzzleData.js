// All 13 puzzle definitions
// Direction: 0=right, 1=down, 2=left, 3=up
// Entity types: 'banana', 'bush', 'turtle'

const puzzles = [
  // ---- Puzzle 1: First Steps ----
  {
    id: 1,
    title: 'First Steps',
    concept: 'step N',
    gridWidth: 5,
    gridHeight: 1,
    monkeyStart: { x: 0, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 3, y: 0 },
    ],
    autoGrab: true, // stepping on banana auto-collects
    starterCode: '# Use step to move the monkey!\n# Example: step 3\n',
    hint: 'Type step followed by the number of squares to move. Count how many squares are between the monkey and the banana!',
    starThresholds: [1, 1, 1], // lines for 1/2/3 stars
  },

  // ---- Puzzle 2: A Longer Walk ----
  {
    id: 2,
    title: 'A Longer Walk',
    concept: 'counting steps',
    gridWidth: 8,
    gridHeight: 1,
    monkeyStart: { x: 0, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 6, y: 0 },
    ],
    autoGrab: true,
    starterCode: '# How many steps to the banana?\n',
    hint: 'Count carefully! The banana is further away this time.',
    starThresholds: [1, 1, 1],
  },

  // ---- Puzzle 3: Turn and Step ----
  {
    id: 3,
    title: 'Turn and Step',
    concept: 'turn left/right',
    gridWidth: 5,
    gridHeight: 5,
    monkeyStart: { x: 0, y: 2, direction: 0 },
    entities: [
      { type: 'banana', x: 2, y: 4 },
    ],
    autoGrab: true,
    starterCode: '# Move right, then turn to go down!\n# Use: turn right or turn left\n',
    hint: 'First step 2 to go right, then turn right to face downward, then step 2 more.',
    starThresholds: [4, 3, 3],
    requiredCommands: ['turn'],
  },

  // ---- Puzzle 4: Two Bananas ----
  {
    id: 4,
    title: 'Two Bananas',
    concept: 'sequencing',
    gridWidth: 5,
    gridHeight: 5,
    monkeyStart: { x: 0, y: 2, direction: 0 },
    entities: [
      { type: 'banana', x: 1, y: 1 },
      { type: 'banana', x: 1, y: 4 },
    ],
    autoGrab: true,
    starterCode: '# Collect BOTH bananas!\n',
    hint: 'Go to the top banana first: step 1, turn left, step 1. Then turn around to get the bottom one.',
    starThresholds: [10, 8, 7],
  },

  // ---- Puzzle 5: Turn to Banana ----
  {
    id: 5,
    title: 'Turn to Banana',
    concept: 'turnTo',
    gridWidth: 8,
    gridHeight: 3,
    monkeyStart: { x: 0, y: 1, direction: 1 }, // facing down
    entities: [
      { type: 'banana', x: 6, y: 1 },
    ],
    autoGrab: true,
    starterCode: '# The monkey is facing the wrong way!\n# turnTo banana makes it face the banana\nturnTo banana\n',
    hint: 'turnTo banana rotates the monkey to face the banana. Then just step the right number!',
    starThresholds: [3, 2, 2],
    requiredCommands: ['turnTo'],
  },

  // ---- Puzzle 6: Step DistanceTo ----
  {
    id: 6,
    title: 'Step DistanceTo',
    concept: 'distanceTo',
    gridWidth: 8,
    gridHeight: 3,
    monkeyStart: { x: 0, y: 1, direction: 0 },
    entities: [
      { type: 'banana', x: 5, y: 1 },
    ],
    autoGrab: true,
    starterCode: '# Instead of counting, let the code do it!\n# step distanceTo banana\n',
    hint: 'distanceTo banana returns the number of steps to the banana. Use it inside step: step distanceTo banana',
    starThresholds: [2, 1, 1],
    requiredCommands: ['distanceTo'],
  },

  // ---- Puzzle 7: Turn To + Distance To ----
  {
    id: 7,
    title: 'Turn To + Distance To',
    concept: 'arrays: bananas[0]',
    gridWidth: 8,
    gridHeight: 6,
    monkeyStart: { x: 0, y: 2, direction: 0 },
    entities: [
      { type: 'banana', x: 4, y: 2 },
      { type: 'banana', x: 4, y: 5 },
    ],
    autoGrab: true,
    starterCode: '# Two bananas! Use bananas[0] and bananas[1]\nturnTo bananas[0]\nstep distanceTo bananas[0]\n# Now get the second one!\n',
    hint: 'After collecting the first banana, use turnTo bananas[1] and step distanceTo bananas[1] to reach the second one.',
    starThresholds: [8, 6, 6],
    requiredCommands: ['turnTo', 'distanceTo'],
  },

  // ---- Puzzle 8: Watch Out for Bushes! ----
  {
    id: 8,
    title: 'Watch Out for Bushes!',
    concept: 'obstacles',
    gridWidth: 7,
    gridHeight: 5,
    monkeyStart: { x: 0, y: 1, direction: 0 },
    entities: [
      { type: 'banana', x: 5, y: 1 },
      { type: 'bush', x: 3, y: 0 },
      { type: 'bush', x: 3, y: 1 },
      { type: 'bush', x: 3, y: 2 },
    ],
    autoGrab: true,
    starterCode: '# Bushes block the way! Go around them.\n',
    hint: 'Go right 2 steps, turn right to go down, step past the bushes, turn left, step right, then turn left and go up to the banana. The monkey collects bananas automatically!',
    starThresholds: [10, 8, 7],
  },

  // ---- Puzzle 9: Loop the Loop ----
  {
    id: 9,
    title: 'Loop the Loop',
    concept: 'for loops',
    gridWidth: 6,
    gridHeight: 1,
    monkeyStart: { x: 0, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 1, y: 0 },
      { type: 'banana', x: 2, y: 0 },
      { type: 'banana', x: 3, y: 0 },
      { type: 'banana', x: 4, y: 0 },
    ],
    autoGrab: true,
    starterCode: '# 4 bananas in a row! Use a loop:\n# for i in [1..4]\n#   step 1\n',
    hint: 'A for loop repeats code. for i in [1..4] runs the indented code 4 times. Put step 1 inside the loop!',
    starThresholds: [4, 3, 3],
    requiredCommands: ['for'],
  },

  // ---- Puzzle 10: Staircase ----
  {
    id: 10,
    title: 'Staircase',
    concept: 'loop patterns',
    gridWidth: 7,
    gridHeight: 7,
    monkeyStart: { x: 0, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 1, y: 1 },
      { type: 'banana', x: 2, y: 2 },
      { type: 'banana', x: 3, y: 3 },
    ],
    autoGrab: true,
    starterCode: '# Each banana is 1 right and 1 down\n# Find the pattern!\n',
    hint: 'The pattern repeats: step 1, turn right, step 1, turn left. Put it in a for i in [1..3] loop!',
    starThresholds: [7, 6, 5],
    requiredCommands: ['for'],
  },

  // ---- Puzzle 11: Loop with turnTo ----
  {
    id: 11,
    title: 'Loop with turnTo',
    concept: 'for..in arrays',
    gridWidth: 9,
    gridHeight: 1,
    monkeyStart: { x: 4, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 0, y: 0 },
      { type: 'banana', x: 2, y: 0 },
      { type: 'banana', x: 6, y: 0 },
      { type: 'banana', x: 8, y: 0 },
    ],
    autoGrab: true,
    starterCode: '# Loop through all bananas!\n# for b in bananas\n#   turnTo b\n#   step distanceTo b\n',
    hint: 'Use for b in bananas to go through each banana. Inside the loop: turnTo b, step distanceTo b.',
    starThresholds: [5, 4, 4],
    requiredCommands: ['for', 'turnTo', 'distanceTo'],
  },

  // ---- Puzzle 12: Maze Runner ----
  {
    id: 12,
    title: 'Maze Runner',
    concept: 'path planning',
    gridWidth: 7,
    gridHeight: 7,
    monkeyStart: { x: 0, y: 0, direction: 0 },
    entities: [
      { type: 'banana', x: 6, y: 6 },
      // Maze walls
      { type: 'bush', x: 2, y: 0 },
      { type: 'bush', x: 2, y: 1 },
      { type: 'bush', x: 2, y: 2 },
      { type: 'bush', x: 4, y: 2 },
      { type: 'bush', x: 4, y: 3 },
      { type: 'bush', x: 4, y: 4 },
      { type: 'bush', x: 1, y: 4 },
      { type: 'bush', x: 2, y: 4 },
      { type: 'bush', x: 5, y: 5 },
    ],
    autoGrab: true,
    starterCode: '# Navigate the maze to reach the banana!\n# Plan your path carefully.\n',
    hint: 'Go right 1, then down past the first wall, then right past the second wall, then keep going down and right to the banana.',
    starThresholds: [14, 12, 10],
  },

  // ---- Puzzle 13: Function Junction ----
  {
    id: 13,
    title: 'Function Junction',
    concept: 'functions',
    gridWidth: 8,
    gridHeight: 3,
    monkeyStart: { x: 0, y: 1, direction: 0 },
    entities: [
      { type: 'banana', x: 2, y: 1 },
      { type: 'banana', x: 4, y: 1 },
      { type: 'banana', x: 6, y: 1 },
    ],
    autoGrab: true,
    starterCode: '# Define a function to avoid repeating code!\n# goGet = () ->\n#   step 2\n',
    hint: 'Create a function: goGet = () -> then indent step 2 below it. Call it 3 times: goGet() or use a loop!',
    starThresholds: [6, 5, 4],
    requiredCommands: ['->'],
  },
];

export default puzzles;
