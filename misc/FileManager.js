"use strict";
var FileManager = (function () {

    var instance = null;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new (function () {
                    var loadend = false;
                    var flags = {};
                    var files = {};

                    var _loadFile = function (filepath) {
                        var xhr = new XMLHttpRequest();

                        xhr.onreadystatechange = function () {
                            if (this.readyState !== 4) return;
                            if (this.status !== 200) return; // or whatever error handling you want
                            console.log("file " + filepath + " read.");
                            files[filepath] = this.responseText;
                            flags[filepath] = true;
                        };

                        xhr.open('GET', filepath, true);
                        xhr.send();
                        console.log("request for " + filepath);
                    };

                    this.loadFiles = function(filepaths){
                        for (var i=0; i<filepaths.length; i++){
                            var curFilepath = filepaths[i];
                            flags[curFilepath] = false;
                            files[curFilepath] = null;
                            _loadFile(curFilepath)
                        }
                    };

                    this.checkLoadEnd = function(){
                        console.log("checkLoadEnd");
                        for (var f in flags){
                            console.log("check for " + f+"...");
                            if (!flags[f]) {
                                console.log(f + " false");
                                return false
                            }
                            console.log(f + " true");
                        }
                        loadend = true;
                        return true;
                    }

                    this.get = function(filepath){
                        return files[filepath]
                    }

                })
            }
            return instance;
        }
    };
})();