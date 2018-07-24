"use strict";
(function(){
    var id, init, deinit;

    id = "game";
    init = function(){
        // fullScreenCanvas("webgl");
        init_main();
    };
    deinit = function(){
        gl.getExtension('WEBGL_lose_context').loseContext();
    };

    var screen = new Screen("game", init, deinit);
    saveScreen(screen);
}).call();

