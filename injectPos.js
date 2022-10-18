function setToPromptPos(id) {


    let apps = document.getElementsByTagName("gradio-app");
    if (apps == null || apps.length <= 0) {
        return
    }
    let app = apps[0];
    if (app == null) {
        return;
    }
    let shadowRoot = app.shadowRoot;
    if (shadowRoot == null) {
        return;
    }
    let promptDiv = shadowRoot.getElementById(id);
    if (promptDiv != null) {
        let tags = promptDiv.getElementsByTagName("textarea")
        if (tags != null && tags.length === 1) {
            if (window.novelAi_inject_pos != null) {
                tags[0].value = window.novelAi_inject_pos;
            }

        }
    }

}

setToPromptPos("txt2img_prompt")
setToPromptPos("img2img_prompt")
window.novelAi_inject_pos = null;
