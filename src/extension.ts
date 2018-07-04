'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, workspace, commands, ExtensionContext } from 'vscode';
import * as path from 'path';
import * as fse from 'fs-extra';
import CodeForcesScrapper from './codeforces-scrapper';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "algorithm-contest-helper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.algorithm-contest-scrapper', async () => {
        if (workspace.rootPath === undefined) {
            window.showErrorMessage('You have to open a folder first');
            return null;
        }

        const result = await window.showQuickPick(['CodeForces'], {
            placeHolder: 'Choose algorithm contest'
        });

        window.showInputBox({placeHolder: 'Enter contest number'}).then(async value => {
            const scrapper = new CodeForcesScrapper(value);
            const problems = await scrapper.getProblems();

            for (let problem in problems) {
                const problemPath = path.join(workspace.rootPath, problem);
                createHelperFiles(context.extensionPath, problemPath);

                let inOuts = problems[problem];
                for (let i = 0; i < inOuts.length; i++) {
                    fse.outputFile(path.join(problemPath, 'in'+i+'.txt'), inOuts[i][0], err => {
                        if (err) { console.log(err); }
                    });
    
                    fse.outputFile(path.join(problemPath, 'out'+i+'.txt'), inOuts[i][1], err => {
                        if (err) { console.log(err); }
                    });
                }
                
            }
        });    
    });

    context.subscriptions.push(disposable);
}

function createHelperFiles(extensionPath: string, problemDirPath: string) {
    fse.copySync(path.resolve(extensionPath, 'res/.vscode'), path.join(problemDirPath, '.vscode'));
}

// this method is called when your extension is deactivated
export function deactivate() {
}