---
title: 'Why I Use Helix'
date: '2025-07-17T11:01:08-04:00'
---

Text editors are a very touchy subject for some people. If you haven't yet chosen
the IDE flag you want to wave when the editor wars start, my general advice
would be to **try all of them**.

If you're not sure where to start, either **VS Code**, or **LazyVim** (A Neovim
distribution) are great options.

*Editors are constantly changing, and it'd be weird if I was an expert on all of
them- so this article will likely age like a glass of warm milk, but my aim is
that the insight into my decision making process will remain relevant.*

## Editor History

Having followed my own advice, I have used quite a few text editors in my day.
I'll try to list out as many as I can remember, in the order I used them. Editors
I would still recommend are **in bold**.

1. Eclipse (Back in High School)
2. Sublime Text
3. Atom[^2]
4. **VS Code**
5. **PHPStorm (JetBrains)**
6. **Emacs**
7. **Neovim**
8. **Helix**
9. **Cursor**

After a brief stint with Cursor, I found myself slinking back to Helix.

Let's get in to the reasons why I've stuck with Helix, in order of significance:

## Reason #1 - A Great Out-Of-The-Box Experience

Because I work at a small company, I have to do most of the deployments for the
apps that I write. We don't have CI/CD pipelines, so most of that work is done
with good old `ssh`. To make things as smooth as possible, I want my local text
editor and my remote editor to match closely enough that my hands don't reach
for chords that don't exist, but (visually) distinct enough that I know when
I'm editing a remote file.

I found that the best solution was to pick an editor that worked well with
minimal configuration, and just install that everywhere. (More on alternatives
[later](#tramp-and-vs-code-remote-development)) This means a great out-of-the-box
experience is **essential** for me.

With that in mind, allow me to list all the things Helix gives you with zero
config, that you don't get with Neovim (at time of writing).

1. A decent theme
2. [vim-surround](https://docs.helix-editor.com/keymap.html#match-mode)
3. [vim-unimpaired](https://docs.helix-editor.com/keymap.html#unimpaired)
3. A file finder with fuzzy match
4. A Global search utility
5. A debugger (albeit an experimental one)[^1]
6. LSP Actions (rename)[^1]

I will post my entire Helix config here to show you what I mean:

```toml
# ~/.config/helix/config.toml

theme = "catppuccin_mocha"

[editor]
end-of-line-diagnostics = "hint"
bufferline = "multiple"
line-number = "relative"
rulers = [81]
shell = ["nu", "--stdin", "-c"]

[keys.normal]
#D = ["select_mode", "goto_line_end", "delete_selection"]
H = ["goto_previous_buffer"]
L = ["goto_next_buffer"]

# Macro to change single line function params to multi-line
m = { o = "@mim<S-S>,<ret>_<A-;>i<ret><esc>t)a<ret><esc>" }
```

```toml
# ~/.config/helix/languages.toml

[language-server.emmet-ls]
command="emmet-ls"
args = ["--stdio"]

[language-server.tailwindcss-ls]
command="tailwindcss-language-server"
args = ["--stdio"]


[[language]]
name = "php"
language-servers = ["intelephense", "emmet-ls", "tailwindcss-ls"]
roots = ["flake.nix", "artisan.php", "wp-config.php", "composer.json"]
block-comment-tokens = { start = "/*", end = "*/" }

[language.debugger]
name = "vscode-php-debug"
transport = "stdio"
command = "node"
args = ["/nix/store/r6zd2ddf88i2sva85wrsx19047c5pwq8-vscode-extension-xdebug-php-debug-1.36.1/share/vscode/extensions/xdebug.php-debug/out/phpDebug.js"]

[[language.debugger.templates]]
name = "Listen for Xdebug"
request = "launch"
ignored = ".direnv"
args = {}

[[language]]
name = "html"
language-servers = ["vscode-html-language-server", "emmet-ls", "tailwindcss-ls"]
```

I won't pretend that I haven't made *some* customizations to my editor, but it's
a damn-sight smaller than any other IDE config I've ever had.

## Reason #2 - No Plugins

This one may seem like it belongs in the cons column rather than the pros, but
hear me out-

If you are a bit of a polyglot like me, the number of plugins you have to
install in the likes of VS Code or Neovim quickly becomes staggering. this issue
compounds if you want to have a good setup on more than one computer.

By handling everything with grammar files (shipped with the editor) and
baked-in knowledge of LSPs, (though the LSPs themselves must be installed separately),
Helix gives you most of what you get from language support plugins in other editors
with none of the hassle (most of the time).

If you have a supported LSP in your path, it will automatically work with Helix,
no special plugins required.

## Reason #3 - Multiple Cursors

Feel free to cry skill issue, call me a hack, or an idiot (I certainly did), but
I could never quite get the hang of
[visual block mode](https://learnvim.irian.to/basics/visual_mode/) in vim.
It always felt awkward and clunky- not at all intuitive.

While I certainly *can* program macros, it always feels like more effort
than just doing things by hand. I think that's because macros force you to
think ahead, and make you get it right the first time. If I could do things
right the first time, I would've been a surgeon.

On the other hand, using multiple cursors allows you to see what you're doing
*while you're doing it*. You retain the interactive element that macros take
away from you. You can see what your commands are doing while you're doing them,
and more importantly, if you make a mistake part way through, you can undo just
that one part you messed up, instead of having to start over.

Multiple cursors also makes it easier to spot mistakes when doing a find and replace.

For example, you can select the inside of your current function using `mif`
(select, inside, function), then press `s` to start selecting text (e.g. for the
variable name you want replace). I'm sure vim has a similar feature, but
unlinke vim, while you're typing, you can see your results (and more imporantly
mistakes), in real time.[^3]

## Reason #4 - I prefer `{selection} -> {action}` to `{action} -> {selection}` 

Instead of vim style commands where you select an action first and then a motion,
ie `dd` (delete, this line), it uses [kakoune](https://kakoune.org/)
style commands that start with a motion, and then the action- to use the `dd`
example, in Helix, you use `xd` (select line, delete).

This may ruffle some feathers, but in all honesty, I think speed-wise the
best case scenario is that kakune-style selections are on-par with vim commands,
and if we're really being fair- **they're probably slower**.
But speed (obviously) is not why I prefer them.

I think that they are more intuitive. i.e. It makes more sense to me to say
"lets select this next paragraph, and then delete it." rather than "let's delete
the next paragraph". YMMV, but at the end of the day it's not hard to learn
either (or both!)

However, the one advantage you *do* get with putting the selection first, is that
you can preview whats going to happen *before* you do it, which ties in to the
previous section about multiple cursors.


## Reason #5 - LSP-Aware motions

There are some very cool motions available in Helix if you have LSPs installed.
Typing `]g` will take you to the next git change in the file, which is great if
you've just opened a file looking for a bug you've recently introduced. similary,
`[c` will take you to the previous comment, and `]f` will take you to the start
of the next function.

## Things I Miss

I think I've waxed lyrical enough about Helix so far, so let's talk about what
I've given up with my choice.

### `D`

Why oh why can't I have the `D`? It hasn't been rebound to anything, the key is
just sitting there doing nothing! You'll notice I added a custom bind for it
initially, but I kept finding myself trying to use it on servers, so eventually
I gave up and turned it off. I'm currently stuck using the much less convenient
`a<ctrl+k><esc>` or `vgld`.

### `.`

This is another one that doesn't make sense to me although it probably has a
better explanation for why it doesn't work as expected. Being able to repeat the
last set of actions you took as a pseudo mini-macro is quite valuable.

### Integrated terminals

I miss being able to press a single key to pop open a terminal that I can then
pop back down when I'm done. Opening a new tab or pressing `ctrl+z` to background
the editor works just as well, but it doesn't feel as nice.

### Help

Both Neovim and emacs have features where you can input a command or keystroke,
and it will take you to the built-in help documentation for that input. This is
a very useful feature when learning the editor or trying to re-bind keys.

## Things I *don't* Miss

### Plugins

Don't get me wrong, there are some truly awesome plugins you can get for emacs
and neovim. [undotree](https://github.com/mbbill/undotree), [magit](https://magit.vc/),
[TRAMP](https://www.emacswiki.org/emacs/TrampMode), and so many
others. But for all the support I got from these plugins, I also got
mountains of disappointment when I:

a) Tried to use them on a remote machine, only to realize they weren't there. Or<br>
b) My editor started slowing down as a result.

No plugins also means I spend less time screwing around- either messing with my
local config or trying desperately to get my remote configs to match.

Yes, I am aware of tools like [GNU Stow](https://www.gnu.org/software/stow/) and
[home-manager](https://github.com/nix-community/home-manager), but in addition to
the setup time and space these take up on your servers, they don't prevent you
from taking up space with plugins.

With Helix I can simply run `nix run nixpkgs#helix` or `nix profile install nixpkgs#helix`
and I'm good to go.

## Should I switch to Helix?

No, probably not. I would guess (using no real information whatsoever) that most
people are looking for the *ultimate* text editor. That is, the one that makes
them the  most effective, most efficient- the fastest. And I don't think Helix
does that.

What it does do, and very well, is make it easy to work with multiple cursors,
LSPs, and easilyy search through files either by name or contents,
all with very little developer effort. It's a quite good developer
environment wrapped up in a single binary + some grammar files. 

By picking Helix, you sacrifice customizability for a better stock experience.
You absolutely do miss out, and if having the best local IDE
is your game, then neovim or JetBrains are better options.

If you want to play with AI helpers like [supermaven](https://supermaven.com/)
and you choose Helix, you're going to either be bending over backwards or simply
waiting with baited breath for plugin support to drop.

If however, you are tired of managing dozens of plugins, you miss having a decent
remote IDE, or you're frustated with VSCode Remote Development/TRAMP, give Helix
a try.

---

## P.S. Why Not X?

### TRAMP and VS Code Remote Development

I have tried many solutions for remote code development throughout the years.
I would say that of the remote code solutions I've used, Emac's
[TRAMP Mode](https://www.emacswiki.org/emacs/TrampMode) arguably works the best.
Its only problem is that it's not excellent enough on its own to justify using
emacs.

TRAMP is basically a client-side module that lets you edit remote files like
they're local. It's fast enough, and pretty smooth.

[VS Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)
is similarly snazzy, but is let down because it requires
a server-side component installed. This isn't *too* inconvenient, until you
realize that it *also* has to install every plugin you want to use on the server,
and if you're working with a small instance that only has 64GB of storage, you'll
very quickly start running out of space for plugins. This will also require you
to sync the versions of your programming languages, LSPs, linters, and other tools
to work as expected :'(

[^2]: I didn't use Atom for very long, because at the time it had horrendous
performance issues that made it basically unusable on my machine.

[^1]: Okay, I'm cheating here a little bit. You do need to have an LSP installed
and in your path for this to work, but you *don't* need to install a custom
plugin.

[^3]: Yes, I'm aware that [multi-cursor](https://github.com/smoka7/multicursors.nvim)
plugins exist, but they've always felt like second-class citizens to me, and
they're not usually as smooth as editors that support it natively.
