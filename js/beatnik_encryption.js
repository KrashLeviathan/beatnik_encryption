// COLLECT WORDS

var wordsLoaded = false;

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Adds words to our own database with the appropriate scrabble score for each word.
function addWordsToDB(wordsArray) {
    $.getJSON('/database.php?action=add_words&words=' + wordsArray.toString(), function (php_json) {
        if (php_json && php_json.words_added != 0) {
            console.log("Learned " + php_json.words_added + " new words!");
        }
    });
}

function getWordsFromDB() {
    $.getJSON('/database.php?action=get_words', function (php_json) {
        $('#loading-words').remove();
        // var badResults = [];
        $(php_json.words).each(function () {
            if (this.score > scoreWordMap.maxScore) {
                // badResults.push(this);
            } else {
                scoreWordMap.scores[this.score].push(this.word);
            }
        });
        console.log("Total number of words being used: " + scoreWordMap.totalCount());
        $('#word-count').html(scoreWordMap.totalCount());
        console.log("scoreWordMap.scores:");
        console.log(scoreWordMap.scores);
        // console.log("Bad Results (score > " + scoreWordMap.maxScore + "): " + badResults.length);
        // console.log(badResults);
        wordsLoaded = true;
    });
}

// This fetches random words from the randomtext.me api to populate our own database.
// The more times the page is loaded, the more verbose the encrypter becomes!
function get_words_api() {
    // Get all words that have already been entered in the DB
    getWordsFromDB();

    // Add more words to the DB to make the program more poetic in the future.
    $.ajax({
        url: 'http://www.randomtext.me/api/gibberish/p-5/100',
        success: function (json) {
            var p = json.text_out;
            var words = $(p).text();
            var words_array = words.replace(/\. ?/g, ' ').split(' ');
            var words1 = [];
            var words2 = [];
            var words3 = [];
            var words4 = [];
            for (var i = 0; i < 100; i++) {
                if (i < 25) {
                    words1.push(words_array[i].toLowerCase());
                } else if (i < 50) {
                    words2.push(words_array[i].toLowerCase());
                } else if (i < 75) {
                    words3.push(words_array[i].toLowerCase());
                } else {
                    words4.push(words_array[i].toLowerCase());
                }
            }
            addWordsToDB(words1);
            addWordsToDB(words2);
            addWordsToDB(words3);
            addWordsToDB(words4);
        }
    });
}

// Maps to A-Z
var scrabble_scores = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];

// This map should be filled in by the word API
var scoreWordMap = {
    scores: {
        1: [],
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
        25: []
    },
    maxScore: 25,
    totalCount: function () {
        var sum = 0;
        for (var score in this.scores) {
            if (this.scores.hasOwnProperty(score)) {
                sum += this.scores[score].length;
            }
        }
        return sum;
    }
};

//noinspection JSUnusedGlobalSymbols
var scoreWordMapForTesting = {
    scores: {
        1: ['T'],
        2: ['TE'],
        3: ['TES'],
        4: ['Test'],
        5: ['TestI'],
        6: ['TestOO'],
        7: ['TestAAA'],
        8: ['TestTest'],
        9: ['TestTestI'],
        10: ['TestTestOO'],
        11: ['TestTestAAA'],
        12: ['TestTestTest'],
        13: ['TestTestTestI'],
        14: ['TestTestTestOO'],
        15: ['TestTestTestAAA'],
        16: ['TestTestTestTest'],
        17: ['TestTestTestTestI'],
        18: ['TestTestTestTestOO'],
        19: ['TestTestTestTestAAA'],
        20: ['TestTestTestTestTest'],
        21: ['TestTestTestTestTestI'],
        22: ['TestTestTestTestTestOO'],
        23: ['TestTestTestTestTestAAA'],
        24: ['TestTestTestTestTestTest'],
        25: ['TestTestTestTestTestTestI']
    }
};

var captializeNextWord = true;

// Returns a word at random from the list of words that have the given score.
function getWord(score) {
    var word = scoreWordMap.scores[score][Math.floor(Math.random() * scoreWordMap.scores[score].length - 1) + 1];

    if (captializeNextWord) {
        word = word.charAt(0).toUpperCase() + word.substring(1);
    }

    var punctuation = getPunctuation();
    var whitespace = getWhitespace();
    captializeNextWord = (whitespace == "<br><br>" || punctuation != "" && punctuation != "," && punctuation != " --");

    return word + punctuation + whitespace;
}


// The distribution object allows you to get random values from a set based on their
// distribution (over 100). The `get` method is bound to the punctuation and whitespace
// objects below. Each key in the `percentages` map is the int percentage, with the value
// being the element with that distribution. The keys do not add up to 100, however. That's
// because any remaining percentage after subtracting all keys from 100 is attributed to
// the `defaultValue`.
var distribution = {
    percentages: {},
    defaultValue: "",
    boundaryValues: {},
    initialized: false,
    get: function () {
        if (!this.initialized) {
            var maxBoundaryValue = 0;
            for (var pKey in this.percentages) {
                if (this.percentages.hasOwnProperty(pKey)) {
                    maxBoundaryValue += parseInt(pKey);
                    this.boundaryValues[maxBoundaryValue] = this.percentages[pKey];
                }
            }
            if (maxBoundaryValue > 100) {
                throw new Error("Cannot have more than 100% in the map of percentages!");
            }
            this.initialized = true;
        }
        var rand = Math.random() * 100;
        for (var bKey in this.boundaryValues) {
            if (this.boundaryValues.hasOwnProperty(bKey) && rand < parseInt(bKey)) {
                return this.boundaryValues[bKey];
            }
        }
        return this.defaultValue;
    }
};

// Punctuation to be distributed at random throughout the encrypted text.
var punctuation = {
    percentages: {
        15: ",",
        10: ".",
        6: "!",
        7: "?",
        1: " --",
        3: "..."
    },
    defaultValue: "",
    boundaryValues: {},
    initialized: false
};
// Returns, at random, either a punctuation mark or an empty string.
var getPunctuation = distribution.get.bind(punctuation);

// Whitespace to be distributed at random throughout the encrypted text.
var whitespace = {
    percentages: {
        25: "<br>",
        6: "<br><br>",
        5: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        4: "<br>&nbsp;&nbsp;&nbsp;",
        3: "<br>&nbsp;&nbsp;",
        2: "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        1: " #"
    },
    defaultValue: " ",
    boundaryValues: {},
    initialized: false
};
// Returns, at random, either a space, several spaces, a newline, or several newlines.
var getWhitespace = distribution.get.bind(whitespace);


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
        // console.log(func + '(' + scoreArg + ')'); // Debugging
        return getWord(functionToScore[func]) + getWord(scoreArg);
    } else {
        // console.log(func); // Debugging
        return getWord(functionToScore[func]);
    }
}

// Returns a function that can be called with an argument (when appropriate). The function
// returns a String of the word output for that function.
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
    for (var i = str.length - 1; i >= 0; i--) {
        // console.log('   ' + str[i] + ': ' + str.charCodeAt(i)); // Debugging
        stringArray.push(pushCharValueToStack(str.charCodeAt(i)));
    }
    for (var j = 0; j < str.length; j++) {
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
    if (value < 1) {
        throw new Error("Value passed to splitCharValue() cannot be less than 1!");
    }
    var values = [];
    while (value > scoreWordMap.maxScore) {
        var subtracted = getRandomInt(1, scoreWordMap.maxScore + 1);
        values.push(subtracted);
        value -= subtracted;
    }
    if (value > 0) {
        values.push(value);
    }
    return values;
}

function encryptFormData(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = "#encryption-results";
    if (!wordsLoaded) {
        alert("Like, wait for the words to be loaded man!");
        return;
    }
    var str = $('#encoder-text').val();
    var encrypted = beatnikify(str);
    $('#encoded-p').html(encrypted)
}

function decryptFormData(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    // I don't think these can use jQuery because the interpreter doesn't use jQuery.
    var interpConsole = document.getElementById('decoder-results');
    var interpStatus = document.getElementById('interp-status');

    window.location.href = "#decryption-results";
    interpStatus.value = '';
    var interpScript = $('#decoder-text').val();
    beatnik_console_eval(interpScript, interpConsole, interpStatus);
}

function displayLetterScoring() {
    var lengthOfSection = Math.floor(scrabble_scores.length / 3) + 1;
    for (var j = 0; j < 3; j++) {
        var innerHtmlItems = [];
        for (var i = lengthOfSection * j; i < lengthOfSection * (j + 1) && i < scrabble_scores.length; i++) {
            var letter = String.fromCharCode(65 + i);
            innerHtmlItems.push('<li><span>' + letter + ':</span>' + scrabble_scores[i] + '</li>');
        }
        $('#letter-scoring' + (j + 1)).html(innerHtmlItems.join(''));
    }
}

// Function to download data to a file
// http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function download(data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

var experimentalEnabled = false;
function enableExperimental() {
    experimentalEnabled = true;
    console.log("Experimental features have been enabled! Please note that the file encryption/decryption " +
      "has proven unstable due to the file size inflation. The resulting file will be two to three orders " +
      "of magnitude larger than the input file. In addition, due to the increased size of the files, it can " +
      "cause the browser to freeze unless using a VERY small (<1kb) file because the run time is so long.");
    $('#file-support').show();
}

function handleEncryptFile(evt) {
    if (!experimentalEnabled) {
        return;
    }
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
        $('#e-file-type').html(file.type);
        $('#d-file-type').val(file.type);
        var reader = new FileReader();
        reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result;
            var encrypted_words = beatnikify(btoa(binaryString)).replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
            download(encrypted_words, file.name + '.txt', 'text/plain');
        };
        reader.readAsBinaryString(file);
    } else {
        alert('Failed to load file.');
    }
}

function handleDecryptFile(evt) {
    if (!experimentalEnabled) {
        return;
    }
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
        var reader = new FileReader();
        reader.onload = function (readerEvt) {
            var interpConsole = document.getElementById('file-decryption-console');
            var interpStatus = document.getElementById('interp-status');
            interpStatus.value = '';
            var interpScript = readerEvt.target.result;
            beatnik_console_eval(interpScript, interpConsole, interpStatus);
            var decoded_results = atob(interpConsole.value);
            var fileType = $('#d-file-type').val();
            download(decoded_results, file.name.replace(/\.txt/, ''), fileType);
        };
        reader.readAsText(file);
    } else {
        alert('Failed to load file.');
    }
}

function initializeClearButtons() {
    $('#clear_decoder').click(function () {
        $('#decoder-results').val('');
        $('#interp-status').val('');
    });
    $('#clear_decoder_form').click(function () {
        $('#decoder-text').val('');
    });
    $('#clear_encoder').click(function () {
        $('#encoded-p').html('');
    });
    $('#clear_encoder_form').click(function () {
        $('#encoder-text').val('');
    });
}

$(document).ready(function () {
    // Fetch words
    get_words_api();

    // Setup the "Copy All" clipboard buttons
    new Clipboard('.btn');

    // Handle encryption/decryption form submissions
    $('#encoder-form').submit(encryptFormData);
    $('#decoder-form').submit(decryptFormData);

    // Handle file uploads for encryption/decryption
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('encode_file').addEventListener('change', handleEncryptFile, false);
        document.getElementById('decode_file').addEventListener('change', handleDecryptFile, false);
    } else {
        $('#file-support').html('<h2>File Encryption/Decryption</h2>' +
            '<p>The File APIs are not fully supported in this browser.</p>');
    }

    // Handle the clearing of form data with the "Clear" buttons
    initializeClearButtons();

    // Display the letter scoring lists
    displayLetterScoring();
});
