import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

/* original code
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  // TODO: populate unit cube vertex positions, normals, and uv coordinates
  this.positions = quad.positions;
  this.normals = quad.normals;
  this.uvCoords = quad.uvCoords;
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
  this.normals = quad.normals.slice(0, 9);
  this.uvCoords = quad.uvCoords.slice(0, 6);
  this.indices = [0, 1, 2];
}

Scene.prototype.computeTransformation = function(transformSequence) {
  // TODO: go through transform sequence and compose into overallTransform
  let overallTransform = Mat4.create();  // identity matrix
  return overallTransform;
}

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 temp;

void main() {
  temp = vec3(position.x, normal.x, uvCoord.x);
  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 temp;

void main() {
  gl_FragColor = vec4(temp, 1.0);
}
`;

*/

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  const positions = [];
  const normals = [];
  const uvCoords = [];

  const cellW = 0.5;
  const cellH = 1.0 / 3.0;
  function uvRect(c, r) {
    const u0 = c * cellW;
    const u1 = (c + 1.0) * cellW;
    const v0 = r * cellH;
    const v1 = (r + 1.0) * cellH;
    return { u0, u1, v0, v1 };
  }

  // helper: v00 bottom-left, v10 bottom-right, v11 top-right, v01 top-left
  function addFace(v00, v10, v11, v01, n, uv, flipU = false) {
    positions.push(
      ...v00, ...v10, ...v11,
      ...v00, ...v11, ...v01
    );
    normals.push(
      ...n, ...n, ...n,
      ...n, ...n, ...n
    );
    if (flipU) {
      // Flip horizontally: swap u0 and u1
      uvCoords.push(
        uv.u1, uv.v1,
        uv.u0, uv.v1,
        uv.u0, uv.v0,
        uv.u1, uv.v1,
        uv.u0, uv.v0,
        uv.u1, uv.v0
      );
    } else {
      uvCoords.push(
        uv.u0, uv.v1,
        uv.u1, uv.v1,
        uv.u1, uv.v0,
        uv.u0, uv.v1,
        uv.u1, uv.v0,
        uv.u0, uv.v0
      );
    }
  }

  // Front (+Z): Light blue = 1 pip - top-left cell (row 2, col 0)
  addFace(
    [-1,-1, 1], [ 1,-1, 1], [ 1, 1, 1], [-1, 1, 1],
    [0,0,1], uvRect(0,2)
  );
  // Right (+X): Light green = 2 pips - middle-left cell (row 1, col 0)
  addFace(
    [ 1,-1, 1], [ 1,-1,-1], [ 1, 1,-1], [ 1, 1, 1],
    [1,0,0], uvRect(0,1), true
  );
  // Left (âˆ’X): 5 pips - middle-right cell (row 1, col 1)
  addFace(
    [-1,-1,-1], [-1,-1, 1], [-1, 1, 1], [-1, 1,-1],
    [-1,0,0], uvRect(1,1)
  );
  // Back (âˆ’Z): 6 pips - bottom-right cell (row 0, col 1)
  addFace(
    [ 1,-1,-1], [-1,-1,-1], [-1, 1,-1], [ 1, 1,-1],
    [0,0,-1], uvRect(1,0)
  );
  // Top (+Y): Peach = 3 pips - bottom-left cell (row 0, col 0)
  addFace(
    [-1, 1, 1], [ 1, 1, 1], [ 1, 1,-1], [-1, 1,-1],
    [0,1,0], uvRect(0,0), true
  );
  // Bottom (âˆ’Y): 4 pips - top-right cell (row 2, col 1)
  addFace(
    [-1,-1,-1], [ 1,-1,-1], [ 1,-1, 1], [-1,-1, 1],
    [0,-1,0], uvRect(1,2)
  );

  this.positions = positions;
  this.normals = normals;
  this.uvCoords = uvCoords;
  this.indices = [];
}

TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  const sinf = Math.sin;
  const cosf = Math.cos;  // had to ask gpt if we could use something like # define in c++, it gave me this, sounds good
  const PI = Math.PI;
  // const positions = [];
  // const normals = [];
  // const uvCoords = [];
  // const indices = [];
  
  // from ben
  // for (let s = 0; s <= numStacks; s++) {
  //   const phi = PI/2 - s * (PI/ numStacks);
    
  //   const z = sinf(phi);
  //   const cosPhi = cosf(phi);
  //   // const sinPhi = sinf(phi);
  //   const sinPhi = z;
  //   const innerLoopVar = 2 * PI/numSectors;
  //   for (let t = 0; t <= numSectors; t++) {
  //     const theta = t * innerLoopVar + PI/2;
  //     const x = cosPhi * sinf(theta);
  //     const y = cosPhi * cosf(theta);
  //     this.positions.push(x, y, z);
  //     this.normals.push(x, y, z);
  //     this.uvCoords.push(t/numSectors, s/numStacks);
  //   }



  // }
  // // from website
  const sectorCount = numSectors;
  const stackCount = numStacks;
  const radius = 1;
  
  const vertices  = [];       // positions
  const normals   = [];       // normals
  const texCoords = [];       // uvcoords
  const indices = [];
  
  let x, y, z, xy;                              // vertex position
  let nx, ny, nz;                               // vertex normal
  const lengthInv = 1.0/radius;                 // vertex texCoord
  let s, t;

  const sectorStep = 2 * PI / sectorCount;
  // const sectorStep = 2 * Math.PI / sectorCount;
  // const stackStep = Math.PI / stackCount;
  const stackStep = PI / stackCount;
  let sectorAngle, stackAngle;

  for (let i = 0; i <= stackCount; ++i) {
    // can modify this angle range ?
    stackAngle = PI / 2 - i *  ( stackStep);  // starting from pi/2 to -pi.2
    // stackAngle = Math.PI / 2 - i ( stackStep);  // starting from pi/2 to -pi.2
    
    xy = radius * cosf(stackAngle);         // r * cos(u)   // radius is just 1, so just pure cos(u)
    // xy = radius * Math.cos(stackAngle);         // r * cos(u)
    z = radius * sinf(stackAngle);          // r * sin(u)
    // z = radius * Math.sin(stackAngle);          // r * sin(u)

    // add (sectorCount + 1) vertices per stack
    // first and last vertices have same position and normal, but different tex coords
    for (let j = 0; j <= sectorCount; ++j) {
      // can modify this angle range ?
      sectorAngle = j * sectorStep + PI/2;               // starting from pi/2 to 3/2 pi
      // sectorAngle = j * sectorStep;               // starting from 0 to 2 pi

      // can be modified 
      // sectorAngle = j * sectorStep + PI/2; //(or -PI/2)

      // vertex position (x, y , z)
      // x = xy * cosf(sectorAngle);                 // r * cos(u) * cos(v)
      x = xy * sinf(sectorAngle);                 // r * cos(u) * cos(v)
      // y = xy * cosf(sectorAngle);                 // r * cos(u) * sin(v)
      y = xy * cosf(sectorAngle);                 // r * cos(u) * sin(v)
      // vertices.push(x);
      // vertices.push(y);
      // vertices.push(z);
      vertices.push(x, y, z);

      // normalized vertex normal (nx, ny, nz)
      // do not need this as we are making the radius 1, so this is just x, y, z * 1
      nx = x * lengthInv;
      ny = y * lengthInv;
      nz = z * lengthInv;
      normals.push(nx);
      normals.push(ny);
      normals.push(nz);
      // normals.push(nx, ny, nz);

      // vertex tex coord (s, t) range between [0, 1]
      s = (j * 1.0) / sectorCount;
      t = (1.0 * i) / stackCount;
      // can be modified, rather not modify this.
      // this.uvCoords.push(j / numSectors, (1-i)/ numStacks);


      texCoords.push(s);
      texCoords.push(t);
      // texCoords.push(s,t);

    }


  }
  // this.positions = positions;
  // this.normals = normals;
  // this.uvCoords = uvCoords;
  // this.indices = indices;
  this.positions = vertices;
  this.normals = normals;
  this.uvCoords = texCoords;

  // const lineIndices = [];   // debugging purposes only
  let k1, k2;
  for (let i = 0; i < stackCount; ++i) {

    k1 = i * (sectorCount + 1);                     // beginning of current stack
    k2 = k1 + sectorCount + 1;                      // beginning of next stack

    for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {

      // 2 triangles per sector excluding first and last stacks         // understandable
      // k1 => kd => k1 +1                                              // not understandable, why so?

      if (i != 0) {
        indices.push(k1);
        indices.push(k2);
        indices.push(k1+1);
        // indices.push(k1, k2, k1+1);

        // k1+1 => k2 => k2 + 1
        if (i != (stackCount - 1)) {
          indices.push(k1+1);
          indices.push(k2);
          indices.push(k2+1);
          // indices.push(k1+1, k2, k2 + 1);
        }

        // // store indices for lines
        // // vertical lines for all stacks, k1 => k2
        // lineIndices.push(k1);
        // lineIndices.push(k2);
        // if (i != 0) {
        //   lineIndices.push(k1);
        //   lineIndices.push(k1 + 1);
        // }


      }

    }

  }

  this.indices = indices;




  // for (let stack = 0; stack <= numStacks; stack++) {
  //   const phi = Math.PI * stack / numStacks; // 0 (north) -> Ï€ (south)
  //   const y = Math.cos(phi);
  //   const sinPhi = Math.sin(phi);

  //   for (let sector = 0; sector <= numSectors; sector++) {
  //     // NEW ATTEMPT: theta offset -Ï€/4 (rotate opposite direction)
  //     const theta = -Math.PI / 4.0 + 2.0 * Math.PI * sector / numSectors;

  //     const x = sinPhi * Math.cos(theta);
  //     const z = -sinPhi * Math.sin(theta);

  //     positions.push(x, y, z);
  //     normals.push(x, y, z); // unit sphere

  //     const u = sector/ numSectors;
  //     const v = 1.0 - (stack / numStacks);
  //     uvCoords.push(u, v);
  //   }
  // }

  // for (let stack = 0; stack < numStacks; stack++) {
  //   for (let sector = 0; sector < numSectors; sector++) {
  //     const first = stack * (numSectors + 1) + sector;
  //     const second = first + numSectors + 1;

  //     indices.push(first, second, first + 1);
  //     indices.push(second, second + 1, first + 1);
  //   }
  // }

  // this.positions = positions;
  // this.normals = normals;
  // this.uvCoords = uvCoords;
  this.indices = indices;
};

Scene.prototype.computeTransformation = function(transformSequence) {
  // Start with identity
  let overallTransform = Mat4.create();
  console.log("computeTransformation: sequence", JSON.stringify(transformSequence));

  const makeTranslation = (tx, ty, tz) => {
    // Column-major: last column is translation
    return Mat4.set(Mat4.create(),
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    );
  };

  const makeRotationX = (degrees) => {
    const rad = degrees * Math.PI / 180.0;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return Mat4.set(Mat4.create(),
      1, 0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    );
    // return Mat4.set(Mat4.create(),
    //   1, 0,  0, 0,
    //   0, c, -s, 0,
    //   0, s,  c, 0,
    //   0, 0,  0, 1
    // );
  };

  const makeRotationY = (degrees) => {
    const rad = degrees * Math.PI / 180.0;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return Mat4.set(Mat4.create(),
       c, 0, -s, 0,
       0, 1,  0, 0,
       s, 0,  c, 0,
       0, 0,  0, 1
    );
    // return Mat4.set(Mat4.create(),
    //    c, 0,  s, 0,
    //    0, 1,  0, 0,
    //   -s, 0,  c, 0,
    //    0, 0,  0, 1
    // );
  };

  const makeRotationZ = (degrees) => {
    const rad = degrees * Math.PI / 180.0;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return Mat4.set(Mat4.create(),
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
    // return Mat4.set(Mat4.create(),
    //   c, s, 0, 0,
    //  -s, c, 0, 0,
    //   0, 0, 1, 0,
    //   0, 0, 0, 1
    // );
  };

  const makeScale = (sx, sy, sz) => {
    return Mat4.set(Mat4.create(),
      sx, 0,   0,  0,
      0,  sy,  0,  0,
      0,  0,   sz, 0,
      0,  0,   0,  1
    );
    // return Mat4.set(Mat4.create(),
    //   sx, 0,   0,  0,
    //   0,  sy,  0,  0,
    //   0,  0,   sz, 0,
    //   0,  0,   0,  1
    // );
  };
  // Track the current position of the object to implement
  // the "translate-to-origin â†’ transform â†’ translate-back" pattern
  let currentPosition = [0, 0, 0]; // Objects start at origin
  
  for (const transform of transformSequence) {
    const [type, x, y, z] = transform;
    let T;

    if (type === "T") {
      // Simple translation - just update position and apply
      T = makeTranslation(x, y, z);
      currentPosition[0] += x;
      currentPosition[1] += y;
      currentPosition[2] += z;
    } else if (type === "Rx" || type === "Ry" || type === "Rz" || type === "S") {
      // For rotations and scaling: T_back * R/S * T_origin
      // Following the pattern from text.txt
      
      // Step 1: Translate to origin (T_origin = -currentPosition)
      const T_origin = makeTranslation(-currentPosition[0], -currentPosition[1], -currentPosition[2]);
      
      // Step 2: Apply the rotation or scale
      let R_or_S;
      if (type === "Rx") {
        R_or_S = makeRotationX(x);
      } else if (type === "Ry") {
        R_or_S = makeRotationY(x);
      } else if (type === "Rz") {
        R_or_S = makeRotationZ(x);
      } else if (type === "S") {
        R_or_S = makeScale(x, y, z);
      }
      
      // Step 3: Translate back (T_back = currentPosition)
      const T_back = makeTranslation(currentPosition[0], currentPosition[1], currentPosition[2]);
      
      // Compose: T_back * R_or_S * T_origin
      let temp = Mat4.create();
      Mat4.multiply(temp, R_or_S, T_origin);  // temp = R_or_S * T_origin
      T = Mat4.create();
      Mat4.multiply(T, T_back, temp);  // T = T_back * temp
      
      console.log("  object-frame transform: translate to origin â†’ " + type + " â†’ translate back");
    } else {
      continue;
    }

    console.log("  applying", type, "with", x, y, z);
    console.log("  T matrix", Array.from(T));

    // Apply new transform BEFORE the existing ones: M = T * M
    Mat4.multiply(overallTransform, T, overallTransform);
    console.log("  overall so far", Array.from(overallTransform));
  }
  console.log("computeTransformation: final", Array.from(overallTransform));
  return overallTransform;
};

Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPos;

void main() {
  // Transform position to view space (point: w=1, affected by translation)
  vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
  vPosition = viewPosition.xyz;
  
  // Transform normal to view space (direction: w=0, NOT affected by translation)
  vec4 viewNormal = viewMatrix * modelMatrix * vec4(normal, 0.0);
  vNormal = viewNormal.xyz;
  
  // Transform light position to view space (point: w=1, affected by translation)
  vLightPos = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
  
  // Pass texture coordinates
  vTexCoord = uvCoord;
  
  // Final clip space position
  gl_Position = projectionMatrix * viewPosition;
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;

uniform sampler2D uTexture;
uniform bool hasTexture;

varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPos;

void main() {
  // Normalize interpolated vectors
  vec3 N = normalize(vNormal);

  vec3 L = normalize(vLightPos - vPosition);
  
  vec3 V = normalize(-vPosition);  // Camera at origin in view space
  
  vec3 H = normalize(L + V);       // Halfway vector (Blinn-Phong)
  
  // Calculate distance attenuation (1/dÂ²)
  float d = length(vLightPos - vPosition);
  float attenuation = 1.0 / (d * d);
  
  // Blinn-Phong lighting components
  vec3 ambient = ka * lightIntensity;
  
  float diffuseFactor = max(0.0, dot(N, L));
  vec3 diffuse = (kd * attenuation) * diffuseFactor * lightIntensity;
  
  float specularFactor = pow(max(0.0, dot(H, N)), shininess);
  // float specularFactor = pow(max(0.0, dot(N, H)), shininess);
  vec3 specular = (ks * attenuation) * specularFactor * lightIntensity ;
  
  // Combined lighting
  vec3 color = ambient + diffuse + specular;
  
  // Modulate with texture if present
  if (hasTexture) {
    vec4 texColor = texture2D(uTexture, vTexCoord);
    color *= texColor.rgb;
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };