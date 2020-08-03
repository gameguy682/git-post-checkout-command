import * as vscode from 'vscode';

export default class Settings {
    public readonly command: string;
    public readonly showTerminal: boolean;
    public readonly terminateTerminal: boolean;
    public readonly noCommand: boolean;
    public get terminalNumber(): number {
        return vscode.window.terminals.length;
    }

    constructor() {
        const config = vscode.workspace.getConfiguration("git-post-checkout-command", undefined);

        this.command = config.get('command') as string;
        if(typeof this.command !== 'string') {
            this.command = '';
            this.noCommand = true;
        } else {
            this.noCommand = false;
        }
        
        this.showTerminal = config.get('showTerminal') as boolean;

        if(typeof this.showTerminal !== 'boolean') {
            this.showTerminal = false;
        }

        this.terminateTerminal = config.get('terminateTerminal') as boolean;
        if(typeof this.terminateTerminal !== 'boolean') {
            this.terminateTerminal = true;
        }
    }
    
}