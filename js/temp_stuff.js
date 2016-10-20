// Wrote this stuff, and then decided I didn't need it. But if I actually end up needing it, I won't
// have to re-write it.

var scoreToFunction = {
    5: push,
    6: pop,
    7: addTopTwo,
    8: getInputFromUser,
    9: popAndPrintChar,
    10: subtractTopFromNextTop,
    11: swapTopTwoValues,
    12: duplicateTopValue,
    13: skipAheadIfZero,
    14: skipAheadIfNotZero,
    15: skipBackIfZero,
    16: skipBackIfNotZero,
    17: stopProgram
};

// 5   // Finds the score of the next word and pushes it onto the stack. Skips the aforementioned next word.
function push(scoreOfNextWord) {

}

// 6   // Pops the top number off the stack and discards it.
function pop() {

}

// 7   // Adds the top two values on the stack together (as described above)
function addTopTwo() {

}

// 8   // Input a character from the user and push its value on the stack. Waits for a keypress.
function getInputFromUser() {
    // Won't use?
}

// 9   // Pop a number off the stack and output the corresponding ASCII character to the screen.
function popAndPrintChar() {

}

// 10  // Subtract the top value on the stack from the next value on the stack, pushing the result.
function subtractTopFromNextTop() {

}

// 11  // Swap the top two values on the stack.
function swapTopTwoValues() {

}

// 12  // Duplicate the top value.
function duplicateTopValue() {

}

// 13  // Pop a number from the stack, and figure out the score of the next word.
//        If the number from the stack is zero, skip ahead by n words, where n is
//        the score of the next word. (The skipping is actually n+1 words, because
//        the word scored to give us n is also skipped.)
function skipAheadIfZero(scoreOfNextWord) {

}

// 14  // Same as above, except skip if the value on the stack isn’t zero.
function skipAheadIfNotZero(scoreOfNextWord) {

}

// 15  // Skip back n words, if the value on the stack is zero.
function skipBackIfZero(scoreOfNextWord) {

}

// 16  // Skip back if it’s not zero.
function skipBackIfNotZero(scoreOfNextWord) {

}

// 17  // Stop the program.
function stopProgram() {

}
