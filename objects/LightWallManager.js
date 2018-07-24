


var LightWallManager = function(gl){
    this.gl = gl;

    this.vertices  = [];
    this.normals   = [];
    this.colors    = [];
    this.texcoords = [];
    // this.indices = new Uint8Array(this.indices);
    // this.indices = new Uint16Array(this.indices);
    // this.indices = [];
    this.n = 0;

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


LightWallManager.prototype.pushWall = function(a,b,c,d, color, cycle_name){
    var prev_vertices_length = this.vertices.length;
    this._quad(a,b,c,d, color);

    // this.vertices = flatten(this.vertices);
    // this.colors = flatten(this.colors);
    // this.normals = flatten(this.normals);
    // this.texcoords = flatten(this.texcoords);

    // var flatten_vertices = flatten(this.vertices);
    // var flatten_normals = flatten(this.normals);
    // var flatten_colors = flatten(this.colors);
    // var flatten_texcoords = flatten(this.texcoords);

    this.updateBuffers();

    if (! (cycle_name in this.cycle2vertexIndices))
        this.cycle2vertexIndices[cycle_name] = [];
    this.cycle2vertexIndices[cycle_name].push(prev_vertices_length);
};

LightWallManager.prototype.updateBuffers = function () {
    var flatten_vertices = flatten(this.vertices);
    this.n = flatten_vertices.length;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    if (this.gl.getError())
        {console.log("Problems in LightWallManager updateBuffers()");}
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


LightWallManager.prototype.draw = function (draw_manager) {
    if (this.vertices.length==0) return;


    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    if (this.gl.getError())
        {console.log("Problems in LightWallManager draw()");}
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


    // white_pixel
    draw_manager.gl.uniform1i(draw_manager.u_Sampler, ALL_TEXTURES["white_pix"].id);

    modelMatrix.setIdentity();
    modelMatrix.translate(0,0,0);
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


    SMatrix.setScale(1,1,1);
    draw_manager.gl.uniformMatrix4fv(draw_manager.u_SMatrix, false, SMatrix.elements);


    this.gl.drawArrays(gl.TRIANGLES, 0, this.n/3);


    //Restore buffers

    draw_manager.gl.bindBuffer(draw_manager.gl.ARRAY_BUFFER, draw_manager.vertexBuffer);
    if (this.gl.getError())
        {console.log("Problems in LightWallManager draw(), when rebinding the draw_manager buffer");}
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


LightWallManager.prototype._quad = function(a, b, c, d, color) {
    // 1.0, 1.0, 0.0,  -1.0, 1.0, 0.0,  -1.0,-1.0, 0.0,   1.0,-1.0, 0.0, // v0-v1-v2-v3 front


    //1 0 3 2
    // vec4( -0.5, -0.5,  0.5, 1.0 ), 0 2       v1      v0      b       a    |   o1      o2      a       d
    // vec4( -0.5,  0.5,  0.5, 1.0 ), 1 1                                    |
    // vec4( 0.5,  0.5,  0.5, 1.0 ),  2 0                                    |
    // vec4( 0.5, -0.5,  0.5, 1.0 ),  3 3       v2      v3      c       d    |   o0      o3      b       c
    // 1 0 3 1 3 2
    
    var t1 = subtract(c, b);
    var t2 = subtract(d, c);
    var normal = cross(t1, t2);


    this.vertices.push(a);
    this.normals.push(normal);
    this.vertices.push(b);
    this.normals.push(normal);
    this.vertices.push(c);
    this.normals.push(normal);
    this.vertices.push(a);
    this.normals.push(normal);
    this.vertices.push(c);
    this.normals.push(normal);
    this.vertices.push(d);
    this.normals.push(normal);

    this.colors.push(color);
    this.texcoords.push(texCoord[0]);
    
    this.colors.push(color);
    this.texcoords.push(texCoord[1]);
    
    this.colors.push(color);
    this.texcoords.push(texCoord[2]);

    
    this.colors.push(color);
    this.texcoords.push(texCoord[0]);
    
    this.colors.push(color);
    this.texcoords.push(texCoord[2]);

    
    this.colors.push(color);
    this.texcoords.push(texCoord[3]);

};




LightWallManager.prototype.checkWalls = function(head, back){
    // var model_head = modelMatrix.multiplyVector4 (head);
    // var model_left = modelMatrix.multiplyVector4 (left);
    // var model_right = modelMatrix.multiplyVector4(right);
    // var model_back = modelMatrix.multiplyVector4 (back);

    var wall_end_vertex, wall_start_vertex;

    var res;
    for (var i =0; i< this.vertices.length; i+=6){
        wall_end_vertex = this.vertices[i];
        wall_start_vertex = this.vertices[i+1];

        res = this._checkSingleWall(back, head, wall_end_vertex, wall_start_vertex);
        if (res)
            return true;
    }
    return false;


};

LightWallManager.prototype._checkSingleWall = function(back, head, wall_end_vertex, wall_start_vertex){
    // head, back: Vector4 type (access them through .elements
    // wall_X_vertex are simple arrays

    var wall_ex,wall_ez;
    var wall_sx,wall_sz;
    var wall_e, wall_s;

    wall_ex = wall_end_vertex[0];
    wall_ez = wall_end_vertex[2];

    wall_sx = wall_start_vertex[0];
    wall_sz = wall_start_vertex[2];

    wall_e = {x: wall_ex, z:wall_ez};
    wall_s = {x: wall_sx, z:wall_sz};

    var b = {x:back.elements[0], z:back.elements[2]};
    var h = {x:head.elements[0], z:head.elements[2]};

    var res = doLineSegmentsIntersect(
        b,
        h,
        wall_e,
        wall_s
    );

    return res.check;

};


LightWallManager.prototype.cleanUpBuffers = function(){

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    if (this.gl.getError())
    {console.log("Problems in LightWallManager cleanUpBuffers()");}
    this.gl.deleteBuffer(this.vertexBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.deleteBuffer(this.colorBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.deleteBuffer(this.normalBuffer);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
    this.gl.deleteBuffer(this.texcoordBuffer);
};


LightWallManager.prototype.removeVerticesByCycleName = function(cycle_name){
    var min_start_idx = this.vertices.length;
    var times = 0;
    var indices = this.cycle2vertexIndices[cycle_name];
    for (var start_idx in indices.reverse()){
        if (indices[start_idx]<=min_start_idx)
            min_start_idx = indices[start_idx];
        times+=1;
        this.vertices.splice(indices[start_idx], 6);
        this.normals.splice(indices[start_idx], 6);
        this.colors.splice(indices[start_idx], 6);
        this.texcoords.splice(indices[start_idx], 6);

        // update indices
        for (var cname in this.cycle2vertexIndices){
            if (cname==cycle_name) continue;
            for (var i = 0; i<this.cycle2vertexIndices[cname].length; i++)
                if (this.cycle2vertexIndices[cname][i]>=min_start_idx)
                    this.cycle2vertexIndices[cname][i]-=6;
    }
    this.updateBuffers();


    }
};

var texCoord = [
    [0, 1],
    [0, 0],
    [1, 0],
    [1, 1]
];

function subtract(a, b){
    if (a.length != b.length)
        return -1;
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ]
}

function cross(a, b){
    if (a.length != b.length)
        return -1;
    return [
        a[1]*b[2] - b[1]*a[2],
        a[2]*b[0] - b[2]*a[0],
        a[0]*b[1] - b[0]*a[1]
    ]
}


function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}