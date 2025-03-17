// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");

require('@electron/remote/main').initialize()

let mainWindow = null;
let subWindows = [];

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
    // 製品実装時にコメント解除
    // transparent: true,
    // frame: false,
  })

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  //Hide a menu bar.
  // mainWindow.removeMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Web Notificationに表示されるドメイン名の設定
app.setAppUserModelId('Reconnection.app')

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Application System
ipcMain.handle('appMinimize', (event, data) => {
  mainWindow.minimize()
})

var isFullScreen = false
ipcMain.handle('appFullScreen', (event, data) => {
  isFullScreen = isFullScreen? false : true
  mainWindow.setFullScreen(isFullScreen)
})

ipcMain.handle('appQuit', (event, data) => {
  app.quit()
})

// Node Modules
const fs = require('fs')

ipcMain.handle('getPicData', (event, data) => {
  const pic = fs.readFileSync(data)
  return 'data:image;base64,' + pic.toString('base64')
})

// IPC Connection
const Datastore = require('nedb');
const DB_SERVER = new Datastore({filename: path.join(app.getPath('userData'),'server.db'), autoload: true})
const DB_TEXTAREA = new Datastore({filename: path.join(app.getPath('userData'),'textarea.db'), autoload: true})

// NeDB for Server
ipcMain.handle('getServer', (event, data) => {
  return new Promise((resolve, reject) => {
    DB_SERVER.find(data, (error, docs) => {
      if(error) reject(error)
      resolve(docs)
    })
  })
})

ipcMain.handle('addServer', (event, data) => {
  return new Promise((resolve, reject) => {
    DB_SERVER.insert(data, (error, docs) => {
      if(error) reject(error)
      resolve(true)
    })
  })
})

ipcMain.handle('deleteServer', (event, data) => {
  return new Promise((resolve, reject) => {
    DB_SERVER.remove(data, {multi: true}, (error, docs) => {
      if(error) reject(error)
      resolve(true)
    })
  })
})

// NeDB for Textarea in Chatroom
ipcMain.handle('getTextarea', (event, data) => {
  return new Promise((resolve, reject) => {
    DB_TEXTAREA.find(data, (error, docs) => {
      if(error) reject(error)
      resolve(docs)
    })
  })
})

ipcMain.handle('addTextarea', (event, data) => {
  return new Promise((resolve, reject) => {
    DB_TEXTAREA.insert(data, (error, docs) => {
      if(error) reject(error)
      resolve(true)
    })
  })
})

ipcMain.handle('updateTextarea', (event, where, data) => {
  return new Promise((resolve, reject) => {
    DB_TEXTAREA.update(where, {$set: data}, {}, (error, docs) => {
      if(error) reject(error)
      resolve(true)
    })
  })
})

ipcMain.handle('deleteTextarea', (event, data) => {
  console.log('delete textarea')
  return new Promise((resolve, reject) => {
    DB_TEXTAREA.remove(data, {multi: true}, (error, docs) => {
      if(error) reject(error)
      resolve(true)
    })
  })
})

// Manga-chat window
ipcMain.handle("openMangaChatWindow", (event, arg) =>{   
  let data = {};
  console.log('arg');
  console.log(arg);
  for(const param of arg.query.split("&")){
    let set = param.split("=");
    data[set[0]] = set[1];
  }

  console.log(data);

	const mangaChatWindow = new BrowserWindow({ 
		// parent: mainWindow,
    width: Number(data.width),
    height: Number(data.height),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
      nativeWindowOpen: true,
    },
    /* 製品版ではコメント解除 */
    transparent: true,
    frame: false,
	}); 

  mangaChatWindow.loadURL(
    isDev
      ? `http://localhost:3000#/manga-chat?${arg.query}`
      : `file://${path.join(__dirname, "../build/index.html#manga-chat")}?${arg.query}`
  );

  subWindows.push(mangaChatWindow);
});
