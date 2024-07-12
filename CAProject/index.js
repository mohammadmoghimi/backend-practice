const fs = require('fs');
const path = require('path');

// Function to read input from the file and parse it
function readInputFromFile(filePath) {
    const input = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.trim());
    const numGroups = parseInt(input[0], 10);
    const groups = [];
    for (let i = 1; i < input.length; i += 3) {
        const algorithm = parseInt(input[i], 10);
        const A = parseInt(input[i + 1], 10);
        const B = parseInt(input[i + 2], 10);
        groups.push({ algorithm, A, B });
    }
    return { numGroups, groups };
}

// Optimized Add and Shift function (same as your provided code)
function optimizedAddAndShift(A, B, bitLength) {
    // Convert A and B to binary strings with padding
    const binaryA = A.toString(2).padStart(bitLength, '0');
    const binaryB = B.toString(2).padStart(bitLength, '0');

    // Initialize M to a binary string with the required length
    let M = '0'.repeat(2 * bitLength);
    let overflow = false;

    // Add B to M
    M = M.slice(0, -bitLength) + binaryB;
    console.log(`Initial M: ${M}`);

    // Helper function to perform binary addition with carry
    function binaryAdd(bin1, bin2) {
        let carry = 0;
        let result = '';
        for (let i = bin1.length - 1; i >= 0; i--) {
            let bit1 = parseInt(bin1[i], 2);
            let bit2 = parseInt(bin2[i], 2);
            let sum = bit1 + bit2 + carry;
            result = (sum % 2).toString() + result;
            carry = Math.floor(sum / 2);
        }
        return { result, carry };
    }

    // Iterate through each bit of B from least significant to most significant
    for (let i = 0; i < bitLength; i++) {
        // Check the least significant bit (LSB) of B
        if ((B & (1 << i)) !== 0) {
            // Shift A left by bitLength bits and convert to binary string
            let shiftedA = (A << bitLength).toString(2).padStart(2 * bitLength, '0');
            // Add A to the most significant bits of M using binary addition
            let { result: newM, carry } = binaryAdd(M, shiftedA);
            M = newM;
            console.log(`After adding A << ${bitLength}: ${M}`);

            // Store carry to determine if there was an overflow
            if (carry > 0) {
                overflow = true;
            }
        }
        // Shift M right by 1 bit
        M = '0' + M.slice(0, -1);
        if (overflow) {
            // Set the MSB to '1' if there was an overflow
            M = '1' + M.slice(1);
            overflow = false;
        }
        console.log(`After shifting right: ${M}`);
    }

    // Return the final value of M, which is the product of A and B
    return parseInt(M, 2);
}
function decToBin(num, bitLength) {
    let bin = (num >>> 0).toString(2);
    while (bin.length < bitLength) {
        bin = '0' + bin;
    }
    if (num < 0) {
        bin = bin.slice(-bitLength); // take the last `bitLength` bits for negative numbers
    }
    return bin;
}

// Function to perform binary addition
function binAdd(bin1, bin2) {
    let carry = 0;
    let result = '';
    for (let i = bin1.length - 1; i >= 0; i--) {
        const sum = parseInt(bin1[i], 2) + parseInt(bin2[i], 2) + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }
    return result;
}

// Function to perform two's complement (negation)
function flipBits(bin) {
    let flipped = '';
    for (let bit of bin) {
        flipped += (bit === '0' ? '1' : '0');
    }
    return binAdd(flipped, '1'.padStart(bin.length, '0')); // add 1 to the inverted bits
}

// Function to perform arithmetic shift right
function shiftRight(Areg, Q, Qminus1) {
    const combined = Areg + Q + Qminus1;
    const shifted = combined[0] + combined.slice(0, -1); // keep the sign bit
    return {
        Areg: shifted.slice(0, Areg.length),
        Q: shifted.slice(Areg.length, Areg.length + Q.length),
        Qminus1: shifted.slice(-1)
    };
}

// Booth's Algorithm
function boothAlgorithm(A, B, bitLength) {
    const M = decToBin(A, bitLength);
    const negM = flipBits(M); // Two's complement of M
    let Q = decToBin(B, bitLength);
    let Qminus1 = '0'; // Initialize Q-1 with 0
    let Areg = '0'.repeat(bitLength); // Initialize A with zeros

    console.log(`Initial Product: ${Areg}${Q}${Qminus1}`);

    for (let i = 0; i < bitLength; i++) {
        const lastTwoBits = Q.slice(-1) + Qminus1;
        if (lastTwoBits === '01') {
            Areg = binAdd(Areg, M);
            console.log(`Step ${i + 1}: Add M - Product: ${Areg}${Q}${Qminus1}`);
        } else if (lastTwoBits === '10') {
            Areg = binAdd(Areg, negM);
            console.log(`Step ${i + 1}: Subtract M - Product: ${Areg}${Q}${Qminus1}`);
        }
        // Perform arithmetic shift right
        const shifted = shiftRight(Areg, Q, Qminus1);
        Areg = shifted.Areg;
        Q = shifted.Q;
        Qminus1 = shifted.Qminus1;
        console.log(`Step ${i + 1}: Shift Right - Product: ${Areg}${Q}${Qminus1}`);
    }

    // Convert result back to decimal
    const result = parseInt(Areg + Q, 2) * (A < 0 !== B < 0 ? -1 : 1);
    return result;
}

// Main function to handle the input and call the multiplication function
function main() {
    const filePath = path.join(__dirname, 'in.txt');
    const { numGroups, groups } = readInputFromFile(filePath);

    groups.forEach(({ algorithm, A, B }, index) => {
        const bitLength = Math.max(Math.abs(A).toString(2).length, Math.abs(B).toString(2).length) + 1; // Extra bit for sign
        let product;

        if (algorithm === 0) {
            // Use optimized add and shift (already implemented)
            product = optimizedAddAndShift(A, B, bitLength);
            console.log(`Group ${index + 1} (A=${A}, B=${B}) using Optimized Add and Shift:`);
        } else if (algorithm === 1) {
            // Use Booth's algorithm
            product = boothAlgorithm(A, B, bitLength); // Corrected function name
            console.log(`Group ${index + 1} (A=${A}, B=${B}) using Booth algorithm:`);
        } else {
            console.log(`Unknown algorithm type: ${algorithm}`);
            return;
        }

        console.log(`Product: ${product}\n`);
    });
}
// Run the main function
main();