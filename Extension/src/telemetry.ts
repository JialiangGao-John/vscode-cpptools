/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All Rights Reserved.
 * See 'LICENSE' in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import TelemetryReporter from 'vscode-extension-telemetry';
import * as util from './common';

interface IPackageInfo {
    name: string;
    version: string;
    aiKey: string;
}

let telemetryReporter: TelemetryReporter;

export function activate(): void {
    try {
        telemetryReporter = createReporter();
    } catch (e) {
        // can't really do much about this
    }
}

export function deactivate(): void {
    if (telemetryReporter) {
        telemetryReporter.dispose();
    }
}

export function logDebuggerEvent(eventName: string, properties?: { [key: string]: string }): void {
    if (telemetryReporter) {
        const eventNamePrefix: string = "cppdbg/VS/Diagnostics/Debugger/";
        telemetryReporter.sendTelemetryEvent(eventNamePrefix + eventName, properties);
    }
}

export function logLanguageServerEvent(eventName: string, properties?: { [key: string]: string }, metrics?: { [key: string]: number }): void {
    if (telemetryReporter) {
        const eventNamePrefix: string = "C_Cpp/LanguageServer/";
        telemetryReporter.sendTelemetryEvent(eventNamePrefix + eventName, properties, metrics);
    }
}

function createReporter(): TelemetryReporter {
    if (util.extensionContext) {
        let packageInfo: IPackageInfo = getPackageInfo();
        if (packageInfo && packageInfo.aiKey) {
            return new TelemetryReporter(packageInfo.name, packageInfo.version, packageInfo.aiKey);
        }
    }
    return null;
}

function getPackageInfo(): IPackageInfo {
    return {
        name: util.packageJson.publisher + "." + util.packageJson.name,
        version: util.packageJson.version,
        aiKey: util.packageJson.contributes.debuggers[0].aiKey
    };
}
