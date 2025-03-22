{
  # description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/24.11";
    nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixos-unstable";


    flake-parts.url = "github:hercules-ci/flake-parts";
    # process-compose-flake.url = "github:Platonic-Systems/process-compose-flake";
    # sbrow.url = "github:sbrow/nix";
    # 
    treefmt-nix.url = "github:numtide/treefmt-nix";
    treefmt-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs@{ flake-parts, nixpkgs, nixpkgs-unstable, treefmt-nix, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" ];

      imports = [
        inputs.treefmt-nix.flakeModule
      ];

      perSystem = { config, inputs', pkgs, system, ... }: {
        _module.args.pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;

          overlays = [
            (_final: _prev: { unstable = inputs'.nixpkgs-unstable.legacyPackages; })
          ];
        };

        treefmt = {
          # Used to find the project root
          projectRootFile = "flake.nix";
          settings.global.includes = [
            "**/*.md"
          ];

          settings.global.excludes = [
            ".direnv/**"
            ".jj/**"
            ".env"
            ".envrc"
            ".env.local"
            "themes/**"
            "**/*.jpg"
          ];


          # Format nix files
          programs.nixpkgs-fmt.enable = true;
          programs.typos.enable = true;
          programs.deadnix.enable = true;
        };


        devShells.default = pkgs.mkShell
          {
            buildInputs = with pkgs; [
              git
              unstable.hugo

              config.treefmt.build.wrapper
              # Your packages here
            ];
          };

        #  process-compose.default.settings = { };
      };
    };
}
