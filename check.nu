#!/usr/bin/env -S nu -n

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
