var generatedCodeList = [];
var urlMap = [];
//debugger;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message["command"] == "copy") {
        var codeList = [];
        for (var i = 0; i < generatedCodeList.length; i++) {
            Array.prototype.push.apply(codeList, generatedCodeList[i]);
            if (i < generatedCodeList.length -1) {
                codeList.push("//---------------------------------------");
                codeList.push("");
            }
        }
        var code = formatCode(codeList);
        copyClipboard(code);
        generatedCodeList = [];
        urlMap = [];

    } else {
        var url = getUrl(message);
        if (message.method == "POST" && (message.requestBody == undefined || message.requestBody.formData == undefined)) {
        } else if (urlMap.indexOf(url) < 0) {
            sendAPI(message);
            urlMap.push(url);
        }
    }
});

function sendAPI(details) {
        var xhr = new XMLHttpRequest();
        xhr.open(details.method, getUrl(details));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                generatedCodeList.push(makeCode(details, xhr));
            }
        }
        xhr.send();

}

