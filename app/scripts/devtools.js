var backgroundPageConnection = chrome.runtime.connect({ name: "devtools-vs-connect"});
    backgroundPageConnection.postMessage({
      name: 'devtools-vs-init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
