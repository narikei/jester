const electron = require('electron');
const app = electron.app
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('save', () => {
    mainWindow.webContents.send('save', app.getPath('temp'));
  });
}

function setMenu() {
  const template = [
    {
      label: 'Jester',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          accelerator: 'Command+S',
          click: () => {
            mainWindow.webContents.send('save', app.getPath('temp'));
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
          {
            label: "Undo",
            accelerator: "Command+Z",
            selector: "undo:"
          },
          {
            label: "Redo",
            accelerator: "Shift+Command+Z",
            selector: "redo:"
          },
          {
            type: "separator"
          },
          {
            label: "Cut",
            accelerator: "Command+X",
            selector: "cut:"
          },
          {
            label: "Copy",
            accelerator: "Command+C",
            selector: "copy:"
          },
          {
            label: "Paste",
            accelerator: "Command+V",
            selector: "paste:"
          },
          {
            label: "Select All",
            accelerator: "Command+A",
            selector: "selectAll:"
          },
          {
            type: "separator"
          },
          {
            label: 'Reformat',
            accelerator: 'Command+L',
            click: () => {
              mainWindow.webContents.send('reformat');
            },
          },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            BrowserWindow.getFocusedWindow().reload();
          },
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: () => {
            BrowserWindow.getFocusedWindow().toggleDevTools();
          },
        },
      ],
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  createWindow();
  setMenu();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
