var myPlayer = videojs("myPlayerID");
var myPlayer2 = videojs("myPlayerID2");
var config = {};
var configs = [];
var waitSequenceShowing = false;
var waitSequenceVideoId;
var waitSequenceName;

var repositoryId = "a657fd8fced304aeb5cc";
var branchId = "e107b525b507b9d33a23";
var nodeId = "1f89a17e1845bc71d945"; // Walmart

var config1 = {
    "clientKey": "ac8a94d2-05d0-4d03-919d-52408a8f9c06",
    "clientSecret": "wn7qJcPQVucXl3IrtJpPfmX7sfJORbAdA9DL/0wEjvcYU5g3Qzu4lKSTZKjHrI+iMOqUSC5aPoSkazluD+i95vuLVSjBtzYm3y2296ESC6Y=",
    "username": "0e2b89b9-115d-4dd8-be07-7fd662b94ba7",
    "password": "sY12fxj9bpSD+aUuDnIJHZ90E4F8fDrRXUXBwFN5CMNo48L3K5oJxTDPEKX9jlqQXTHWWkf6GZWPMdEBYF81ETVmUEVwfC+4n4XXuARfKyM=",
    "baseURL": "https://api.cloudcms.com",
    "application": "4db40e414e0888fe688d"
}

Gitana.connect(config1, function (err) {
    if (err) {
        console.log(err);
    }
}).then(function () {
    this.readRepository(repositoryId).then(function () {
        this.readBranch(branchId).then(function () {
            this.readNode(nodeId).then(function () {
                config = JSON.parse(JSON.stringify(this));
                loadNewVideo(config.startVideoName, false);
            });
        });
    });
});

 //Pulling data from local file
//$.ajax({
//    url: "data/walmart.json",
//    type: "get",
//    success: function (result) {
//        //config = JSON.parse(result); hosting on iis does not require parsing
//        config = result;
//        loadNewVideo(config.startVideoName, false);
//    }
//});

videojs("myPlayerID").ready(function () {
    myPlayer.on("ended", function () {
        if (config.videos[config.currentVideoIndex].endBehavior != undefined) {
            $("#myPlayerIDContainer").css("display", "none");
            $("#myPlayerID2Container").css("display", "block");
            myPlayer2.play();
            myPlayer.pause();
            waitSequenceShowing = true;
        } else {
            //myPlayer.pause(); //pause the player if no endbehavior is specified
        }
    })
    myPlayer.on("loadedmetadata", function () {
        loadWaitSequence(waitSequenceVideoId, waitSequenceName, false);
        myPlayer.play();
        myPlayer2.pause();
        $("#myPlayerIDContainer").css("display", "block");//test these
        $("#myPlayerID2Container").css("display", "none");//test these
        waitSequenceShowing = false;//tst this
        for (var i = 0; i < config.videos.length; i++) {           
        }        
        $("#slideInfo").load("inc/" + config.videos[config.currentVideoIndex].name + ".html");
        $("#slideInfo2").load("inc/" + config.videos[config.currentVideoIndex + 1].name + ".html");
    });
});

videojs("myPlayerID2").ready(function () {
    myPlayer2.on("ended", function () {
        myPlayer2.currentTime(0);
        myPlayer2.play();
    })

    myPlayer2.on("loadedmetadata", function () {
        myPlayer2.pause();       
    });
});

//Any element without an event specified will be handled here using properties specified in config.
function defaultEventHandler(onscreenElementIndex) {
    if (waitSequenceShowing) {
        var adjuster = 1;
    } else {
        adjuster = 0;
    }

    if (config.videos[config.currentVideoIndex + adjuster].onscreenElements[onscreenElementIndex].defaultAction.jumpToName != undefined) {
        loadNewVideo(config.videos[config.currentVideoIndex + adjuster].onscreenElements[onscreenElementIndex].defaultAction.jumpToName, true);
        $("#myPlayerIDContainer").css("display", "block");
        $("#myPlayerID2Container").css("display", "none");
        waitSequenceShowing = false;
        assignWeights(config.videos[config.currentVideoIndex + adjuster].onscreenElements[onscreenElementIndex].defaultAction.weightings);
        //if (config.videos[config.currentVideoIndex].onscreenElements[onscreenElementIndex].lastQuestion) {
        //}
    }
}

//this external file will handle the custom eventHandlers functions for questions with an event handler specified in config.
$.getScript("js/eventHandlers.js", function (data, textStatus, jqxhr) {
});

//this external file will handle the showResults function
$.getScript("js/processResults.js", function (data, textStatus, jqxhr) {
});

function home() {
    location.reload();
}

function skip() {
    if (config.videos[config.currentVideoIndex].skipIntro && (myPlayer.currentTime() < config.videos[config.currentVideoIndex].skipIntro)) {
        myPlayer.currentTime(config.videos[config.currentVideoIndex].skipIntro)
    }
}

function back() {
    config = JSON.parse(configs.pop());
    if (config.videos[config.currentVideoIndex].name == config.startVideoName) { //First video starting - reset voteBucket values to 0
    }
    try {
        loadNewVideo(config.videos[config.currentVideoIndex].name, false);
    } catch (err) {
        console.log("Error loading video");
    }
}

function assignWeights(array) {
    for (var i = 0; i < config.recommendations.length; i++) {
        config.recommendations[i].voteBucket += array[i];
    }
}

function loadNewVideo(videoId, saveThis) {
    if (saveThis) { // first determine if this is a valid 'historical' config state
        //now determine if this is a wait sequence video. If it is set the currentVideoIndex to the base video. Only base video indices should be stored in the history, not wait sequence videos
        if (config.videos[config.currentVideoIndex].waitSequence) {
            config.currentVideoIndex--;
        }
        configs.push(JSON.stringify(config));
    }

    //The following do/while loop translates the name passed in to the brightcove id pertaining to that video name. This allows one video to be used for many questions/answers. Name based rather than brightcoveid based
    var iterator = 0
    do {
        if (config.videos[iterator].name == videoId) {
            videoId = config.videos[iterator].brightcoveId; //at this point videoID turns back into a number
            var name = config.videos[iterator].name
        }
        iterator++;
    }
    while (iterator < config.videos.length);

    //now do a similar process for obtaining the brightcove id of the wait sequence for this video. Use it to load the wait sequence player
    var iterator1 = 0
    do {
        if (config.videos[iterator1].name == name + "_wait") {
            waitSequenceVideoId = config.videos[iterator1].brightcoveId; //at this point videoID turns back into a number
            waitSequenceName = config.videos[iterator1].name;
        }
        iterator1++;
    }
    while (iterator1 < config.videos.length);
    myPlayer.catalog.getVideo(videoId, function (error, video) {
        //deal with error
        makeVideoOverlay(name);
        myPlayer.catalog.load(video);
    });
}

function makeVideoOverlay(videoId) {
    //set global json properties
    var videoOverlayObject = {};
    videoOverlayObject.overlay = {};
    myPlayer.overlay(null);
    myPlayer2.overlay(null);//see if this clears out the overlay
    videoOverlayObject.overlay.content = "";
    videoOverlayObject.overlay.overlays = [];
    //now create the overlay properties
    for (var i = 0; i < config.videos.length; i++) { //find the current video object in the config object
        if (config.videos[i].name == videoId) {
            config.currentVideoIndex = i;
            for (var j = 0; j < config.videos[i].onscreenElements.length; j++) { // cycle through the onscreenElements array and build an overly for each
                videoOverlayObject.overlay.overlays[j] = {};
                videoOverlayObject.overlay.overlays[j].align = config.videos[i].onscreenElements[j].align;
                if (config.videos[i].onscreenElements[j].event != undefined) {
                    videoOverlayObject.overlay.overlays[j].content = "<span class='" + config.videos[i].onscreenElements[j].class + "' onclick='" + config.videos[i].onscreenElements[j].event + "()'>" + config.videos[i].onscreenElements[j].content + "</span>";
                } else {
                    videoOverlayObject.overlay.overlays[j].content = "<span class='" + config.videos[i].onscreenElements[j].class + "' onclick='defaultEventHandler(" + j + ")'>" + config.videos[i].onscreenElements[j].content + "</span>";
                }
                videoOverlayObject.overlay.overlays[j].start = config.videos[i].onscreenElements[j].start;
                videoOverlayObject.overlay.overlays[j].end = config.videos[i].onscreenElements[j].end;
            }
            //now add the menubar overlay to every page
            var navBar = {};
            navBar.align = "bottom-left";
            navBar.content = "<span onclick='" + config.homeVideoEvent + "()'><i class='fa fa-2x " + config.homeVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.skipVideoEvent + "()'><i class='fa fa-2x " + config.skipVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.backVideoEvent + "()'><i class='fa fa-2x " + config.backVideoIcon + " text-primary sr-icons'></i></span>" + "<span onclick='" + config.infoVideoEvent + "(1)'><i class='fa fa-2x " + config.infoVideoIcon + " text-primary sr-icons'></i></span>";
            navBar.start = 0;
            navBar.end = config.videos[config.currentVideoIndex].duration;
            videoOverlayObject.overlay.overlays.push(navBar);
            myPlayer.overlay(videoOverlayObject.overlay);
            return;
        }
    }
}

function loadWaitSequence(videoId, name) {
    myPlayer2.catalog.getVideo(videoId, function (error, video) {
        //deal with error
        makeVideoOverlayWait(name);
        myPlayer2.catalog.load(video);

    });
}

function makeVideoOverlayWait(videoName) {
    var videoOverlayObject = {};
    videoOverlayObject.overlay = {};
    myPlayer2.overlay(videoOverlayObject.overlay);//see if this clears out the overlay
    videoOverlayObject.overlay.content = "";
    videoOverlayObject.overlay.overlays = [];

    //now create the overlay properties
    for (var i = 0; i < config.videos.length; i++) { //find the current video object in the config object
        if (config.videos[i].name == videoName) {
            for (var j = 0; j < config.videos[i].onscreenElements.length; j++) { // cycle through the onscreenElements array and build an overly for each
                videoOverlayObject.overlay.overlays[j] = {};
                videoOverlayObject.overlay.overlays[j].align = config.videos[i].onscreenElements[j].align;
                if (config.videos[i].onscreenElements[j].event != undefined) {
                    videoOverlayObject.overlay.overlays[j].content = "<span class='" + config.videos[i].onscreenElements[j].class + "' onclick='" + config.videos[i].onscreenElements[j].event + "()'>" + config.videos[i].onscreenElements[j].content + "</span>";
                } else {
                    videoOverlayObject.overlay.overlays[j].content = "<span class='" + config.videos[i].onscreenElements[j].class + "' onclick='defaultEventHandler(" + j + ")'>" + config.videos[i].onscreenElements[j].content + "</span>";
                }
                videoOverlayObject.overlay.overlays[j].start = config.videos[i].onscreenElements[j].start;
                videoOverlayObject.overlay.overlays[j].end = config.videos[i].onscreenElements[j].end;
            }
            //now add the menubar overlay to every page
            var navBar = {};
            navBar.align = "bottom-left";
            navBar.content = "<span onclick='" + config.homeVideoEvent + "()'><i class='fa fa-2x " + config.homeVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.skipVideoEvent + "()'><i class='fa fa-2x " + config.skipVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.backVideoEvent + "()'><i class='fa fa-2x " + config.backVideoIcon + " text-primary sr-icons'></i></span>" + "<span onclick='" + config.infoVideoEvent + "(2)'><i class='fa fa-2x " + config.infoVideoIcon + " text-primary sr-icons'></i></span>";
            navBar.start = 0;
            navBar.end = config.videos[config.currentVideoIndex + 1].duration;
            videoOverlayObject.overlay.overlays.push(navBar);
            myPlayer2.overlay(videoOverlayObject.overlay);
            return;
        }
    }
}



