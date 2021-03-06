##Chapter 2 - Thinking About Data

Programming, at its core, is about data. Whether it's user-entered data or data from a web service, programming is the management and interaction with data. Since programming is about data, it only makes sense to start with data set a foundation for what we will, ultimately, be talking about throughout the following chapters.

Data has a few intrinsic properties including type and comparability. These two ideas are so intertwined it hardly makes sense to talk about one without the other. Type plays an integral part in the comparison of two values and, equally, type only has meaning if there is a means to compare and define equality.

In the real world, data is imperfect. It may not contain information that is expected, or it may be malformed. Worse, the data may not actually exist at all. After a discussion of data equality and type, we will take a look at sanitary data and how it impacts the development process.

A unique property of functional programming is functions are data. This behavior seems to spring forth from the world of Lisp where a program and its primary data type are the same, i.e. lists. As a setup for understanding how to work with functions in a functional language, we must talk about how functions and data intersect and what sets functional programming apart from object oriented programming.

Finally, we will take a look at accessing data in arrays and object literals.  We will look at the relation between arrays and lists, as well as object literals and hash maps, which we will call maps for short. We will also dive into how our understanding of data informs our approach to complex data types like lists and maps.

Before we get too far ahead of ourselves, let's start at the beginning.


###Data, Types and Comparisons

Javascript has a variety of data types including object, number, string and undefined. These types share one core property, the concept of equality. Javascript has two methods for comparing to verify equality, a type-coercive comparison and a strict comparison. In order to give us certain type and value guarantees, we will only use strict equality in this book.

The first idea we need to investigate is what equality really means.  Strict equality verifies identity, which means two variables must be both the same type and the same value. This definition gives us a clear way to understand questions like "are 5 and '5' equal," (no) and "do 'foo' and 'bar' have the same type?" (yes)

To be a little more formal about this inquiry, we can say any two variables, x and y, are equal if and only if _x === y_. Digging into equality this way will help us to have a stable place to return to if things start to go awry.

Javascript has a rather long list of operators including things like delete, >=, << and so on. The five primary operators we are going to focus on using here are typeof, ===, <, > and !. With these five operators we can define a solid foundation for our functional experiments througout this book.

Don't get too used to seeing these operators, however, we will be wrapping them up in functions and using them for operations we can build upon to create a rich and expressive framework.  In the meanwhile we will explore what they mean and how they apply to interacting with data.

We have already discussed equality and given it a relatively formal definition. Let's take a look at our first function. We are going to create a function called equal, which will wrap up the infix operator ===.

	function equal (a, b) {
		return a === b;
	}

Although it isn't immediately apparent why this simple function is useful, equal is a foundational element to create other, more complex functions. The fact that equal is actually a function instead of an operator gives us the ability to create composite functions and define a richer set of behaviors.

Let's take a look at the unary operator, !. This is the negation operator and is commonly pronounced "not." There is a special operator !== which is the negation of the === operator we just defined a function for, so we can easily redefine !== as !equal, but this is hardly useful if we want a function we can interact with.  Let's define a not function to fill this gap.

	function not (a) {
		return !Boolean(a);
	}

With our new function, not, we can more thoroughly define !== as not(equal). Not, equal and not(equal) are all members of the same class of functions known as _predicate functions_. The book "The Little Schemer" introduces predicate functions as questions, and rightly so.  Any predicate function can be viewed as a question with a yes or no answer.

When considering the question-like behavior of predicate functions, consider the following definition; Predicate functions are a class of functions which accept any number of arguments and return boolean values, true and false. In other words, predicate functions are a question to the computer and the reply is a boolean value.

Greater and less than operators, > and < respectively, are the remaining predicate operators we will wrap in functions.  Inequality is an operation that is unique to strings and numbers in Javascript.  Asking if {} < [] or {} > [], for example, is meaningless and both expressions will return false. On the other hand, asking if 'a' < 'b' or 5 > 3 both have meaning and are valid to ask.  These functions can be defined together as they represent two sides of the same kind of question.

	function less (a, b) {
		return a < b;
	}
	
	function greater (a, b) {
		return less(b, a);
	}

As it turns out, when we have infix operators, we need both < and > to satisfy the strict inequality questions we could want to ask, but when we create functions, we only need one. Even more than that, we can create all of the other inequality expressions with not, less and greater. If we create pseudocode to address these two other conditions, we can see that _x >= 3_ is the same as saying _x !< 3_. Similarly, _x <= 5_ can be written as _x !> 5_.  Let's create functions to express this.

	// leq and geq were borrowed directly from Lisp and were
	// chosen specifically for brevity and relative language consistency
	function leq (a, b) {
		return not(greater(a, b));
	}
	
	function geq (a, b) {
		return not(less(a, b));
	}

With all of this discussion of comparisons and equality, it almost seems type is an afterthought after equality is defined.  This, however, couldn't be further from the truth. Our opening discussion was regarding strict equality and type coercion. As it turns out, type is integral to every comparison and function we have written so far.  Although Javascript is a dynamic language, under the hood, type is still considered and managed. Let's expose some of the typing by using typeof.

	function getType (value) {
		return typeof value;
	}

GetType exposes the result of the unary operator typeof. Typeof is interesting in two regards. First, typeof is the only operator we have looked at so far which is not symbolic. Second, typeof is not a predicate. GetType accepts a value and returns a string. Although the number of strings that will be returned is limited, this is definitely not the definition of a predicate function. GetType does provide functionality we will need to create one of our last predicates in our discussion of data.

This predicate exposes an implicit comparison property of all values in Javascript. We know variables all can be compared via equality and we know that each variable has a type. The string representation of the variable type exposes a new kind of comparison which will be important in working with and managing data, isType.

	function isType(value, type){
		return equal(getType(value), type);
	}

The last predicates we will need to talk about data meaningfully will test for undefined and null. Undefined is a distinct data type, however null is not. If we take _typeof null_ the response we get is 'object.' This can introduce issues since we can look for key references in an object, but if we were to execute _null[4]_ we would get a runtime exception.  To avoid the kinds of errors that can only occur when a value is a special, falsey type like null and undefined, we need new predicates.

	function isNull (value) {
		return equal(value, null);
	}
	
	function isUndefined (value) {
		return isType(value, 'undefined');
	}

With these basic functions, we have created a functional core that is rich and expressive. We can work with data and say something useful about a broad range of data with a few simple functions.  Along the way we even managed to introduce interesting and meaningul new behaviors which were not originally part of the core language.

###Sanitary Data

When working with data, regardless of the source, it is common to encounter corrupt, missing or just plain wrong data. Users could enter a string when you need a number or the database could return null when you wanted an array. These situations are common enough we have developed patterns for dealing with the fallout gracefully.

Programmers often create conditional blocks and guard clauses in their code to manage bad data. Code can become so littered with this data management that it can become difficult to parse the original intent of the code that was written. Searching Google for "programmers reading code" returns page after page of results regarding people talking about reading code as much or more than writing it. This means, each new conditional block or guard clause introduced into a codebase is one more expression someone will have to read, digest and understand.

It seems with all of this information we can find out about our variables, we should be able to do a better job of managing the data flow through our application. This is especially true when we have other languages to look to for answers.

Haskell is a strictly pure functional language with static data types and a really good grasp on working with data. Not only does Haskell deal with data well, they have quite possibly an order of magnitude more data types than Javascript. The solution Haskell programmers use to keep everything straight is interesting and inventive.

Haskell uses something called a maybe type to manage wayward data. The maybe type can best be equated to a function or operator in Javascript, though that really doesn't do it justice. Effectively, the programmer can express Maybe a and receive either Just a or nil. In other words, if a is an acceptable value, then the programmer gets a, and they continue programming. If, on the other hand, a is an unacceptable value, they get nil.

We can express this same relation using our data functions defined in the previous section. Since we know the data types we can work with and we have a value which we can expose the data type of, we can create a maybe type of our own.

	function maybe (value, type) {
		var valueIsAcceptable = isUndefined(type) ? Boolean(value) : isType(value, type);
		
		return valueIsAcceptable ? value : null;
	}

With our definition of maybe, we have introduced a second argument Haskell neither needs, nor wants, a type declaration. Where Haskell is a strongly, statically typed language, Javascript is the opposite. This maybe definition introduces the concept of type annotations or type hinting to place guarantees around the value we want to apply maybe to.

While maybe is a good core solution for making type safety stronger in Javascript, it can still introduce some overhead in our programming. We are no longer required to perform cumbersome type checks and falsey checks, we must still verify we are not about to interact with a null value in an unsafe way.  Let's take a look at the example below.

	function getName (person) {
		return maybe(person, 'object').name;
	}

Clearly this won't do at all. As long as person actually is an object, we are safe, but as soon as a bad value is provided, we will get a null value exception.  In order to get around this, we have to do some extra work.  To make this function safe, we need to check for null and manage the output appropriately.

	function getName (person) {
		var sanitizedData = isNull(maybe(person, 'object')) ? { name: '' } : person;
		
		return sanitizedData.name;
	}

This function is now safe, however, we haven't eliminated the guard clause overhead. We can turn to Haskell once more to solve our new problem.  When maybe isn't enough and we have to have something safe no matter what, we can use either. Either is a data type, similar to maybe, however, it supports a default.

Haskell programmers can express Either a b and they will get a or b depending on the appropriateness of the values provided to either. Ultimately, the Haskell either is a very complex data type and what we need can be reduced to a simpler function. Much like with maybe, we will implement a digestible subset of the Haskell functionality to solve our immediate sanitary data needs.

	function either (defaultValue, originalValue, type){
		return isNull(maybe(originalValue, type)) ? defaultValue : originalValue;
	}

This expansion on the maybe function gives us a tremendous amount of power when working with data. If we opt for using either over guard clauses, our code becomes clear, precise and meaningful to programmers who have to read it later. We will see later how powerful the idea of an either type really is when working with lots of data, or deeply nested data structures.  For now, let's finish refactoring our getName function.

	function getName (person) {
		return either({ name: '' }, person, 'object').name;
	}

Maybe and either are the core of creating a sanitary environment to program in, but the applications reach farther and deeper as we touch different aspects of functional programming. These composite functions bring to bear what we know about data and types. Maybe and either ask the same questions of each piece of data presented to them so we can get added guarantees and stability in our applications through better data integrity.

###Functions

When discussing functional programming and data we must discuss one of the core data types to the language, functions. Javascript, like other functional programming languages, treats functions like data. This means that functions can take on characteristics which are intrinsic to other data types and are defined in the core language the same way any other data type might be. This particular behavior is why it is common to hear functions in Javascript referred to as _first class citizens_.

Two things make functions unique in Javascript. First, functions are executable, which allows them to provide behavior in the language. Second, functions can be expressed with a special keyword, 'function,' as a means to define the function with or without a uniquely identifying name. Aside from these two distinct characteristics, functions behave much like other complex data types like objects.

Before we explore the deeper nature of functions as data, let's take a look at an idiomatic method for creating a new function. The function keyword acts similarly to an operator or a macro in other functional languages. Functions can be declared with or without a name, the other two defining elements, arguments and function body, are required. Below we have described two common arithmetic functions.

	// Defining a named function
	function add (a, b){
		return a + b;
	}
	
	// Defining an unnamed (anonymous) function
	var multiply = function (a, b) {
		return a * b;
	}
	
	add.name; // 'add'
	multiply.name; // ''

Each of these functions can be called to execute their particular behavior, however multiply is actually not a function. Add is an integral part of the function definition for our add function. Multiply, however, is just a variable storing a reference to the anonymous function which expresses the multiplication behavior. Although this can seem like a minor difference, at runtime, the difference between a named or anonymous function can make or break a debugging session.

Multiply is the perfect segue into managing functions as data. The pointer multiply stores represents a pointer to data, which could be executed and produce a behavior, or it could be treated as a complex data type, much the same way as an object literal. Functions and generic objects in Javascript are actually quite similar.

Functions, like every data type in Javascript, have a prototype.  This prototype carries some of the same characterstics as objects and arrays. Functions have a length and a toString method. Properties can be attached to them and deleted from them. It is even possible to enumerate keys which have been attached to functions at runtime. Let's experiment a little with the function data type and see what we can accomplish.

	var greet = new Function('subject', 'return \'Hello, \' + subject;');
	
	// greet is a callable function
	greet('world'); // Hello, world
	
	var hello = greet;
	
	hello.subject = 'universe';
	hello(greet.subject); // Hello, universe
	
	hello.length; // 1
	greet.length; // 1
	greet.name; // ''
	greet === hello; // true
	getType(greet); // function

	greet.toString();
	// 'function anonymous(subject\n/**/) {\nreturn \'Hello, \' + subject;\n}'


###Lists

In functional programming, lists are an important data structure for handling, storing and retrieving data. Lists are, at their most abstract, a collection of ordered data. When we talk about ordered data, the order is not necessarily a meaningful or predictable thing, instead it is simply the order in which the data was place in the collection.

Javascript does not support traditional lists by default, unlike other functional languages. Instead, Javascript has an array collection, which provides certain access characteristics which reach beyond typical lists. Aside from a defined order characteristic, arrays also have a random access characteristic which provides speed when capturing the nth element of your collection.  Let's use this as a jumping off point to look at interacting with arrays as lists.

Lists and arrays share one common trait, a head or first element. This element is interesting because for both arrays and lists, the access time is O(1) otherwise known as constant time. Regardless of how large the array or list is, we can always access the first element without knowing anything about the rest of the collection.  Let's create a function for getting the first element in an array.

	function first (list) {
		return list[0];
	}
	
Although this function seems rather futile, it turns out this is a very common behavior in functional programming. More often than not, we are more iterested with the first value in a list or array than in any other particular element. Even in a common iteration scenario, typically iterations start from one end of the collection and work to the other. Effectively, what we are left looking at is the first element of our list and the rest of our list. This means we will want another function to get the remaining list in order to continue our iteration. Let's call this function "rest."

	function rest (list) {
		return list.slice(1);
	}

First and rest, together, create the foundation for performing non-destructive actions on lists. First simply peeks at the head of our list and returns that value. Rest does the grunt work of slicing the head value from the list and returning a new list, one value shorter than the original list. We can see this behavior at work if we treat Javascript arrays as if they were identical to their ordered list counterpart.  Suppose we wanted to find the nth value of a list, we could create a function, nth, to do this for us, taking a list and index, and returning the nth value.

    function nth (index, list) {
		var tempList = list,
		    currentIndex = 0;
		
		while (not( isUndefined( first( tempList ))) && greater(index, currentIndex)) {
			tempList = rest(tempList);
			currentIndex = add(index, 1);
		}
		
		return maybe(first(tempList));
	}

This nth function actually exposes the declarative nature of using functions over operators. It is especialy useful when looking at "not isUndefined first tempList" which states in clear language precisely what we are really testing. Hwever informative this code is, it is unnecessary and verbose. There is a better way to accomplish iterations, which we will discuss later and there is a better way to access the nth element of our list. We can take advantage of what we know about arrays in Javascript and write a simpler, faster function. Let's create a more idiomatic nth function which will be both brief and efficient.

	function nth (index, list) {
		return list[index];
	}


###Maps

Maps are the final piece of the data puzzle for functional programming. Maps are complex data types which store key value pairs for fast, random retrieval of information. Much like lists, Javascript does not support native maps directly. Instead we can use object literals in the place of maps. The surface functionality is similar enough, once we dive into working with keys ad values, any specific differences will disappear.

The first thing we will want to accomplish with maps is reading existing data. It is quite common to retrieve data from an endpoint and need to interact with it. JSON has become the lingua franca of data interactions, so it is likely any data received from a service will be an object.  Let's have a look at getting data from an object.

	function pick (key, map) {
		return maybe(either({}, map, 'object')[key]);
	}

At first glance that looks like quite a bit of code, but we get some guarantees not provided by Javascript idiomatic behaviors. We introduced maybe and either as data types eariler in this chapter to provide data stability. Now we can see the payoff with pick. Let's break down what is happening and why returning a maybe type is valuable here.

Our innermost maybe does a type check for 'object' and returns either the map object, or null. This is the baseline for how maybe works, which means we know with precision what will be returned. Our data will either exist and it is an object, or it is null.  A null value means the type check failed and our map was not an object.

The next check is an untyped either. This means we are relying on the value to either be truthy or falsey. Our maybe check already did the work, so we are just interested in whether the object is null or an object we can make a key reference against. The default value returned by our either is an object, so the result will always be an object.  We now have a guaranteed stable object to dereference a key against.

Finally we return a maybe value. This means pick will always return either the intended value, or null. In much the same way that our inner maybe gave us a type guarantee the outer maybe ensures the result of our function will always provide an expected result which provides data guarantees to the calling function,  These guarantees help to eliminate script failures due to unexpected values and null pointer references. In other words, our pick function won't break and it does its best to avoid breaking other code too.

Our pick function puts us in just the right place to dig deeper into objects. It's fantastic when we can get a value safely one level deep in our objects, but often we need to access data deeper than one level in an object. We could chain several pick functions together to find a value, or we could do it the functional way, and build an abstraction which says precisely what it does.  Let's build a better function.

	function deref (key, map) {
		var tokens = either('', key, 'string').split('.'),
			result = null;
		
		while(not( isUndefined( first(tokens)))) {
			result = pick(first(tokens));
			tokens = rest(tokens); 
		}
		
		return result;
	}

Deref is just an iterative layer over the top of pick, which makes the entire development process rather painless. We didn't need to perform even one null check because we had the guarantee of the maybe type built into pick. This means result our result is, implicitly, a maybe value. We can guarantee our result will always either be the intended result, or null. That's a really strong guarantee to provide in our code when we can never be quite sure about the quality of the data we might get.

We have looked at accessing data in a map, though the keys can be as meaningful as the data sometimes. Maps can be constructed around keys which identify the data stored at each location uniquely. Keys which are universally unique identifiers (UUIDs) or record IDs can be useful for understanding and interacting with the data contained in a map. Javascript has the Object.keys function, but when we call it with null or 'foo' or 983, it fails spectacularly. Let's fix that.

	function keys (map) {
		return Object.keys(either({}, map, 'object'));
	}

The last data function we are going to look at for managing map data is a function to capture just the values of a map and return them as a list. Sometimes all we need to do something useful is a set of values. This is common when we need fast access by an ID as a collection is being built, but we really need a list in the end, or if an object is merely masquerading as an array. The second case is especially frustrating since the structure could really have been an array all along.

	function toValues (map) {
		var keys = keys(map),
			result = [];
		
		while(not( isUndefined( first( keys )))) {
			result = pick(first(keys), map);
			keys = rest(keys);
		}
		
		return result;
	}

Once we have a toValues function, we can easily work with and create maps, then convert them to lists with a single function call. As we dig deeper into the world of functional programming in Javascript, this kind of power will pay great dividends when we start working with large or complex data structures, breaking them down and using the resulting collections to get real work done.


###Ideas In action

A pattern which emerged wile we were iterating over lists is checking whether a first element exists. Since this behavior can be repeated throughout a number of iteration behaviors, it makes sense to abstract away this logic which, though informative, is not as declarative as it could be. Since we want to verify that the first element exists in a list, we could easily call our new function firstExists.  We can combine our first function and the predicates to verify its existence to create a new predicate.

	function firstExists (list) {
		return not(isUndefined(first(list)));
	}

Once we have a new abstraction for our list checking behavior, we can rewrite our deref behavior. Later we can take a look at how to further reduce the amount of logic and energy we put into this, but for now we can make an iteration to clarify our logic.

	function deref (key, map) {
		var tokens = either('', key, 'string').split('.'),
			result = null;
		
		while(firstExists(tokens)){
			result = pick(first(tokens), map);
			tokens = rest(tokens);
		}
		
		return result;
	}
	
Now our iterator really says exactly what we mean, "while a first element exists, iterate." This really demonstrates the power we get from functional programming and good abstractions. Through the power of relaible type handling and understanding the data which flows through our application, we can take potentially complex data manipulations and reduce them to simple, expressive functions which declare our intent and reduce the amount of brain time involved in understanding what the last person wrote, even if the last person was you.