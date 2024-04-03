/* eslint no-console: off */

import {
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  app,
  shell,
} from 'electron';

import fs from 'fs';
import os from 'os';
import path from 'path';

const documentationUrl =
  'https://github.com/vincent-leclerc-dev/presto-picto#readme';
interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', () => {
      Menu.buildFromTemplate([
        {
          label: '&Exporter au format PDF',
          click: () => {
            const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
            this.mainWindow.webContents
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
                return true;
              })
              .catch((error) => {
                console.log(`Failed to write PDF to ${pdfPath}: `, error);
              });
          },
        },
        {
          label: '&Imprimer',
          click: () => {
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
            this.mainWindow.webContents.print(
              options,
              (success, failureReason) => {
                if (!success) console.log(failureReason);
                console.log('Print Initiated');
              },
            );
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {};
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: '&Affichage',
      submenu: [
        {
          label: '&Ajouter un pictogramme',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: '&Recharger la page',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: '&Plein écran',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: '&Outils développeur',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: '&Affichage',
      submenu: [
        {
          label: '&Plein écran',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: '&Fenêtre',
      submenu: [
        {
          label: '&Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Aide',
      submenu: [
        {
          label: 'Documentation',
          click() {
            shell.openExternal(documentationUrl);
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&Fichier',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Recharger la page',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: '&Plein écran',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: '&Outils développeur',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: '&Plein écran',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
      {
        label: '&Aide',
        submenu: [
          {
            label: '&Documentation',
            click() {
              shell.openExternal(documentationUrl);
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
