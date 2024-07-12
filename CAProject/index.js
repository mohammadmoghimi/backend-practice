function optimizedAddAndShift(A, B) {
    // Convert A and B to binary strings with padding
    const binaryA = A.toString(2).padStart(4, '0');
    const binaryB = B.toString(2).padStart(4, '0');

    // Initialize M to a binary string with the required length of 8 bits
    let M = '0'.repeat(8);
    let overflow = false ;

    // Add B to M
    M = M.slice(0, -binaryB.length) + binaryB;
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
    for (let i = 0; i < binaryB.length; i++) {
        // Check the least significant bit (LSB) of B
        if ((B & (1 << i)) !== 0) {
            // Shift A left by 4 bits and convert to binary string
            let shiftedA = (A << 4).toString(2).padStart(8, '0');
            // Add A to the most significant bits of M using binary addition
            let { result: newM, carry } = binaryAdd(M, shiftedA);
            M = newM;
            console.log(`After adding A << 4: ${M}`);

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

// Example usage:
const A = 11; 
const B = 13; 
const product = optimizedAddAndShift(A, B);
console.log(`Product of ${A} and ${B} is: ${product}`); 
