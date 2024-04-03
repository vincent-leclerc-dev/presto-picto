/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, ipcMain, screen, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import os from 'os';
import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath, streamToBase64, streamToBlob } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  (process.env.TOGGLE_DEV_TOOLS === 'auto' &&
    process.env.NODE_ENV === 'development') ||
  process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions: string[] = []; // 'REACT_DEVELOPER_TOOLS'

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#121212',
      symbolColor: '#bbb',
      height: 42,
    },
    transparent: false,
    frame: false,
    show: false,
    resizable: true,
    width,
    height,
    minWidth: 400,
    minHeight: 270,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      contextIsolation: true, // warning: keep it true
      devTools: true,
      nodeIntegration: true, // TODO check how replace it to false
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.setBackgroundColor('rgba(0, 0, 0, 0)');
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

/**
 * IPC events
 */

// test itern processus communication
ipcMain.on('ipc-test', async (event, arg) => {
  const msgTemplate = (pingPong: string) => pingPong;
  if (arg.length > 0 && arg[0] === 'ping') {
    event.reply('ipc-test', msgTemplate('pong'));
  }
});

ipcMain.on('picto:upload:start', async (_e, opt) => {
  console.log('picto:upload:start', opt);
  if (!mainWindow) {
    return false;
  }

  const mimetype = opt.type;
  const filename = opt.path.split('\\').pop();

  const readStream = fs.createReadStream(opt.path);

  const blob: Blob = await streamToBlob(readStream, mimetype);
  const arrayBuffer = await blob.arrayBuffer();

  mainWindow.webContents.send('picto:upload:complete', {
    uint8array: new Uint8Array(arrayBuffer),
    filename,
    mimetype,
  });

  return true;
});

ipcMain.on('file:list', async (_e, opt) => {
  if (!mainWindow) {
    return false;
  }
  const { dir } = opt;
  const defaultPictosDir = `${app.getPath('home')}/pictos`;
  const pictosDir = dir ?? defaultPictosDir;

  const files = fs.readdirSync(pictosDir, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  const imageFiles: fs.Dirent[] = files.filter((filename: fs.Dirent) => {
    const fileName: string = filename.name;
    return ['png', 'jpg', 'jpeg', 'gif'].includes(fileName.split('.')[1]);
  });

  const fileList: Promise<{ name: string; words: string[]; data: string }[]> =
    Promise.all(
      imageFiles.map(async (dirEntry: fs.Dirent) => {
        const { name } = dirEntry;
        const cleanUp = name
          .replace('.png', '')
          .replace('.jpg', '')
          .replace('.jpeg', '')
          .replaceAll('_', ' ')
          .replace(/[0-9]+/g, '')
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', '-')
          .toLocaleLowerCase()
          .trim();
        const extractedWords = cleanUp.split('-').filter((it) => it !== '');
        const readStream = fs.createReadStream(pictosDir + path.sep + name);
        const b64 = await streamToBase64(readStream);

        /*
        // convert uint8array to base64 string
        const blob = new Blob([src], {
          type: mimetype,
        });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          if (reader.result) {
            setConvertedSrc(reader.result.toString());
            // setError('Erreur de lecture du fichier');
          }
        };
        reader.onerror = () => {
          setError('Erreur de lecture du fichier');
        };
        */
        return {
          name,
          words: extractedWords,
          data: `data:image/png;base64,${b64.toString()}`,
        };
      }),
    );

  mainWindow.webContents.send('list:complete', { files: await fileList });

  return true;
});

ipcMain.on('print-to-pdf', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    return;
  }

  const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
  win.webContents
    .printToPDF({
      printBackground: false,
      landscape: false,
      pageSize: 'A4',
      scale: 1,
    })
    .then((data) => {
      fs.writeFile(pdfPath, data, (error) => {
        if (error) throw error;
        console.log(`Wrote PDF successfully to ${pdfPath}`);
      });
    })
    .catch((error) => {
      console.log(`Failed to write PDF to ${pdfPath}: `, error);
    });
});

ipcMain.on('print', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) {
    return;
  }

  const options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: 'printableArea',
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Header of the Page',
    footer: 'Footer of the Page',
  };

  win.webContents.print(options, (success, failureReason) => {
    if (!success) {
      console.log(failureReason);
    }
    console.log('Print Initiated');
  });
});

ipcMain.on('toogle-dev-tools', () => {
  if (!mainWindow) {
    return false;
  }

  mainWindow.webContents.toggleDevTools();

  return true;
});
