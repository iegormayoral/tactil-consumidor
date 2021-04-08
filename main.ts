import { exec } from 'child_process';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as ElectronLog from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';

// Assign a logging method for `electron-updater`
autoUpdater.logger = ElectronLog;

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const screens = {
  'P1': { width: 960, height: 505 },
};

function createWindow(): BrowserWindow {

  // const size = screen.getPrimaryDisplay().workAreaSize;
  const size = screens.P1;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    fullscreen: !serve,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // Attach event listeners
  attachListeners();

  return win;
}

function attachListeners(): void {

  // Emitted when the application needs to check for the device information.
  ipcMain.handle('deviceInfo', () => {

    type DeviceInfo = {
      manufacturer: string
      model: string
      name: string
    };

    return new Promise((resolve, reject) => {
      if (serve) {
        const deviceInfo: DeviceInfo = {
          manufacturer: 'Manufacturer S.A.',
          model: 'PPC3100',
          name: 'Test',
        };

        return resolve(deviceInfo);
      }

      if (os.platform() === 'win32') {

        // Execute `wmic` on windows
        exec('wmic computersystem get manufacturer, model, name /value', (err, stdout) => {
          if (err) {
            return reject(err.message);
          }

          const stdoutLines = stdout.toString().trim().split('\n');

          const deviceInfo: DeviceInfo = {
            manufacturer: null,
            model: null,
            name: null,
          };

          stdoutLines.forEach(line => {
            const lineArr = line.split('='),
              prop = lineArr[0].toLowerCase();
            deviceInfo[prop] = lineArr[1];
          });

          resolve(deviceInfo);
        });
      }
      else {
        reject(`Platform "${os.platform()}" not supported.`);
      }
    });
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();

    createWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
