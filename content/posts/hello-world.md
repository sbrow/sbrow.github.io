---
title:  Why Too Many Features Spoil The Language
date: '2025-03-15T08:49:54-04:00'
publishDate: '2025-03-21T10:22:36-04:00'
draft: false
isStarred: true
---

## Hello, World!


The humble and venerable "Hello World" program has been with us for many decades.
Love it or hate it, we've all written at least one. While it can't always tell
you much about a language, when it can- you better listen.

Something that draws me to new programming languages is whether or not they're
opinionated. I find that opinionated languages tend towards having
"one [correct] way to do things", and this shuts down a lot of bikeshedding
about code style or particular types of abstractions.

I consider myself a programming polyglot, and you should too! Every language worth
its salt has something valuable to teach you. Whilst my favorite programming
languages of late are nushell, Zig, and golang- for the last 6 years at my job
I have been coding primarily in PHP.

For those of you not in the know, PHP is a practical and productive
language that can be used to very quickly set up pseudo-microservices, and it's
an excellent choice when you just need to throw something together. It's also
AI friendly if you're into that sort of thing.

So, with positivity out of the way, I can speak my mind. It is **not** a pretty
language. The syntax is all over the place, ditto the casing conventions,
functional programming is awkward at best, and most importantly
**there are way too many ways to do the same thing**.

I never liked PHP, but I have come to appreciate it's practicality, and one
of the important lessons it's taught me, is that in a professional context,
formatting just doesn't matter. We all have much bigger problems to deal with
than to argue over 2 or 4 space indenting, 80 or 100 line limits, etc.

But that's a topic for [another article](/ideas).

### Foreword

To illustrate how PHP has too many features, I embarked on a journey to discover
just how many Hello World programs I could write in PHP. I wrote a nushell script
to ensure every code fragment I show you outputs the text "Hello, World!", plus
or minus trailing or leading whitespace. I will include that code in a
footnote.[^nu]

We'll start with programs that output a static "Hello, World!" message, then move
on to programs that accept a variable for "World", and we'll keep iterating until
our minds break.

But before we enter the gates of hell, I'd like you to pick your favorite
programming language, and think about how many different ways you could write
"Hello, World". Start with the obvious ones. Then go a bit crazy. Go even *more*
crazy. You don't have to actually code them all out, just think about all the
ways you can write to stdout, format a string, etc.

---

How many did you come up with? 2, 3, 5? Maybe as many as 10? Languages like go
should only have a handful. Ones that support macros like Rust, you can get a
bit crazier with, and older ones like Common Lisp that have macros *and* multiple
output functions (`print`, `princ`, `terpri`, `prin1`, `format`, etc.)
you can start to go crazy with.

Let's take a peek inside the crazy world of PHP and see just how deep this rabbit
hole goes...

### Pure 

Despite all the horrible things I've said about PHP's pragmatic awfulness,
it arguably has the the world's best Hello World program:


```php { #ex-1 }
Hello, World!
```

Those familiar with PHP can skip to the next example.

This code is not a mistake. Putting the raw text "Hello, World!" in a `.php` file
and opening it in your browser will display whatever text is in that file. [^php-fpm]

[PHP](https://www.php.net/) is a recursive acronym that stands for
"PHP: Hypertext Preprocessor", and it was originally intended to let you upgrade
your website by changing the extension of your pages from `.html` to
`.php`, gaining the ability to dynamically generate content on those pages.

In order to actually write PHP "code", you need to start a code block
with `<?php`. You can go back to "text" mode by writing a `?>` tag.

While many modern PHP frameworks ditch this idea, in favor of using a
templating language like [twig](https://twig.symfony.com/doc/3.x/)
or [blade](https://laravel.com/docs/11.x/blade), it's still a part of the
language, and it's a useful way to write pseudo-microservices.

```php { #ex-2 }
<?php

echo "Hello, World!";
```

```php { #ex-3 }
<?php

echo 'Hello, World!';
```

While many compiled languages reserve single-quotes to represent chars rather
than strings, PHP (rightly) lets you use either.[^1]


```php { #ex-4 }
<?php

print 'Hello, World!';
```

Even PHP devs might be taken aback by this one (I certainly was), as `echo` tends
to be the prevalent keyword in the wild.

What's the difference between `print` and `echo` you may ask? Well,
[echo](https://www.php.net/manual/en/function.echo.php) can accept multiple
arguments and returns `void`, but [print](https://www.php.net/manual/en/function.print.php)
accepts just one argument, and returns `1`. Do we really need both? I'd say no,
but since `echo` can take multiple arguments, we're adding this to our roster:

```php { #ex-5 }
<?php

echo 'Hello,', ' World!';
```

Incedentily, did you notice how I said that `echo` is a keyword? Apparently, this
must have been confusing to someone at some point, so in order to make things
*clearer*, you can also use these keywords with parentheses. So say
hello to our next 3 examples:

```php { #ex-6 }
<?php

echo('Hello, World!');
```

```php { #ex-7 }
<?php

print('Hello, World!');
```

```php { #ex-8 }
<?php

echo('Hello,'), (' World!');
```

Did that last one blow your mind? I'm certainly picking pieces of skull out of
my keyboard.

That's right, `echo` is a 'language construct', not a function- which means it
can be called with *or without* parentheses. There are at least 4 such constructs
that I know of: `echo`, `print`, `exit`, and `die`.

> **QUICK:** PHP devs, you have 30 seconds to tell me the difference between `exit`
and `die`...

Time's up. The correct answer is: **Nothing**.

[Die is an alias of exit](https://www.php.net/manual/en/function.die.php).
They are therefore identical- no need to grab the kitchen sink: it's *already in
here*.

I knew that you could wrap your echo calls in `()`, but I had *no* idea that echo
could take multiple arguments, and when it does, it's a disaster. 

This weird syntax means that statements like `echo(1 + 2) * 3;` output `9`. [^2]

It doesn't stop there though- you don't just get to choose between parens or not
parens, you get to choose it **for each argument separately**.

```php { #ex-9 }
<?php

echo 'Hello,', (' World!');
```

```php { #ex-10 }
<?php

echo('Hello,'), ' World!';
```

I wish I was joking.

---

Moving on:


```php { #ex-11 }
<?php

print_r('Hello, World!');
```

This time, I'm being a little unfair. [print_r](https://www.php.net/manual/en/function.print-r.php)
is specifically meant for debugging variables: it prints the contents of them in
a "human-readable" format. In the case of strings though, it doesn't wrap the
output in quotes or anything, so we're counting it.

### Adding Parameters

Let's move on now to Hello World programs that vary their output based on the
user:

```php { #ex-12 }
Hello, <?php echo $_GET['user'] ?? 'World'; ?>!
```

Already we can see that things are starting to get less clean. In this example,
we extract the 'user' value from the query string (i.e. `https://index.php?user=World`)
and default to `'World'` if none was provided.

However, we can clean it up a little bit:

```php { #ex-13 }
Hello, <?= $_GET['user'] ?? 'World' ?>!
```

`<?=` is essentially a macro for `<?php echo`. If you aren't using a templating
language, this can remove a lot of noise from your code, at the expense of
increased language complexity. Note also that we didn't need to close with a `;`
when using this tag.

### String Interpolation

Let's go back and update our [second example](#ex-2):

```php { #ex-14 }
<?php

$user = $_GET['user'] ?? 'World';

echo "Hello, ${user}!";
```

This version is equally valid, and probably more familiar to JavaScript
developers. Double-quoted strings support string interpolation, so the variable
$user will be inserted into the string.

Pedantic PHP devs however, will note that as of PHP 8.2
I'm using a [deprecated syntax](https://www.php.net/manual/en/language.types.string.php#language.types.string.parsing)
here: the `$` now goes inside the curly brace:

```php { #ex-15 }
<?php

$user = $_GET['user'] ?? 'World';

echo "Hello, {$user}!";
```

Confused? Don't worry- the curly braces aren't necessary at all[^3]:

```php { #ex-16 }
<?php

$user = $_GET['user'] ?? 'World';

echo "Hello, $user!";
```

However, string interpolation is unnecessary here- let's not forget what we
learned about `echo`:

```php { #ex-17 }
<?php

$user = $_GET['user'] ?? 'World';

echo 'Hello, ', $user, '!';
```

Sure.

```php { #ex-18 }
<?php

$user = $_GET['user'] ?? 'World';

echo ('Hello, '), ($user), ('!');
```

Okay...

```php { #ex-19 }
<?php

$user = $_GET['user'] ?? 'World';

echo ('Hello, '), ($user), '!';
```

Oh god...

```php { #ex-20 }
<?php

$user = $_GET['user'] ?? 'World';

echo ('Hello, '), $user, ('!');
```

Please stop...

```php { #ex-21 }
<?php

$user = $_GET['user'] ?? 'World';

echo 'Hello, ', ($user), ('!');
```

You monster.

There are more permutations, but I can't handle them right now.

### Time to stop counting

By now, I think there's at least five or six Hello World programs that I've
missed in the previous sections, so our official count will no longer be
official.

However, I'm sad to say that we aren't yet done adding language features.
So far, we have the following options for printing to output:

1. Exiting php to output what follows as raw text.
2. Printing to output using the echo command.
3. Printing to output using the print command.
4. Printing to output using the `<?=` short tag.

That may sound like enough options to you, but wait...**there's more**!


```php { #ex-22 }
<?php 

$user = $_GET['user'] ?? 'World';

echo sprintf('Hello, %s!', $user);
```

Yes, for complex output, we can choose to echo *formatted strings!* But don't
forget everything we learned from before:

```php { #ex-23 }
<?php

$user = $_GET['user'] ?? 'World';

echo(sprintf('Hello, %s!', $user));
```

```php { #ex-24 }
<?php

$user = $_GET['user'] ?? 'World';

print sprintf('Hello, %s!', $user);
```

```php { #ex-25 }
<?php

$user = $_GET['user'] ?? 'World';

print(sprintf('Hello, %s!', $user));
```

Of course, only an idiot would use any of the above examples, when `printf`
exists:

```php { #ex-26 }
<?php

$user = $_GET['user'] ?? 'World';

printf('Hello, %s!', $user);
```

Fortunately, (or unfortunately, depending on your level of masochism), `printf`
if a proper function, so it can't be called without parens.


### Multi-line strings

Think you've learned everything about PHP strings? *Think again!*

PHP Supports multi-line strings in the form of heredocs and nowdocs.

```php { #ex-27 }
<?php

$user = $_GET['user'] ?? 'World';

echo <<<TXT
Hello, $user!
TXT;
```

```php { #ex-28 }
<?php

$user = $_GET['user'] ?? 'World';

echo <<<TXT
Hello, {$user}!
TXT;
```

```php { #ex-29 }
<?php

$user = $_GET['user'] ?? 'World';

echo <<<TXT
Hello, ${user}!
TXT;
```

```php { #ex-30 }
<?php

$user = $_GET['user'] ?? 'World';

echo <<<'TXT'
Hello,
TXT
. " $user!";
```

and of course, we have to take it too far:

```php { #ex-31 }
<?php

$user = $_GET['user'] ?? 'World';

echo (<<<TXT
Hello, $user!
TXT);
```

```php { #ex-32 }
<?php

$user = $_GET['user'] ?? 'World';

echo (<<<TXT
Hello, 
TXT), $user, '!';
```

### WTF, echo?

Now if you aren't already as pissed off at `echo` as I am, this will probably push
you over the edge. `echo` takes multiple arguments, right?
i.e. with echo, we can `echo 'Hello ', $user, '!';` and with `print` we can't.
While some people might think that this makes `echo` necessary, we can just do
*this* instead:

```php { #ex-33 }
<?php

$user = $_GET['user'] ?? 'World';

print(implode('', ['Hello, ', $user, '!']));
```

Or just use string concatenation:

```php { #ex-34 }
<?php

$user = $_GET['user'] ?? 'World';

print('Hello, ' . $user . '!');
```

so why do we *need* `echo`?

> Now that we've added string concatenation and `implode`, you need to update
your head-canon to include Hello, World programs that replace every
`echo $arg1, $arg2, ...` statement in all of our examples with
`echo $arg1 . $arg2 ...` and `echo (implode('', [$arg1, $arg2]))`.
I'm not writing those ones out.

...

Okay fine, here's *one* more:

```php { #ex-35 }
<?php

$user = $_GET['user'] ?? 'World';

echo <<<TXT
Hello, 
TXT . $user . '!';
```

So why use heredocs? You may have noticed that I used `<<<TXT`,
instead of the more traditional `<<<EOF`. One of the reasons to use heredocs and
nowdocs is that good IDEs can actually use the delimiter you chose to change
what LSP executes in that block (e.g. `<<<HTML`, `<<<CSS`, etc.), which can be
great when you're dynamically generating content.

That being said, if you're some kind of psycopath, nothing stops you from making
a regular string span multiple lines:

```php
<?php

$user = $_GET['user'] ?? 'World';

echo "Hello,
$user
!";
```

But we can't add this one to our official count of course, because the newlines
aren't removed from the string.

Output:

```
Hello,
World
!
```

#### Brief Recap

There's been a lot of information here, so lets quickly review the many, *many*
 ways you can build a complex, variable string in PHP:

1. You can [escape php context and use echo](#ex-12).
2. You can escape php context and use print.
3. You can [escape php context and use the short echo tag](#ex-13).
4. You can use [simple string interpolation](#ex-16).
5. You can use [advanced string interpolation](#ex-15).
6. You can use advanced string interpolation with the [deprecated syntax](#ex-14).
7. You can `echo` the arguments [one at a time](#ex-17).
8. You can [concatenate the arguments and then use print](#ex-34), (or `echo`).
9. You can [implode the arguments and then use print](#ex-33), (or `echo`).
10. You can use `print` or `echo` [in conjunction with `sprintf`](#ex-22).
11. You can use [printf](#ex-26).
11. You can use a [heredoc](#ex-27), (optionally with the addition of 6, 8 or 9).
11. You can use a [nowdoc](#ex-30), (optionally with the addition of 8 or 9).

And if **that** isn't enough options, *I don't know what is*.

### Output buffering

> GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH?!

That's right, we're not done. If you've made it this far, I commend you.
If not, I can't blame you. The hard truth is though, that we aren't quite done
with our string options. Allow me to show you why:

```php { #ex-36 }
<?php

function hello(?string $user = 'World'): string {
  return "Hello, $user!";
}

echo hello();
````

```php { #ex-37 }
<?php

function hello(?string $user = 'World'): void { ?>
Hello, <?= $user ?>!
<?php }

hello();
```

Both of these are equally valid Hello, World programs. The first function returns
a string which is later printed to the output buffer, while the second one prints
immediately to the output buffer and returns nothing.

But what if you initially want your function to write directly to the output
buffer, but further down the line you decide that you also want the ability to
extract the output from it like it was a string?

PHP allows you to control and capture the output buffer before it gets sent to
the browser (or STDOUT):

```php { #ex-38 }
<?php

function hello(?string $user = 'World'): string {
  // Pause output printing so we can query it later.
  ob_start();

?>Hello, <?= $user ?>!<?php

  // Empty the output buffer and restore normal service.
  return ob_get_clean();
}

// The program won't output anything if you remove echo.
echo hello();
```

This particular feature can occasionally be quite useful, if you need to save
the output of some third-party code into a string, but the third-party code
prints directly to the output buffer.

But would the language be better if this feature was unnecessary?

### LET IT END

I have so much more to talk about, but I feel this article is already growing
long in the tooth, so I will provide the rest of my Hello, World programs with
minimal context:

#### Ternaries

```php { #ex-39 }
<?php

/**
 * ?? checks against null
 * ?: checks against falsey
 *
 * The difference can hurt you, but in this case,
 * all it does is print a warning.
 */
$user = $_GET['user'] ?: 'World';

echo "Hello, $user!";
```

```php { #ex-40 }
<?php

/**
 * A Proper ternary statement
 * <condition> ? <true branch> : <false_branch>
 */
$user = $_GET['user'] ? $_GET['user'] : 'World';

echo "Hello, $user!";
```

#### If/else

```php { #ex-41 }
<?php

if ($_GET['user'] ?? false) {
  $user = $_GET['user'];
} else {
  $user = 'World';
}

echo "Hello, $user!";
```

```php { #ex-42 }
<?php
/**
 * The if(): syntax is meant to make it easiser
 * to use conditionals inside html templates
 */ 
if ($_GET['user']): ?>
Hello, <?= $_GET['user'] ?>!
<?php else: ?>
Hello, World!
<?php endif ?>
```

```php { #ex-43 }
<?php
// But nothing stops you from:
if ($_GET['user']) { ?>
Hello, <?= $_GET['user'] ?>!
<?php } else { ?>
Hello, World!
<?php } ?>
```

Surely you can imagine however, that curly braces can get out-of-control, once you wrap
your `if` statement in a couple of loops.[^4]

And with that, our **43rd** Hello World program is complete.

### So what?

I know some of you are already furiously complaining in the comments:

- "You're just abusing the language, you could do this with anything!"
- "You're being hysterical, this isn't actually a problem!"
- "Skill issue! Skill issue!! If you don't know how to write a hello world
program correctly it's *your* fault."

My point(s) here are thus:

1. Having a simple language raises the floor on bad code. If there are fewer
choices, then fewer bad decisions can be made.
2. Having a simple language makes it easier to review other peoples' code,
because you don't have to mentally transpile their way of doing things to yours.
3. If this *isn't* a problem, why haven't we seen any modern languages based on
PHP?[^5]

There are going to be people who are read the whole manual, learn all of
these tools, and decide when to use each appropriately.

There are going to be people who read the whole manual, decide to use half
of the tools, and throw away the rest.

There are going to be people who go to Google (or ChatGPT) for the specific solutions
they need, and keep using what they know until it doesn't work anymore.

As long as this variety of people exists, we're going to get wildly different
versions of the same code, and waste time doing the mental conversions, or
bickering over who's right.

As my closing argument, here's a piece of code I found in the wild, along with
a refactor in a style that I prefer.

```php
<?php
function alert_flash(string $type, string $message)
{
    $alertID = 'alert_' . date('ms');
    return sprintf('<div id="%s" class="toast align-items-center text-white bg-%s border-0 m-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">%s</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Užverti"></button>
        </div>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                var element%s = document.getElementById("%s");
                var toast = new bootstrap.Toast(element%s);
                toast.show();
                setTimeout(function() {
                    element%s.remove();
                }, 7000);
            });
        </script>
    </div>', $alertID, $type, $message, $alertID, $alertID, $alertID, $alertID);
}
```

```php
<?php
function alert_flash(string $type, string $message)
{
    $alertID = 'alert_' . date('ms');

    return <<<HTML
<div id="$alertID"
     class="toast align-items-center text-white bg-$type border-0 m-2"
     role="alert"
     aria-live="assertive"
     aria-atomic="true"
>
  <div class="d-flex">
    <div class="toast-body">$message</div>
      <button type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Užverti"></button>
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const element = document.getElementById("$alertID");
        const toast = new bootstrap.Toast(element);
        toast.show();
        setTimeout(function() {
          element.remove();
        }, 7000);
      });
    </script>
</div>
HTML;
}
```

As I hope you've learned by now, there are *many* other ways to do it.

[^nu]:
    ```bash
    #!/usr/bin/env -S nu -n

    # Grabs all the php blocks out of a Markdown file and runs
    # them to confirm They output "Hello, World!"
    # +/- leading/trailing whitespce.
    #
    # Tested with nushell 0.102.0
    def main []: nothing -> any {
      let blocks = (
        open --raw ./content/posts/hello-world.md
        | blocks
        | check
      );

      print -e ($blocks | reduce -f {ok: 0, not_okay: 0} {|it, acc|
        if ($it.ok) {
          { ok: ($acc.ok + 1), not_okay: $acc.not_okay }
        } else {
          { ok: $acc.ok, not_okay: ($acc.not_okay + 1) }
        }
      });

      let failed = ($blocks | where not ok);

      print -e $failed;

      exit ($failed | length);
    }

    def blocks []: string -> list<string> {
      (
        rg -U "(?:^```php(?: .*)?$\n)(^[^`]+)"  --json
        | from json -o
        | where type == 'match'
        | get data.lines.text
        | str replace -r "```php.*\n" ''
      )
    }

    def check []: list<string> -> any {
      par-each {
        (
          wrap code
          | insert output {
            (
              $in.code
              | nix run 'nixpkgs#php' -- -n
              | rg -v '^(Deprecated|Warning):'
              | str trim
            )
          }
          | insert ok { $in.output == 'Hello, World!' }
        )
      }
    }
    ```
[^php-fpm]: Assuming you have a php server running of course. You can get one
by running  `php -S localhost:9000`
[^1]: When a lot of your work involves generating html attributes, being able to
easily quote quotes is a good thing.
[^2]: Citation: [echo documentation](https://www.php.net/manual/en/function.echo.php#refsect1-function.echo-notes)
[^3]: The curly brace syntax lets you do array/object access like `"{$foo->bar}"`.
[^4]: I used to use `endif`/`endforeach` when looping inside of html, until I
realized that [Helix](https://helix-editor.com/) only lets me jump if I use braces.
Your mileage may vary.
[^5]: No, [hack](https://en.wikipedia.org/wiki/Hack_(programming_language))
*doesn't* count. Unless you also count [this](https://www.youtube.com/watch?v=vcFBwt1nu2U).
