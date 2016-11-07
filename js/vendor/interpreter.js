console.log("NOTE: The beatnik interpreter was found at http://www.club.cc.cmu.edu/~rjmccall/beatnik.js");
console.log("The only changes made to the interpreter were the addition of these two initial console.log " +
  "statments and the uncommenting of the line in beatnik_compile() that kills everything which isn't a letter. " +
  "This is to conform to the beatnik language specification that says that punctuation should be ignored.");

/* Evaluates the given script in the given console. */
function beatnik_console_eval(script, console, status) {
  // Clear the console.
  console.value = '';

  var compiled = beatnik_compile(script);

  // Debugging:
  // console.value = compiled.join(','); return;

  var closure = beatnik_new_closure(compiled);

  beatnik_console_run_closure(closure, console, status);
}

/*
   Resumes the given closure with a particular piece of input.
   
   input - the unicode codepoint of the key pressed
   console - the console, a textarea
   status - the status console, a text input
 */
function beatnik_console_feed(input, console, status) {
  var closure = console.closure;

  // Ignore if there isn't a saved closure.
  if (closure != null && input != null) {
    // Feed the closure its input.
    closure = closure.feed(input);

    beatnik_console_run_closure(closure, console, status);
  }
}

/* Runs the given closure on the console. */
function beatnik_console_run_closure(closure, console, status) {
  // Set the status.
  status.value = 'Running';

  // Clear the closure set on the console.
  console.closure = null;

  // Printing function.
  var print = function(ch) { console.value += ch; }

  try {
    while (closure.isRunning()) {
      closure = closure.step(print);
    }

    if (closure.needsInput()) {
      status.value = 'Input';
      console.focus();
      console.closure = closure;
    }else {
      status.value = 'Stopped';
    }
  }catch (e) {
    status.value = e.message;
  }
}

/* Compiles the given script into the given console. */
function beatnik_console_compile(script, console, status) {
  var compiled = beatnik_compile(script);
  for (var i = 0; i < compiled.length; ++i)
    compiled[i] = '#' + compiled[i];
  console.value = compiled.join(' ');
}

// Status where the program is still running.
var BEATNIK_STATUS_RUNNING = 0;
// Status where the program is waiting for input.
var BEATNIK_STATUS_INPUT = 1;
// Status where the program has finished running.
var BEATNIK_STATUS_DONE = 2;

/* Creates a new closure around the given compiled form, instruction
   pointer, and stack. */
function beatnik_new_closure(compiled) {
  return new BeatnikClosure(compiled, 0, [], BEATNIK_STATUS_RUNNING);
}
function BeatnikClosure(compiled,ip,stack,status) {
  this.opcodes = compiled;
  this.ip = ip;
  this.stack = stack;
  this.status = status;
}

/*
   Determines whether this closure is running.
 */
BeatnikClosure.prototype.isRunning = function() {
  return this.status == BEATNIK_STATUS_RUNNING;
}

/*
   Determines whether this closure needs input.
 */
BeatnikClosure.prototype.needsInput = function() {
  return this.status == BEATNIK_STATUS_INPUT;
}

/*
   Feeds a character of input to the closure, returning a new closure.

   input - a unicode codepoint
 */
BeatnikClosure.prototype.feed = function(input) {
  if (!this.needsInput()) {
    throw new Error("Closure is not waiting for input.");
  }

  value = coerceValue(input);
  var stack = this.stack.slice(0, this.stack.length);
  stack.push(value);
  return new BeatnikClosure(this.opcodes, this.ip, stack, BEATNIK_STATUS_RUNNING);
}

/*
   Steps through execution of the closure, returning a new closure
   or throwing an exception.

   Parameters:
     print - a function which accepts a single character as input and
             prints it somehow.
 */
BeatnikClosure.prototype.step = function(print) {
  if (!this.isRunning()) {
    throw new Error("Closure is not runnable.");
  }

  var opcodes = this.opcodes;
  var nOps = opcodes.length;
  var ip = this.ip;

  // Copy the stack.
  var stack = this.stack.slice(0, this.stack.length);

  while (true) {
    if (ip > nOps) break;

    switch (opcodes[ip]) {

     // Push next operand as literal.
     case 5:
      if (ip + 1 >= nOps) throw new Error("No immediate for PUSH at " + ip);
      stack.push(opcodes[ip + 1]);
      ip++;
      break;

     // Pop and discard.
     case 6:
      if (stack.pop() == null) throw new Error("Stack underflow at " + ip);
      break;

     // Pop twice and add.
     case 7: {
      var right = stack.pop();
      var left = stack.pop();
      if (left == null || right == null) {
        throw new Error("Stack underflow at " + ip);
      }
      
      // Compute the result and coerce it.
      var result = left + right;
      result = coerceValue(result);
      stack.push(result);
     }
      break;

     // Read a character of input onto the stack.
     case 8:
      return new BeatnikClosure(opcodes, ip + 1, stack, BEATNIK_STATUS_INPUT);

     // Pop and print.
     case 9: {
      var ch = stack.pop();
      if (ch == null) throw new Error("Stack underflow at " + ip);
      print(String.fromCharCode(ch));
     }
      break;
     
     // Pop twice and subtract.
     case 10: {
      var right = stack.pop();
      var left = stack.pop();
      if (left == null || right == null) {
        throw new Error("Stack underflow at " + ip);
      }

      // Compute the result and coerce it.
      var result = left - right;
      result = coerceValue(result);
      stack.push(result);
     }
      break;
 
     // Pop twice and swap.
     case 11: {
      var right = stack.pop();
      var left = stack.pop();
      if (left == null || right == null) {
        throw new Error("Stack underflow at " + ip);
      }
      stack.push(right);
      stack.push(left);
     }
      break;

     // Pop and duplicate.
     case 12: {
      var value = stack.pop();
      if (value == null) throw new Error("Stack underflow at " + ip);
      stack.push(value);
      stack.push(value);
     }
      break;

     // JZ forward.
     case 13: {
      // Pop the test value from the stack.
      var value = stack.pop();
      if (value == null) throw new Error("Stack underflow at " + ip);

      // Check the immediate.
      if (ip + 1 >= nOps) throw new Error("No immediate for JZF at " + ip);
      var jump = opcodes[ip + 1];

      if (value == 0) {
        // Jumping to EOP is okay, but complain if we go past the limit.
        if (ip + jump + 1 > nOps) throw new Error("Jump past end of program in JZF at " + ip);
        // Move forward by the jump quantity.
	ip += jump;
      }
      // Move past the immediate.
      ip++;
     }
      break;

     // JNZ forward.
     case 14: {
      // Pop the test value from the stack.
      var value = stack.pop();
      if (value == null) throw new Error("Stack underflow at " + ip);

      // Check the immediate.
      if (ip + 1 >= nOps) throw new Error("No immediate for JNZF at " + ip);
      var jump = opcodes[ip + 1];

      if (value != 0) {
        // Jumping to EOP is okay, but complain if we go past the limit.
        if (ip + jump + 1 > nOps) throw new Error("Jump past end of program in JZF at " + ip);
        // Move forward by the jump quantity.
	ip += jump;
      }
      // Move past the immediate.
      ip++;
     }
      break;

     // JZ backward.
     case 15: {
      // Pop the test value from the stack.
      var value = stack.pop();
      if (value == null) throw new Error("Stack underflow at " + ip);

      // Check the immediate.
      if (ip + 1 >= nOps) throw new Error("No immediate for JZB at " + ip);
      var jump = opcodes[ip + 1];

      if (value == 0) {
        if (ip - jump < 0) throw new Error("Jump past begining of program in JZB at " + ip);
        // Move forward by the jump quantity, and compensate for the coming
        // increment.
	ip -= jump + 1;
      }else {
        // Otherwise, move past the immediate.
        ip++;
      }
     }
      break;

     // JNZ backward.
     case 16: {
      // Pop the test value from the stack.
      var value = stack.pop();
      if (value == null) throw new Error("Stack underflow at " + ip);

      // Check the immediate.
      if (ip + 1 >= nOps) throw new Error("No immediate for JNZB at " + ip);
      var jump = opcodes[ip + 1];

      if (value != 0) {
        if (ip - jump < 0) throw new Error("Jump past begining of program in JNZB at " + ip);
        // Move forward by the jump quantity, and compensate for the coming
        // increment.
	ip -= jump + 1;
      }else {
        // Otherwise, move past the immediate.
        ip++;
      }
     }
      break;

     // Terminate.
     case 17:
      return new BeatnikClosure(opcodes, ip, stack, BEATNIK_STATUS_DONE);

     // No-op.
     default:
      // do nothing
    }

    ip++;
  }

  return new BeatnikClosure(opcodes, ip, stack, BEATNIK_STATUS_DONE);
};

/* Compiles the given script into a blackbox form. */
/* (it's an array of word values) */
function beatnik_compile(script) {
  // Kill everything that isn't whitespace or a letter.
  script = script.replace(/[^ \na-zA-Z]/g, '');

  // Kill leading and trailing whitespace.
  script = script.replace(/^\s+/, '');
  script = script.replace(/\s+$/, '');

  // Split the script into tokens.
  var words = script.split(/\s+/);

  // Evaluate the tokens.
  var opcodes = new Array(words.length);
  for (var i = 0; i < words.length; ++i) {
    opcodes[i] = beatnik_score_token(words[i]);
  }

  return opcodes;
}

// Scrabble per-letter scores.
var scrabble_scores = [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10];

/* Scores the given token, which we assume is strictly ASCII and,
   in fact, strictly alpha. */
function beatnik_score_token(token) {
  var score = 0;

  // Special testing case: allow #XXX
  if (/^#\d+$/.test(token)) {
    score = parseInt(token.slice(1));
  }else {
    // ucase the token
    token = token.toUpperCase();

    var length = token.length;
    var score = 0;
    for (var i = 0; i < length; ++i) {
      var code = token.charCodeAt(i);
      if (code >= 65 && code <= 90)
      score += scrabble_scores[code - 65];
    }
  }

  if (score < 0) return 0;
  if (score > 255) return 255;
  return score;
}

/* Coerces the given value to fall within the acceptable range. */
function coerceValue(value) {
  if (value < 0 || value > 255) {
    value = value % 256;
    if (value < 0) return value + 256;
  }
  return value;
}
   