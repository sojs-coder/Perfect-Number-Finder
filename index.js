const { Worker, isMainThread, parentPort } = require('worker_threads');
const fs = require('fs');

// create log folder if not exists
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}
const writeStream = fs.createWriteStream(`./output.txt`);
const done = fs.createWriteStream(`./finished_works.txt`);
function log(...args){
    writeStream.write(args.join(' ') + '\n');
}
const maxWorkers = 16;
let activeWorkers = 0;
const queue = [];

// Function to create a worker
function createWorker(data,i) {
    console.log(i,"Worker created",data)
    const worker = new Worker('./worker.js', { workerData: {
        number: data,
        i
    } });
    activeWorkers++;
    worker.on('message', (message) => {
        done.write(`WORKER (${message.index}) DONE: ${message.number}\n`);
        if (message.isPrimeResult) {
            log(message.number);
        }
        activeWorkers--;
        if (queue.length > 0) {
            const [nextData,i] = queue.shift();
            createWorker(nextData,i);
        }
    });
}

// Test function for the main thread
function test() {
    log("Testing for P values of 2^P - 1");
    log("-----------------------------")
    for (let i = 200n; i < 1000; i++) {
        const data = (2n ** i) - 1n;
        if (activeWorkers < maxWorkers) {
            createWorker(data,i);
        } else {
            queue.push([data,i]);
        }
    }
}

// Main thread execution
if (isMainThread) {

    // Call the test function
    test();
}