"use strict";
var Screen = function(id, init, deinit) {
    this.id = id;
    this.init = init;
    this.deinit = deinit;
};

Screen.prototype.getId = function(){return this.id};

Screen.prototype.show = function() {
    this.init();
    document.getElementById(this.id).style.display = "block"
};
Screen.prototype.hide = function() {
    this.deinit();
    document.getElementById(this.id).style.display = "none"
};

