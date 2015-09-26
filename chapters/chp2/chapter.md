*Chapter 2*
Data and Access

Summary

All functional programming starts with data. Regardless of whether data is being requested, saved, manipulated or stored for future use, functional programming comes back down to data. Given the way that Javascript handles primitive data types, it's not critical that much time is spent on them. We will do a simple survey so we are all using the same vocabulary.

The more important data types to focus on are Javascript's core collections, object literals and arrays. These data types introduce a way to collect and store both primitive data types and other collections. The construction and management of these complex data types is exactly what functional programmers look to work with daily.

The last important data type is the function data type. Functions in Javascript, much like other functional languages, are data. This speaks more directly to the soundbite "functions are first class." Functions as data is possibly one of the most difficult topics to fully digest, but there is a lot of power that comes with managing functions as data.

When these concepts are brought together, a powerful foundation is created to work with data.  The last section of this chapter is dedicated to methods for accessing data functionally. This functional data access provides a new way to look at and think about data.  When data is accessed functionally, it opens the door to stronger methods for data access and management developed in later chapters.


Primitive Data Types

In Javascript there are several primitive data types. These types are boolean, number, string and undefined.  Since this book is not an introductory book on programming it is assumed the reader implicitly understands what these data types mean. Instead, it is important to understand the deeper meanings of how these data types interact.

Each primitive data type has unique properties, but they all share one.  There is a notion of equality.  Undefined is never equal to anything but the rest all contain elements wich can be compared and guaranteed to be equal.  Due to this explicit comparison behavior, we can say that any two values are equal when the following is true:

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