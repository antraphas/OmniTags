// Background Service Worker — Abre o painel OmniTag como janela centralizada
chrome.action.onClicked.addListener(function () {
  var w = 900;
  var h = 720;

  chrome.windows.getCurrent(function (currentWin) {
    var left = Math.round((currentWin.left || 0) + ((currentWin.width || 1280) - w) / 2);
    var top = Math.round((currentWin.top || 0) + ((currentWin.height || 800) - h) / 2);

    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: w,
      height: h,
      left: Math.max(0, left),
      top: Math.max(0, top)
    });
  });
});
