"use strict";
(function launch(){

    //************************************
    // Wait for all needed files to be loaded
    var fm = FileManager.getInstance();
    if (!fm.checkLoadEnd()){
        setTimeout(launch, 1);
        return
    }
    //************************************

    //************************************
    //For every screen
    for (var i=0; i<SCREENS_HTML_FILEPATHS.length; i++) {
        // Populate index.html with all the screens (they are in display:none mode)
        document.body.innerHTML += fm.get(SCREENS_HTML_FILEPATHS[i]);
        // Evaluate associated script (generate Screen objects)
        window.eval(fm.get(SCREENS_JS_FILEPATHS[i]));
    }
    //************************************

    var sm = ScreenManager.getInstance();
    sm.setCurrentScreen(START_SCREEN);

}).call();