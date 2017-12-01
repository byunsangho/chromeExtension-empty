$(function () {
        chrome.runtime.sendMessage({command: "start"}, function(res) {});
        window.close();

});

