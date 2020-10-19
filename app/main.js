/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import Promise from 'bluebird';
import screenshot from 'screenshot-desktop';
import path from 'path';
import { app, BrowserWindow, Tray, Menu, ipcMain, desktopCapturer, screen } from 'electron';
import io from 'socket.io-client';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Positioner from 'electron-positioner';
import MenuBuilder from './menu';
import config from './config.json';
import electronLocalshortcut from 'electron-localshortcut';
import si from 'systeminformation';
// import { OpenVidu } from 'openvidu-browser';

import authenticate from './libs/authenticate.js';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// let mainWindow = BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

let appIcon;
let realtimeChatIcon;
const iconImage = `${__dirname}/images/fav.png`;
const chatImage = `${__dirname}/images/chat.png`;
let authenticationToken;
let socket;
let socketConnected = false;
let user;
// const openvidu = new OpenVidu();

let chatWindow;

const startUp = async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  appIcon = new Tray(iconImage);
  appIcon.setTitle(config.appName);
  appIcon.setToolTip(config.appName);
  realtimeChatIcon = new Tray(chatImage);
  realtimeChatIcon.on('click', () => {
    if (!chatWindow) return;
    if (!chatWindow.isVisible() || chatWindow.isMinimized()) {
        if (chatWindow.isMinimized()) {
          chatWindow.restore();
        } else {
          chatWindow.show();
        }
        chatWindow.focus();
        if (process.platform === 'darwin') {
          // app.dock.show();
        }
      } else {
        chatWindow.focus();
      }
  });
  realtimeChatIcon.setTitle(config.appName);
  realtimeChatIcon.setToolTip(config.appName);
  // realtimeChatIcon.hide();
  continousScreenshot();
  beginAuthentication();
  // console.log('App Icon Started');
}

const beginAuthentication = () => {
  const username = process.env.USERNAME;
  const domain = process.env.USERDOMAIN || '';
  if (config.allowedDomains.indexOf(domain) > -1) {
    // await createWindow();
    authenticationToken = authenticateWithUsernameAndUrl(username, config.appUrl);
    console.log('authenticationToken', authenticationToken);
    // await createTray();
  } else {
    // console.log(width, height);
    // const loginWindow = new BrowserWindow({ parent: top, modal: true, show: false })
    startAuthenticationWindow();
  }
};

const startAuthenticationWindow = async () => {
  console.log('Starting authentication window ...');
  let loginWindow = await createWindow(`loginForm/index.html`, {
    frame: false,
    width: 296,
    height: 334,
    transparent: true,
    devTools: false,
    icon: `${__dirname}/images/fav.png`,
    // modal: true
  });
  loginWindow.once('ready-to-show', () => {
    console.log('loginWindow is ready to show');
    const trayBounds = appIcon.getBounds();
    const positioner = new Positioner(loginWindow);
    const position = positioner.calculate('bottomRight', trayBounds);
    loginWindow.setPosition(position.x - 10, position.y - 10, true);
    loginWindow.show();
    loginWindow.focus();
    loginWindow.webContents.send('show');
    loginWindow.webContents.openDevTools();
    // ipcRenderer.on('show', () => {
    // positioner.move('bottomRight', trayBounds);

    // win.setPosition(x, y[, animate])
    // console.log('Ready to show');
  });
  loginWindow.once('close', () => {
    if (!authenticationToken) {
      startAuthenticationWindow();
    } else {
      // connectSocket();
    }
  });
}

const startChatWindow = async () => {
  console.log('Opening Chat Window');
  chatWindow = await createWindow('chat/index.html', {
    // frame: true,
    width: 1000,
    height: 600,
    // transparent: false,
    devTools: false,
    icon: `${__dirname}/images/chat.png`,
    // modal: false
  });
  chatWindow.setMinimumSize(1030, 600);
  chatWindow.on('close', (e) => {
    e.preventDefault();
    chatWindow.hide();
  });
  chatWindow.once('ready-to-show', () => {
    chatWindow.show();
    chatWindow.focus();
    chatWindow.webContents.send('show');
    chatWindow.webContents.openDevTools();
    // ipcRenderer.on('show', () => {
    // positioner.move('bottomRight', trayBounds);

    // win.setPosition(x, y[, animate])
    // console.log('Ready to show');
  });
  chatWindow.once('close', () => {
  });
  // return chatWindow;
}

const connectSocket = () => {
  socket = io(config.appUrl, {
    transports: ['websocket'],
    reconnection: true,             // whether to reconnect automatically
    reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
    reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
    reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts. Each attempt increases the reconnection delay by 2x along with a randomization factor
    randomizationFactor: 0.5,
    'query': 'token=' + authenticationToken + '&mode=agent'
  });
  socket.on('connect', () => {
    // console.log('Agent is online');
    socketConnected = true;
    if (!chatWindow) {
      startChatWindow();
    }
    if (chatWindow) {
      chatWindow.webContents.send('connect');
    }
    socket.emit('user:me', (reply) => {
      user = reply.result;
      if (chatWindow) {
        chatWindow.webContents.send('user:me:reply', user);
      }
    });
    const agentInfo = {};
    si.cpu()
      .then(data => agentInfo.cpu = data)
      .then(() => si.osInfo())
      .then(data => agentInfo.osInfo = data)
      .then(() => si.graphics())
      .then(data => agentInfo.graphics = data)
      .then(() => si.networkInterfaces())
      .then(data => agentInfo.networkInterfaces = data)
      .then(
        () => {
          console.log('Agent sent infos');
          socket.emit('agent-info', agentInfo);
        }
      );
  });
  socket.on('disconnect', () => {
    console.log('Agent is offline');
    socketConnected = false;
    if (chatWindow) {
      chatWindow.webContents.send('disconnect');
    }
  });
  socket.on('connect_error', (error) => {
    console.log('Socket connect_error', error);
  });
  socket.on('error', (error) => {
    console.log('Socket error', error);
    if (error.message === 'invalid token') {
      beginAuthentication();
    }
  });
  socket.on('vidu-session-show-desktop', async (data) => {
    console.log('vidu-session-show-desktop');
    const {
      sessionName
    } = data;
    streamingWindows[sessionName].window.webContents.send('show-desktop');
  });
  socket.on('chat:message', async (data) => {
    if (chatWindow) {
      console.log('Data', data, chatWindow);
      chatWindow.webContents.send('chat:message', data);
    } else {
      console.log('Data', data);
    }
  });
  socket.on('vidu-session-destroyed', async (data) => {
    const {
      sessionName
    } = data;
    if (streamingWindows[sessionName]) {
      console.log('Cloasing streaming window!');
      streamingWindows[sessionName].window.close();
      delete streamingWindows[sessionName];
    }
  });
  socket.on('join', async (data) => {
    console.log('Remote Join', data);
  });
  socket.on('join-vidu-session', async (data) => {
    const {
      type,
      sessionName,
      token
    } = data;
    if (!streamingWindows[sessionName]) {
      streamingWindows[sessionName] = {
        window: await streamDesktop(data),
        type: 'desktop',
        showingDesktop: true
      };
      // console.log('streamingWindows[sessionName]', streamingWindows[sessionName]);
      streamingWindows[sessionName].window.webContents.once('did-finish-load', () => {
        // streamingWindows[sessionName].window.show();
        streamingWindows[sessionName].window.webContents.send('store-session-data', data);
        // desktopStreamWindow.webContents.send('show-desktop');
      });
    } else {
      // streamingWindows[sessionName].window.webContents.send('show-desktop');
      // streamingWindows[sessionName].showingDesktop = true;
    }

  });
  // socket.on('join-vidu-session', (data) => {
  //   const {
  //     type,
  //     sessionName,
  //     token
  //   } = data;
  //   if (type === 'desktop') {
  //     streamingWindows[sessionName] = {
  //       window: streamDesktop(data),
  //       type: 'desktop'
  //     };
  //   }
  // });
  // socket.on('pause-vidu-session', (data) => {
  //   const {
  //     type,
  //     sessionName,
  //     token
  //   } = data;
  //   if (streamingWindows[sessionName]) {
  //     console.log('Closing streaming window');
  //     streamingWindows[sessionName].window.close();
  //     streamingWindows[sessionName] = null;
  //   } else {
  //     console.log('Streaming window not found');
  //   }
  // });
}

const streamingWindows = {};

const streamDesktop = async (data) => {
  const {
    type,
    sessionName,
    token
  } = data;
  const desktopStreamWindow = await createWindow('viduAutoDesktop/index.html', {
    frame: true,
    height: 10,
    width: 10,
    transparent: true,
    devTools: false,
    icon: `${__dirname}/images/fav.png`,
    show: false
  });
  // console.log('desktopStreamWindow', desktopStreamWindow);
  // desktopStreamWindow.once('ready-to-show', () => {
  //   console.log('New Window is ready to show');
  //   desktopStreamWindow.show();
  // });
  desktopStreamWindow.once('ready-to-show', () => {
    console.log('New Window is ready to show');
    // desktopStreamWindow.show();
  });
  // desktopStreamWindow.webContents.once('did-finish-load', () => {
  //   console.log('New Window is did-finish-load');
  //   desktopStreamWindow.webContents.send('store-session-data', data);
  // });
  return desktopStreamWindow;
  // session = openvidu.initSession();
  // session.connect(token)
  //   .then(
  //     () => {
  //       desktopCapturer.getSources({
  //           types: ['window', 'screen']
  //       }).then(async sources => {
  //         console.log('Streamable sources', sources);
  //       });
  //     }
  //   )
}

const continousScreenshot = (err) => {
  Promise.delay(30 * 1000)
    .then(
      () => {
        if (!socketConnected) {
          console.log('Socket not connected');
          continousScreenshot();
        } else {
          screenshot.all()
          .then((imgs) => {
            if (socketConnected) {
              Promise.map(imgs, (img) => {
                return img;
              })
              .then(
                (images) => {
                  // console.log(images);
                  if (socketConnected) {
                    socket.emit('push:screenshot', images);
                  }
                  continousScreenshot();
                }
              )
            }
            // imgs: an array of Buffers, one for each screen
            // console.log('Images', imgs);
          })
          .catch(
            (e) => {
              continousScreenshot();
            }
          );
        }
      }
    );
}
ipcMain.on('user:me', (event) => {
  console.log('User:Me');
  event.reply('user:me:reply', user);
  console.log('Sent Reply');
});
ipcMain.on('socket:proxy', (event, args) => {
  const {
    cmd,
    arg,
    callback
  } = args;
  console.log('Proxying request', cmd);
  socket.emit(cmd, arg, (reply) => {
    console.log('Got', cmd, 'reply', reply);
    if (callback) {
      event.reply(`${cmd}:reply`, reply);
    }
  });
})
// ipcMain.on('bulk:chat:messages', (event, arg) => {
//   console.log('bulk:chat:messages', arg);
//   socket.emit('bulk:chat:messages', arg);
//   socket.once('bulk:chat:messages:reply', async (data) => {
//     console.log('DATA', data);
//     if (chatWindow) {
//       chatWindow.webContents.send('bulk:chat:messages:reply', data);
//     }
//   });
// });
ipcMain.on('check-login', async (event, arg) => {
  authenticationToken = false;
  const retval = await authenticate(arg.username, arg.password);
  // console.log('Authentication result', retval);
  if (retval) {
    authenticationToken = retval;
    // connectSocket();
    connectSocket();
  }
  event.reply('check-login-result', retval);
});

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async (filename, options) => {
  // if (
  //   process.env.NODE_ENV === 'development' ||
  //   process.env.DEBUG_PROD === 'true' && !options.disableDebug
  // ) {
  //   await installExtensions();
  // }

  const tmpWin = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
      devTools: options.devTools
    },
    ...options
  });
  console.log('Loading url', `file://${__dirname}/${filename}`);
  tmpWin.loadURL(`file://${__dirname}/${filename}`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  // tmpWin.webContents.on('did-finish-load', () => {
  //   console.log('Window did finit load!');
  //   if (!tmpWin) {
  //     throw new Error('"mainWindow" is not defined');
  //   }
  //   if (options.startMinimized) {
  //     tmpWin.minimize();
  //   } else {
  //     tmpWin.show();
  //     tmpWin.focus();
  //   }
  // });

  tmpWin.on('closed', () => {
    // tmpWin = null;
  });

  // const menuBuilder = new MenuBuilder(tmpWin);
  // tmpWin.buildMenu();
  // return tmpWin;
  //
  // // Remove this if your app does not use auto updates
  // // eslint-disable-next-line
  // new AppUpdater();
  tmpWin.removeMenu();

  // tmpWin.on('focus', (event) => {
  //     electronLocalshortcut.register(tmpWin, ['CommandOrControl+R','CommandOrControl+Shift+R', 'F5'], () => {})
  // });
  //
  // tmpWin.on('blur', (event) => {
  //     electronLocalshortcut.unregisterAll(tmpWin);
  // })
  return tmpWin;
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
});

app.on('ready', () => {
  console.log('App is ready!');
  startUp();
});

app.on('activate', () => {
  console.log('App is activating!');
  startUp();
});
