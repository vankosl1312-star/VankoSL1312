const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'clients.db');

function ensureDbExists() {
  if (!fs.existsSync(DB_PATH)) {
    dialog.showErrorBox('Грешка', 'Липсва clients.db в /data. Уверете се, че файлът е наличен.');
    app.quit();
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'build','icons','book.png')
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
  ensureDbExists();
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

function openDb() {
  return new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err)=>{
    if (err) console.error('DB open error', err);
  });
}

ipcMain.handle('get-clients', async (event, letter) => {
  const db = openDb();
  let sql = "SELECT * FROM clients";
  const params = [];
  if (letter) {
    sql += " WHERE UPPER(SUBSTR(TRIM(name),1,1)) = ?";
    params.push(letter.toUpperCase());
  }
  sql += " ORDER BY name COLLATE NOCASE ASC";
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
});

ipcMain.handle('search-clients', async (event, q) => {
  const db = openDb();
  const s = '%' + q + '%';
  const sql = "SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR city LIKE ? OR email LIKE ? ORDER BY name COLLATE NOCASE ASC";
  return new Promise((resolve, reject) => {
    db.all(sql, [s,s,s,s], (err, rows) => {
      db.close();
      if (err) reject(err.message); else resolve(rows);
    });
  });
});

ipcMain.handle('add-client', async (event, client) => {
  const db = openDb();
  const sql = `INSERT INTO clients (name, phone, address, email, egn, city, postal_code) VALUES (?,?,?,?,?,?,?)`;
  const params = [client.name, client.phone||'', client.address||'', client.email||'', client.egn||'', client.city||'', client.postal_code||''];
  return new Promise((resolve,reject)=> {
    db.run(sql, params, function(err){
      if (err) { db.close(); reject(err.message); return; }
      db.get("SELECT * FROM clients WHERE id = ?", [this.lastID], (e,row)=>{
        db.close();
        if (e) reject(e.message); else resolve(row);
      });
    });
  });
});

ipcMain.handle('delete-client', async (event, id) => {
  const db = openDb();
  return new Promise((resolve,reject)=>{
    db.run("DELETE FROM clients WHERE id = ?", [id], function(err){
      db.close();
      if (err) reject(err.message); else resolve({deleted: this.changes});
    });
  });
});

ipcMain.handle('update-client', async (event, client) => {
  const db = openDb();
  const sql = `UPDATE clients SET name=?, phone=?, address=?, email=?, egn=?, city=?, postal_code=? WHERE id=?`;
  const params = [client.name, client.phone||'', client.address||'', client.email||'', client.egn||'', client.city||'', client.postal_code||'', client.id];
  return new Promise((resolve,reject)=>{
    db.run(sql, params, function(err){
      if (err) { db.close(); reject(err.message); return; }
      db.get("SELECT * FROM clients WHERE id = ?", [client.id], (e,row)=>{
        db.close();
        if (e) reject(e.message); else resolve(row);
      });
    });
  });
});