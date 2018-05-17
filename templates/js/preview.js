let zoomer;
let switcher;
let sendStatus;
let settings;

let previewStatus = {
    page: 1,
    pageStatus: {}
}

function saveStatus() {
    if (sendStatus && switcher.current) {
        previewStatus.page = switcher.current;
        previewStatus.pageStatus[switcher.current] = zoomer.status
        let status = JSON.stringify(previewStatus);
        // console.log("save status: " + status);
        sendStatus.attributes["href"].value = 'command:plantuml.previewStatus?' + encodeURIComponent(status);
        sendStatus.click();
    }
}
window.addEventListener("load", () => {

    let status = undefined;
    try {
        status = JSON.parse(document.getElementById("status").innerHTML);
    } catch (error) {
        // console.log("parse preview status error:", error.message);
        status = undefined;
    }
    settings = JSON.parse(document.getElementById("settings").innerHTML);

    let hasError = !!document.getElementById("errtxt").innerText.trim();
    if (!hasError)
        document.getElementById("error-warning").style.display = "none";
    if (!settings.showSpinner)
        document.getElementById("spinner-container").remove();

    switcher = new Switcher();
    let imgErr = document.getElementById("image-error");
    if (!switcher.images.length && hasError) {
        switcher.images = [imgErr.currentSrc];
        // reset status if error image
        status = undefined;
    }
    if (switcher.images.length) {
        if (status) previewStatus = status;
        document.getElementById("image-container").style.margin = "0";
        sendStatus = document.getElementById("sendStatus");
        zoomer = new Zoom(settings.zoomUpperLimit);
        switcher.moveTo(previewStatus.page);
        addCursorManager();
        addSelectionBox();
    } else {
        document.getElementById("ctrl-container").remove();
        document.getElementById("image-container").remove();
    }
});
window.addEventListener("resize", () => {
    previewStatus.pageStatus = {};
    saveStatus();
});