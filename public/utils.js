/**
 * 创建一个 html element
 * @param name
 * @param params
 * @returns {*}
 */
function createElement(name, params) {
    let element = document.createElement(name);
    for (let key in params) {
        element.setAttribute(key, params[key]);
    }
    return element;
}

function toast(text, time) {
    let toast = document.getElementById('toast');
    let toast_box = document.getElementsByClassName('toast_box')[0];
    toast.innerHTML = text;
    toast_box.style.animation = 'show 1.5s';
    toast_box.style.display = 'inline-block';
    setTimeout(function () {
        toast_box.style.animation = 'hide 1.5s';
        setTimeout(function () {
            toast_box.style.display = 'none';
        }, 1400)
    }, time)
}

function copyToClip(content, t2) {
    const inputDom = document.createElement('input');
    inputDom.setAttribute('value', content);
    document.body.appendChild(inputDom);
    inputDom.select();
    document.execCommand('copy');
    document.body.removeChild(inputDom);
    if (t2 !== false) {
        toast("已复制到剪贴板")
    }

}

function injectPosToWebUi(injectInfo) {
    try {
        if (chrome == null || chrome.tabs == null) {
            return
        }
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: "window.novelAi_inject_pos=\"" + injectInfo + "\"",
            });
            chrome.tabs.executeScript(tabs[0].id, {
                file: "injectPos.js",
            });
        });
    } catch {

    }
}

function injectNegToWebUi(injectInfo) {
    try {
        if (chrome == null || chrome.tabs == null) {
            return
        }
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: "window.novelAi_inject_neg=\"" + injectInfo + "\"",
            });
            chrome.tabs.executeScript(tabs[0].id, {
                file: "injectNeg.js",
            });
        });
    } catch {

    }
}

