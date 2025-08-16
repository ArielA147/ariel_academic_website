# What Is Behind Clojure Error Messages?

Have you ever looked at your REPL and asked yourself “What am I supposed to understand from this?”. This is not just a junior thought, but one also common to more advanced programmers. What makes it hard is that Clojure error messages are not very informative. This is why a lot of work was put into improving these error messages.

The errors seem a bit strange at first, but you can get used to them and develop a sense of where to look. Then, handling errors will be much less difficult.

In this post, we'll look into four different types of errors.

## Have No Fear of the Stack Trace

When you get an error in Clojure, the stack trace will probably be the first place you will look to try to understand what happened. The problem with the stack trace is that you usually get a huge stack trace, hence it can be very intimidating if you are not familiar with it. But with the right strategy, you can get a lot of information out of it.

If the error happened inside a library you are calling, then it propably looks something like this:

```
Exception .... (1)
  at java...
  at java...
  at clojure...
  at clojure...
  at some_library.... (3)
  at some_library....
  at your_own_code.... (2)
  at your_own_code....
  at ...
  ... (lots more after this)
```

Stack traces are upside down; the most recent stack frame is at the top. In this case, our `your-own-code` namespace is calling the `some-library` namespace, which calls a Clojure function, which relies on Java. Some of these parts may be missing, but generally this is the pattern you'll see. I've marked the most important places to look for.

- (1) Look at the exception type and message. Do you understand what it means? We'll give you some tips to understand these further down.
- (2) Find the first line of the stack trace involving your own code, this will tell you a file and line number. Go look at that line. What is it doing? How could that relate to the error you got?
- (3) Find the top-most line before that doesn't start with "java" or "clojure", this could be your own code, or library code, but it's another important part of the puzzle. What is that line doing?

The rest of the stack trace is usually not that important, but don't dismiss it just yet. Maybe you see that you have a `nil` somewhere causing a `NullPointerException`. But where did that `nil` come from? Look at the lines below of the ones pointed out, and try to understand where the value is coming from.

Most errors in Clojure can be classified into patterns and contain interfaces. There are many different patterns for errors, some of them were documented in [this repo](https://github.com/yogthos/clojure-error-message-catalog) by members of the community. Let's try to understand what we see by focusing on the errors type and error description which contains the patterns.

## How to Recognize Errors by Spotting Certain Patterns

Let's get down to business and tackle some of the confusing error messages you might encounter:

**1) Pattern #1: `X can not be cast to Y`**
   * Explanation: You have something of type X, but the function you are calling expects it to be of type Y. Clojure tries to cast X to be of type Y, but fails.
   * Pattern example: `Java.lang.String cannot be cast to clojure.lang.IFn.`
                    In this case, it’s not possible because the JVM doesn’t know how to turn a String into an IFn (Interface Function).
   * Code example: A number is being used where a function is expected.

```clojure
user=> (def x 10)
user=> (x)
Execution error (ClassCastException) at user/eval138 (REPL:1).
class java.lang.Long cannot be cast to class clojure.lang.IFn
```

Here it helps to learn to recognize some of the interface names that Clojure uses. `IFn` means a function, or something that acts like a function, like a keyword. `ISeq` is a sequence, like a `list` or the result of `filter` or `map`. `IPersistentCollection` means any Clojure collection, like a vector, map, or set.

A particular case that you might come across is Clojure complaining it can't cast to `java.util.concurrent.Future`. This means you are trying to dereference something that isn't dereferencable.

```clojure
user=> @3
Execution error (ClassCastException) at user/eval7 (REPL:0).
class java.lang.Long cannot be cast to class java.util.concurrent.Future
```

You don't actually need a future to replace the number in this case, it could be an atom, a delay, or any other reference type, so don't the let "Future" in that error message throw you.

**2) Pattern #2: `Don't know how to create Y: from X`**
   * Explanation: This is very similar, Clojure tries to convert into X into Y, but can't.
   * Pattern example: *`IllegalArgumentException Don't know how to create ISeq from: java.lang.Long.`*
                       In this case, it was expecting a collection but got a number, hence converting from a number (*Long*) into a collection was not possible.
   * Code example: Trying to iterate over a number, instead of a collection.

```clojure
user=> (reduce (fn [x y] (into x (+ x 1))) [1 2 3])
Execution error (IllegalArgumentException) at user/eval1$fn (REPL:1).
Don't know how to create ISeq from: java.lang.Long
```

**3) Pattern #3: `Wrong number of args (X) passed to: Y`**
   * Explanation: the function Y expected to get a different number of arguments instead of the X number of arguments we gave.
   * Code example: In this case, the function expects a single collection, but we are passing it 3 numbers.

```clojure
user=> (first 1 2 3)
Execution error (ArityException) at user/eval3 (REPL:1).
Wrong number of args (3) passed to: clojure.core/first--5402
```

**4) Pattern #4: `X - failed: even-number-of-forms? at: [:bindings] spec: :clojure.core.specs.alpha/bindings`**
   * Explanation: This happens during Clojure's compilation phase, when you have a form like a `let` binding vector, which is expected to contain an even number of entries. You can see here that internally Clojure uses `clojure.spec` to validate these, which is why this error message looks a little different.
   * Code example: In this case, it was expected to have even numbers in the binding of the `let` but we gave it an odd number. The bindings vector should contain pairs of names and values, so it should always be even.

```clojure
user=> (let [a b 2] (+ a b))
Syntax error macroexpanding clojure.core/let at (REPL:1:1).
[a b 2] - failed: even-number-of-forms? at: [:bindings] spec: :clojure.core.specs.alpha/bindings
```

A related message is `Map literal must contain an even number of forms`, which happens when you evaluate something like `{:hello}`. The `:hello` key needs to have a value associated with it. If you meant to create a set, add a #: `#{:hello}`.

## Final thoughts ##

After reading those few examples and explanations, I hope you feel like next time you will know who is your main suspect when you investigate those errors.

From my standpoint, I think that Clojure error messages could be more informative and less threatening especially for those who are new to the language. But in the same breath, remember that writing code is 10% writing new code lines and 90% debugging and refactoring. At least now you know where to start when doing the 90%.
