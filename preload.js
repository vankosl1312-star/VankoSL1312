const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  getClients: (letter) => ipcRenderer.invoke('get-clients', letter),
  searchClients: (q) => ipcRenderer.invoke('search-clients', q),
  addClient: (data) => ipcRenderer.invoke('add-client', data),
  deleteClient: (id) => ipcRenderer.invoke('delete-client', id),
  updateClient: (data) => ipcRenderer.invoke('update-client', data)
});