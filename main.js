/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const openSshTunnel = require('open-ssh-tunnel');
const readFileSync = require('fs').readFileSync;
const pg = require('pg');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
let menu;
let template;
let mainWindow = null;
let connectUrl = 'postgres://user:password@localhost/db';
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
  pg.end();
  if (process.platform !== 'darwin') app.quit();
});

// https://github.com/atom/electron/issues/4490
function fixTempIssue(data) {
  for (const field of data) {
    for (const fieldName in field) {
      if (field[fieldName] instanceof Date) {
        field[fieldName] = { IssueType: 'Date', value: field[fieldName].toString() };
      }
      if (field[fieldName] === null) {
        delete field[fieldName];
      }
    }
  }
  return data;
}


/* eslint no-param-reassign: [2, { "props": false }] */
function getTables(client, event) {
  const query = `
    SELECT table_name
      FROM information_schema.tables
    WHERE table_schema='public'
      AND table_type='BASE TABLE';
  `;
  client.query(query, (err, result) => {
    if (err) {
      reconnectDB(event, 'get-tables');
    } else {
      event.returnValue = result.rows;
    }
  });
}

function getTableContent(client, event, argObj) {
  let page = argObj.page;
  if (page === undefined) {
    page = 1;
  }

  const offset = (page - 1) * 100;
  let totalCount = 0;

  let order = argObj.order;
  if (order === undefined) {
    order = [];
  }

  let orderQuery = '';
  if (order.length) {
    orderQuery = 'ORDER BY ';
    for (let item of order) { // eslint-disable-line
      orderQuery += `${item.fieldName} ${item.type}, `;
    }
  }
  orderQuery = orderQuery.slice(0, -2);
  client.query(`SELECT COUNT(*) FROM ${argObj.tableName};`, (err, result) => {
    if (err) {
      reconnectDB(event, 'get-table-content', argObj);
    } else {
      totalCount = parseInt(result.rows[0].count, 10);

      const query = `
        SELECT * FROM ${argObj.tableName} ${orderQuery} LIMIT 100 OFFSET ${offset};
      `;
      client.query(query, (error, res) => {
        if (error) {
          reconnectDB(event, 'get-table-content', argObj);
        } else {
          if (!offset) {
            const titleQuery = `
                SELECT column_name FROM information_schema.columns
                WHERE table_name='${argObj.tableName}';`;
            client.query(titleQuery, (titleError, resTitle) => {
              if (titleError) {
                reconnectDB(event, 'get-table-content', argObj);
              } else {
                const titleTable = resTitle.rows.map(key => key.column_name);
                event.sender.send(
                  'get-table-content', fixTempIssue(res.rows), totalCount, order, page, titleTable
                );
              }
            });
          } else {
            event.sender.send(
              'get-table-content', fixTempIssue(res.rows), totalCount, order, page
            );
          }
        }
      });
    }
  });
}

function reconnectDB(event, command, argObj) {
  ipcMain.removeAllListeners('get-tables');
  ipcMain.removeAllListeners('get-table-content');
  pg.end();
  connectDB(event, command, argObj);
}

// In future maybe lot of sense to move pg into frontend, using remote
function connectDB(event, command, argObj) {
  pg.connect(connectUrl, (err, client, done) => {
    if (err) {
      if (event && command === 'connect-db') {
        event.returnValue = { success: false, error: err };
      }
    } else {
      ipcMain.on('get-tables', (ev) => {
        done();
        getTables(client, ev);
      });
      ipcMain.on('get-table-content', (ev, params) => {
        done();
        getTableContent(client, ev, params);
      });
      if (event) {
        switch (command) {
          case 'get-tables':
            getTables(client, event);
            break;
          case 'get-table-content':
            getTableContent(client, event, argObj);
            break;
          case 'connect-db':
            event.returnValue = { success: true };
            break;
          default:
            break;
        }
      }
    }
  });
}


ipcMain.on('connect-db', (event, params) => {
  ipcMain.removeAllListeners('get-tables');
  ipcMain.removeAllListeners('get-table-content');
  pg.end();

  if (params.useSSH) {
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
      connectUrl = `postgres://${params.user}:${params.password}@${params.address}:5433/${params.database}`;
      connectDB(event, 'connect-db');
    }).catch(err => {
      console.error(err); // eslint-disable-line
    });
  } else {
    connectUrl = `postgres://${params.user}:${params.password}@${params.address}:${params.port}/${params.database}`;
    connectDB(event, 'connect-db');
  }
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

