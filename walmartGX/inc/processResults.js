function showResults() {

    //showSlideInfo();


    var total = "";
    for (var i = 0; i < config.recommendations.length; i++) {
        total += config.recommendations[i].voteBucket + ","
    }

    console.log(total);
    $('#med-ppo,#med-hmo,#med-hdhp,#dent-prem,#vis-prem,#dent-core,#vis-core').hide();
    $('#results').show();

    //one result for all
    $('#medical,#dental,#vision').hide();
    $('#medical,#med-hdhp').show();



    //switch (total) {


    //    case "2,1,2,1,0,1,0,":

    //        $('#medical,#dental,#vision').hide();
    //        $('#medical,#med-hdhp').show();
    //        break;


    //    case "2,1,2,0,1,0,1,":

    //        $('#medical,#dental,#vision').hide();
    //        $('#results,#medical,#med-hdhp').show();

    //        break;
    //    case "2,1,2,1,0,0,1,":

    //        $('#medical,#dental,#vision').hide();
    //        $('#medical,#med-hdhp').show();


    //        break;
    //    case "2,1,2,0,1,1,0,":

    //        $('#medical,#dental,#vision').hide();
    //        $('#medical,#med-hdhp').show();
    //        break;

    //    case "1,2,1,1,0,1,0,":
    //        //alert("hmo, dentalCore, visionCore");
    //        break;
    //    case "1,2,1,0,1,0,1,":
    //        //alert("hmo, dentalPremium, visionPremium");
    //        break;
    //    case "1,2,1,1,0,0,1,":
    //        //alert("hmo, dentalCore, visionPremium");
    //        break;
    //    case "1,2,1,0,1,1,0,":
    //        //alert("hmo, dentalPremium, visionCore");
    //        break;

    //    case "2,1,1,1,0,1,0,":
    //        //alert("ppo, dentalCore, visionCore");
    //        break;
    //    case "2,1,1,0,1,0,1,":
    //        //alert("ppo, dentalPremium, visionPremium");
    //        break;
    //    case "2,1,1,1,0,0,1,":
    //        //alert("ppo, dentalCore, visionPremium");
    //        break;
    //    case "2,1,1,0,1,1,0,":
    //        //alert("ppo, dentalPremium, visionCore");
    //        break;

    //    case "1,2,0,1,0,1,0,":
    //        //alert("hmo, dentalCore, visionCore");
    //        break;
    //    case "1,2,0,0,1,0,1,":
    //        //alert("hmo, dentalPremium, visionPremium");
    //        break;
    //    case "1,2,0,1,0,0,1,":
    //        //alert("hmo, dentalCore, visionPremium");
    //        break;
    //    case "1,2,0,0,1,1,0,":
    //        //alert("hmo, dentalPremium, visionCore");
    //        break;

    //    case "1,0,3,1,0,1,0,":
    //        //alert("hdhp, dentalCore, visionCore");
    //        break;
    //    case "1,0,3,0,1,0,1,":
    //        //alert("hdhp, dentalPremium, visionPremium");
    //        break;
    //    case "1,0,3,1,0,0,1,":
    //        //alert("hdhp, dentalCore, visionPremium");
    //        break;
    //    case "1,0,3,0,1,1,0,":
    //        //alert("hdhp, dentalPremium, visionCore");
    //        break;

    //    case "0,1,2,1,0,1,0,":
    //        //alert("hdhp, dentalCore, visionCore");
    //        break;
    //    case "0,1,2,0,1,0,1,":
    //        //alert("hdhp, dentalPremium, visionPremium");
    //        break;
    //    case "0,1,2,1,0,0,1,":
    //        //alert("hdhp, dentalCore, visionPremium");
    //        break;
    //    case "0,1,2,0,1,1,0,":
    //        //alert("hdhp, dentalPremium, visionCore");
    //        break;

    //    case "1,0,2,1,0,1,0,":
    //        //alert("hdhp, dentalCore, visionCore");
    //        break;
    //    case "1,0,2,0,1,0,1,":
    //        //alert("hdhp, dentalPremium, visionPremium");
    //        break;
    //    case "1,0,2,1,0,0,1,":
    //        //alert("hdhp, dentalCore, visionPremium");
    //        break;
    //    case "1,0,2,0,1,1,0,":
    //        //alert("hdhp, dentalPremium, visionCore");
    //        break;

    //    case "0,0,1,1,0,1,0,":
    //        //alert("hdhp, dentalCore, visionCore");
    //        break;
    //    case "0,0,1,0,1,0,1,":
    //        //alert("hdhp, dentalPremium, visionPremium");
    //        break;
    //    case "0,0,1,1,0,0,1,":
    //        //alert("hdhp, dentalCore, visionPremium");
    //        break;
    //    case "0,0,1,0,1,1,0,":
    //        //alert("hdhp, dentalPremium, visionCore");
    //        break;

    //}
}