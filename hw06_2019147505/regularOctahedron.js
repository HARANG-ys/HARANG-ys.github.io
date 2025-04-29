let sqrt2 = Math.sqrt(2); // 루트 2
let sqrt3 = Math.sqrt(3); // 루트 3

export class RegularOctahedron {
    constructor(gl, options = {}) {
        this.gl = gl;

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ebo = gl.createBuffer();

        this.vertices = new Float32Array([
            // Top 4 faces
            0, sqrt2/2, 0,  -0.5, 0, 0.5,   0.5, 0, 0.5,   // front face
            0, sqrt2/2, 0,   0.5, 0, 0.5,   0.5, 0, -0.5,  // right face
            0, sqrt2/2, 0,  -0.5, 0, -0.5,  -0.5, 0, 0.5, // left face
            //0.5, 0, -0.5,  -0.5, 0, -0.5,   0, sqrt2/2, 0,  // back face
            0, sqrt2/2, 0,  0.5, 0, -0.5,  -0.5, 0, -0.5,
            // Bottom 4 faces
            0, -sqrt2/2, 0,   -0.5, 0, 0.5,  0.5, 0, 0.5,   // front face
            0, -sqrt2/2, 0,   0.5, 0, 0.5,   0.5, 0, -0.5,   // right face
            0, -sqrt2/2, 0,  -0.5, 0, -0.5,  -0.5, 0, 0.5,  // left face
           // 0.5, 0, -0.5,  -0.5, 0, -0.5,  0, -sqrt2/2, 0   // back face
            0, -sqrt2/2, 0,  0.5, 0, -0.5,  -0.5, 0, -0.5
        ]);
        
        this.indices = new Uint16Array([
            // Top 4 faces
            0, 1, 2,
            3, 4, 5,
            6, 7, 8,
            9, 10, 11,
            // Bottom 4 faces
            12, 13, 14,
            15, 16, 17,
            18, 19, 20,
            21, 22, 23
        ]);
        
        this.texCoords = new Float32Array([ //
            // Top faces
            0.5, 1.0,  0.25, 0.5,  0.5, 0.5,  // front
            0.5, 1.0,  0.5, 0.5,   0.75, 0.5,  // right
            0.5, 1.0,  0.0, 0.5,   0.25, 0.5,  // left
            0.5, 1.0,  0.75, 0.5,  1.0, 0.5,  // back
        
            // Bottom faces
            0.5, 0.0,  0.25, 0.5,  0.5, 0.5,  // front
            0.5, 0.0,  0.5,  0.5,  0.75, 0.5,  // right
            0.5, 0.0,  0.0, 0.5,   0.25, 0.5,  // left
            0.5, 0.0,  0.75, 0.5,  1.0, 0.5,   // back
        ]);

        this.normals = new Float32Array([
            // 1 
            0, 1/sqrt3, sqrt2/sqrt3,   0, 1/sqrt3, sqrt2/sqrt3,   0, 1/sqrt3, sqrt2/sqrt3,
            // 2
            sqrt2/sqrt3, 1/sqrt3, 0,   sqrt2/sqrt3, 1/sqrt3, 0,   sqrt2/sqrt3, 1/sqrt3, 0,
            // 3
            -sqrt2/sqrt3, 1/sqrt3, 0,  -sqrt2/sqrt3, 1/sqrt3, 0,  -sqrt2/sqrt3, 1/sqrt3, 0,
            // 4
            0, 1/sqrt3, -sqrt2/sqrt3,  0, 1/sqrt3, -sqrt2/sqrt3,  0, 1/sqrt3, -sqrt2/sqrt3,
            
            // 5
            0, -1/sqrt3, sqrt2/sqrt3,  0, -1/sqrt3, sqrt2/sqrt3,  0, -1/sqrt3, sqrt2/sqrt3,
            // 6
            sqrt2/sqrt3, -1/sqrt3, 0,  sqrt2/sqrt3, -1/sqrt3, 0,  sqrt2/sqrt3, -1/sqrt3, 0,
            // 7
            -sqrt2/sqrt3, -1/sqrt3, 0, -sqrt2/sqrt3, -1/sqrt3, 0, -sqrt2/sqrt3, -1/sqrt3, 0,
            // 8
            0, -1/sqrt3, -sqrt2/sqrt3, 0, -1/sqrt3, -sqrt2/sqrt3, 0, -1/sqrt3, -sqrt2/sqrt3
        ]);

        if (options.color) {
            for (let i = 0; i < 24 * 4; i += 4) {
                this.colors[i] = options.color[0];
                this.colors[i+1] = options.color[1];
                this.colors[i+2] = options.color[2];
                this.colors[i+3] = options.color[3];
            }
        }
        else {
            this.colors = new Float32Array([
                // front face  - red
                1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,
                // right face  - yellow
                1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,
                // left face  - cyan
                0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,
                // back face - magenta
                1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1,
                
                // front face  - red
                1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,
                // right face  - yellow
                1, 1, 0, 1,   1, 1, 0, 1,   1, 1, 0, 1,
                // left face  - cyan
                0, 1, 1, 1,   0, 1, 1, 1,   0, 1, 1, 1,
                // back face - magenta
                1, 0, 1, 1,   1, 0, 1, 1,   1, 0, 1, 1
            ]);
        }

        this.sameVertices = new Uint16Array([
            0, 3, 6, 9, // v0
            1, 8, 13, 20,// v1
            2, 4, 14, 16, // v2
            5, 10, 17, 22, // v3
            7, 11, 19, 23, // v4
            12, 15, 18, 21 // v5

        ]);

        this.vertexNormals = new Float32Array(72);
        this.faceNormals = new Float32Array(72);
        this.faceNormals.set(this.normals);

        // compute vertex normals 
        for (let i = 0; i < 24; i += 3) {

            let vn_x = (this.normals[this.sameVertices[i]*3] + 
                       this.normals[this.sameVertices[i+1]*3] + 
                       this.normals[this.sameVertices[i+2]*3]) / 3; 
            let vn_y = (this.normals[this.sameVertices[i]*3 + 1] + 
                       this.normals[this.sameVertices[i+1]*3 + 1] + 
                       this.normals[this.sameVertices[i+2]*3 + 1]) / 3; 
            let vn_z = (this.normals[this.sameVertices[i]*3 + 2] + 
                       this.normals[this.sameVertices[i+1]*3 + 2] + 
                       this.normals[this.sameVertices[i+2]*3 + 2]) / 3; 

            this.vertexNormals[this.sameVertices[i]*3] = vn_x;
            this.vertexNormals[this.sameVertices[i+1]*3] = vn_x;
            this.vertexNormals[this.sameVertices[i+2]*3] = vn_x;
            this.vertexNormals[this.sameVertices[i]*3 + 1] = vn_y;
            this.vertexNormals[this.sameVertices[i+1]*3 + 1] = vn_y;
            this.vertexNormals[this.sameVertices[i+2]*3 + 1] = vn_y;
            this.vertexNormals[this.sameVertices[i]*3 + 2] = vn_z;
            this.vertexNormals[this.sameVertices[i+1]*3 + 2] = vn_z;
            this.vertexNormals[this.sameVertices[i+2]*3 + 2] = vn_z;
        }

        this.initBuffers();
    }

    copyVertexNormalsToNormals() {
        this.normals.set(this.vertexNormals);
    }

    copyFaceNormalsToNormals() {
        this.normals.set(this.faceNormals);
    }

    initBuffers() {
        const gl = this.gl;

        const vSize = this.vertices.byteLength;
        const nSize = this.normals.byteLength;
        const cSize = this.colors.byteLength;
        const tSize = this.texCoords.byteLength;
        const totalSize = vSize + nSize + cSize + tSize;

        gl.bindVertexArray(this.vao);

        // VBO에 복합 데이터 (vertex + normal + texCoord)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, totalSize, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.normals);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize, this.colors);
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize + nSize + cSize, this.texCoords);

        // EBO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // vertex attributes 설정
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  // position
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, vSize);  // normal
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, vSize + nSize);  // color
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 0, vSize + nSize + cSize);  // texCoord

        // vertex attributes 활성화
        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
        gl.enableVertexAttribArray(2);
        gl.enableVertexAttribArray(3);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    updateNormals() {
        const gl = this.gl;
        const vSize = this.vertices.byteLength;

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        
        // normals 데이터만 업데이트
        gl.bufferSubData(gl.ARRAY_BUFFER, vSize, this.normals);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }

    draw(shader) {
        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    delete() {
        const gl = this.gl;
        gl.deleteBuffer(this.vbo);
        gl.deleteBuffer(this.ebo);
        gl.deleteVertexArray(this.vao);
    }
}