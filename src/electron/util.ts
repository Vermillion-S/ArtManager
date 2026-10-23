import { ipcMain, WebContents, WebFrameMain } from 'electron';
import { getUIPath } from './pathResolver.js';
import { pathToFileURL } from 'node:url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcHandle<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: () => EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame);
        handler();
    });
};

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    WebContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    WebContents.send(key, payload);
}


export function validateEventFrame(frame: WebFrameMain | null) {
    if(frame === null) {
        throw new Error('Malicious event');
    }

    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}