$(document).ready(function () {

    var time, lambda, meanServiceTime, arrived, serviced, rejected,
        totalServiceTime, state,
        firstServiceTime, firstServiceCounter,
        secondServiceTime, secondServiceCounter,
        thirdServiceTime, thirdServiceCounter,
        interval, i, arriveRequestNumber, allRequestNumber;


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getPoissonRandom(lambda) {
        var L = Math.exp(-lambda),
            k = 0,
            p = 1.0;

        do {
            k++;
            p *= Math.random();
        }
        while(p > L);

        return k-1;
    }

    function animateTask(serverNumber) {

        var server = $("#s" + serverNumber);
        var params = {left : "", top : "-=200", opacity: "0.0"};

        switch (serverNumber) {
            case 1:
                params.left = "-=200";
                break;
            case 2 :
                params.left = "+=0";
                break;
            case 3:
                params.left = "+=200";
                break;
        }

        var task = $("#task");
        $(task).animate({left : "+=" + ($(window).width()/2 + 50)}, 500)
               .animate(params, 300, function () {

                   $(server).attr("src", "./res/service.gif");
                   $("#s" + serverNumber + " + "  + "input").val("Occupied").css("background-color", "#FFB4A8");
                   $(task).css({opacity :"1.0", left : "-100px", top : "450px"});

                   stopService();
                   interval = setInterval(simulation, 100);
               });
    }

    function animateReject() {

        var task = $("#task");
        $(task).animate({left : "+=" + ($(window).width()/2 + 50)}, 300)
            .animate({top : "+=20", opacity: "0.0"}, 300, function () {

                $(task).css({opacity :"1.0", left : "-100px", top : "450px"});

                stopService();
                interval = setInterval(simulation, 100);
            });
    }

    function stopService() {

        if(firstServiceCounter == firstServiceTime) {
            $("#s1").attr("src", "./res/service.png");
            $("#s1 + input").val("Available").css("background-color", "#C0FFA7");
            if(firstServiceTime != 0) {
                totalServiceTime += firstServiceTime;
                firstServiceTime = firstServiceCounter = 0;
                serviced++;
            }

        }
        else {
            $("#s1 + input").val(firstServiceTime - firstServiceCounter).css("background-color", "#FFB4A8");
        }

        if(secondServiceCounter == secondServiceTime) {
            $("#s2").attr("src", "./res/service.png");
            $("#s2 + input").val("Available").css("background-color", "#C0FFA7");
            if(secondServiceTime != 0) {
                totalServiceTime += secondServiceTime;
                secondServiceTime = secondServiceCounter = 0;
                serviced++;
            }
        }
        else {
            $("#s2 + input").val(secondServiceTime - secondServiceCounter).css("background-color", "#FFB4A8");
        }

        if(thirdServiceCounter == thirdServiceTime) {
            $("#s3").attr("src", "./res/service.png");
            $("#s3 + input").val("Available").css("background-color", "#C0FFA7");
            if(thirdServiceTime != 0) {
                totalServiceTime += thirdServiceTime;
                thirdServiceTime = thirdServiceCounter = 0;
                serviced++;
            }
        }
        else {
            $("#s3 + input").val(thirdServiceTime - thirdServiceCounter).css("background-color", "#FFB4A8");
        }

    }

    function showResult() {
        $("#timer").hide();
        $("#result").show();

        $("#arrived").val(arrived);
        $("#rejected").val(rejected);
        $("#serviced").val(serviced);
        $("#serviceTime").val(totalServiceTime);
    }

    function reset() {

        arrived = 0; serviced = 0; rejected = 0;
        totalServiceTime = 0; state = 0; i = 0;

        firstServiceTime = 0; secondServiceTime = 0; thirdServiceTime = 0;
        firstServiceCounter = 0; secondServiceCounter = 0; thirdServiceCounter = 0;

        $("#timer").show();
        $("#result").hide();

        $("#s1").attr("src", "./res/service.png");
        $("#s1 + input").val("Available").css("background-color", "#C0FFA7");

        $("#s2").attr("src", "./res/service.png");
        $("#s2 + input").val("Available").css("background-color", "#C0FFA7");

        $("#s3").attr("src", "./res/service.png");
        $("#s3 + input").val("Available").css("background-color", "#C0FFA7");

    }
    
    function simulation() {

        if(i == time) {

            clearInterval(interval);
            showResult();

            $("#s1").attr("src", "./res/service.png");
            $("#s2").attr("src", "./res/service.png");
            $("#s3").attr("src", "./res/service.png");
            return;
        }

        $("#timerWindow").val(i+1);
        i++;

        var t = getRandomInt(1, allRequestNumber);

        if(firstServiceTime == 0 && secondServiceTime == 0 && thirdServiceTime == 0) state = 1;
        if(firstServiceTime == 0 && secondServiceTime == 0 && thirdServiceTime  > 0) state = 2;
        if(firstServiceTime == 0 && secondServiceTime  > 0 && thirdServiceTime == 0) state = 3;
        if(firstServiceTime  > 0 && secondServiceTime == 0 && thirdServiceTime == 0) state = 4;
        if(firstServiceTime == 0 && secondServiceTime  > 0 && thirdServiceTime  > 0) state = 5;
        if(firstServiceTime  > 0 && secondServiceTime  > 0 && thirdServiceTime == 0) state = 6;
        if(firstServiceTime  > 0 && secondServiceTime == 0 && thirdServiceTime  > 0) state = 7;
        if(firstServiceTime  > 0 && secondServiceTime  > 0 && thirdServiceTime  > 0) state = 8;

        if(1 <= t && t <= arriveRequestNumber) {

            arrived++;
            clearInterval(interval);

            if(state == 1) {
                animateTask(1);
                firstServiceTime = getPoissonRandom(60*meanServiceTime);
                firstServiceCounter = 0;
            }
            else if(state == 2) {
                animateTask(1);
                firstServiceTime = getPoissonRandom(60*meanServiceTime);
                firstServiceCounter = 0;
                thirdServiceCounter++;
            }
            else if(state == 3) {
                animateTask(1);
                firstServiceTime = getPoissonRandom(60*meanServiceTime);
                firstServiceCounter = 0;
                secondServiceTime--;
            }
            else if(state == 4) {
                animateTask(2);
                secondServiceTime = getPoissonRandom(60*meanServiceTime);
                secondServiceCounter=0;
                firstServiceCounter++;
            }
            else if(state == 5) {
                animateTask(1);
                firstServiceTime = getPoissonRandom(60*meanServiceTime);
                firstServiceCounter = 0;
                secondServiceCounter++;
                thirdServiceCounter++;
            }
            else if(state == 6) {
                animateTask(3);
                thirdServiceTime = getPoissonRandom(60*meanServiceTime);
                thirdServiceCounter = 0;
                firstServiceCounter++;
                secondServiceCounter++;
            }
            else if(state == 7) {
                animateTask(2);
                secondServiceTime = getPoissonRandom(60*meanServiceTime);
                secondServiceCounter = 0;
                firstServiceCounter++;
                thirdServiceCounter++;
            }
            else if(state == 8) {
                animateReject();
                rejected++;
                firstServiceCounter++;
                secondServiceCounter++;
                thirdServiceCounter++;
            }
            return;
        }
        else {

            if(state == 2) thirdServiceCounter++;
            else if(state == 3) secondServiceCounter++;
            else if(state == 4) firstServiceCounter++;
            else if(state == 5) {
                secondServiceCounter++;
                thirdServiceCounter++;
            }
            else if(state == 6) {
                firstServiceCounter++;
                secondServiceCounter++;
            }
            else if(state == 7) {
                firstServiceCounter++;
                thirdServiceCounter++;
            }
            else if(state ==8) {
                firstServiceCounter++;
                secondServiceCounter++;
                thirdServiceCounter++;
            }
        }
        stopService();
    }

    $("#start").click(function () {

        time = +$("#time").val();
        lambda = +($("#lambda").val());
        meanServiceTime = +($("#meanServiceTime").val());

        if(!time || !lambda || !meanServiceTime) {
            alert("Wrong input!");
            return;
        }

        var f = new Fraction(lambda/60);

        arriveRequestNumber = f.n;
        allRequestNumber = f.d;

        debugger;
        reset();
        interval = setInterval(simulation,100);

    });

    $("#stop").click(function () {

        clearInterval(interval);
        $("#s1").attr("src", "./res/service.png");
        $("#s2").attr("src", "./res/service.png");
        $("#s3").attr("src", "./res/service.png");
        reset();
        $("#timerWindow").val(0);
    })

});4