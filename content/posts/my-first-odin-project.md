---
title: 'Adventures in Odin: The Joy of Programming returns'
date: '2026-06-19T11:16:41-04:00'
publihDate: '2026-06-26T10:13:41-04:00'
draft: false
---

> [!CAUTION]+ AI Disclaimer | **code**: 🤖
> 
> Most of the code linked here was written by
> AI under my supervision. I stand behind it. I haven't yet audited 100% of the
> code, but I have audited most of it, tested the output and I am satisfied with it.
> 
> 100% of the prose on this page was typed with my own two hands.

Awhile back, I was trying to clean up my work projects directory which had  
grown bloated from years of one-off projects.

My backup plan is relativey straightforward: I use [NixOS](https://nixos.org/)  
as a "version manager" for my system, ensuring I can quickly rebuild if my hard  
drive gets nuked. Part of my nix config includes  
[home-manager](https://github.com/nix-community/home-manager), which manages your  
dotfiles, shell config, git username, etc., similar to  
[GNU Stow](https://www.gnu.org/software/stow/).

Every project is in a remote git repo, which I instinctively push to the `dev`  
branch, about as often as I instinctively hit reload in an FPS. Each repo is also  
a [nix flake](https://nixos.wiki/wiki/flakes), which you can think of like an OS  
level version of `package.json`+`package.lock`<sup>[\[1\]](#fn1)</sup>.

What this means is I can clone a project to any linux machine and have a  
development envrionment with the exact same dependencies (php, go, Caddy, etc.)  
that I had on the machine I started with.

So if my hard drive dies on me, the procedure goes:

1.  Re-install NixOS
2.  restore SSH keys from a backup
3.  `git clone` any projects I need to work on.
4.  Profit

* * *

Did you notice a hole in my plan? Take a second to think about it.

<details>
<summary>The Hole</summary>
<p>Many of the projects require secrets, either to talk to remote APIs or to
encrypt the databases. Those secrets are in <code>.env</code> files, and those
<code>.env</code> files aren't getting backed up.</p></details>

I figured I couldn't be the first person to have this problem, and so I searched  
the internet - but couldn't find a solution.

## Enter envr

With no off-the-shelf solutions to be found, I decided to make my own, and  
seeing as I was at work, and not really interested in getting my hands dirty at  
the time, I decided to throw something together using Golang, AI, and libraries  
I knew I liked. I was able to get a working prototype together very quickly, and  
so [envr](https://github.com/sbrow/envr) was born.

Envr is a commandline application that you run periodically to import your `.env`  
files into an encrypted database. The encryption is based on  
[age](https://github.com/FiloSottile/age), allowing you to encrypt the data with
multiple keys.

There are commands to list the paths that are tracked, update the contents of files,  
restore them, search for untracked files, and more.

The key feature is that I can backup a .env file, `rm` a project, and if I ever  
need to work on it again, I just `git clone` it to the same path<sup>[\[2\]](#fn2)</sup> and call  
`envr sync` .

It's not a backup solution in-and-of itself, but it takes your scattered secrets  
and consolidates them in one easy to manage place.

## Zig

As a career web dev at a small company, I've had precious few opportunities to
work on high performance code, or really anything without a garbage collector.

I had learned about [Zig](https://ziglang.org/), and found it intriguing.
I wanted to write some code with it to broaden my knowledge and skillset,
and I've always found rewriting old projects in a new language to be enlightening.

After rewriting a Rust based ZMQ work project, I set my sights on envr.

Progress was slow, as Zig is an incredibly explicit language; and on top of that,
neither it nor the Ziggit community<sup>[\[3\]](#fn3)</sup> are particularly AI
friendly. The language itself has not reached 1.0, and underwent a pretty massive
change with the addition of the Io interface in 0.16.0

However, my focus was about to shift...

## A Wild Odin Appears

I had heard of Odin before, and heard gingerbill speak in a number of YouTube
videos, but in an effort to not get distracted, I was waiting to look into it
until after I had given Zig the old college try.

That all changed one morning when the Primeagen's video
[I am done with Golang](https://youtu.be/WqSWZuGS9pc) came across my feed. I'm a
big fan of Go, and although it has its problems, projects I wrote nearly 10 years
ago can still compile unmodified with a modern Go compiler.

While I think it's a bit hyperbolic to say Go is "over" because you can make
Option/Error monads now, (some people have always been witing non-idiomatic go
code), what stood out to me was how he likened Odin to a Go successor.  
Hearing this, I had to know more.

After looking over the overview, a few things quickly stood out to me:

1. Using `::` to declare constants feels like a natural extension to the implicit
type variable declaration syntax in go `x := 4` (and reminds me fondly of Haskell).
    

For Example:

Odin

```odin
# Constant
x :: 12

# variable
y := 3
a : int = 3

# variable
z: int

# variable assignment
z = y + x

```

Go
```go
const x = 12

y := 3
var a int
a = 3

var z int
z = y + x
```

2. Returning to directory level packages felt like a weight of my shoulders.
Not that there's anything *wrong* with file-level modules, it justs gives you so
many more decisions to make, piling on to the decision fatigue.
3. My time with Zig had given me a new appreciation for the `string` and `rune`
types. I'm on the fence about them in general, but because procedure parameters
are immutable in Odin, something I never have to  worry about when accepting a
list of strings, is whether the type should be: `[][]u8`, `[][]const u8`, or
`[]const []const u8`. Instead I just accept `[]string`.

---

Liking what I saw, I quickly decided to give Odin a shot, and convert my Go
codebase to it (with AI). I could not be more pleased with the results! The
conversion went smoothly, and aside from AI sometimes home-rolling stuff that
exists in core packages, it was pretty easy. I ended up with fewer dependencies
(from dozens down to just 2), and a dramaticially smaller binary size
(from ~17MB down to ~600KB), which was the most shocking improvement to me.
The codebase got smaller and eaiser to understand.

I learned very quickly that having a strong test suite is a must when working
with memory-managed languages, as I had leaks all over the place. But it wasn't
hard to track them down and fix them, and since my project was a short-lived CLI,
it didn't really affect the performance.

I really expected I would notice the lack of methods, but was pleasantly
surprised to find out how unnecessary they can be. Using the
[table](https://pkg.odin-lang.org/core/text/table/) package feels reminiscent of
method chaining, but it's just procedures all the way down!

From the docs: 
```odin
package main

import "core:fmt"
import "core:strings"
import "core:text/table"

main :: proc() {
	string_buffer := strings.builder_make()
	defer strings.builder_destroy(&string_buffer)

	{
		tbl: table.Table
		table.init(&tbl)
		defer table.destroy(&tbl)
		table.caption(&tbl, "Hellope!")
		table.row(&tbl, "Hellope", "World")

		builder_writer := strings.to_writer(&string_buffer)

		// The written table will be cached into the string builder after this call.
		table.write_plain_table(builder_writer, &tbl)
	}
	// The table is inaccessible, now that we're back in the first-level scope.

	// But now the results are stored in the string builder, which can be converted to a string.
	my_table_string := strings.to_string(string_buffer)

	// Remember that the string's allocated backing data lives in the
	// builder and must still be freed.
	//
	// The deferred call to `builder_destroy` will take care of that for us
	// in this simple example.
	fmt.println(my_table_string)
}
```

	    
Odin feels like has the important things I missed from Haskell (enum types,
tagged unions), Go (package level modules, multiple return values) and has even
more with `#soa` and the `bit_set` type.

## Conclusion

I would sit down after a long day of work, do ~30mins of Zig and think
"Well that's all my brain can handle for today". But with Odin, I'd get to the
end of the day and think "Oh, boy I can write more Odin now!"

I still like Zig, and am still happy to support its development financially,
but it's a lot more work than Odin (for me), and for fun projects, I feel like
I have 90% of the control with ~%30 of the effort. 

If you want to know more about my process for using AI to move from Go to Odin,
check out my [next article](../i-ported-fd-to-odin).

* * *

1.  A lot of Nix developers (and probably some users) would likely be *very*  
    upset about me comparing nix to npm - they are fundamentally different in  
    a lot of important ways, but if you've never heard of nix before, those  
    differences are not really relevent to this discussion. [↩︎](#fnref1)
    
2.  envr does have the capability to find moved directories, but I have yet to  
    test it thouroughly. [↩︎](#fnref2)
    
3.  Not **everyone** in the community is anti-AI, but a subset of it takes a very hard stsnce on the matter, so you have to be very conscious of how you're using AI if you plan on showing your code there. [↩︎](#fnref3)
