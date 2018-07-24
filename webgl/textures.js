var ALL_TEXTURES = {};

//----------
//Mipmaps
//----------

var texSize = 64;
var margin = 1;

var TILE_TEXTURE = new Uint8Array(4 * texSize * texSize);
for (var i = 0; i < texSize; i++) {
    var c;
    for (var j = 0; j < texSize; j++) {
        var patchx = i < margin || i > texSize - margin;
        var patchy = j < margin || j > texSize - margin;

        if (patchx || patchy) c = 255;
        else c = 0;
        //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
        TILE_TEXTURE[4 * i * texSize + 4 * j] = c;
        TILE_TEXTURE[4 * i * texSize + 4 * j + 1] = c;
        TILE_TEXTURE[4 * i * texSize + 4 * j + 2] = c;
        TILE_TEXTURE[4 * i * texSize + 4 * j + 3] = 255;
    }
}



var TEXTURE_WHITE = new Uint8Array(4*texSize*texSize);
c = 255;
for ( var i = 0; i < texSize; i++ ) {
    for ( var j = 0; j <texSize; j++ ) {
        TEXTURE_WHITE[4 * i * texSize + 4 * j] = c;
        TEXTURE_WHITE[4 * i * texSize + 4 * j + 1] = c;
        TEXTURE_WHITE[4 * i * texSize + 4 * j + 2] = c;
        TEXTURE_WHITE[4 * i * texSize + 4 * j + 3] = 255;
    }
}

var whitePixel = new Uint8Array([255, 255, 255, 255]);
var redPixel = new Uint8Array([RED[0]*255, RED[1]*255, RED[2]*255, RED[3]*255]);
var bluePixel = new Uint8Array([BLUE[0]*255, BLUE[1]*255, BLUE[2]*255, BLUE[3]*255]);
var greenPixel = new Uint8Array([GREEN[0]*255, GREEN[1]*255, GREEN[2]*255, GREEN[3]*255]);
var yellowPixel = new Uint8Array([YELLOW[0]*255, YELLOW[1]*255, YELLOW[2]*255, YELLOW[3]*255]);
var magentaPixel = new Uint8Array([MAGENTA[0]*255, MAGENTA[1]*255, MAGENTA[2]*255, MAGENTA[3]*255]);

//----------
//images
//----------


//---------------

ALL_TEXTURES["tile_tex"] = {id:0, isMipmap: true, texSize:texSize, tex:TILE_TEXTURE, color:null};
ALL_TEXTURES["white_pix"] = {id:2, isMipmap: true, texSize:1, tex:whitePixel, color:WHITE};
ALL_TEXTURES["red_pix"] = {id:3, isMipmap: true, texSize:1, tex:redPixel, color:RED};
ALL_TEXTURES["blue_pix"] = {id:4, isMipmap: true, texSize:1, tex:bluePixel, color:BLUE};
ALL_TEXTURES["green_pix"] = {id:5, isMipmap: true, texSize:1, tex:greenPixel, color:GREEN};
ALL_TEXTURES["yellow_pix"] = {id:6, isMipmap: true, texSize:1, tex:yellowPixel, color:YELLOW};

// ALL_TEXTURES["grid_wall"] = {id:2, isMipmap: false, texSize:texSize, tex:TILE_TEXTURE};