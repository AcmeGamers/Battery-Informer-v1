const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

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
let mainWindows, aboutWindows;

// Main Application
function runApplication() {
  mainWindows = new BrowserWindow({
    icon: "./assets/favicon/favicon-32x32.png",
    height: 600,
    width: 800,
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  isDev ? mainWindows.webContents.openDevTools() : null;
  mainWindows.loadFile("./app/index.html");
}

function aboutPage() {
  aboutWindows = new BrowserWindow({
    icon: "./assets/favicon/favicon-32x32.png",
    height: 450,
    width: 450,
    resizable: false,
  });
  aboutWindows.loadFile("./app/about.html");
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

  mainWindows.on("ready", () => (mainWindows = null));
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
