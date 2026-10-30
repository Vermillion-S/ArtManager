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
    
    // Use Dev environment instead of build
    isDev()
        ? mainWindow.loadURL('http://localhost:5123')
        : mainWindow.loadFile(getUIPath())

    db = new AppDatabase(); // Sqlite3 Schedule db

    createTray(mainWindow);
    
    handleCloseEvents(mainWindow);
    
});

// Alternate closing behavior
function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false; // trigger for quit event

    // On X - Minimize instead of close 
    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault();
        mainWindow.hide();

        // minimize
        if (app.dock) {
            app.dock.hide();
        }
    });

    // Close database connection on quit
    app.on("will-quit", () => {
        if (!db) return;

        db.close();
    });

    // Trigger on-quit event
    app.on("before-quit", ()=> {
        willClose = true;
    });

    mainWindow.on('show', ()=> {
        willClose = false;
    })
}