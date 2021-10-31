const { app, BrowserWindow } = require("electron");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Window Name",
    width: 500,
    height: 500,
  });
}

app.on("ready", createMainWindow);
