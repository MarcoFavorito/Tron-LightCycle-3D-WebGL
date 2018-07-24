"use strict";
var ScreenManager = (function () {

    var instance = null;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new (function () {
                    var currentScreen = null;
                    var screens = {};
                    this.getCurrentScreen = function () {return currentScreen};
                    this.setCurrentScreen = function (id) {
                        if (id in screens) {
                            if (currentScreen){
                                console.log(currentScreen.getId() + " screen is hidden.");
                                currentScreen.hide();
                            }
                            currentScreen = screens[id];
                            currentScreen.show();
                            console.log(id + " screen is shown.")
                        }
                        else throw new Error("No screen found.")
                    };
                    this.addScreen = function(s){
                        if (!(s.getId() in screens)) screens[s.getId()]=s;
                        else throw new Error("Screen already present.");
                    };
                    this.getScreen = function(id){
                        if (!(id in screens))
                            throw new Error("Screen-id='" + id + "' does not exists.");
                        return screens[id];
                    };
                });
            }
            return instance;
        }
    };
})();