import * as vscode from 'vscode';
import Settings from './settings';

export default class CommandTerminal {
    public terminal: vscode.Terminal;
    private settings: Settings;

    constructor(settings: Settings) {
        this.settings = settings;

        this.terminal = vscode.window.createTerminal({
            name: `Post Checkout #${settings.terminalNumber}`,
            hideFromUser: !this.settings.showTerminal
        });
    }

    public sendCommand() {
        if(!this.settings.noCommand) {
            if(this.settings.showTerminal) {
                this.terminal.show();
            }

            this.terminal.sendText(`${this.settings.command}`);

            if(this.settings.terminateTerminal) {
                this.dispose();
            }
        }
    }

    public dispose(timeout: number = 5000) {
        setTimeout(() => {
            this.getTerminal().dispose();
        }, timeout);
    }

    public getTerminal() {
        return this.terminal;
    }
}

/*
            
            
            
*/