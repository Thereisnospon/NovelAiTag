const MAGIC_VERSION = "2.2";

let updateLog={
    "2.2":["固定tag顺序，之前点击 tag 的顺序并不会依次显示在最终的文本里，而是会乱序"],
    "2.1/2.0":["2.0 开始浏览器插件，点击tag自动复制内容到webui 文本框，无需手动复制，2.1修复2.0 bug"],
    "1.4":["内置元素法典，可以用预设的风/水/核/彩虹 等各种魔法书快速得到好的效果"],
    "1.1":["增加抽卡功能可以随机抽卡组合"],
}

let allData = window.globalData;
let magicBooks = window.magic_books;
var translate = window.magic_trans;

//group prop
var innerMust = [
    "正面常用", "负面常用"
];
var innerNeg = [
    "负面常用", "负面实践"
];
var diyMust = [];
var diyNeg = [];
var groupOrder = [];
//

let myWeight = {};
var checked = [];

var uiConfig = {
    "show_add": false,
    "show_weight": false,
    "show_del": false,
    "show_en": false,
    "show_yuan": false,
    "show_numq": false,
    "show_cp1": false,
    "select_magic": "",
    "show_autocp": true
};


let uiElements = {
    "checkBox_array": [],
    "uiMap": {}
};


/**
 * 更新一个 tag 的权重
 * @param key
 * @param cb
 * @param badge
 * @param chValue
 */
function onCheckBoxWeightChange(group, key, cb, badge, chValue) {
    var weight = myWeight[group + "_" + key];
    if (weight == null) {
        weight = 0;
    } else {
        weight = parseInt(weight);
    }
    weight += chValue;
    myWeight[group + "_" + key] = weight;
    badge.innerText = weight;
    onTagsUiChange();
}

/**
 * 获取标准显示的 tag 的 checkBox
 * @returns {[]}
 */
function getStandardTagCheck() {
    return uiElements.checkBox_array;
}

/**
 * 获取 加权显示的 tag
 * @param key
 * @param info
 * @returns {string}
 */
function getWeightInfo(group, key, info) {
    return getWeightInfoFromLabel(group + "_" + key, info)
}

function getWeightInfoFromLabel(gk, info) {
    let weight = myWeight[gk];
    var weightInfo = info;
    var posL = "{";
    var posR = "}";
    if (uiConfig.show_yuan) {
        posL = "(";
        posR = ")";
    }
    if (weight != null && weight !== 0) {
        let neg = weight < 0;
        let abs = weight < 0 ? (-weight) : weight;
        var numWeight = 1.0;
        if (uiConfig.show_numq) {
            for (var j = 0; j < abs; j++) {
                if (neg) {
                    numWeight = numWeight * 0.952;
                } else {
                    numWeight = numWeight * 1.1;
                }
            }
            weightInfo = "(" + weightInfo + ":" + numWeight.toFixed(2) + ")"
        } else {
            for (var j = 0; j < abs; j++) {
                if (!neg) {
                    weightInfo = posL + weightInfo + posR;
                } else {
                    weightInfo = "[" + weightInfo + "]";
                }
            }
        }

    }
    return weightInfo;
}

/**
 * 是否为 负面关键词 group
 * @param group
 * @returns {boolean}
 */
function isNegativeGroup(group) {
    return innerNeg.indexOf(group) > -1 || diyNeg.indexOf(group) > -1;
}

function isMustGroup(group) {
    return innerMust.indexOf(group) > -1 || diyMust.indexOf(group) > -1;
}

function getAllMustGroup() {
    let todata = {};
    for (let i in innerMust) {
        let g = innerMust[i];
        let group = allData[g];
        if (group != null) {
            todata[g] = group;
        }
    }
    for (let i in diyMust) {
        let g = diyMust[i];
        let group = allData[g];
        if (group != null) {
            todata[g] = group;
        }
    }
    return todata;
}

function tryResetWeight(group, key) {
    let wKey = group + "_" + key;
    let wWei = myWeight[wKey];
    if (wWei != null) {
        Reflect.deleteProperty(myWeight, wKey);
        getOrPutUiGP(group, key).checkBadge.innerText = 0;
    }

}

/**
 * 刷新 tag ui
 */
function onTagsUiChange() {
    let positiveTags = [];
    let negativeTags = [];
    let quickTagLayout = document.getElementById("selected_btn_div");
    let tagCheckBoxs = getStandardTagCheck();
    let checkMap = {};
    for (var i = 0; i < tagCheckBoxs.length; i++) {
        let tagCbUi = tagCheckBoxs[i];
        let tagValue = tagCbUi.getAttribute("tagValue");
        let tagGroup = tagCbUi.getAttribute("tagGroup");
        let tagKey = tagCbUi.getAttribute("tagKey");
        if (tagValue == null || tagGroup == null || tagKey == null) {
            continue;
        }
        let uiEle = getOrPutUiGP(tagGroup, tagKey);
        let quickBtn = uiEle.quickBtn;
        if (tagCbUi.checked) {
            checkMap[tagGroup + "_" + tagKey] = {
                "info": tagValue,
                "neg": isNegativeGroup(tagGroup)
            };
            if (quickBtn == null) {
                let tagQuickBtn = createSelectedBtn(tagGroup, tagKey, isNegativeGroup(tagGroup));
                quickTagLayout.appendChild(tagQuickBtn);
            }

        } else {
            if (quickBtn != null) {
                uiEle.quickBtn = null;
                tryRemoveFromParent(quickBtn);
            }
            tryResetWeight(tagGroup, tagKey);

        }
    }
    let checkedInfo = getAllCheckedInfo();
    // console.log(checkedInfo,checkMap);
    for (let i in checkedInfo) {
        let checkInfo = checkedInfo[i];
        let saveState = checkMap[checkInfo.gk];
        if (saveState != null) {
            let weighInfo = getWeightInfoFromLabel(checkInfo.gk, saveState["info"]);
            if (saveState["neg"] === true) {
                negativeTags.push(weighInfo);
            } else {
                positiveTags.push(weighInfo);
            }
        }

    }
    let positive = positiveTags.join(",");
    let negative = negativeTags.join(",");

    document.getElementById("textarea_pos").value = positive;
    document.getElementById("textarea_neg").value = negative;
    if (uiConfig.show_autocp) {
        injectPosToWebUi(positive);
        injectNegToWebUi(negative);
    }

    saveChecked();

}

/**
 * 创建一个标准的 tag 组
 * @param key
 * @param info
 * @param group
 * @returns {*}
 */
function createTagBtnGroup(key, info, group) {

    let groupLayout = createElement("div", {
        "class": "btn-group tag_btn_group",
        "role": "group",
        "aria-label": "Basic checkbox toggle button group"
    });


    let leftBtn = createElement("button", {
        "type": "button",
        "class": "btn btn-danger",
        "id": "btn_" + key + "_left"
    });
    leftBtn.innerText = "-";

    let rightBtn = createElement("button", {
        "type": "button",
        "class": "btn btn-success",
        "id": "btn_" + key + "_right"
    });
    rightBtn.innerText = "+";


    let checkBtn = createElement("input", {
        "type": "checkbox",
        "class": "btn-check",
        "autocomplete": "off",
        "id": "btn_" + key
        // "data-bs-toggle":"tooltip",
        // "data-bs-placement":"top",
        // "data-bs-title":info
    });

    getStandardTagCheck().push(checkBtn);
    let holder = getOrPutUiGP(group, key);
    holder.mainCheck = checkBtn;

    holder.checkBoxs.push(checkBtn);

    if (checked.indexOf(group + "_" + key) > -1) {
        checkBtn.checked = true;
    }

    let checkLabel = createElement("label", {
        "class": "btn btn-outline-primary",
        "for": "btn_" + key
    });
    if (uiConfig.show_en) {
        checkLabel.innerText = key + "(" + info + ")";
    } else {
        checkLabel.innerText = key;
    }

    let checkBadge = createElement("span", {
        "class": "badge bg-secondary"
    });
    holder.checkBadge = checkBadge;
    let mW = myWeight[group + "_" + key];
    if (mW != null) {
        checkBadge.innerText = mW;
    } else {
        checkBadge.innerText = 0;
    }
    checkBtn.onclick = function () {
        if (checkBtn.checked && uiConfig.show_cp1) {
            copyToClip(getWeightInfo(group, key, info), false);
        }
        onTagCheckChange(group, key, checkBtn.checked);
        onTagsUiChange();
    };
    leftBtn.onclick = function () {
        onCheckBoxWeightChange(group, key, checkBtn, checkBadge, -1);
        if (checkBtn.checked && uiConfig.show_cp1) {
            copyToClip(getWeightInfo(group, key, info), false);
        }
    };
    rightBtn.onclick = function () {
        onCheckBoxWeightChange(group, key, checkBtn, checkBadge, 1);
        if (checkBtn.checked && uiConfig.show_cp1) {
            copyToClip(getWeightInfo(group, key, info), false);
        }
    };

    checkBtn.setAttribute("tagKey", key);
    checkBtn.setAttribute("tagValue", info);
    checkBtn.setAttribute("tagGroup", group);

    checkLabel.appendChild(checkBadge);
    groupLayout.appendChild(leftBtn);
    groupLayout.appendChild(checkBtn);
    groupLayout.appendChild(checkLabel);
    groupLayout.appendChild(rightBtn);

    if (uiConfig.show_del) {

        let delBtn = createElement("button", {
            "type": "button",
            "class": "btn btn-warning",
            "id": "btn_" + key + "_del"
        });
        delBtn.onclick = function () {
            onTagCheckChange(group, key, false);
            deleteTag(group, key);
            toast("重新加载后生效", 1000);

        };
        delBtn.innerText = "删除"
        groupLayout.appendChild(delBtn);
    }
    return groupLayout;
}


/**
 * 删除 tag
 * @param group
 * @param key
 */
function deleteTag(group, key) {
    let gData = allData[group];
    if (gData != null) {
        let kData = gData[key];
        if (kData != null) {
            Reflect.deleteProperty(gData, key);
            saveStorage(group, gData);
        }
    }
}


function getGroupAllCheck(group) {
    let data = getOrUiGroup(group);
    let checks = [];
    for (let k in data) {
        let kData = data[k];
        if (kData != null) {
            checks.push(kData.mainCheck);
        }
    }
    return checks;
}

function randGroupPlusOne(checks, group) {
    let opData = [];
    for (let i = 0; i < checks.length; i++) {
        let cb = checks[i];
        if (!cb.checked) {
            opData.push(cb);
        }
    }
    if (opData.length > 0) {
        let rnd = Math.floor(Math.random() * (opData.length));
        let checkBox= opData[rnd];
        let tagGroup = checkBox.getAttribute("tagGroup");
        let tagKey = checkBox.getAttribute("tagKey");
        onTagCheckChange(tagGroup,tagKey,true);
        checkBox.checked = true;
    }
}

function randGroupMinusOne(checks, group) {
    let opData = [];
    for (let i = 0; i < checks.length; i++) {
        let cb = checks[i];
        if (cb.checked) {
            opData.push(cb);
        }
    }
    if (opData.length > 0) {
        let rnd = Math.floor(Math.random() * (opData.length));
        let checkBox= opData[rnd];
        let tagGroup = checkBox.getAttribute("tagGroup");
        let tagKey = checkBox.getAttribute("tagKey");
        onTagCheckChange(tagGroup,tagKey,false);
        checkBox.checked = false;
    }

}

function randGroupPlus(group, num, refresh) {
    let checks = getGroupAllCheck(group);

    for (var i = 0; i < num; i++) {
        randGroupPlusOne(checks, group);
    }
    if (refresh !== false) {
        onTagsUiChange();
    }

}

function randGroupMinus(group, num, refresh) {
    let checks = getGroupAllCheck(group);
    for (var i = 0; i < num; i++) {
        randGroupMinusOne(checks, group);
    }
    if (refresh !== false) {
        onTagsUiChange();
    }
}

/**
 * 创建一个 tag 添加面板c
 * @param group
 * @returns {*}
 */
function createGroupAdd(group) {
    let div = createElement("div", {
        "class": "row"
    });
    let d3 = createElement("div", {
        "class": "input-group mb-3"
    });
    let tagNameInput = createElement("input", {
        "type": "text",
        "class": "form-control",
        "placeholder": "tag名字",
        "aria-label": "tag名字"
    })
    let tagValueInput = createElement("input", {
        "type": "text",
        "class": "form-control",
        "placeholder": "tag内容",
        "aria-label": "tag内容"
    })
    let btn = createElement("button", {
        "type": "button",
        "class": "btn btn-primary"
    });
    let rP = createElement("button", {
        "type": "button",
        "class": "btn btn-danger"
    });

    let rJ = createElement("button", {
        "type": "button",
        "class": "btn btn-success"
    });

    rP.onclick = function () {
        randGroupPlus(group, 1)
    }
    rJ.onclick = function () {
        randGroupMinus(group, 1)
    }


    rP.innerText = "随机+";
    rJ.innerText = "随机-";

    btn.innerText = "新增 tag"
    div.appendChild(d3);
    d3.appendChild(tagNameInput);
    d3.appendChild(tagValueInput);
    d3.appendChild(btn);

    d3.appendChild(rJ);
    d3.appendChild(rP);

    btn.onclick = function () {
        let key = tagNameInput.value;
        var gData = allData[group];
        if (gData == null && groupOrder.indexOf(group) > -1) {
            gData = {};
            allData[group] = {};
            console.log("fix bug")
        }
        if (key == null || key.length === 0) {
            window.alert("tag内容输入框 为空");
            return
        } else if (gData[key] != null) {
            window.alert("已经存在tag " + key);
            return
        }
        let value = tagValueInput.value
        if (value == null || value.length === 0) {
            window.alert("tag内容 为空");
            return
        }
        gData[key] = value;
        saveStorage(group, gData);
        toast("添加成功,重新加载页面后生效", 1000);

    }
    return div;
}

function createTagGroupLayout(group, groupData) {
    let layout = createElement("div", {
        "class": "container-sm"
    });
    let gadd = createGroupAdd(group);
    layout.appendChild(gadd);

    for (let key in groupData) {
        let info = groupData[key];
        let child = createTagBtnGroup(key, info, group);
        layout.appendChild(child)
    }
    return layout

}

function getAllCanRandomGroup() {
    let data = [];
    for (let g in allData) {
        if (!isMustGroup(g)) {
            data.push(g);
        }
    }
    return data;
}


function randomAllInc() {
    let all = getAllCanRandomGroup();
    forEachArray(all, function (p) {
        randGroupPlus(p, 1, false);
    })
    onTagsUiChange();
}

function randomAllDec() {
    let all = getAllCanRandomGroup();

    forEachArray(all, function (p) {
        randGroupMinus(p, 1, false);
    })
    onTagsUiChange();
}

function checkBoxCount(checks, check) {
    var count = 0;
    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked && check) {
            count++;
        } else if (!checks[i].checked && !check) {
            count++;
        }
    }
    return count;
}

function randomOneInc() {
    let toALL = getAllCanRandomGroup();
    let all = [];

    for (let i in toALL) {
        let g = toALL[i];
        let checks = getGroupAllCheck(g);
        console.log(toALL,"checks",checks);
        if (checkBoxCount(checks, false) > 0) {
            all.push(g);
        }
    }
    console.log(all);
    if (all.length <= 0) {
        return
    }
    let rnd = Math.floor(Math.random() * (all.length));
    randGroupPlus(all[rnd], 1);
}

function randomOneDec() {
    let toALL = getAllCanRandomGroup();
    let all = [];
    for (let i in toALL) {
        let g = toALL[i];
        let checks = getGroupAllCheck(g);
        if (checkBoxCount(checks, true) > 0) {
            all.push(g);
        }
    }
    if (all.length <= 0) {
        return
    }
    let rnd = Math.floor(Math.random() * (all.length));
    randGroupMinus(all[rnd], 1);
}

function initRandLayout() {
    let rAllInc = document.getElementById("btn_rnd1");
    let rAllDec = document.getElementById("btn_rnd2");
    let rOnInc = document.getElementById("btn_rnd3");
    let rOneInc = document.getElementById("btn_rnd4");
    rAllInc.onclick = randomAllInc;
    rAllDec.onclick = randomAllDec;
    rOnInc.onclick = randomOneInc;
    rOneInc.onclick = randomOneDec;
}

function createNavTab(navUl, navContent, tabName, active) {
    let li = createElement("li", {
        "class": "nav-item",
        "role": "presentation"
    });
    let btn = createElement("button", {
        "class": active ? "nav-link active" : "nav-link",
        "id": "tab-" + tabName,
        "data-bs-toggle": "tab",
        "data-bs-target": "#tab_" + tabName,
        "type": "button",
        "role": "tab",
        "aria-controls": "tab_" + tabName,
        "aria-selected": active ? "true" : "false"
    });
    btn.innerText = tabName;
    let tabContent = createElement("div", {
        "class": active ? "tab-pane fade show active" : "tab-pane fade",
        "id": "tab_" + tabName,
        "role": "tabpanel",
        "aria-labelledby": "tab-" + tabName
    });

    li.appendChild(btn);
    navUl.appendChild(li);
    navContent.appendChild(tabContent);

    return tabContent;
}


function resetFromCheckData() {
    let all = getAllCheckedInfo();

    for (let i in all) {
        let info = all[i];
        if (info.check) {
            let ua=uiElements[info.gk];
            if(ua!=null){
                let ma=  uiElements[info.gk].mainCheck;
                if(ma!=null){
                    ma.checked=true;
                }
            }

        }
    }
}

function resetFromMustData() {
    let allG = getAllMustGroup();
    for (let g in allG) {
        let gData = allG[g];
        for (let k in gData) {
            onTagCheckChange(g, k, true);
            getOrPutUiGP(g, k).mainCheck.checked = true;
        }
    }
}

function resetALlCheckBox() {
    let checkBoxs = getStandardTagCheck()
    for (var i = 0; i < checkBoxs.length; i++) {
        var cb = checkBoxs[i];
        let info = cb.getAttribute("tagKey");
        var g = cb.getAttribute("tagGroup");
        if (g != null && info != null) {
            cb.checked = false;
        }
    }
}

function resetCheck(resetAll, restMust) {
    resetALlCheckBox();
    if (restMust) {
        return
    }
    if (!resetAll) {
        resetFromCheckData();
    }
    resetFromMustData();
    // var checked = localStorage.getItem("checked_data")
    // if (checked == null) {
    //     checked = [];
    // }
    // let checkBoxs = getStandardTagCheck()
    // for (var i = 0; i < checkBoxs.length; i++) {
    //     var cb = checkBoxs[i];
    //     let info = cb.getAttribute("tagKey");
    //     var g = cb.getAttribute("tagGroup");
    //     if (g != null && info != null && (!(checked.indexOf(g + "_" + info) > -1) || resetAll)) {
    //         if (restMust === true) {
    //             cb.checked = false;
    //         } else {
    //             cb.checked = isMustGroup(g);
    //         }
    //     }
    // }

    if (resetAll) {
        myWeight = [];
    }
    onTagsUiChange();
}

function loadLocalStorage(key) {
    var s = localStorage.getItem(key);
    if (s != null) {
        var pData = JSON.parse(s)
        return pData;
    }
    return null;
}

function loadStorage(key, groupData) {
    var s = localStorage.getItem(key);
    if (s != null) {
        var pData = JSON.parse(s)

        for (let p in pData) {
            let pValue = pData[p];
            groupData[p] = pValue;
        }
    }
}

function saveStorage(key, value) {
    asyncStorage(key, value).then(result => {
    })
}

async function asyncStorage(key, value) {
    var s = JSON.stringify(value);
    localStorage.setItem(key, s);
}

function clearStorage() {
    localStorage.clear()
}

function saveUiConfig() {
    saveStorage("uiConfig", uiConfig);
}

async function loadUiConfig() {
    let s = localStorage.getItem("uiConfig");
    if (s != null) {
        var pData = JSON.parse(s);
        for (let p in pData) {
            let pValue = pData[p];
            uiConfig[p] = pValue;
        }
    }
}

async function loadCheckConfig() {
    let x = localStorage.getItem("checked_data")
    if (x != null) {
        checked = JSON.parse(x);
    }
    if (checked == null) {
        checked = [];
    }
    for (let i in checked) {
        let gk = checked[i];
        onTagCheckChangeByLabel(gk, true);
    }
}

async function loadWeightConfig() {
    loadStorage("myWeight", myWeight);
}

async function loadLocalGroupConfig() {
    let allG = {};
    let s = localStorage.getItem("groupOrder");

    if (s != null) {
        let gOr = JSON.parse(s);
        if (gOr != null) {
            for (let i in gOr) {
                let g = gOr[i];
                allG[g] = true;
            }
        }

    }
    for (let group in allData) {
        allG[group] = true;
    }
    for (let group in allG) {
        var value = allData[group];
        if (value == null) {
            value = {};
            allData[group] = value;
        }
        loadStorage(group, value);
    }

}

let checkedInfo = [];

function getOrPutCheckedInfoByLabel(gk) {
    for (let i in checkedInfo) {
        let info = checkedInfo[i];
        if (info.gk === gk) {
            return info;
        }
    }
    let newInfo = checkedInfo.push({
        "gk": gk
    })
    return newInfo;
}

function getAllCheckedInfo() {
    let checked = [];
    for (let i in checkedInfo) {
        let info = checkedInfo[i];
        if (info.check) {
            checked.push(info);
        }
    }
    return checked;
}

function getAllCheckedInfoGk() {
    let checked = [];
    for (let i in checkedInfo) {
        let info = checkedInfo[i];
        if (info.check) {
            checked.push(info.gk);
        }
    }
    return checked;
}


function onTagCheckChange(group, key, check) {
    onTagCheckChangeByLabel(group + "_" + key, check)
}

function onTagCheckChangeByLabel(gk, check) {
    //TODO 优化性能，不需要遍历两次
    getOrPutCheckedInfoByLabel(gk);
    let newChek = [];

    for (let i in checkedInfo) {
        let info = checkedInfo[i];
        if (info.gk != null) {
            if (info.gk === gk) {
                info.check = check;
            } else {
                newChek.push(info)
            }
        }
    }
    if (!check) {
        checkedInfo = newChek;
    }
}

function saveChecked() {
    var checked = getAllCheckedInfoGk();
    // let checkBoxs = getStandardTagCheck()
    // for (var i = 0; i < checkBoxs.length; i++) {
    //     let tagCbUi = checkBoxs[i];
    //     let tagKey = tagCbUi.getAttribute("tagKey");
    //     let tagGroup = tagCbUi.getAttribute("tagGroup");
    //     if (tagKey != null && tagGroup != null && tagCbUi.checked) {
    //         checked.push(tagGroup + "_" + tagKey);
    //     }
    // }
    saveStorage("checked_data", checked);
    saveStorage("myWeight", myWeight);


}

async function loadGroupOrder() {
    let s = localStorage.getItem("groupOrder");
    if (s != null) {
        groupOrder = JSON.parse(s);
    }
    if (groupOrder == null || groupOrder.length === 0) {
        groupOrder = [];
        for (let p in allData) {
            groupOrder.push(p);
        }
    }
}

function clearGroupOrder() {
    groupOrder = [];
    saveGroupOrder([]);
}

function saveGroupOrder(order) {
    for (let i in order) {
        let p = order[i];
        let data = allData[p];
        if (data == null) {
            allData[p] = {};
            saveStorage(p, {});
        }
    }
    saveStorage("groupOrder", order);
}

async function loadNegDat() {

    for (let i in groupOrder) {
        let n = groupOrder[i];
        if (n.startsWith("负面")) {
            if (!isNegativeGroup(n)) {
                diyNeg.push(n)
            }
        }
    }
}

async function loadLocalData() {
    await loadUiConfig();
    await loadCheckConfig();
    await loadWeightConfig();
    await loadLocalGroupConfig();
    await loadGroupOrder();
    await checkGroupData();
    await loadNegDat();
    await parseMagicBook();
}

async function checkGroupData() {
    let kSet = {};
    let vKet = {};
    for (let g in allData) {
        let gData = allData[g];
        for (let key in gData) {
            let value = gData[key];
            let aKeyGroup = kSet[key];
            if (aKeyGroup != null) {
                console.log("重复的 key " + g + ":" + key + " 与 " + aKeyGroup + ":" + key);
            } else {
                kSet[key] = g;
            }
            let aValueGroup = vKet[value];
            if (aValueGroup != null) {
                console.log("重复的 value " + g + ":" + value + " 与 " + aValueGroup + ":" + value);
            } else {
                vKet[value] = g;
            }
        }
    }
}

async function clearLocal() {
    localStorage.clear();
}

function configUiCtrlElement(name) {
    var ctrl1 = document.getElementById(name)
    ctrl1.checked = uiConfig[name];
    ctrl1.onclick = function () {
        uiConfig[name] = ctrl1.checked;
        saveUiConfig();
        toast("点击重新加载后生效", 2000);
    };
}


function modifyGroupData() {
    let data = document.getElementById("textera_group").value;
    if (data == null || data.length === 0) {
        toast("请输入合理的分组列表顺序", 2000);
        return
    }
    let groups = data.split(",")
    if (groups == null || groups.length === 0) {
        toast("请输入合理的分组列表顺序", 2000);
        return
    }
    if (data.indexOf("，") > -1) {
        toast("请不要使用中文逗号", 2000);
        return
    }
    if (data.indexOf(" ") > -1) {
        toast("请不要使用空格，使用英文逗号分割", 2000);
        return
    }
    let st = [];
    for (let i in groups) {
        let key = groups[i];
        if (key != null && key.trim().length > 0) {
            if (st.indexOf(key) > -1) {
                toast("存在相同分组 " + key, 2000);
                return;
            } else {
                st.push(key);
            }
            let groupData = groups[i];
            if (groupData == null && !(key.startsWith("m"))) {
                toast("新增的自定义分组 " + key + " 没有以m开头,或者不要修改当前已有的分组名", 3000);
                return;
            }
        }

    }
    groupOrder = st;
    saveGroupOrder(st);
    toast("保存分组顺序成功,重新加载页面后生效", 2000);
}

function getOrUiGroup(group) {
    let uiMap = uiElements["uiMap"];
    var groupData = uiMap[group];
    if (groupData == null) {
        groupData = {};
        uiMap[group] = groupData;
    }
    return groupData;
}

function getOrPutUiGP(group, key) {
    let uiMap = uiElements["uiMap"];
    var groupData = uiMap[group];
    if (groupData == null) {
        groupData = {};
        uiMap[group] = groupData;
    }
    var keyData = groupData[key];
    if (keyData == null) {
        keyData = {
            "checkBoxs": []
        }
        groupData[key] = keyData;
    }
    uiElements[group + "_" + key] = keyData;
    return keyData
}

function forEachArray(array, call) {
    for (var i = 0; i < array.length; i++) {
        var data = array[i];
        call(data);
    }
}

function tryRemoveFromParent(child) {
    let parent = child.parentNode;
    if (parent != null) {
        parent.removeChild(child);
    }
}

function createSelectedBtn(group, key, danger) {
    let text = group + ":" + key
    let btn = createElement("button", {
        "type": "button",
        "class": danger ? "btn btn-warning btn-sm" : "btn btn-primary btn-sm",
        "tagKey": key
    });
    btn.innerText = text;
    getOrPutUiGP(group, key).quickBtn = btn;


    btn.onclick = function () {
        let uiData = getOrPutUiGP(group, key)
        let childChecks = uiData.checkBoxs;
        forEachArray(childChecks, function (cb) {
            cb.checked = false;
        })
        uiData.quickBtn = null;
        tryRemoveFromParent(btn);
        onTagCheckChange(group, key, false);
        onTagsUiChange();
    }
    return btn;
}


function tryAddBatch(group, text) {
    let lines = text.split(/[\n]/)
    var count = 0;

    let gData = allData[group];
    let splitChar = getSplitChar();
    if (gData != null) {

        for (let i in lines) {
            let line = lines[i];

            let data = line.split(splitChar);
            console.log(line, data);
            if (data != null && data.length === 2) {
                let k = data[0];
                let v = data[1];
                if (k != null && v != null) {
                    if (gData[k] == null) {
                        gData[k] = v;
                        count++;
                    }
                }
            }
        }
        saveStorage(group, gData);
    }
    toast("批量添加 " + count + " 条数据，重新加载页面生效", 2000)

}

function getSplitChar() {
    let splitSelect = document.getElementById("batch_group_select_split");
    return splitSelect.options[splitSelect.selectedIndex].value
}

function getBatchSelectGroup() {
    let inputSelect = document.getElementById("batch_group_select");
    return inputSelect.options[inputSelect.selectedIndex].value;
}


function printBatchTag(group, textArea) {
    let toData = [];
    let spc = getSplitChar();

    let storageData = allData[group];
    console.log(storageData);
    for (let key in storageData) {
        let value = storageData[key];
        if (key != null && value != null) {
            toData.push(key + spc + value)
        }
    }
    let cpData = toData.join("\n");
    textArea.value = cpData;
    toast("分组 " + group + "的数据已经 拷贝到粘贴板", 2000);
}

function getSelectBook() {
    let splitSelect = document.getElementById("magic_book_select");
    return splitSelect.options[splitSelect.selectedIndex].value
}

function initMagicBookGroup() {
    let bookNames = getMagicBookNames();
    let inputBtn = document.getElementById("magic_book_text_import");
    let disableBtn = document.getElementById("magic_book_text_disable");
    let inputSelect = document.getElementById("magic_book_select");
    var sle = true;
    for (let i in bookNames) {
        let bookName = bookNames[i];
        let optionEle = createElement("option", {
            "value": bookName
        })

        optionEle.innerText = bookName;
        if (sle) {
            optionEle.selected = true
            sle = false;
        }
        inputSelect.appendChild(optionEle);
    }
    inputBtn.onclick = function () {
        let book = getSelectBook();
        uiConfig.select_magic = book
        saveUiConfig();
        resetCheck(true, true);
        toast("加载魔法书 " + book + " 成功，重新加载后生效", 2000);
    }
    disableBtn.onclick = function () {
        uiConfig.select_magic = "";
        saveUiConfig();
        resetCheck(true, true);
        toast("已经禁用魔法书,重新加载后生效", 2000);
    }
}

function initBatchGroup() {
    let inputSelect = document.getElementById("batch_group_select");
    let inputText = document.getElementById("batch_group_text");
    let inputBtn = document.getElementById("batch_group_btn");
    let inputPrint = document.getElementById("batch_group_print");
    var sle = true;
    for (var i = groupOrder.length - 1; i > 0; i--) {
        let group = groupOrder[i];
        if (group != null) {
            let optionEle = createElement("option", {
                "value": group
            })

            optionEle.innerText = group;
            if (sle) {
                optionEle.selected = true
                sle = false;
            }
            inputSelect.appendChild(optionEle);
        }
    }
    inputBtn.onclick = function () {
        tryAddBatch(getBatchSelectGroup(), inputText.value);
    }
    inputPrint.onclick = function () {
        printBatchTag(getBatchSelectGroup(), inputText);
    }
}


function formatMagicStr(str) {
    return str.replace("-", " ").replace("_", " ")
}

function fillMagic(group, from, to, weights) {

    for (let i in from) {
        let k = from[i];
        let format = formatMagicStr(k)
        let w = weights[k];
        var tran = translate[format];
        if (tran == null) {
            tran = k;
        }
        if (w != null) {
            myWeight[group + "_" + tran] = w;
        }
        to[tran] = k;
    }
}

let magicBooksOrder = [];

function getMagicBookNames() {
    let names = [];
    for (let i in magicBooks) {
        let magicBook = magicBooks[i];
        names.push(magicBook.name);
    }
    return names;
}

var currentMagic = null;

function showTipsInfo(text) {
    document.getElementById("textera_holder").value = text;
}

async function parseMagicBook() {

    let selectBook = uiConfig.select_magic;
    var magicBook = null;
    for (let i in magicBooks) {
        let book = magicBooks[i];
        if (book.name === selectBook) {
            magicBook = book;
            break;
        }
    }
    if (magicBook == null) {
        return;
    }
    currentMagic = magicBook;


    let posx = {};
    let negx = {};
    let gKey = "魔法书-" + magicBook.name
    let pG = gKey + "-正"
    let nG = gKey + "-负"
    fillMagic(pG, magicBook.pos, posx, magicBook.weight)
    fillMagic(nG, magicBook.neg, negx, magicBook.weight)

    allData[pG] = posx;
    allData[nG] = negx;
    innerNeg = [];
    innerMust = [];
    innerNeg.push(nG);
    innerMust.push(pG);
    innerMust.push(nG);
    magicBooksOrder.push(pG);
    magicBooksOrder.push(nG);
    console.log(innerNeg, innerMust);
}


function initTopAlert(){
    var alert=document.getElementById("top_alert");
    alert.onclick=function (){
        localStorage.setItem("magic_version",MAGIC_VERSION);
        alert.hidden=true;
    }
    let now=localStorage.getItem("magic_version");
    if(now!==MAGIC_VERSION){
        alert.hidden=false;
    }else{
        alert.hidden=true;
    }
    alert.innerHTML+="更新日志,当前版本为 "+MAGIC_VERSION+" 每次更新或者清除本地缓存后显示该页面，点击该文本后不再显示"+"<br/>";
    for(let version in updateLog){
        let versionLog=updateLog[version];
        alert.innerHTML+=""+version+" 版本更新 :"+"<br/>";
        for(let i in versionLog){
            let log =versionLog[i];
            alert.innerHTML+=log+"<br/>";
        }
    }
}

function parseAll() {
    let navUi = document.getElementById("myTab");
    let navContent = document.getElementById("myTabContent");

    var active = true;

    let groups = [];
    for (let i in groupOrder) {
        groups.push(groupOrder[i]);
    }
    for (let i in magicBooksOrder) {
        groups.push(magicBooksOrder[i]);
    }

    if (currentMagic != null) {
        showTipsInfo("手动设置参数 " + currentMagic.option + " \n正式开启魔法书 " + currentMagic.name + " 正面tag和负面tag 会全面替换");
    }

    for (let i in groups) {

        let group = groups[i];
        if (group != null) {
            let tab = createNavTab(navUi, navContent, group, active);
            active = false;

            let layout = createTagGroupLayout(group, allData[group]);

            tab.appendChild(layout);
        }

    }
    resetCheck(false);
    initTopAlert();
    configUiCtrlElement("show_numq");
    configUiCtrlElement("show_yuan");
    configUiCtrlElement("show_en");
    configUiCtrlElement("show_del");
    configUiCtrlElement("show_cp1");
    configUiCtrlElement("show_autocp");
    initBatchGroup();
    initMagicBookGroup();
    document.getElementById("selected_btn_div");

    document.getElementById("textera_group").value = groupOrder.join(",");
    document.getElementById("btn_group_reset").onclick = function () {
        clearGroupOrder();
        toast("重新加载页面后生效", 2000);
    }
    document.getElementById("btn_group_modify").onclick = modifyGroupData;
    document.getElementById("btn_reset_all").onclick = function () {
        resetCheck(true, true);
    };

    document.getElementById("textarea_pos").onclick = function () {
        copyToClip(document.getElementById("textarea_pos").value)
    };
    document.getElementById("textarea_neg").onclick = function () {
        copyToClip(document.getElementById("textarea_neg").value)
    };
    document.getElementById("btn_reset").onclick = function () {
        resetCheck(true);
    };
    document.getElementById("btn_reload").onclick = function () {
        location.reload();
    };
    document.getElementById("btn_clear").onclick = function () {
        let confirm = window.confirm("删除本地存储可以解决大部分bug，但是意味着分组顺序以及添加tag会被清空")
        if (confirm) {
            clearLocal().then(function (p) {
                location.reload();
            })
        }


    };
    initRandLayout();
    onTagsUiChange();
}


window.onload = function () {
    loadLocalData().then(p => {
        parseAll();
        // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    })
};