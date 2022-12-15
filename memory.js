
// Check limit of heap
// https://felixgerschau.com/javascript-heap-out-of-memory-error/
//
// Node 16:
// node --max-old-space-size=8192 memory.js >>8GB
// node memory.js  >>4GB

const array = [];
while (true) {
  // This makes the array bigger on each iteration
  array.push(new Array(10000000));

  const memory = process.memoryUsage();
  console.log((memory.heapUsed / 1024 / 1024 / 1024).toFixed(4), 'GB');
}