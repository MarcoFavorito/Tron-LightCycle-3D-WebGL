"use strict";
function saveScreen(screen){
    var sm = ScreenManager.getInstance();
    sm.addScreen(screen);
}


function fullScreenCanvas(canvas_id){
    //get canvas object from html document
    var canvas = document.getElementById("webgl");

    // canvas.width = document.body.clientWidth; //document.width is obsolete
    // canvas.height = document.body.clientHeight; //document.height is obsolete
    // console.log(canvas.width + " " + canvas.height);
    //
    // canvas.width = document.clientWidth; //document.width is obsolete
    // canvas.height = document.clientHeight; //document.height is obsolete
    // console.log(canvas.width + " " + canvas.height);

    // canvas.width = window.innerWidth; //document.width is obsolete
    // canvas.height = window.innerHeight; //document.height is obsolete

    var min = window.innerHeight>window.innerWidth?window.innerWidth:window.innerHeight;
    canvas.width = min; //document.width is obsolete
    canvas.height = min; //document.height is obsolete
    console.log(canvas.width + " " + canvas.height);

    // window.onload = window.onresize = function() {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    //     console.log("RESIZE:" + canvas.width + " " + canvas.height);
    // };
}
