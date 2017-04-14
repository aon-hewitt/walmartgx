
var myPlayer = videojs("myPlayerID");
var config = {};
var configs = [];

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

videojs("myPlayerID").ready(function () {
    myPlayer.on("ended", function () {
        if (config.videos[config.currentVideoIndex].endBehavior != undefined) {
            loadNewVideo(config.videos[config.currentVideoIndex].endBehavior, false);
        } else {
            myPlayer.pause();//pause the player if no endbehavior is specified
        }
    })

    myPlayer.on("loadedmetadata", function () {

        console.log("Text Track to load: " + config.videos[config.currentVideoIndex].tracks);
        if (config.videos[config.currentVideoIndex].tracks != undefined) {
            myPlayer.addRemoteTextTrack({
                kind: 'metadata',
                src: "vtt/" + config.videos[config.currentVideoIndex].tracks + ".vtt"
            }, false);
        } else {

        }
        var trackIndex = myPlayer.textTracks().length - 1;
        var tt = myPlayer.textTracks()[trackIndex];
        tt.oncuechange = function () {
            if (tt.activeCues[0] !== undefined) {
                console.log("Cue point begins");
                var dynamicHTML = "id: " + tt.activeCues[0].id + ", ";
                dynamicHTML += "text: " + tt.activeCues[0].text + ", ";
                dynamicHTML += "startTime: " + tt.activeCues[0].startTime + ",  ";
                dynamicHTML += "endTime: " + tt.activeCues[0].endTime;
                console.log(dynamicHTML);
                jsonData = JSON.parse(tt.activeCues[0].text);
                if (jsonData.description == "results") {
                    showResults();
                }
            } else {
                console.log("Cue point duration over");
            }
        }

        
        myPlayer.play();
        
        $("#slideInfo").load("inc/" + config.startVideoName + ".html");


    });
});

//Any element without an event specified will be handled here using properties specified in config.
function defaultEventHandler(onscreenElementIndex) {
    loadNewVideo(config.videos[config.currentVideoIndex].onscreenElements[onscreenElementIndex].defaultAction.jumpToName, true);
    assignWeights(config.videos[config.currentVideoIndex].onscreenElements[onscreenElementIndex].defaultAction.weightings);

    //if (config.videos[config.currentVideoIndex].onscreenElements[onscreenElementIndex].lastQuestion) {

    //}
}

//this external file will handle the custom eventHandlers functions for questions with an event handler specified in config.
$.getScript("inc/eventHandlers.js", function (data, textStatus, jqxhr) {
});

//this external file will handle the showResults function
$.getScript("inc/processResults.js", function (data, textStatus, jqxhr) {
});

function home() {
    location.reload();
}

function skip() {
    if (config.videos[config.currentVideoIndex].skipIntro && (myPlayer.currentTime() < config.videos[config.currentVideoIndex].skipIntro)) {
        myPlayer.currentTime(config.videos[config.currentVideoIndex].skipIntro)
    } else {
        loadNewVideo(config.videos[config.currentVideoIndex].endBehavior, true);
    }
}

function back() {
    config = JSON.parse(configs.pop());

    if (config.videos[config.currentVideoIndex].name == config.startVideoName) { //First video starting - reset voteBucket values to 0
        location.reload;
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
            videoId = config.videos[iterator].brightcoveId;
            var name = config.videos[iterator].name
        }
        iterator++;
    }
    while (iterator < config.videos.length);

    myPlayer.catalog.getVideo(videoId, function (error, video) {
        //deal with error
        myPlayer.catalog.load(video);
        makeVideoOverlay(name);
        //if (name == config.startVideoName) { //First video starting - reset voteBucket values to 0
        //    for (var i = 0; i < config.recommendations.length; i++) {
        //        config.recommendations[i].voteBucket = 0;
        //    }
        //}
        //myPlayer.play(); Call the play method within the loadedmetadata event rather than here.
    });
}

function makeVideoOverlay(videoId) {
    //set global json properties
    var videoOverlayObject = {};
    videoOverlayObject.overlay = {};
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
            navBar.content = "<span onclick='" + config.homeVideoEvent + "()'><i class='fa fa-2x " + config.homeVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.skipVideoEvent + "()'><i class='fa fa-2x " + config.skipVideoIcon + " text-primary sr-icons'></i></span><span onclick='" + config.backVideoEvent + "()'><i class='fa fa-2x " + config.backVideoIcon + " text-primary sr-icons'></i></span>" + "<span onclick='" + config.infoVideoEvent + "()'><i class='fa fa-2x " + config.infoVideoIcon + " text-primary sr-icons'></i></span>";
            navBar.start = 0;
            navBar.end = config.videos[config.currentVideoIndex].duration;
            videoOverlayObject.overlay.overlays.push(navBar);
            myPlayer.overlay(videoOverlayObject.overlay);
            return;
        }
    }
}



