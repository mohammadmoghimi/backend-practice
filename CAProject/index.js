const fs = require('fs');
const path = require('path');

// Function to read input from the file and parse it
function readInputFromFile(filePath) {
    const input = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.trim());
    const numGroups = parseInt(input[0], 10);
    const groups = [];
    for (let i = 1; i < input.length; i += 2) {
        const A = parseInt(input[i], 10);
        const B = parseInt(input[i + 1], 10);
        groups.push({ A, B });
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

// Main function to handle the input and call the multiplication function
function main() {
    const filePath = path.join(__dirname, 'in.txt');
    const { numGroups, groups } = readInputFromFile(filePath);
    
    groups.forEach(({ A, B }, index) => {
        const bitLength = Math.max(A.toString(2).length, B.toString(2).length);
        const product = optimizedAddAndShift(A, B, bitLength);
        console.log(`Product of group ${index + 1} (A=${A}, B=${B}) is: ${product}`);
    });
}

// Run the main function
main();
