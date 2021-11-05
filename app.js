const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  Tray,
  ipcMain,
} = require("electron");
const AutoLaunch = require("auto-launch");
process.env.NODE_ENV = "production"; //development
const isDev = process.env.NODE_ENV !== "production" ? true : false,
  isMac = process.env.NODE_ENV === "darwin" ? true : false,
  isWin = process.env.NODE_ENV === "win32" ? true : false,
  isLin = process.env.NODE_ENV === "linux" ? true : false;

console.log(process.platform);

//////////////////////
// Application Windows
//////////////////////

// Assignments
let mainWindow, aboutWindow, notificationWindow, settingsWindow;

////////////////////////
/// Application Page ///
////////////////////////
const icon = __dirname + "\\assets\\battery-2.ico";

// Main Application
function runApplication() {
  mainWindow = new BrowserWindow({
    icon: icon,
    title: "Battery Informer",
    height: 400,
    width: 400,

    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.center();
  // isDev ? mainWindow.webContents.openDevTools() : null;
  mainWindow.loadFile("./app/start.html");

  // Hiding the Main Window
  mainWindow.on("close", (event) => {
    if (app.quitting) {
      mainWindow = null;
    } else {
      event.preventDefault();
      mainWindow.hide();
    }
  });
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
    icon: icon,
    height: 189,
    width: 428,
    resizable: false,
    frame: false,
  });
  notificationWindow.center();
  notificationWindow.loadFile("./app/notification.html");
}

/////////////////////
/// Settings Page ///
/////////////////////
function settingsPage() {
  settingsWindow = new BrowserWindow({
    title: "Settings",
    icon: icon,
    height: 230,
    width: 400,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: "./preload.js",
    },
  });
  settingsWindow.center();
  settingsWindow.loadFile("./app/settings.html");
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

  // Auto-Launch
  let autoLaunch = new AutoLaunch({
    name: "Battery Informer",
    path: app.getPath("exe"),
  });
  autoLaunch.isEnabled().then((isEnabled) => {
    if (!isEnabled) autoLaunch.enable();
  });
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
          label: "File",
          submenu: [
            { label: "About " + app.name, click: () => aboutPage() },
            { type: "separator" },
            { label: "Settings", click: () => settingsPage() },
          ],
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
            { label: "Notification Page", click: () => notificationPage() },
            { type: "separator" },
            { label: "Settings", click: () => settingsPage() },
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

// Application Tray Icon

let tray = null;
app.whenReady().then(() => {
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: "About", click: () => aboutPage() },
    { label: "Settings", click: () => settingsPage() },
    { type: "separator" },
    {
      label: "Exit",
      click: () => {
        app.exit();
      },
    },
  ]);
  tray.setToolTip("Battery Informer");
  tray.setContextMenu(contextMenu);
});

///////////////////////
// Battery Main Process
///////////////////////
const batteryLevel = require("battery-level");
batteryLevel().then((level) => {
  var totalBattery = level * 100;

  console.log(totalBattery);

  setInterval(function () {
    //this code runs every second

    if (totalBattery > 90) {
      notificationPage();
    }
  }, 420000); // 7mins
  // 5000 5secs
  // 1200000 20mins
});

ipcMain.on("form:value", (e, options) => {
  console.log(options.sliderValue);
});

// Starting on System Startup
// _electron.app.setLoginItemSettings({
//   openAtLogin: true,
//   path: _electron.app.getPath("exe"),
// });
