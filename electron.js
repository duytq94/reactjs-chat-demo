const electron = require('electron');
const { app, BrowserWindow } = electron;
const { ipcMain } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

function createWindow() {
  // Main
  mainWindow = new BrowserWindow({
    width: 960,
    height: 540,
    resizable: false,
    title: "Pharmacity Review"
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });
}