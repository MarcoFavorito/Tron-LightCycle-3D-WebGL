var dh = 1.05;
var no_particles = 15;
var points = [
    [1.0,                  0.5,   0.0                  ],
    [0.9135454576426009,   0.5,   0.40673664307580015  ],
    [0.6691306063588582,   0.5,   0.7431448254773941   ],
    [0.30901699437494745,  0.5,   0.9510565162951535   ],
    [-0.10452846326765333, 0.5,   0.9945218953682734   ],
    [-0.4999999999999998,  0.5,   0.8660254037844387   ],
    [-0.8090169943749473,  0.5,   0.5877852522924732   ],
    [-0.9781476007338057,  0.5,   0.20791169081775931  ],
    [-0.9781476007338057,  0.5,  -0.20791169081775907  ],
    [-0.8090169943749476,  0.5,  -0.587785252292473    ],
    [-0.5000000000000004,  0.5,  -0.8660254037844384   ],
    [-0.10452846326765423, 0.5,  -0.9945218953682733   ],
    [0.30901699437494723,  0.5,  -0.9510565162951536   ],
    [0.6691306063588585,   0.5,  -0.743144825477394    ],
    [0.913545457642601,    0.5,  -0.40673664307580015  ],

    // //same as above, but y=0.5
    // [1.0,                  0.95,   0.0                  ],
    // [0.9135454576426009,   0.95,   0.40673664307580015  ],
    // [0.6691306063588582,   0.95,   0.7431448254773941   ],
    // [0.30901699437494745,  0.95,   0.9510565162951535   ],
    // [-0.10452846326765333, 0.95,   0.9945218953682734   ],
    // [-0.4999999999999998,  0.95,   0.8660254037844387   ],
    // [-0.8090169943749473,  0.95,   0.5877852522924732   ],
    // [-0.9781476007338057,  0.95,   0.20791169081775931  ],
    // [-0.9781476007338057,  0.95,  -0.20791169081775907  ],
    // [-0.8090169943749476,  0.95,  -0.587785252292473    ],
    // [-0.5000000000000004,  0.95,  -0.8660254037844384   ],
    // [-0.10452846326765423, 0.95,  -0.9945218953682733   ],
    // [0.30901699437494723,  0.95,  -0.9510565162951536   ],
    // [0.6691306063588585,   0.95,  -0.743144825477394    ],
    // [0.913545457642601,    0.95,  -0.40673664307580015  ]
];

var Explosion = function(gl, center, color){
    this.gl = gl;
    this.center = center;
    this.color = color;
    this.alpha = 1.0;
    this.theta = 0.0;


    this.n = 0;
    this.vertices  = [];
    this.normals   = [];
    this.colors    = [];
    this.texcoords = [];

    this.vertexBuffer =   this.gl.createBuffer();
    this.normalBuffer =   this.gl.createBuffer();
    this.colorBuffer =    this.gl.createBuffer();
    this.texcoordBuffer = this.gl.createBuffer();
    // this.indexBuffer =    this.gl.createBuffer();

    this.a_Position =   this.gl.getAttribLocation(this.gl.program, 'a_Position');
    this.a_Normal =     this.gl.getAttribLocation(this.gl.program, 'a_Normal');
    this.a_Color=       this.gl.getAttribLocation(this.gl.program, 'a_Color');
    this.a_TexCoord =   this.gl.getAttribLocation(this.gl.program, 'a_TexCoord');

    this.cycle2vertexIndices = {};

};

Explosion.prototype.animate = function(){
    if (this.alpha<=30) {
        this.alpha += .5;
        this.height = this.alpha
    }
    else{
        this.height *= dh;
    }
    this.theta += 20;

};

Explosion.prototype.initData = function () {
    // var translateMatrix = new Matrix4();
    // translateMatrix.setTranslate(this.center.x, this.center.y, this.center.z);
    for (var v in points){
        this.vertices.push([0.0,0.0,0.0]);
        this.vertices.push(points[v]);

        this.colors.push(this.color);this.colors.push(this.color);
        // this.normals.push([1.0,1.0,1.0,1.0]);this.normals.push([1.0,1.0,1.0,1.0]);
        this.normals.push([0.0,0.0,0.0,0.0]);this.normals.push([0.0,0.0,0.0,0.0]);
        this.texcoords.push([.0,.0]);this.texcoords.push([1.0,0.0]);
    }

    this.updateBuffers();



};

Explosion.prototype.draw = function (draw_manager) {
    if (this.vertices.length == 0) return;

    try{
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    }catch(err){console.log("Problems in Explosion draw(), when binding the vertex buffers");}
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Position);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.vertexAttribPointer(this.a_Normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Normal);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Color);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.vertexAttribPointer(this.a_TexCoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_TexCoord);


    // 2 stand for white_pixel
    draw_manager.gl.uniform1i(draw_manager.u_Sampler, ALL_TEXTURES["white_pix"].id);

    modelMatrix.setIdentity();
    modelMatrix.translate(this.center[0], this.center[1], this.center[2]);
    modelMatrix.rotate(this.theta, 0, 1, 0);
    modelMatrix.scale(this.alpha, this.height, this.alpha);

    // mvpMatrix.set(draw_manager.projViewMatrix).multiply(modelMatrix);
    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // Pass the model matrix to u_ModelMatrix
    draw_manager.gl.uniformMatrix4fv(draw_manager.u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    // draw_manager.gl.uniformMatrix4fv(draw_manager.u_MvpMatrix, false, mvpMatrix.elements);

    // Pass the transformation matrix for normals to u_NormalMatrix
    draw_manager.gl.uniformMatrix4fv(draw_manager.u_NormalMatrix, false, normalMatrix.elements);


    draw_manager.gl.uniformMatrix4fv(draw_manager.u_SMatrix, false, SMatrix.elements);


    this.gl.drawArrays(gl.LINES, 0, this.n/3);


    //Restore buffers
    // if (!draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.vertexBuffer)) console.log("Problems in Explosion draw(), when rebind the draw_manager buffer");
    try{
        draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.vertexBuffer);
    }catch(err){console.log("Problems in Explosion draw(), when rebind the draw_manager buffer");}

    // draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.vertexBuffer);
    draw_manager.gl.vertexAttribPointer(draw_manager.a_Position, 3, draw_manager.gl.FLOAT, false, 0, 0);
    draw_manager.gl.enableVertexAttribArray(draw_manager.a_Position);

    draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.normalBuffer);
    draw_manager.gl.vertexAttribPointer(draw_manager.a_Normal, 3, draw_manager.gl.FLOAT, false, 0, 0);
    draw_manager.gl.enableVertexAttribArray(draw_manager.a_Normal);

    draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.colorBuffer);
    draw_manager.gl.vertexAttribPointer(draw_manager.a_Color, 4, draw_manager.gl.FLOAT, false, 0, 0);
    draw_manager.gl.enableVertexAttribArray(draw_manager.a_Color);

    draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.texcoordBuffer);
    draw_manager.gl.vertexAttribPointer(draw_manager.a_TexCoord, 2, draw_manager.gl.FLOAT, false, 0, 0);
    draw_manager.gl.enableVertexAttribArray(draw_manager.a_TexCoord);

    draw_manager.gl.bindBuffer(draw_manager.gl.ELEMENT_ARRAY_BUFFER, draw_manager.indexBuffer);


};

Explosion.prototype.updateBuffers = function () {
    var flatten_vertices = flatten(this.vertices);
    this.n = flatten_vertices.length;

    // if (!this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)) console.log("Problems in Explosion updateBuffers()");
    try{
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    }catch(err){console.log("Problems in Explosion updateBuffers()");}

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten_vertices, this.gl.DYNAMIC_DRAW );
    this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Position);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.normals), this.gl.DYNAMIC_DRAW );
    this.gl.vertexAttribPointer(this.a_Normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Normal);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.colors), this.gl.DYNAMIC_DRAW );
    this.gl.vertexAttribPointer(this.a_Color, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_Color);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.bufferData( this.gl.ARRAY_BUFFER, flatten(this.texcoords), this.gl.DYNAMIC_DRAW );
    this.gl.vertexAttribPointer(this.a_TexCoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.a_TexCoord);

};



Explosion.prototype.cleanUpBuffers = function(){
    // if (!this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)) console.log("Problems in Explosion cleanUpBuffers()");
    try{
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    }catch(err){console.log("Problems in Explosion cleanUpBuffers()");}

    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.deleteBuffer(this.vertexBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.deleteBuffer(this.colorBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.deleteBuffer(this.normalBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.deleteBuffer(this.texcoordBuffer);
};
