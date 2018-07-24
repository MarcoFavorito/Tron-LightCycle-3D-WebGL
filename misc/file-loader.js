"use strict";
/*
Script used for load the needed files (i.e. .HTML screens, .glsl shaders)
 */

var SCREENS_HTML_FILEPATHS = (function (){
    var x = [];
    for (var i=0; i<SCREENS_IDS.length; i++)
        x.push(SCREEN_FILEPATH_PREFIX + SCREENS_IDS[i] + SCREEN_FILEPATH_SUFFIX)
    return x;
}).call();

var SCREENS_JS_FILEPATHS = (function (){
    var x = [];
    for (var i=0; i<SCREENS_IDS.length; i++)
        x.push(SCREEN_FILEPATH_PREFIX + SCREENS_IDS[i] + ".js")
    return x;
}).call();

var SHADERS_FILEPATHS = [
    SHADER_FILEPATH_PREFIX + "lightcycle-vertex-shader.glsl",
    SHADER_FILEPATH_PREFIX + "lightcycle-fragment-shader.glsl",
];

var MISC_FILEPATHS = [];

var FILEPATHS = [].concat.apply([],
    [
        SCREENS_HTML_FILEPATHS,
        SCREENS_JS_FILEPATHS,
        SHADERS_FILEPATHS,
        MISC_FILEPATHS
    ]);

(function preprocessing(){
    var f = FileManager.getInstance();
    f.loadFiles(FILEPATHS);
}).call();


