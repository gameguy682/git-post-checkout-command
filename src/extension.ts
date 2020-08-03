// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension } from './api/git';
import Settings from './settings';
import CommandTerminal from './terminal';
import GitApi from './gitapi';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    let gitExt: GitExtension;
    
    const disposable = vscode.commands.registerCommand('git-post-checkout-command.triggerCommand', () => {
        try {
            const settings = new Settings();
            const terminal = new CommandTerminal(settings);
            terminal.sendCommand();
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

        const gitApi = new GitApi(gitExt);
        gitApi.enableBranchListener();
    } catch (e) {
        vscode.window.showWarningMessage(
            'There was an issue activating vscode.git extension.'
        );
        return;
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
