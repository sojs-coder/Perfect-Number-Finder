const { parentPort, workerData } = require('worker_threads');
const BigNumber = require('bignumber.js');
const fs = require("fs")

var { i: index } = workerData;
function sqrt(bigIntValue) {
    const bigNumberValue = new BigNumber(bigIntValue.toString());
    const sqrtValue = bigNumberValue.sqrt().toFixed(0);
    return BigInt(sqrtValue);
}

function isPrime(number) {
    if (number <= 1n) {
        return false;
    } else if (number === 2n) {
        return true;
    } else if (number % 2n === 0n) {
        return false;
    }

    // Check odd factors up to the square root of the number
    // create a write stream to file "prime-logs-<primenumber>.txt"
    const writeStream = fs.createWriteStream(`./logs/prime-logs-${index}.txt`, { highWaterMark: 0 });
    writeStream.write(`Prime number: ${number}\n`);

    for (let i = 3n; i <= sqrt(number); i += 2n) {
        writeStream.write(`Checking factor: ${i}\n`)
        if (number % i === 0n) {
            writeStream.write(`Factor found: ${i}\n`);
            writeStream.write(`Number is not prime\n`);
            writeStream.end();
            return false;
        }
    }
    writeStream.write(`No factor found\n`);
    writeStream.write(`Number is prime\n`);
    writeStream.end();
    return true;
}

// Listen for messages from the parent thread
var {number} = workerData;
// Perform the calculations and send the result back to the parent thread
const isPrimeResult = isPrime(number);
parentPort.postMessage({ number, isPrimeResult, index });