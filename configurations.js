"use strict";
var SCREEN_FILEPATH_PREFIX = "screens/";
var SCREEN_FILEPATH_SUFFIX= ".html";

var SHADER_FILEPATH_PREFIX = "shaders/";


//Populate this array if you want to add new screens,
//but be sure that files <new-screen-name>.html and <new-screen-name>.js are in screens/
var SCREENS_IDS = [
    "startmenu",
    "game"
];


var GRID_WIDTH = 600;
var NO_ENEMIES = 3;

var START_SCREEN = "startmenu";



var KEYCODE_LEFT_ARROW_KEY = 37;
var KEYCODE_RIGHT_ARROW_KEY = 39;


// var GameConfigurations = function(){
//     this.NUMBER_OF_ENEMIES = 1;
//     this.GRID_SIZE = GRID_WIDTH;
// };
