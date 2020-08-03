import * as vscode from 'vscode';
import { GitExtension, API } from "./api/git";
import { isNullOrUndefined } from "util";

export default class GitApi {
    private readonly apiVerison = 1;
    public gitApi: API;
    public currentBranch: String|undefined;

    constructor(gitExt: GitExtension) {
        this.gitApi = gitExt.getAPI(this.apiVerison);
    }

    public enableBranchListener() {
        this.gitApi.onDidOpenRepository(gitRepo => {
            const gitState = gitRepo.state;
            
            gitState.onDidChange(() => {
                let newBranch = gitRepo.state.HEAD?.name;
                
                if(!isNullOrUndefined(this.currentBranch)) {
                    //This should only trigger on a branch change
                    if(this.currentBranch !== newBranch) {
                        vscode.commands.executeCommand('git-post-checkout-command.triggerCommand');

                        //Update the old branch with the new branch
                        this.changeBranch(newBranch);
                    }
                } else {
                    //If the oldBranch is null or undefined, set it to the current branch 
                    this.changeBranch(newBranch);
                }
            });
        });
    }

    public changeBranch(newBranch: string|undefined) {
        if(typeof newBranch !== 'undefined') {
            this.currentBranch = newBranch;
        }
    }
}