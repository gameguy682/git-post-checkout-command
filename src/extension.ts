// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension, API } from './git';
import { isNullOrUndefined, isRegExp } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    let gitExt: GitExtension;
    let gitApi: API;
    let oldBranch: String|undefined;

    let TERM_COUNT = 1;

    const config = vscode.workspace.getConfiguration("git-post-checkout-command", undefined);

    let command = config.get('command') as string;
    let showTerminal = config.get('showTerminal') as boolean;
    let terminateTerminal = config.get('terminateTerminal') as boolean;

    //TODO: Trigger Manually
    const disposable = vscode.commands.registerCommand('git-post-checkout-command.triggerCommand', () => {
        //This will be moved into a single codebase, for now its for testing
        try {
            const terminal = vscode.window.createTerminal({
                name: `#${TERM_COUNT++} Command Test`,
                hideFromUser: !showTerminal
            });

            if(showTerminal) {
                terminal.show();
            }
            
            terminal.sendText(`${command}`);

            if(terminateTerminal) {
                //Remove the terminal after 5 seconds
                setTimeout(function() {
                    terminal.dispose();
                }, 5000); 
            }
        } catch(e) {
            vscode.window.showWarningMessage(
                'There was an issue with sending the command. Please double check the command.'
            );
            return;
        }
	});

	context.subscriptions.push(disposable);

    try {
        const git = vscode.extensions.getExtension<GitExtension>('vscode.git');
        if (!git) {
            throw new Error('vscode.git extension not found');
        }
        gitExt = await git.activate();
    } catch (e) {
        vscode.window.showWarningMessage(
            'There was an issue activating vscode.git extension.'
        );
        return;
    }

    try {
        gitApi = gitExt.getAPI(1);

        gitApi.onDidOpenRepository(gitRepo => {
            const gitState = gitRepo.state;
            
            gitState.onDidChange(() => {
                let newBranch = gitRepo.state.HEAD?.name;
                
                if(!isNullOrUndefined(oldBranch)) {
                    //This should only trigger on a branch change
                    if(oldBranch !== newBranch) {
                        try {
                            const terminal = vscode.window.createTerminal({
                                name: `#${TERM_COUNT++} Command Test`,
                                hideFromUser: !showTerminal
                            });

                            if(showTerminal) {
                                terminal.show();
                            }
                            
                            terminal.sendText(`${command}`);

                            if(terminateTerminal) {
                                //Remove the terminal after 5 seconds
                                setTimeout(function() {
                                    terminal.dispose();
                                }, 5000); 
                            }
                        } catch(e) {
                            vscode.window.showWarningMessage(
                                'There was an issue with sending the command. Please double check the command.'
                            );
                            return;
                        }

                        //Update the old branch with the new branch
                        oldBranch = newBranch;
                    }
                } else {
                    //If the oldBranch is null or undefined, set it to the current branch 
                    oldBranch = newBranch;
                }
            });
        });
    } catch (e) {
        vscode.window.showWarningMessage(
            'There was an issue with connecting with Git.'
        );
        return;
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
