var INIT_EVT = 'app/scripts/events/init.js';
var DESTROY_EVT = 'app/scripts/events/destroy.js';
var connections = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    var tabs = Object.keys(connections);
    for (var i=0, len=tabs.length; i < len; i++) {
      if (connections[tabs[i]].tabId === tabId) {
        chrome.tabs.executeScript(connections[tabs[i]].tabId, { file: INIT_EVT });
        break;
      }
    }
  }
});

chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  if (devToolsConnection.name == "devtools-vs-connect") {
    var devToolsListener = function(message, sender, sendResponse) {
      if(message.name === 'devtools-vs-init'){
        var tabId = message.tabId;
        connections[tabId]        = devToolsConnection;
        connections[tabId].tabId  = tabId;
        connections[tabId].dt     = true;
        chrome.tabs.executeScript(message.tabId, { file: INIT_EVT });
        return;
      }
    }
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function(port) {
      port.onMessage.removeListener(devToolsListener);
      var tabs = Object.keys(connections);
      for (var i=0, len=tabs.length; i < len; i++) {
        if (connections[tabs[i]] == port) {
          chrome.tabs.executeScript(port.tabId, { file: DESTROY_EVT });
          delete connections[tabs[i]];
          break;
        }
      }
    });
  }
});
