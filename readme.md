# Perfect Number Finder

Perfect numbers are number whose factors add up back to that number.

For example, the first perfect number is 6.

The factors of 6 are `1,2,3,6`.

Excluding the last factor (which is 6 itself), they add up to 6.

`1+2=3`
`3+3=6`


The hunt for perfect numbers is a large one, and the biggest found is ~42 million digits long. How can we find these numbers you may ask?

It is relatively easy to find once you have an associated mersenne prime.

## Mersenne Primes

A mersenne prime is a prime number that follows the formula: `2^n - 1 = prime`.

These primes are found to be in close association with perfect numbers, and multiple interesting patterns arise when comparing powers of two with the factors of 2, and these patterns become even more interesting when looking at them with the context of these mersenne prime numbers.

## Finding perfect numbers

The techniques and patterns are all very interesting, and I recommend [watching this veritaserum](https://www.youtube.com/watch?v=Zrv1EDIqHkY&t=406s) video as it covers most of the concepts used in this codebase.

The formula for finding a perfect number based on a mersenne prime (p) is as follows:

`(2^p - 1) * 2^(p-1) = perfect number`

Becuase of this we we find that to unlock a perfect number, we need to find a mersenne prime.

## Finding Mersenne Primes

Because the formula for a mersenne prime is `2^n - 1 = prime`, logically, we can just loop through values of `n` and then figure out if the result of `2^n - 1` is indeed prime. 

Sadly, this takes a lot of compute power, so we took a couple steps to try and speed this up.

### Checking if a number is prime

The easiest way to check for a prime is to loop through all numbers less than the square root of that number. This works because factors go two ways (eg: they are pairs, `1 & 6`, `2 & 3` for 6)

So, we can do the following

```
for i < sqrt(number):
    if number % i: factor found -> not prime
    else: continue
```

We can speed this up a little further by skipping every even number (automatically divisible by two).

```
for i = 3; i < sqrt(number) i+= 2:
...
```

We start at three because we return true automatically if the number is 2, and false if it is less than 2 (no prime numbers under 2).

Thats about it.


## Using the code

- `git clone https://github.com/sojs-coder/Perfect-Number-Finder.git`
- `cd Perfect-Number-Finder`
- `npm i`
- `node index.js <number of workers> <number of n to loop up to>`

You can also just run `node index.js` and it will run up to 1K n with 16 worker threads.

Watch output in `output.txt`. The console will log whenever a new worker is spawned, and `finished_works.txt` logs whenever a worker finishes checking if `2^n - 1` if prime.

# Bye!