'use strict';
import * as vscode from 'vscode';

const IDENTIFIER = "emacsMarkMode";

//TODO commands:
//markMode
//exitMarkMode
//cursorHome
//cursorEnd
//cursorLeft
//cursorRight
//cursorUp
//cursorDown
//cursorWordLeft
//cursorWordRight
//cursorNextParagraph
//cursorPrevParagraph
//cursorBeginOfFile
//cursorEndOfFile
//copy
//cut
//paste
//killLineAfterCursor

function runCommands(...commands: (string | number)[]): Promise<{}> {
    let p = Promise.resolve({});
    commands.forEach((command) => {
        p = p.then(() => {
            if (typeof command === "number") {
                let delay = command;
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, delay)
                });
            } else {
                // console.log("run command " + command)
                return vscode.commands.executeCommand(command)
            }
        })
    })
    return p
}

function cursorHome() {
    let editor = vscode.window.activeTextEditor;
    let active = editor.selection.active;
    let lineText = editor.document.lineAt(editor.selection.active.line);
    if (lineText.firstNonWhitespaceCharacterIndex === editor.selection.active.character) {
        vscode.commands.executeCommand("emacs.cursorHome");
    } else {
        vscode.commands.executeCommand("emacs.cursorHome");
        vscode.commands.executeCommand("emacs.cursorHome");
    }
}

function killToEndOfLine() {
    let editor = vscode.window.activeTextEditor;
    let lineText = editor.document.lineAt(editor.selection.active.line);
    let noCharAfterCursor = false;
    if (lineText.text.length - editor.selection.active.character === 0) {
        noCharAfterCursor = true;
    }
    // console.log(lineText.text, lineText.text.length, editor.selection.active.character, noCharAfterCursor);
    if (noCharAfterCursor) {
        vscode.commands.executeCommand("deleteRight");
    } else {
        let { start, end } = lineText.range;
        editor.selection = new vscode.Selection(start, end);
        // console.log(editor.selection.start.character, editor.selection.end.character);
        // console.log(editor.document.getText(new vscode.Range(start, end)));
        runCommands("editor.action.clipboardCutAction", 30, "emacs.exitMarkMode");
    }
}

export function activate(context: vscode.ExtensionContext) {
    let commands = [
        vscode.commands.registerCommand(`${IDENTIFIER}.cursorHome`, () => { cursorHome() }),
        vscode.commands.registerCommand(`${IDENTIFIER}.killToEndOfLine`, () => { killToEndOfLine() })
    ]
    context.subscriptions.push(...commands);
}

export function deactivate() { }