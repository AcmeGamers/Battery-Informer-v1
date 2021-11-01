const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

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
const icon = "./assets/favicon/favicon-32x32.png";
// Main Application
function runApplication() {
  mainWindow = new BrowserWindow({
    icon: icon,
    height: 500,
    width: 628,

    resizable: isDev ? true : true, //: false
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.center();
  isDev ? mainWindow.webContents.openDevTools() : null;
  mainWindow.loadFile("./app/about.html");
}

function aboutPage() {
  aboutWindow = new BrowserWindow({
    icon: icon,
    height: 450,
    width: 450,
    resizable: false,
  });
  aboutWindow.loadFile("./app/about.html");
}

function notificationPage() {
  notificationWindow = new BrowserWindow({
    icon: "./assets/favicon/favicon-32x32.png",
    height: 189,
    width: 428,
    frame: false,
    resizable: isDev ? true : true, //: false
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.center();
  isDev ? mainWindow.webContents.openDevTools() : null;
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
          submenu: [{ label: "About " + app.name, click: () => aboutPage() }],
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
