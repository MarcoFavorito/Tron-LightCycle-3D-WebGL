var keyPressed = new Set();
var keyboard_callback;

var keydownEventListener =  function(event) {
    // console.log("down" + event.keyCode);
    if (event.keyCode in keyboard_callback && !(keyPressed.has(event.keyCode))) {
        console.log("call");
        keyPressed.add(event.keyCode);
        keyboard_callback[event.keyCode].call();
    }
};

var keyupEventListener = function(event) {
    // console.log("up " + event.keyCode);
    if (keyPressed.has(event.keyCode)){
        keyPressed.delete(event.keyCode)
    }
};

var KeyboardManager = function(keycode2callback){
    keyPressed = new Set();
    keyboard_callback = keycode2callback;
    document.addEventListener('keydown',keydownEventListener);
    document.addEventListener('keyup', keyupEventListener);

};

var cleanUpKM = function(){

    document.removeEventListener('keydown', keyupEventListener);
    document.removeEventListener('keyup', keydownEventListener);
};