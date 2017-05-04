//custom events section

function backToMainMenuEvent() {
    homeEventHandler("returnIntro");
}

// This event is specified in the config file
function showSlideInfo(slide) {
    if (slide == 1) {
        $('#slideInfo').toggle("slide", { direction: "right" }, 400);
        myPlayer.pause(); //no call to save cc state is needed here since we save it on pause event

       
    } else if (slide == 2) {
        $('#slideInfo2').toggle("slide", { direction: "right" }, 400);
        myPlayer2.pause(); //no call to save cc state is needed here since we save it on pause event
             
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
