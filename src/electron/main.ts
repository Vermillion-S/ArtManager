import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getAssetPath, getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import AppDatabase from './db/db_util.js';

Menu.setApplicationMenu(null);
let db: AppDatabase;

app.on("ready", ()=>{
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    });
    isDev()
        ? mainWindow.loadURL('http://localhost:5123')
        : mainWindow.loadFile(getUIPath())

    db = new AppDatabase();

    createTray(mainWindow);
    
    handleCloseEvents(mainWindow);
    
});

function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false;

    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault();
        mainWindow.hide();
        if (app.dock) {
            app.dock.hide();
        }
    });

    app.on("will-quit", () => {
        if (!db) return;

        db.close();
    });

    app.on("before-quit", ()=> {
        willClose = true;
    });

    mainWindow.on('show', ()=> {
        willClose = false;
    })
}