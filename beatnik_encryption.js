// COLLECT WORDS

// TODO: Find a dictionary word API
// TODO: Use word API to get N words for each possible word score needed, and populate to score:word[] map

// Returns, at random, either a punctuation mark or an empty string.
// STRETCH: Tinker with probabilities to make the poem more "artsy".
//   Ex: Empty string 30% of the time, Comma 20% of the time, Period 10% of the time... etc.
function getPunctuation() {
    // TODO
    return ".";
}

// Returns, at random, either a space, several spaces, a newline, or several newlines.
// STRETCH: Tinker with probabilities to make the poem more "artsy".
//   Ex: single space 50% of the time, single newline 30% of the time, multiple spaces... etc.
function getSpaceOrNewline() {
    // TODO
    return " ";
}

/**
 * Returns a word at random from the list of words that have the given score.
 * @param score
 */
function getWord(score) {
    // TODO
    var word = "word";
    return word + getPunctuation() + getSpaceOrNewline();
}

// MAP SCORES TO FUNCTIONS


// Maps function "names" to the given score for that function
var functionToScore = {
    push: 5,
    pop: 6,
    addTopTwo: 7,
    getInputFromUser: 8,
    popAndPrintChar: 9,
    subtractTopFromNextTop: 10,
    swapTopTwoValues: 11,
    duplicateTopValue: 12,
    skipAheadIfZero: 13,
    skipAheadIfNotZero: 14,
    skipBackIfZero: 15,
    skipBackIfNotZero: 16,
    stopProgram: 17
};

/**
 * Returns a String containing one or two words. The first word corresponds to the
 * beatnik function being called. The second word corresponds to the argument (if
 * the function takes one)
 * @param func
 * @param scoreArg
 * @returns {string}
 */
function wordsForFunction(func, scoreArg) {
    if (nextWord) {
        return getWord(functionToScore[func]) + getWord(scoreArg);
    } else {
        return getWord(functionToScore[func]);
    }
}

// Returns a function that can be called with an argument (when appropriate). The function
// returns a String of the word output for that function.
var bn = {
    push: function(scoreArg) { return wordsForFunction(push, scoreArg)},
    pop: function() { return wordsForFunction(pop, null)},
    addTopTwo: function() { return wordsForFunction(addTopTwo, null)},
    getInputFromUser: function() { return wordsForFunction(getInputFromUser, null)},
    popAndPrintChar: function() { return wordsForFunction(popAndPrintChar, null)},
    subtractTopFromNextTop: function() { return wordsForFunction(subtractTopFromNextTop, null)},
    swapTopTwoValues: function() { return wordsForFunction(swapTopTwoValues, null)},
    duplicateTopValue: function() { return wordsForFunction(duplicateTopValue, null)},
    skipAheadIfZero: function(scoreArg) { return wordsForFunction(skipAheadIfZero, scoreArg)},
    skipAheadIfNotZero: function(scoreArg) { return wordsForFunction(skipAheadIfNotZero, scoreArg)},
    skipBackIfZero: function(scoreArg) { return wordsForFunction(skipBackIfZero, scoreArg)},
    skipBackIfNotZero: function(scoreArg) { return wordsForFunction(skipBackIfNotZero, scoreArg)},
    stopProgram: function() { return wordsForFunction(stopProgram, null)}
};

// TODO: For testing purposes only!
$('encoder-results').text = bn.push(10) + bn.pop() + bn.addTopTwo() + bn.getInputFromUser() + bn.popAndPrintChar() +
        bn.subtractTopFromNextTop() + bn.swapTopTwoValues() + bn.duplicateTopValue() + bn.skipAheadIfZero(10) +
        bn.skipAheadIfNotZero(10) + bn.skipBackIfZero(10) + bn.skipBackIfNotZero(10) + bn.stopProgram();



// WRITE BEATNIKIFY ALGORITHM

// TODO: Create method beatnikify() using algorithm that takes a char and produces the Beatnik program to print that char

// INTEGRATION

// TODO: Read html input to var
// TODO: Parse each char from the input to a number value in an array of ints (scores corresponding to that character)
// TODO: Run each char in the array through the beatnikify() method, appending the output to a writer stream
// TODO: Write the value of the writer stream to a string
// TODO: Output the string to the html page
