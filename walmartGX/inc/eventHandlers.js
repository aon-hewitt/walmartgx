//custom events section
function question6_element1() {
    //loadNewVideo(config.videos[config.currentVideoIndex].onscreenElements[1].defaultAction.jumpToName, true);
    //assignWeights(config.videos[config.currentVideoIndex].onscreenElements[1].defaultAction.weightings);

    loadNewVideo("question8", true);
    assignWeights([10, 1, 0, 0, 0, 0, 0]);

}
function question6_element2() {
    loadNewVideo(config.videos[config.currentVideoIndex].onscreenElements[2].defaultAction.jumpToName, true);
    assignWeights(config.videos[config.currentVideoIndex].onscreenElements[2].defaultAction.weightings);
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