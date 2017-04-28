//custom events section

function backToMainMenuEvent() {
    
    homeEventHandler("returnIntro");
}
// This event is specified in the config file
function showSlideInfo(slide) {

    if (slide == 1) {
        $('#slideInfo').toggle("slide", { direction: "right" }, 400);
        myPlayer.pause();
    } else if (slide == 2) {
        $('#slideInfo2').toggle("slide", { direction: "right" }, 400);
        myPlayer2.pause();

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

function takeAction() {
    alert("Taking Action");
}


//end custom events section