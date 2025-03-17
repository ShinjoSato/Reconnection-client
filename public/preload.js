const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('myapi', {
    // Application System
    appMinimize: async (data) => await ipcRenderer.invoke('appMinimize', data),
    appFullScreen: async (data) => await ipcRenderer.invoke('appFullScreen', data),
    appQuit: async (data) => await ipcRenderer.invoke('appQuit', data),

    // Node Modules
    getPicData: async (data) => await ipcRenderer.invoke('getPicData', data),

    // NeDB for Server
    getServer: async (data) => await ipcRenderer.invoke('getServer', data),
    addServer: async (data) => await ipcRenderer.invoke('addServer', data),
    deleteServer: async (data) => await ipcRenderer.invoke('deleteServer', data),
    
    // NeDB for Textarea in Chatroom
    getTextarea: async (data) => await ipcRenderer.invoke('getTextarea', data),
    addTextarea: async (data) => await ipcRenderer.invoke('addTextarea', data),
    updateTextarea: async (where, data) => await ipcRenderer.invoke('updateTextarea', where, data),
    deleteTextarea: async (data) => await ipcRenderer.invoke('deleteTextarea', data),

    // Manga-chat Window
    openMangaChatWindow: async (data) => await ipcRenderer.invoke('openMangaChatWindow', data),
})