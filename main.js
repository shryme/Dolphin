chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 900,
      height: 480
      //height: 315
    },
    minWidth: 900,
    minHeight: 480,
    "resizable": false
  });
});
