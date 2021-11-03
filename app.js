const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
} = require("electron");

process.env.NODE_ENV = "development"; //development
const isDev = process.env.NODE_ENV !== "production" ? true : false,
  isMac = process.env.NODE_ENV === "darwin" ? true : false,
  isWin = process.env.NODE_ENV === "win32" ? true : false,
  isLin = process.env.NODE_ENV === "linux" ? true : false;

console.log(process.platform);

//////////////////////
// Application Windows
//////////////////////

// Assignments
let mainWindow, aboutWindow, notificationWindow;

////////////////////////
/// Application Page ///
////////////////////////

const icon = "./assets/favicon/favicon-32x32.png";
// Main Application
function runApplication() {
  mainWindow = new BrowserWindow({
    icon: icon,
    title: "Battery Informer",
    width: 350,
    height: 400,

    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.center();
  // isDev ? mainWindow.webContents.openDevTools() : null;
  mainWindow.loadFile("./app/about.html");
}

//////////////////
/// About Page ///
//////////////////
function aboutPage() {
  aboutWindow = new BrowserWindow({
    title: "About Battery Informer",
    icon: icon,
    width: 350,
    height: 400,
    resizable: false,
  });
  aboutWindow.loadFile("./app/about.html");
}

/////////////////////////
/// Notification Page ///
/////////////////////////

function notificationPage() {
  notificationWindow = new BrowserWindow({
    title: "Notification Page",
    icon: "./assets/favicon/favicon-32x32.png",
    height: 189,
    width: 428,
    frame: false,
    resizable: isDev ? true : false, //: false
  });

  mainWindow.center();
  mainWindow.loadFile("./app/notification.html");
}

///////////////////////
// Starting Application
///////////////////////

app.on("ready", () => {
  runApplication();
  // The Menu to be Made
  const mainmenu = Menu.buildFromTemplate(menu);

  // The Menu to Set
  Menu.setApplicationMenu(mainmenu);
  // Quit Menu
  globalShortcut.register("CmdOrCtrl+W", () => app.quit());

  mainWindow.on("ready", () => (mainWindow = null));
});

///////////////////////
// Battery Main Process
///////////////////////
const batteryLevel = require("battery-level");
batteryLevel().then((level) => {
  var totalBattery = level * 100;

  console.log(totalBattery);

  // if (mainWindow) {
  //   mainWindow.close();
  // }

  // if (totalBattery > 50) {
  //   notificationPage();
  // }
});

///////////////////
// Application Menu
///////////////////

const menu = [
  // About Page

  // Macintosh
  ...(isMac
    ? [
        { role: "appMenu" },
        {
          label: app.name,
          submenu: [{ label: "About " + app.name, click: () => aboutPage() }],
        },
      ]
    : [
        // Windows
        {
          label: "File",
          submenu: [
            {
              label: "Quit Appication",
              accelerator: "CmdOrCtrl+W",
              click: () => {
                app.quit();
              },
            },
          ],
          // role:"fileMenu"
        },
        {
          label: "Help",
          submenu: [
            { label: "About Battery Informer", click: () => aboutPage() },
          ],
        },
        {
          label: "Notification Page",
          submenu: [
            { label: "Notification Page", click: () => notificationPage() },
          ],
        },
      ]),

  ...(isDev
    ? [
        {
          label: "Developer Tools",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" }, // Making a line in the menu
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];
