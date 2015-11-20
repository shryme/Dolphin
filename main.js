chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 900,
      height: 600
      //height: 315
    },
    minWidth: 900,
    minHeight: 600,
    "resizable": false
  });
});
