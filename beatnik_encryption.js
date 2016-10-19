// COLLECT WORDS

// TODO: Find a dictionary word API
// TODO: Use word API to get N words for each possible word score needed, and populate to score:word[] map

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Maps to A-Z
var scrabble_scores = [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10];

// This map should be filled in by the word API
var scoreWordMap = {
    1: ['a'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: [],
    23: [],
    24: [],
    25: [],
    maxScore: 25
};

var scoreWordMapForTesting = {
    1:  ['a'],
    2:  ['aa'],
    3:  ['aaa'],
    4:  ['aaaa'],
    5:  ['aaaaa'],
    6:  ['aaaaaa'],
    7:  ['aaaaaaa'],
    8:  ['aaaaaaaa'],
    9:  ['aaaaaaaaa'],
    10: ['aaaaaaaaaa'],
    11: ['aaaaaaaaaaa'],
    12: ['aaaaaaaaaaaa'],
    13: ['aaaaaaaaaaaaa'],
    14: ['aaaaaaaaaaaaaa'],
    15: ['aaaaaaaaaaaaaaa'],
    16: ['aaaaaaaaaaaaaaaa'],
    17: ['aaaaaaaaaaaaaaaaa'],
    18: ['aaaaaaaaaaaaaaaaaa'],
    19: ['aaaaaaaaaaaaaaaaaaa'],
    20: ['aaaaaaaaaaaaaaaaaaaa'],
    21: ['aaaaaaaaaaaaaaaaaaaaa'],
    22: ['aaaaaaaaaaaaaaaaaaaaaa'],
    23: ['aaaaaaaaaaaaaaaaaaaaaaa'],
    24: ['aaaaaaaaaaaaaaaaaaaaaaaa'],
    25: ['aaaaaaaaaaaaaaaaaaaaaaaaa']
};

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

// Returns a word at random from the list of words that have the given score.
function getWord(score) {
    // TODO
    var word = scoreWordMapForTesting[score];
    return word + getPunctuation() + getSpaceOrNewline();
}

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

// Returns a String containing one or two words. The first word corresponds to the
// beatnik function being called. The second word corresponds to the argument (if
// the function takes one)
function wordsForFunction(func, scoreArg) {
    if (scoreArg) {
        return getWord(functionToScore[func]) + getWord(scoreArg);
    } else {
        return getWord(functionToScore[func]);
    }
}

// Returns a function that can be called with an argument (when appropriate). The function
// returns a String of the word output for that function.
// TODO: Consider deleting unused methods after everything is finished?
var bn = {
    push: function(scoreArg) { return wordsForFunction("push", scoreArg)},
    pop: function() { return wordsForFunction("pop", null)},
    addTopTwo: function() { return wordsForFunction("addTopTwo", null)},
    getInputFromUser: function() { return wordsForFunction("getInputFromUser", null)},
    popAndPrintChar: function() { return wordsForFunction("popAndPrintChar", null)},
    subtractTopFromNextTop: function() { return wordsForFunction("subtractTopFromNextTop", null)},
    swapTopTwoValues: function() { return wordsForFunction("swapTopTwoValues", null)},
    duplicateTopValue: function() { return wordsForFunction("duplicateTopValue", null)},
    skipAheadIfZero: function(scoreArg) { return wordsForFunction("skipAheadIfZero", scoreArg)},
    skipAheadIfNotZero: function(scoreArg) { return wordsForFunction("skipAheadIfNotZero", scoreArg)},
    skipBackIfZero: function(scoreArg) { return wordsForFunction("skipBackIfZero", scoreArg)},
    skipBackIfNotZero: function(scoreArg) { return wordsForFunction("skipBackIfNotZero", scoreArg)},
    stopProgram: function() { return wordsForFunction("stopProgram", null)}
};

// Takes any string and returns a beatnik program (string) that prints that string.
function beatnikify(str) {
    var stringArray = [];
    for (var i = 0; i < str.length; i++) {
        stringArray.push(pushCharValueToStack(str.charCodeAt(i)));
    }
    for (var j = 0; j < str.length; j++) {
        // TODO: This can be made more interesting later if we have time instead of popping them all at the end.
        stringArray.push(bn.popAndPrintChar());
    }

    return stringArray.join("");
}

// Returns a beatnik program to add the value of the charCode to the top of the stack.
function pushCharValueToStack(charCode) {
    var stringArray = [];
    var valuesToAdd = splitCharValue(charCode);
    stringArray.push(bn.push(valuesToAdd[0]));
    for (var i = 1; i < valuesToAdd.length; i++) {
        stringArray.push(bn.push(valuesToAdd[i]));
        stringArray.push(bn.addTopTwo());
    }
    return stringArray.join("");
}

// Returns an array of ints that add up to the value. If value is <=25, then it just returns the value in
// an array by itself. Otherwise, it splits the value.
function splitCharValue(value) {
    if (value > scoreWordMap.maxScore) {
        var values = [];
        while (value > scoreWordMap.maxScore) {
            console.log(value);
            var subtracted = getRandomInt(1, scoreWordMap.maxScore + 1);
            values.push(subtracted);
            value -= subtracted;
        }
        console.log("Exiting loop");
        return values;
    } else if (value < 1) {
        throw new Error("Value passed to splitCharValue() cannot be less that 1!");
    } else {
        return [value];
    }
}


$(document).ready(function() {
    $('#encoder-form').submit(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var str = $('#encoder-text').val();
        var encrypted = beatnikify(str);
        $('#encoder-results').html('<p>' + encrypted + '</p>');
    });

    $('#decoder-form').submit(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

    });
});
