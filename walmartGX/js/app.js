var myPlayer = videojs("myPlayerID");
var myPlayer2 = videojs("myPlayerID2");
var config = {};
var configs = [];
var waitSequenceShowing = false;
var waitSequenceVideoId;
var waitSequenceName;
var textTrackToShow = 0;
var repositoryId = "a657fd8fced304aeb5cc";
var branchId = "e107b525b507b9d33a23";
var nodeId = "1f89a17e1845bc71d945";
var config1 = {
    "clientKey": "ac8a94d2-05d0-4d03-919d-52408a8f9c06",
    "clientSecret": "wn7qJcPQVucXl3IrtJpPfmX7sfJORbAdA9DL/0wEjvcYU5g3Qzu4lKSTZKjHrI+iMOqUSC5aPoSkazluD+i95vuLVSjBtzYm3y2296ESC6Y=",
    "username": "0e2b89b9-115d-4dd8-be07-7fd662b94ba7",
    "password": "sY12fxj9bpSD+aUuDnIJHZ90E4F8fDrRXUXBwFN5CMNo48L3K5oJxTDPEKX9jlqQXTHWWkf6GZWPMdEBYF81ETVmUEVwfC+4n4XXuARfKyM=",
    "baseURL": "https://api.cloudcms.com",
    "application": "4db40e414e0888fe688d"
}

//Gitana.connect(config1, function (err) {
//    if (err) {
//        console.log(err);
//    }
//}).then(function () {
//    this.readRepository(repositoryId).then(function () {
//        this.readBranch(branchId).then(function () {
//            this.readNode(nodeId).then(function () {
//                config = JSON.parse(JSON.stringify(this));
//                loadNewVideo(config.startVideoName, false);
//            });
//        });
//    });
//});



// Pulling data from local file
//$.ajax({
//    url: "data/walmartQA.json", //the QA version of the demo rather than the QC version
//    type: "get",
//    success: function (result) {
//        //config = JSON.parse(result); hosting on iis does not require parsing
//        config = result;
//        loadNewVideo(config.startVideoName, false);
//    }
//});

$.getJSON("data/walmart3.json", function (result) {
    config = result; //use this line for local testing in Visual Studio
    loadNewVideo(config.startVideoName, false);
});

videojs("myPlayerID").ready(function () {

    //this is a fix recommended by Brightcove to overcome black screen on IE11
    if (videojs.IE_VERSION === 11) {
        // IE will use MP4/HTML5 before HLS/Flash
        videojs("myPlayerID").options_.sourceOrder = false;
    }


    myPlayer.on("play", function () {
        if (textTrackToShow == 1) {
            console.log("Showing text track 1");
            myPlayer.textTracks()[1].mode = "showing";
        } else if (textTrackToShow == 2) {
            console.log("Showing text track 2");
            myPlayer.textTracks()[2].mode = "showing";
        } else {
            myPlayer.textTracks()[1].mode = "disabled";
            myPlayer.textTracks()[2].mode = "disabled";
        }
    });



    myPlayer.on("ended", function () {
        if (config.videos[config.currentVideoIndex].endBehavior != undefined) {
            $("#myPlayerIDContainer").css("display", "none");
            $("#myPlayerID2Container").css("display", "block");
            $("#myPlayerID2Container").css("opacity", 1);
            myPlayer2.play();
            myPlayer.pause();
            waitSequenceShowing = true;
        } else {
            //myPlayer.pause(); //pause the player if no endbehavior is specified
        }
    })

    myPlayer.on("loadedmetadata", function () {
        console.log("myPlayer loadedmetadata");
        loadWaitSequence(waitSequenceVideoId, waitSequenceName);

        ////////////////////////////////

        console.log("Text Track to load: " + config.videos[config.currentVideoIndex].tracks);
        if (config.videos[config.currentVideoIndex].tracks != undefined) {
            myPlayer.addRemoteTextTrack({
                kind: 'metadata',
                src: "vtt/" + config.videos[config.currentVideoIndex].tracks + ".vtt"
            }, false);
        } else {
            console.log("Tracks is undefined");
        }

        console.log("This video has " + myPlayer.textTracks().length + " text tracks.");
        for (var i = 0; i < myPlayer.textTracks().length; i++) {
            console.log(myPlayer.textTracks()[i]);
        }

        for (var i = 1; i < myPlayer.textTracks().length; i++) {
            if (myPlayer.textTracks()[i].src == "vtt/intro.vtt") {
                var tt = myPlayer.textTracks()[i];
            }
        }
        console.log("This is TT: " + tt);
        tt.oncuechange = function () {
            if (tt.activeCues[0] !== undefined) {
                console.log("Cue point begins");
                var dynamicHTML = "id: " + tt.activeCues[0].id + ", ";
                dynamicHTML += "text: " + tt.activeCues[0].text + ", ";
                dynamicHTML += "startTime: " + tt.activeCues[0].startTime + ",  ";
                dynamicHTML += "endTime: " + tt.activeCues[0].endTime;
                console.log(dynamicHTML);
                jsonData = JSON.parse(tt.activeCues[0].text);
                if ((jsonData.description == "results1") && (config.currentVideoIndex == 10)) {
                    $(".vjs-overlay.vjs-overlay-bottom-left.vjs-overlay-background").css("display", "none");
                } else if ((jsonData.description == "showDate") && (config.currentVideoIndex == 4)) {
                    var d = new Date();
                    d.setDate(d.getDate() + 30);
                    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    var weekdayName = days[d.getDay()];
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var monthName = months[d.getMonth()];
                    var datestring = weekdayName + ", " + monthName + " " + d.getDate() + ", " + d.getFullYear();
                    var n = d.toDateString();
                    $(".question.deadline").html(datestring);
                } else if ((jsonData.description == "results2") && (config.currentVideoIndex == 10)) {
                    $(".vjs-overlay.vjs-overlay-bottom-left.vjs-overlay-background").css("display", "block");
                }
            } else {
                console.log("Cue point duration over");
            }
        }

        ////////////////////////////////

        myPlayer.play();
        myPlayer2.pause();
        waitSequenceShowing = false;//tst this
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
        console.log("myPlayer2 loadedmetadata");
        // now its safe to display none the second player
        $("#myPlayerID2Container").css("display", "none");
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

function homeEventHandler(videoName) {
    if (waitSequenceShowing) {
        var adjuster = 1;
    } else {
        adjuster = 0;
    }
    loadNewVideo(videoName, true);
    $("#myPlayerIDContainer").css("display", "block");
    $("#myPlayerID2Container").css("display", "none");
    waitSequenceShowing = false;
}

//this external file will handle the custom eventHandlers functions for questions with an event handler specified in config.
$.getScript("js/eventHandlers.js", function (data, textStatus, jqxhr) {
});

//this external file will handle the showResults function
$.getScript("js/processResults.js", function (data, textStatus, jqxhr) {
});

function home() {
    //location.reload(); Comment this out to test new return to wait sequence function
    //should home lead to a reload and 'back to main menu lead to the wait sequence?
    //take them to the wait sequence for now
    homeEventHandler("returnIntro");
}

function skip() {

    if (config.videos[config.currentVideoIndex].skipIntro && (myPlayer.currentTime() < config.videos[config.currentVideoIndex].skipIntro)) {
        myPlayer.currentTime(config.videos[config.currentVideoIndex].skipIntro);
        $("#skipIcon").css("display", "none");
    }
}

function back() {
    config = JSON.parse(configs.pop());
    if (config.videos[config.currentVideoIndex].name == config.startVideoName) { //First video starting - reset voteBucket values to 0
    }
    try {
        loadNewVideo(config.videos[config.currentVideoIndex].name, false);
        $("#myPlayerID2Container").css("opacity", 0);
        $("#myPlayerIDContainer").css("display", "block");

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


    textTrackToShow = 0;
    for (var i = 0; i < myPlayer.textTracks().length; i++) {
        console.log("Texttrack " + i + " showing? " + myPlayer.textTracks()[i].mode);

        if ((myPlayer.textTracks()[i].mode) == "showing") {
            textTrackToShow = i;
        }
    }
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

        if (name == config.startVideoName) {
            $("#backIcon").css("display", "none");
        }
        myPlayer.catalog.load(video);
    });
}

function makeVideoOverlay(videoId) {
    //set global json properties
    var videoOverlayObject = {
    };
    videoOverlayObject.overlay = {
    };
    myPlayer.overlay(null);
    myPlayer2.overlay(null);//see if this clears out the overlay
    videoOverlayObject.overlay.content = "";
    videoOverlayObject.overlay.overlays = [];
    //now create the overlay properties
    for (var i = 0; i < config.videos.length; i++) { //find the current video object in the config object
        if (config.videos[i].name == videoId) {
            config.currentVideoIndex = i;
            for (var j = 0; j < config.videos[i].onscreenElements.length; j++) { // cycle through the onscreenElements array and build an overly for each
                videoOverlayObject.overlay.overlays[j] = {
                };
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
            var navBar = {
            };
            navBar.align = "bottom-left";
            navBar.content = "<span id='homeIcon' onclick='" + config.homeVideoEvent + "()'><i class='fa fa-2x " + config.homeVideoIcon + " text-primary sr-icons'></i></span>" + "<span id='backIcon' onclick='" + config.backVideoEvent + "()'><i class='fa fa-2x " + config.backVideoIcon + " text-primary sr-icons'></i></span>" + "<span id='skipIcon' onclick='" + config.skipVideoEvent + "()'><i class='fa fa-2x " + config.skipVideoIcon + " text-primary sr-icons'></i></span>" + "<span id='infoIcon' onclick='" + config.infoVideoEvent + "(1)'><i class='fa fa-2x " + config.infoVideoIcon + " text-primary sr-icons'></i></span>";
            navBar.start = 0;
            navBar.end = "end";
            //navBar.end = config.videos[config.currentVideoIndex].duration;
            videoOverlayObject.overlay.overlays.push(navBar);
            myPlayer.overlay(videoOverlayObject.overlay);
            //hide certain menu icons depending on video requirments
            if (!config.videos[i].skipIntro) {
                //hide the skip button if there is no skip intro property set
                $("#skipIcon").css("display", "none");
            }
            return;
        }
    }
}

function loadWaitSequence(videoId, name) {
    console.log("loadWaitSequence started");
    myPlayer2.catalog.getVideo(videoId, function (error, video) {
        console.log("This is the video object: " + video);
        makeVideoOverlayWait(name);
        if (name == config.startVideoName + "_wait") {//test to see if the back icon should be displayed. Do not show on intro video or wait sequence
            $("#backIcon2").css("display", "none");
        }
        myPlayer2.catalog.load(video);
    });
}

function makeVideoOverlayWait(videoName) {
    var videoOverlayObject = {
    };
    videoOverlayObject.overlay = {
    };
    myPlayer2.overlay(videoOverlayObject.overlay);//see if this clears out the overlay
    videoOverlayObject.overlay.content = "";
    videoOverlayObject.overlay.overlays = [];
    //now create the overlay properties
    for (var i = 0; i < config.videos.length; i++) { //find the current video object in the config object
        if (config.videos[i].name == videoName) {
            for (var j = 0; j < config.videos[i].onscreenElements.length; j++) { // cycle through the onscreenElements array and build an overly for each
                videoOverlayObject.overlay.overlays[j] = {
                };
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
            var navBar = {
            };
            navBar.align = "bottom-left";
            navBar.content = "<span id='homeIcon2' onclick='" + config.homeVideoEvent + "()'><i class='fa fa-2x " + config.homeVideoIcon + " text-primary sr-icons'></i></span>" + "<span id='backIcon2' onclick='" + config.backVideoEvent + "()'><i class='fa fa-2x " + config.backVideoIcon + " text-primary sr-icons'></i></span>" + "<span id='infoIcon2' onclick='" + config.infoVideoEvent + "(2)'><i class='fa fa-2x " + config.infoVideoIcon + " text-primary sr-icons'></i></span>";
            navBar.start = 0;
            navBar.end = config.videos[config.currentVideoIndex + 1].duration;
            videoOverlayObject.overlay.overlays.push(navBar);
            myPlayer2.overlay(videoOverlayObject.overlay);
            return;
        }
    }
}



