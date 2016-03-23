/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const openSshTunnel = require('open-ssh-tunnel');
const readFileSync = require('fs').readFileSync;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
let menu;
let template;
let mainWindow = null;
let sshServer = null;

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}


app.on('window-all-closed', () => {
  ipcMain.removeAllListeners('get-tables');
  ipcMain.removeAllListeners('get-table-content');
  if (sshServer) {
    sshServer.close();
  }
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.on('ssh-connect', (event, params) => {
  if (sshServer) {
    sshServer.close();
  }
  const opts = {
    host: params.sshServer,
    port: params.sshPort,
    username: params.sshUser,
    dstPort: params.port,
    srcPort: 5433,
    srcAddr: '127.0.0.1',
    dstAddr: params.address,
    readyTimeout: 5000,
    forwardTimeout: 2000,
    localPort: 5433,
    localAddr: '127.0.0.1'
  };

  if (params.privateKey) {
    opts.privateKey = readFileSync(params.privateKey);
  } else {
    opts.password = params.password;
  }
  openSshTunnel(opts).then(server => {
    sshServer = server;
    event.sender.send('ssh-connect', true);
  }).catch(err => {
    console.error(err); // eslint-disable-line
  });
});


app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = new BrowserWindow({ width: 1600, height: 900, minWidth: 800, minHeight: 400 });

    if (process.env.HOT) {
      mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    } else {
      mainWindow.loadURL(`file://${__dirname}/app/app.html`);
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools();
    }
  }
});

app.on('ready', () => {
  if (process.platform === 'darwin') {
    template = [{
      label: 'PostGlass',
      submenu: [{
        label: 'About PostGlass',
        selector: 'orderFrontStandardAboutPanel:'
      }, {
        type: 'separator'
      }, {
        label: 'Hide PostGlass',
        accelerator: 'Command+H',
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          mainWindow.restart();
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass');
        }
      }, {
        label: 'Hire me!',
        click() {
          shell.openExternal('https://www.upwork.com/freelancers/~019739a15313b8bd52');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass/issues');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.restart();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'Learn More',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass');
        }
      }, {
        label: 'Hire me!',
        click() {
          shell.openExternal('https://www.upwork.com/freelancers/~019739a15313b8bd52');
        }
      }, {
        label: 'Search Issues',
        click() {
          shell.openExternal('https://github.com/mic-fadeev/postglass/issues');
        }
      }]
    }];

    mainWindow = new BrowserWindow({ width: 1600, height: 900, minWidth: 800, minHeight: 400 });

    if (process.env.HOT) {
      mainWindow.loadURL(`file://${__dirname}/app/hot-dev-app.html`);
    } else {
      mainWindow.loadURL(`file://${__dirname}/app/app.html`);
    }
    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools();
    }
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
