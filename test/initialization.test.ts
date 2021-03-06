import assert = require('assert');
import vscode = require('vscode');

import * as Extension from '../src/extension';
import { MainController } from '../src/controllers/main.controller';

function ensureExtensionIsActive(): Promise<any> {
    return new Promise((resolve, reject) => {
        waitForExtensionToBeActive(resolve);
    });
}

function waitForExtensionToBeActive(resolve): void {
    if (typeof(vscode.extensions.getExtension('kenhowardpdx.vscode-gist')) === 'undefined' ||
        !vscode.extensions.getExtension('kenhowardpdx.vscode-gist').isActive) {
        setTimeout(waitForExtensionToBeActive.bind(this, resolve), 50);
    } else {
        resolve();
    }
}

suite('Initialization Tests', () => {
    test('Commands initialized properly', function(done): void { // Note: this can't be an arrow function (=>), otherwise this.timeout() breaks
        this.timeout(10000); // Service installation usually takes a bit longer than the default 2000ms on a fresh install

        // Force the extension to activate by running one of our commands
        vscode.commands.executeCommand('extension.initialize');

        // Wait for the extension to activate
        ensureExtensionIsActive().then(() => {
            // Verify that the connection manager was initialized properly
            let controller: MainController = Extension.getController();
            assert.equal(true, controller instanceof MainController);
            done();
        }).catch((e) => {
          done(e);
        });
    });
});
