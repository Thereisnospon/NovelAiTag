

function setToPromptNeg(id) {


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
            if (window.novelAi_inject_neg != null) {
                setNativeValue(tags[0],window.novelAi_inject_neg)
            }

        }
    }

}
function setNativeValue(element, value) {
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: value,
        dataTransfer: null,
        isComposing: false
    });
    element.value = value;
    element.dispatchEvent(evt);
}
setToPromptNeg("txt2img_neg_prompt")
setToPromptNeg("img2img_neg_prompt")
window.novelAi_inject_neg=null;