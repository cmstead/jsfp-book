##Chapter 2 - Data and Access

All functional programming starts with data. Regardless of whether data is being requested, saved, manipulated or stored for future use, functional programming comes back down to data. Given the way that Javascript handles primitive data types, it's not critical that much time is spent on them. We will do a simple survey so we are all using the same vocabulary.

The more important data types to focus on are Javascript's core collections, object literals and arrays. These data types introduce a way to collect and store both primitive data types and other collections. The construction and management of these complex data types is exactly what functional programmers look to work with daily.

The last important data type is the function data type. Functions in Javascript, much like other functional languages, are data. This speaks more directly to the soundbite "functions are first class." Functions as data is possibly one of the most difficult topics to fully digest, but there is a lot of power that comes with managing functions as data.

When these concepts are brought together, a powerful foundation is created to work with data.  The last section of this chapter is dedicated to methods for accessing data functionally. This functional data access provides a new way to look at and think about data.  When data is accessed functionally, it opens the door to stronger methods for data access and management developed in later chapters.


###Primitive Data Types

In Javascript there are several primitive data types. These types are boolean, number, string and undefined.  Since this book is not an introductory book on programming it is assumed the reader understands what these data types mean. Instead, it is important to understand the deeper meanings of how these data types interact.

Each primitive data type has unique properties, but they all share one.  There is a notion of equality. All primitive data types contain elements which can be compared and guaranteed to be equal.  Due to this explicit comparison behavior, we can say that any two values are equal when the following is true:

	x === y

It is important to note this comparison is a strict comparison. Throughout the course of this book, equality will only be discussed with respect to strict equality. Type coercion damages the clarity of our intent, so we will always assume variables which are not the same type will never be equal.

So, given that equality can be described idiomatically in Javascript, we can, just as reasonably, discuss inverse equality.  This can be stated simply as any two variables which do not share the same value are not equal.  Lack or equality, or not equal, is expressed when the following is true:

    x !== y

This kind of comparison is not likely to be revelatory to anyone who is competent with Javascript, however it gives us our first insight into the world of functional programming. For reasons which will be discussed later, it is important that the concept of equality be expressed as a function.

    function equal(x, y){
		return x === y;
	}

Although this function is likely more simple than most developers write day to day, it is important as a foundation for functional programming in general. This kind of function, which takes some input and returns a boolean result based on comparison or other verification is called a _predicate function_.

Predicate functions always return a boolean value, which means they produce values in a set that contains only two members, true and false.  This means that our comparison which returns true when x and y are not equal can be expessed functionally as well.  A first attempt to write the inverse of the equal function above, might look like this:

    function notEqual(x, y){
		return x !== y;
	}
	
There is an issue with going this direction, however.  Any predicate we would create would need an inverse predicate to verify the inverse is true.  This kind of programming experience can be tedious and is completely unnecessary. We know the following is true:

    !true === false
	!false === true

By using this knowledge a second important function can be created.  In much the same way that the ! unary operator inverts the boolean value provided to it, a not function can be written which provides the same functionality.

    function not(a){
		return !Boolean(a);
	}

This not function is possibly one of the most valuable functions we will encounter. Not is used almost as often as other comparison values, though it is more powerful than even equality.  First, we will take a look at a refactoring of our notEqual using not.

    not(equal(x, y))
	
	// This is true
	notEqual(5, 6) === not(equal(5, 6))
	
	// So is this
	notEqual(1, 1) === not(equal(1, 1))

This method of handling inverse equality can extend to places that, otherwise, has no explicit definition of an inverse operation. If two numbers were compared via inequality, the following statement would be meaningless:

    5 !< 3 // parse error

Although anyone reading this can understand, given the context, of what this really means, five is not less than 3, it has no meaning in Javascript.  On the other hand, if a function less is created, we can do the following:

    not(less(5, 3)); // true
	
This comparison may not be immediately intuitive, but it is an important first step toward understanding how functional programming interacts with the existing data types in Javascript.  Although Javascript does not allow the developer to create their own types, the power that comes from its Scheme ancestry provides us with a data type that is equally empowering, the function.

###Functions As Data

In Javascript, much like other functional languages, functions are data. When coming from an object oriented perspective, this feels like a strange thing to say. Functions do things, they aren't something.  The longer a developer works with a functional language, the concept that a function is not data feels about as misinformed as to say 0 isn't a number.

When we say a function is data, this is meaninful in many ways.  First, because functions are data, they are instantiable and have a prototype associated with them.  It's easy to see the core prototype by simply interacting with the browser developer console.  Logging typeof Function.prototype garners the result 'function'. A more informative experiment might be to instantiate a new function.

    > var test = new Function();
	undefined
	> test
	function anonymous()

This action actually created a new function and stored it in our variable. This kind of programming activity is a little strange when we are trying to write programs day to day, but it's a great party trick. The really imporant idea here is, we are interacting with the core system and manipulating data in a standardized way.

If we set aside the academic experimentation and dig into the meat of functions as data, it opens up new means for programming. Functions can be manipulated and stored as data, so they can be provided as arguments to other functions or rturned as the result of a function.  Functions which either take one or more functions as arguments or return one or more functions are called _higher-order functions_.

Higher-order functions are one of the features of functional programming that provides a tremendous amount of power. Although higher-order functions provide power, they also can cause a significant amount of confusion to the uninitiated. Let's start off by creating two simple functions.  One will add two numbers and the other will return a function as an argument.

    function add (a, b) {
		return a + b;
	}
	
	function addN (a) {
		return function (b) {
			return add(a, b);
		}
	}
	
	var increment = addN(1);
	
	console.log(increment(5)); // 6

There is a considerable amount happening here, some of which we will cover later in this book. The important item to take note of right now is, addN returns a function. AddN is is a higher-order function because it returns a function. We can see the return value is a function because we can immediately use the output we stored in our variable "increment."

The other aspect of higher order functions is, they take at least one function as an argument. It is possible for higher-order functions to take multiple functions as arguments, but for now, we'll look at a function that takes a single function as an argument and returns a function.

The goal of this higher-order function is to invert a predicate function.  In other words, whatever a predicate might return, the resulting function will return the opposite.  Our higher-order function will be called invertPredicate.  In order to demonstrate the way invertPredicate works, let's also create a predicate function called isEven.  Let's see what our experiment holds.

	function isEven (a) {
		var result = a % 2;
		return equal(result, 0);
	}
	
	console.log(isEven(5)); // false
	console.log(isEven(48)); // true
	
	function invertPredicate (predicateFn){
		return function (value){
			return not(predicateFn(value));
		}
	}
	
	var isOdd = invertPredicate(isEven);
	
	console.log(isOdd(5)); // true
	console.log(isOdd(48)); // false

We should stop and reflect on what happened here. We only wrote 8 lines of code, but there is a lot to digest.  There are, effectively, five different functions we need to look at: equal, isEven, invertPredicate, our anonymous return function and isOdd.  Although it is important to understand all of the moving parts, we don't need to dig into each one individually now. It is more important to review each of the functions and understand what they do, even if it is not entirely clear why they to what they do, just yet.

It's easy to see how working with higher-order functions can quickly introduce a significant amount of abstraction into a program. This abstraction is precisely why higher-order functions are a common stumbling block for people who are coming to functional programming for the first time. It's important to digest the input and output of invertPredicate, and get comfortable with higher-order functions.

Although everything that was introduced in this example may not immediately make sense, it is important to see how functions can be introduced, stored and acted upon both as data and as a core implementation facility for functionial programming. There is a tremendous amount of power that comes with functions when they are defined as a data type. Javascript is able to harness that power so programmers can write more expressive code and eliminate the boilerplate that comes with the common imparative-style programming often seen in code bases today.

One of the most common uses for higher-order functions is to manage complex data types.  Complex data types are types that are not considered primitive data types and aren't functions.  Javascript, currently, supports several complex data types, however, we will focus on just two for the purpose of this book, objects and arrays.


###Complex Data Types

In computer science there are a variety of complex data types, of which a subset are supported by Javascript. At the time of this writing, there are several complex data types which are supported by Javascript, including arrays, objects, sets, weak sets, etc. There are two we will focus on for the purpose of digging into functional programming and development, arrays and object literals.

Scheme has the concept of lists and hash tables. Neither of these are currently supported by Javascript directly. If we squint our eyes just a little, however, we have two native complex data types which come pretty close, arrays and object literals, respectively.

Traditionally, languages like Lisp or Scheme worked with lists of data. These lists allowed fast access to the first element, but random access reads were significantly slower. Lists, though slow to randomly read, were fast to grow. An addition of one item took very little time as memory reallocation for a single element is fast. Arrays in Javascript are not as performant when they grow beyond their initial bound. Even with this limitation, because Javascript arrays are a native data structure, they are more intuitive to work with and with modern computing, the common case will not be significantly impacted by the small performance difference between lists and arrays.  After this chapter, when we deal with list-like arrays we will always refer to them as lists.

Traditionally in functional programming there are a small number of functions that define the core data-access behavior for lists.  Although we can access list elements and information directly in Javascript, these functions still provide an important foundation for the way we interact with lists of data.

    function first (list) {
		return list[0];
	}
	
	function rest (list) {
		return list.slice(1);
	}
	
	function nth (index, list) {
		return list[index];
	}
	
Each of these functions will be enhanced shortly, but it is important to consider data access in terms of functions instead of raw data access. This kind of functional behavior will allow us to explore powerful techniques for accessing and manipulating data later. For now, let's take a look at a simple application of the first and rest functions as a stepping stone toward functional patterns we will employ. As we create our functional experiment, look at our use of functions and refer to the constructions that happened before.

	function getOdds (list) {
		var odds = [],
		    remainingValues = list,
			value;
		
		while((value = first(remainingValues)) !== undefined){
			remainingList = rest(remainingList);
			
			if(isOdd(value)){
				odds.push(value);
			}
		}
		
		return odds
	}

This function is still fairly verbose, but it is already exposing a new way to think about interacting with lists using functions. The first function returns the first value of the passed list, which gives us our current value to work with. Once we have a handle on the first value, we no longer need to keep it in our remainingValues list, so we adjust the list with a slice.

With each iteration of our while loop, the remaining values list gets shorter and we get closer to being done. One very important action happens when we use our rest function, remainingValues becomes decoupled from the original array. This means remainingValues won't be affected if the original list is modified while our function continues to operate.

Lists are not the only data type we will work with. Newer functional languages like Clojure and F# allow the developer to work with enhanced hash maps or hash tables which allow for fast read access, though the growth profile is roughly as poor as arrays. Javascript also introduces a structure similar to hash maps and hash tables, object literals.This function takes advantage of the speed and ease of data access that is inherent in hash maps and hash tables. As we move forward through this book we will refer to object literals as hash maps. By referring to these collections as hash maps, it will help tie concepts in this book with other languages which use similar data types.

Object literals, when used as a data storage and retrieval system behave very similarly to hash maps in other languages. This read characteristic makes them ideal for known-key retrieval. Since arrays have a similar known-key retrieval speed, we can introduce a function which will enable fast reading from these complex data structures. This data access speed is key to the next function we will introduce.

    function pick (key, dataObject) {
		return dataObject[key];
	}

Pick is the functional equivalent to direct data access. In much the same way that nth allowed us to access each element directly in a list, we can use pick to access any element in a hash map.  Let's write our getOdds function using pick and a hash map.

	function pickOdds (valueObj) {
		var odds = [],
			keyList = Object.keys(valueObj),
			value;
		
		while((value = pick(first(keyList), valueObj)) !== undefined){
			keyList = rest(keyList);
			
			if(isOdd(value)){
				odds[key] = value;
			}
		}
		
		return odds;
	}

Now we can begin to see the real power that comes with functional programming. Pick and first always return a value, which gives us a strong guarantee that we can iterate over a list of either keys or values and easily interact with lists and hash maps in almost identical ways.  We will be able to use this information to develop powerful abstractions and express the intent of our programs in much shorter and clearer ways.


###Sanitary Data -- Maybe and Either

Programs almost always read, write, manipulate or otherwise interact with data in some meaningful way.  With such close ties between programs and data, it is important to know and understand what your data will look like.  It is quite common for a Javascript developer to wrap functions up in conditional blocks to avoid a breaking condition introduced by bad or unexpected data.  The following block of code is so common it should be considered a pattern, or more aptly, an anti-pattern.

	if(typeof dataObject === 'object' && dataObject.key !== undefined){
		processValue(dataObject.key);
	}

This kind of programming, though stable, introduces quite a bit of noise into the process of creating a program. "Uncle Bob" Martin claims programmers spend more time reading code than writing it. Arguably this is true more often than not. This conditional block, though useful for eliminating errors and failure conditions, does not provide insight into the real goal of the code.  Any code that does not declare intent in the code is noise.

Sanitary data functions aim to eliminate noise in the process of programming by separating the data sanitization process from the expressions that make a solution workable and unique. In general, programs are best when they are less interested in the integrity of their data and more interested in the logic. 

Haskell introduces the concept of maybe types, which provides guarantees around the data the programmer will interact with.  When the programmer says "Maybe a" they get either "Just a" or "nil." To anyone not working in Haskell, this likely sounds like a bunch of words strung together which don't mean a whole lot. Instead, let's start writing functions and make sense of what maybe actually means when you are working with Javascript.

	function maybe (value, type) {
		var isAcceptable = typeof value === type;
		
		isAcceptable = type !== undefined ? isAcceptable : Boolean(value); 
		
		return isAcceptable ? value : null;
	}

Maybe is a function that is solely concerned with data integrity. If the passed value matches the optional type string, then it is considered acceptable. If no type is specified then acceptability is based solely on whether the value evaluates to true when typecast to boolean. Haskell's definition of maybe varies somewhat from our definition, however, for maintaining data integrity, this is completely acceptable. If we use maybe along with a default object, we can clean out most of the conditional logic in our code block.

	var sanitizedData = maybe(dataObject) !== null ? dataObject : { key: 'default' };
	
	processValue(santizedData.key);

This is much more meaningful to the reader. The conditional block is gone and we are guaranteed to avoid data-related program failures. Unfortunately, we still have a data conditional lingering in our code. It's tidier and more expressive, but there is another data type Haskell introduces which we can borrow against.

Haskell also has an either data type. Either builds upon the concept of maybe and picks either the value is returned if it is acceptable or a default value is returned if the initial value fails the acceptability check. Although this is a data type in Haskell, we can express it as a function in Javascript.

	function either (defaultValue, originalValue, type) {
		return maybe(originalValue, type) !== null ? originalValue : defaultValue;
	}

This simple abstraction atop maybe gives us a strong way to guarantee data integrity. Either helps us to abstract away the conditional logic and express what we really want: either we want to use the object that was passed to our function, or we want to use a default. This abstraction brings our code closer to natural language, which makes the intent clearer.  Here is the final refactor of our original code block, bringing in either and opting for pick over the dot operator for data access.

	// Formatted using Lisp/Scheme indentation for expression clarity
	processValue(
		pick('key', 
			either({ key: 'default' }, dataObject)));

Either and maybe capitalize on the deep implications of data comparison to simplify the way data is managed and exposed. Javascript's === operator allows us to ensure data type and value safety while also abstracting away unnecessary conditions and express the real intent of our program. Either and maybe bring all of the work done in this chapter back to the foundational ideas of primitive data types through by ensuring data integrity through brief, expressive functions.


###Summary

