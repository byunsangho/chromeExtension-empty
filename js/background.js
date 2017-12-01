////chrome.browserAction.setBadgeText({"text": "language"});
var xrp_url = "https://coincheck.com/api/rate/xrp_jpy";
var btc_url = "https://coincheck.com/api/rate/btc_jpy";

var isStart = false;
var isPlayed = false;

function sendAPI(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr);
            }
        }
        xhr.send();
}

chrome.runtime.onMessage.addListener(

    function(request,sender,sendResponse) {
        var cmd = request["command"];
        if (cmd == "start") {
            if (isStart) {
                isStart = false;
            } else {
                isStart = true;
            }
//            sendMessageCurrentTab({ "command" : "start"});

        }
//        sendResponse({ result: 'ok'});
    }
);

chrome.webRequest.onBeforeRequest.addListener(

    function(details){
        console.log(details.url);

        return {};
    },
    {
        urls: [ "*://steamcommunity.com/*" ],
        types:[
//			"main_frame"
//			,"sub_frame",
            "xmlhttprequest"
        ]
        }, ['requestBody']
);

function sendMessageCurrentTab (details) {

        chrome.tabs.query({
          active: true,
          windowId: chrome.windows.WINDOW_ID_CURRENT
        }, function (result) {
          var currentTab = result.shift();
          var id = currentTab == undefined ?  0 : currentTab.id;

          // 取得したタブに対してメッセージを送る
            chrome.tabs.sendMessage(id, details, function() {});
        });

}

$(function () {

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    getrate();

//    var start = document.getElementById('start');
//
//    start.addEventListener('click', function() {
//        chrome.runtime.sendMessage({command: "start"}, function(res) {});
//    });


});

function getrate() {
    if (isStart) {
        sendAPI(xrp_url, parseXHR);
        sendAPI(btc_url, parseXHR);
    }

    setTimeout(function () { getrate(); }, 5000 );
}

function parseXHR(xhr) {
    var res = JSON.parse(xhr.responseText);
    var rate = parseFloat(res["rate"] );
    if (xhr.responseURL.indexOf("xrp") >= 0) {
        console.log(rate);
        notify(rate);
    } else {
        console.log(rate + " <= 278450");
    }
//    if (res["rate"] )
    // setTimeout(function () { getrate(); }, 1000 );
}

function notify2() {
    if (!isPlayed) {
        var yourSound = new Audio('../test.mp3');
        yourSound.loop = true;
        yourSound.play();
        isPlayed = true;
    }
//// create a HTML notification:
//var notification = window.webkitNotifications.createHTMLNotification(
//    '../html/popup.html' // html url - can be relative
//);
//
//// Then show the notification.
//notification.show();
}

function notify(rate) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notification;
        var title = "";
        if (rate > 40.2) {
            title = "upper";
        } else if (rate < 32.2) {
            title = "lower";
        }

        if (title != "") {
            notification = new Notification(title, {
            icon: '../icon/icon.png',
            body: rate
            });

            setTimeout( function () {notification.close(); }, 2000);

            notification.onclick = function () {
                notification.close(); //.open("http://");
            };
            notify2();
        }

    }

}

