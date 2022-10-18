
function setToPromptNeg(id) {


    let apps = document.getElementsByTagName("gradio-app");
    console.log("s0");
    if (apps == null || apps.length <= 0) {
        return
    }
    console.log("s02");
    let app = apps[0];
    if (app == null) {
        return;
    }
    console.log("s03");
    let shadowRoot = app.shadowRoot;
    if (shadowRoot == null) {
        return;
    }
    console.log("s04");
    let promptDiv = shadowRoot.getElementById(id);
    if (promptDiv != null) {
        console.log("s05");
        let tags = promptDiv.getElementsByTagName("textarea")
        if (tags != null && tags.length === 1) {
            console.log("s06");
            if (window.novelAi_inject_neg != null) {
                tags[0].value = window.novelAi_inject_neg;
                console.log("s07");
            }

        }
    }

}

setToPromptNeg("txt2img_neg_prompt")
setToPromptNeg("img2img_neg_prompt")
window.novelAi_inject_neg=null;