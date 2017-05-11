//custom events section

//This function is specified in the walmart config file and is needed only for walmart
function backToMainMenuEvent() {
    homeEventHandler("returnIntro");
}

function myEvent(onscreenElementIndex) {
    var video;
    var date = new Date().getDay();
    if (date != 4) { //on every day except thursday
        defaultEventHandler(onscreenElementIndex);
        return;
    } else {     
        video = "topQuestions"
    }
    loadNewVideo(video, true);
    $("#myPlayerIDContainer").css("display", "block");
    $("#myPlayerID2Container").css("display", "none");
    waitSequenceShowing = false;
}
