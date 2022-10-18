window.onload = function () {



    document.getElementById("pannel_btn").onclick = function () {
        document.getElementById("pannel_btn").innerText="cc";
        console.log("xxxdf");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: 'document.body.style.backgroundColor = "' + "#ffaacc" + '";',
            });
        });
        // document.getElementById("pannel_btn").innerText="gx";
    };
};