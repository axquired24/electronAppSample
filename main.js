const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

 // Listen for app to be read
 app.on('ready', function() {
     // Create new window
     mainWindow = new BrowserWindow({});
     // Load html into window
     mainWindow.loadURL(url.format({
         pathname: path.join(__dirname, 'mainWindow.html'),
         protocol: 'file:',
         slashes: true
     }));

     // Quit app when closed
     mainWindow.on('closed', function() {
        app.quit();
     });

     // Build menu from template
     const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
     // Insert menu
     Menu.setApplicationMenu(mainMenu)
 });

 function createAddWindow(){
     // Create new window
     addWindow = new BrowserWindow({
         width: 200,
         height: 300,
         title: 'Add new item'
     });
     // Load html into window
     addWindow.loadURL(url.format({
         pathname: path.join(__dirname, 'addWindow.html'),
         protocol: 'file:',
         slashes: true
     }));

     // Garbage collection handle
     addWindow.on('closed', function() {
         addWindow = null;
     })
 }

 function setCtrlShortcut(key){
     const ret = process.platform == 'darwin' ? 'Command+'+key : 'Ctrl+'+key;
     return ret;
 }

 // Catch item:add
 ipcMain.on('item:add', function(e, item) {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
 });

 // Create menu template
 const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: setCtrlShortcut('N'),
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item'
            },
            {
                label: 'Quit',
                accelerator: setCtrlShortcut('Q'),
                click(){
                    app.quit();
                }
            }
        ]
    }
 ];

 // if mac, add empty object to menu
 if(process.platform == 'darwin') {
     mainMenuTemplate.unshift({});
 }

 // Add developer tools if not in prod
 if(process.env.NODE_ENV !== 'production'){
     mainMenuTemplate.push({
         label: 'Developer Tools',
         submenu: [
             {
                 label: 'Toggle DevTools',
                 accelerator: setCtrlShortcut('I'),
                 click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                 }
             },
             {
                 role: 'reload'
             }
         ]
     })
 }
