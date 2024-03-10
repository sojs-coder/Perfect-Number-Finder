const { Worker, isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');

// create log folder if not exists
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}
// read output.txt
const output = fs.readFileSync('./output.txt', 'utf8');
const writeStream = fs.createWriteStream(`./output.txt`);
writeStream.write(output);
const done = fs.createWriteStream(`./finished_works.txt`);
function log(...args) {
    writeStream.write(args.join(' ') + '\n');
}
log("=====================================");
log("Testing for P values of 2^P - 1");
log("Session started at " + new Date().toISOString());
log("=====================================");
const maxWorkers = parseInt(process.argv[2]) || 16;
log(maxWorkers + " workers");
const maxQueue = parseInt(process.argv[3]) || 1000;
log(maxQueue + " max queue");
let activeWorkers = 0;
const queue = [];

// Function to create a worker
function createWorker(data, i) {
    console.log(i, "Worker created", data)
    const worker = new Worker('./worker.js', {
        workerData: {
            number: data,
            i
        }
    });
    activeWorkers++;
    worker.on('message', (message) => {
        done.write(`${message.index}\n`);
        if (message.isPrimeResult) {
            log("FOUND: " +message.number);
        }
        worker.terminate();
        if (queue.length > 0) {
            const [nextData, i] = queue.shift();
            createWorker(nextData, i);
        }
    });
}

// Test function for the main thread
function loadQueue() {

    // read from finished_works.txt
    const finishedWorks = fs.readFileSync('./finished_works.txt', 'utf8').split('\n').map(Number);
    // sort
    finishedWorks.sort((a, b) => a - b);
    // find the max
    const max = finishedWorks[finishedWorks.length - 1];
    // convert max to BigInt
    const maxBigInt = BigInt(max);
    log("Starting from  "+ maxBigInt + " to "+maxQueue+"...")
    for (let i = maxBigInt; i < maxQueue; i++) {
        const data = (2n ** i) - 1n;
        queue.push([data, i]);
    }
}


// Main thread execution
if (isMainThread) {

    loadQueue();
    for(var i = 0; i < maxWorkers; i++) {
        const [data, index] = queue.shift();
        createWorker(data, index);
    }
}