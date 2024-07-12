def optimized_add_and_shift(A, B):
    # Convert inputs to binary strings to determine their bit lengths
    a_bin_length = len(bin(A)) - 2
    b_bin_length = len(bin(B)) - 2
    
    # Determine the length of M
    lengthM = a_bin_length + b_bin_length
    
    # Initialize M to B (extended with zeros to the lengthM)
    M = B << a_bin_length  # Shift B to the left to make space for A
    
    # Loop through each bit of B
    for _ in range(b_bin_length):
        # Check the least significant bit (LSB) of M
        if M & 1:
            # Add A to the most significant bits of M
            M += (A << b_bin_length)
        
        # Handle overflow and shift M right
        if M >= (1 << lengthM):
            # Handle overflow: if there's an overflow, set the MSB to 1 after right shift
            M = (M >> 1) | (1 << (lengthM - 1))
        else:
            # Regular right shift
            M = M >> 1
    
    # Return the final value of M
    return M

# Example usage
A = 11  # 1011 in binary
B = 13  # 1101 in binary
result = optimized_add_and_shift(A, B)
print(f'The product of {A} and {B} is: {result}')
