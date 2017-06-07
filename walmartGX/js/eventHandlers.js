//custom events section

//This function is specified in the walmart config file and is needed only for walmart to handle 'back to main menu' hotspot
function backToMainMenuEvent() {
    homeEventHandler("returnIntro");
}

//This function is an example of a custom event handler. It can replace a default behavior and sends the user to topQuestions every thursday.
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
    waitSequenceShowing = false;
}
