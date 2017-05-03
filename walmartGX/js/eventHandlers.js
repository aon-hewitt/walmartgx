//custom events section

function backToMainMenuEvent() {
    homeEventHandler("returnIntro");
}

// This event is specified in the config file
function showSlideInfo(slide) {
    if (slide == 1) {
        $('#slideInfo').toggle("slide", { direction: "right" }, 400);
        myPlayer.pause();
        saveCCStatePlayer1(); // required only on the intro video sice textTrackToShow has not yet been saved in loadNewVideo(). On all subsequent videos this call is not needed.

    } else if (slide == 2) {
        $('#slideInfo2').toggle("slide", { direction: "right" }, 400);
        myPlayer2.pause();
        saveCCStatePlayer1(); // required only on the intro video sice textTrackToShow has not yet been saved in loadNewVideo(). On all subsequent videos this call is not needed.

    }
}

//This event is specified in the slideInfo.html file
function dismissSlideInfo() {
    $('#slideInfo').toggle("slide", { direction: "right" }, 400);
    myPlayer.play();
}
function dismissSlideInfo2() {
    $('#slideInfo2').toggle("slide", { direction: "right" }, 400);
    myPlayer2.play();
}
