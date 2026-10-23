import path from 'path';
import { BrowserWindow, Tray, app, Menu } from 'electron';
import { getAssetPath } from './pathResolver.js';

export function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(
        path.join(
            getAssetPath(),
            'hero.png'
        )
    );

    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: "Show",
                click: ()=> {
                    mainWindow.show();
                    if (app.dock) {
                        app.dock.show();
                    }
                }
            },
            {
                label: "Quit",
                click: ()=> {
                    app.quit();
                },
            }
        ])
    )
}
