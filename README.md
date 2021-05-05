# Git Post Checkout Command

This VS Code Extension will allow you to run a terminal command following a Git Branch change.

## Features

Automatically trigger terminal commands when switching branches. Good if you don't know how to set up a git hook or need a interactive terminal when switching branches.

## Requirements

* git (This extension will only work for git projects)

## Extension Settings

This extension contributes the following settings:

* `git-post-checkout-command.command`: Command to run. Leaving it empty will disable any action from running. Default: null
* `git-post-checkout-command.showTerminal`: Show the terminal when running or leave it in the background. Enable if you need input inside of the newly created terminal. Default: false
* `git-post-checkout-command.terminateTerminal`: Terminate the new terminal after the command has run. Default: true

## Release Notes

Please see the `CHANGELOG.md` file for the list of changes

## FAQ

### Why not just use a git post-checkout hook?

Visual Studio Code doesn't seem to like interactive git hooks. Therefore, this extension was created to run a separate terminal to allow user input when changing a branch.

### Will this run if I change branches outside of VS Code?

Not right away. It should trigger once you go back into VS Code and recognizes a branch was changed.

## Contributors

* [gameguy682](https://github.com/gameguy682)
* [spencerwmiles](https://github.com/spencerwmiles)
