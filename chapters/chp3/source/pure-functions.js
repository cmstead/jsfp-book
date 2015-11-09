function noop () { /* does nothing */ }

function identity (value) {
	return value;
}

// numeric functions

function add (a, b) {
	return a + b;
}

function multiply (a, b) {
	return a * b;
}

function subtract (a, b) {
	return add(a, -b);
}

function divide (a, b) {
	return multiply(a, 1/b);
}

// call

function add1ByCall (value) {
	return add.call(null, 1, value);
}

add1ByCall(5); // 6

// apply

function add1ByApply (value) {
	return add.apply(null, [1, value]);
}

// bind

var add1 = add.bind(null, 1);

add1(5); // 6
add1(6); // 7

// Putting these together

function slice (start, object) {
	var end = arguments[2],
		result = null;
	
	if (typeof end === 'undefined') {
		result = Array.prototype.slice.apply(object, start);
	} else {
		result = Array.prototype.slice.apply(object, start, end);
	}
	
	return result;
}

function call (userFn) {
	var callableFn = either(noop, userFn, 'function'),
		arglist = slice(1, arguments);
		
	return callableFn.apply(null, arglist);
}

function apply (userFn, args) {
	var callableFn = either(noop, userFn, 'function'),
		arglist = either([], args, 'object');
		
	return callableFn.apply(null, arglist);
}

function bind (userFn) {
	var callableFn = either(noop, userFn, 'function'),
		arglist = slice(1, arguments);
		
	return callableFn.bind.apply(null, arglist);
}

// partial application

var divideBy5 = bind(divide, 5); // this does not work

// Closures introduced here!

function partial (userFn) {
	var callableFn = either(identity, userFn, 'function'),
		capturedArgs = slice(1, arguments);
	
	return function () {
		var arglist = slice(0, arguments).concat(capturedArgs);
		apply(callableFn, arglist);
	}
}

function rpartial (userFn) {
	var callableFn = either(identity, userFn, 'function'),
		capturedArgs = slice(1, arguments);
	
	return function () {
		var arglist = capturedArgs.concat(slice(0, arguments));
		apply(callableFn, arglist);
	}
}

var divideBy5 = rpartial(divide, 5);

divideBy5(35); // 7
divideBy5(115); // 23

// currying

function myFunction (a, b, c) {
	/* do stuff with a, b and c */
}

// Currying definition
function myCurriedFunction (a) {
	return function (b) {
		return function (c) {
			/* do stuff with a, b and c */
		}
	}
}

// example
function addThreeNumbers (a, b, c) {
	return a + b + c;
}

addThreeNumbers(1, 2, 3); // 6

// The hard way -- by hand
function curriedAddThreeNumbers (a) {
	return function (a, b) {
		return function (a, b, c) {
			return a + b + c;
		}.bind(null, a, b);
	}.bind(null, a);
}

curriedAddThreeNumbers(1, 2, 3); // anonymous function
curriedAddThreeNumbers(1)(2)(3); // 6

function currier (curriableFn, args, value) {
	var arglist = slice(0, args).concat([value]),
		curryArgs = [currier, curriableFn].concat(arglist),
		executable = arglist.length >= curriableFn.length;
		
	return executable ? apply(curriableFn, arglist) : apply(bind, curryArgs);
}

function curry (curriableFn) {
	return bind(currier, curriableFn, []);
}

curry(addThreeNumbers)(1)(2)(3); // 6
curry(identity)('Hello, world!'); // Hello, world!