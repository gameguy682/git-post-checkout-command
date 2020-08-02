// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension, API } from './git';
import { isNullOrUndefined } from 'util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    let gitExt: GitExtension;
    let gitApi: API;
    let oldBranch: String|undefined;

    let command = '../test.sh';

    let TERM_COUNT = 1;

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
                                name: `#${TERM_COUNT++} Command Test`
                                //hideFromUser: false,
                            });
                            
                            terminal.sendText(`${command}`);
                            terminal.dispose();
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
