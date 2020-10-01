/**
 * Convert a bitstream into dots/dashes/pauses
 * 
 * @param string bits - 0s for pauses, 1s for signal
 * @return string - dots/dashes
 */
const decodeBitsAdvanced = bits => {
    // Trim leading/trailing 0s
    bits = bits.match(/^0*((1.*?)?)0*$/)[1];
}


const decodeMorse = morseCode => {
    
}