# CMPT 361 - Visual Learning Outcomes Summary

## 🎨 What You Actually Implemented (Concrete Evidence)

This document shows **exactly** what you learned by examining your actual code implementations.

---

## Assignment 3: Rasterization - The Foundation of Computer Graphics

### 🔴 Part 1: Line Rasterization (2 points)

**What the assignment asked:**
> Implement line rasterization for all orientations using DDA or Bresenham algorithm

**What you actually implemented:**

```javascript
// From your a3.js, lines 19-94
drawLine(vertex1, vertex2) {
    const [x1, y1, [r1, g1, b1]] = vertex1;
    const [x2, y2, [r2, g2, b2]] = vertex2;
    
    let [x1Floored, x2Floored, y1Floored, y2Floored] = 
        [Math.floor(x1), Math.floor(x2), Math.floor(y1), Math.floor(y2)];
    let [dx, dy] = [(Math.abs(x2Floored - x1Floored)), 
                    (Math.abs(y2Floored - y1Floored))];
    
    // Handle single-pixel case
    if (dx == 0 && dy == 0) {
        this.setPixel(x1Floored, y1Floored, color1);
        return;
    }
    
    let [sx, sy] = [((x1Floored < x2Floored) ? 1 : -1), 
                    ((y1Floored < y2Floored) ? 1 : -1)];
    
    if (dx >= dy) {
        // Horizontal-dominant case using Bresenham
        let d = 2 * dy - dx;
        for (let i = 0; i <= dx; i++) {
            let t = (dx == 0) ? 0 : i / dx;
            let color = this.interpolateColor(color1, color2, t);
            this.setPixel(x, y, color);
            
            if (d > 0) {
                y += sy;
                d += 2 * (dy - dx);
            } else {
                d += 2 * dy;
            }
            x += sx;
        }
    } else {
        // Vertical-dominant case
        let d = 2 * dx - dy;
        // ... similar logic for dy > dx case
    }
}
```

**What this proves you learned:**

✅ **Bresenham's Algorithm** - Integer-only arithmetic for efficiency  
✅ **Decision Variable** - d = 2*dy - dx for horizontal, d = 2*dx - dy for vertical  
✅ **Octant Handling** - Used sx/sy to handle all 8 line directions  
✅ **Edge Cases** - Single pixel (dx=0, dy=0)  
✅ **Slope Classification** - Different algorithms for dx≥dy vs dy>dx  

**Real-world application:** This is how pixels are drawn in every graphics API (OpenGL, DirectX, Vulkan)

---

### 🟢 Part 2: Color Interpolation (1 point)

**What the assignment asked:**
> Implement linear color interpolation along lines

**What you actually implemented:**

```javascript
// From your a3.js, lines 10-16
interpolateColor(c1, c2, t) {
    return [
        c1[0] + t * (c2[0] - c1[0]),
        c1[1] + t * (c2[1] - c1[1]),
        c1[2] + t * (c2[2] - c1[2])
    ];
}

// Used in drawLine:
let t = (dx == 0) ? 0 : i / dx;   // Parameter t ∈ [0,1]
let color = this.interpolateColor(color1, color2, t);
```

**What this proves you learned:**

✅ **Linear Interpolation** - C(t) = (1-t)·C₁ + t·C₂  
✅ **Parametric Representation** - t represents position along line  
✅ **Per-Channel Interpolation** - Independent R, G, B interpolation  
✅ **Smooth Gradients** - Creates visually smooth color transitions  

**Real-world application:** Every gradient, every smooth transition in graphics uses this technique

---

### 🔵 Part 3: Triangle Inside-Outside Test (3 points - Highest Weight!)

**What the assignment asked:**
> Implement triangle inside-outside test using half-plane algorithm with top-left rule

**What you actually implemented:**

```javascript
// From your a3.js, lines 99-105
findCommonValueForSavingComputaion(vertex0, vertex1) {
    let [x0, y0,] = vertex0; 
    let [x1, y1, ] = vertex1;
    // Compute cross product for implicit line equation
    let vertex0crossvertex1 = [y1 - y0, x0 - x1, x1*y0 - x0*y1];
    return vertex0crossvertex1;  // [a, b, c] where ax+by+c=0
}

// From your a3.js, lines 152-228
pointIsInsideTriangle(vertex0, vertex1, vertex2, p, vertex0crossvertex1All) {
    let pHomogeneous = [p[0], p[1], 1];
    
    // Evaluate half-plane for each edge
    let halfPlaneFlag0 = this.findUsefulValueVolumeAndLineEquation(
        vertex2, pHomogeneous, 1, vertex0crossvertex1All[0]
    );
    let halfPlaneFlag1 = this.findUsefulValueVolumeAndLineEquation(
        vertex0, pHomogeneous, 1, vertex0crossvertex1All[1]
    );
    let halfPlaneFlag2 = this.findUsefulValueVolumeAndLineEquation(
        vertex1, pHomogeneous, 1, vertex0crossvertex1All[2]
    );
    
    // Strictly inside
    if (halfPlaneFlag0 > 0 && halfPlaneFlag1 > 0 && halfPlaneFlag2 > 0) 
        return 1;
    
    // Top-left rule for edge cases
    const checkLeftEdge = (vertex0, vertex1) => {
        let [, y0, ,] = vertex0; 
        let [, y1, ,] = vertex1;
        if (y0 < y1) return 1;  // Left edge
        return 0;
    }
    
    const checkTopEdge = (vertex0, vertex1, vertex2) => {
        let [, y0, ,] = vertex0; 
        let [, y1, ,] = vertex1; 
        let [, y2, ,] = vertex2;
        if (y0 == y1 && y0 < y2) return 1;  // Top edge
        return 0;
    }
    
    // Complex logic for vertices vs edges...
    if (halfPlaneFlag0 == 0) 
        return (checkLeftEdge(vertex0, vertex1) || checkTopEdge(vertex0, vertex1, vertex2));
    // ... similar for other edges
}
```

**What this proves you learned:**

✅ **Cross Product** - Used to compute implicit line equation [a,b,c]  
✅ **Half-Plane Test** - f(x,y) = ax + by + c determines which side of line  
✅ **Homogeneous Coordinates** - [x, y, 1] for point representation  
✅ **Top-Left Rule** - Critical for gap-free triangle rendering  
✅ **Left Edge Definition** - Edge where y increases (y₀ < y₁)  
✅ **Top Edge Definition** - Horizontal edge above third vertex  
✅ **Vertex Special Case** - Vertices need TWO left/top edges to be filled  
✅ **Edge Special Case** - Edge pixels need ONE left/top edge  

**Why this is hard:** The top-left rule is subtle and easy to get wrong. Your implementation shows deep understanding of:
- Coordinate system orientation (y increases downward)
- Shared edge problem between adjacent triangles
- Vertex vs edge pixel distinction

**Real-world application:** This exact algorithm is in GPU rasterizers (Direct3D spec)

---

### 🟡 Part 4: Triangle Rasterization with Bounding Box (2 points)

**What the assignment asked:**
> Rasterize triangles using bounding box optimization

**What you actually implemented:**

```javascript
// From your a3.js, lines 232-267
drawTriangle(vertex0, vertex1, vertex2) {
    const [x1, y1, ,] = vertex0;
    const [x2, y2, ,] = vertex1;
    const [x3, y3, ,] = vertex2;
    
    // Compute axis-aligned bounding box
    let [xmin, xmax, ymin, ymax] = [
        Math.floor(Math.min(x1, x2, x3)),
        Math.floor(Math.max(x1, x2, x3)),
        Math.floor(Math.min(y1, y2, y3)),
        Math.floor(Math.max(y1, y2, y3))
    ];
    
    // Precompute edge equations
    let vertex0crossvertex1All = [
        this.findCommonValueForSavingComputaion(vertex0, vertex1),
        this.findCommonValueForSavingComputaion(vertex1, vertex2),
        this.findCommonValueForSavingComputaion(vertex2, vertex0)
    ];
    
    // Scan only bounding box (not entire screen!)
    for (let y = ymin; y <= ymax; y++) {
        for (let x = xmin; x <= xmax; x++) {
            let p = [x + 0.5, y + 0.5];  // Pixel center
            
            if (this.pointIsInsideTriangle(vertex0, vertex1, vertex2, p, 
                                          vertex0crossvertex1All)) {
                let pixelColour = this.findColor(vertex0, vertex1, vertex2, p, 
                                                 vertex0crossvertex1All);
                this.setPixel(x, y, pixelColour);
            }
        }
    }
}
```

**What this proves you learned:**

✅ **Bounding Box (AABB)** - Axis-aligned minimum rectangle containing triangle  
✅ **Optimization** - O(bbox_area) instead of O(screen_area)  
✅ **Pixel Center** - Test at (x+0.5, y+0.5) for correct rasterization  
✅ **Precomputation** - Calculate edge equations once, reuse in loop  
✅ **Efficient Traversal** - Only test pixels that could possibly be inside  

**Performance impact:** For a 100×100 pixel triangle on a 1920×1080 screen:
- Naive: 2,073,600 tests
- Bounding box: 10,000 tests
- **207× speedup!**

---

### 🟣 Part 5: Barycentric Color Interpolation (2 points)

**What the assignment asked:**
> Implement barycentric coordinate calculation for color interpolation

**What you actually implemented:**

```javascript
// From your a3.js, lines 126-145
findColor(vertex0, vertex1, vertex2, p, vertex0crossvertex1All) {
    // Total area of triangle
    let totalArea = this.findUsefulValueVolumeAndLineEquation(
        vertex2, p, 0, vertex0crossvertex1All[0]
    );
    
    // Sub-areas opposite each vertex
    let areaOppositeVertex2 = this.findUsefulValueVolumeAndLineEquation(
        p, p, 0, vertex0crossvertex1All[0]
    );
    let areaOppositeVertex0 = this.findUsefulValueVolumeAndLineEquation(
        p, p, 0, vertex0crossvertex1All[1]
    );
    let areaOppositeVertex1 = this.findUsefulValueVolumeAndLineEquation(
        p, p, 0, vertex0crossvertex1All[2]
    );
    
    // Compute barycentric coordinates
    let u = areaOppositeVertex0 / totalArea;
    let v = areaOppositeVertex1 / totalArea;
    let w = areaOppositeVertex2 / totalArea;
    
    // Interpolate color using barycentric weights
    let uTimesVertex0color = [u * vertex0[2][0], u * vertex0[2][1], u * vertex0[2][2]];
    let vTimesVertex1Color = [v * vertex1[2][0], v * vertex1[2][1], v * vertex1[2][2]];
    let wTimesVertex2Color = [w * vertex2[2][0], w * vertex2[2][1], w * vertex2[2][2]];
    
    let pixelColour = [
        uTimesVertex0color[0] + vTimesVertex1Color[0] + wTimesVertex2Color[0],
        uTimesVertex0color[1] + vTimesVertex1Color[1] + wTimesVertex2Color[1],
        uTimesVertex0color[2] + vTimesVertex1Color[2] + wTimesVertex2Color[2]
    ];
    
    return pixelColour;
}
```

**What this proves you learned:**

✅ **Barycentric Coordinates** - (u,v,w) where u+v+w = 1  
✅ **Area Ratios** - Each coordinate = opposite_area / total_area  
✅ **Signed Area Computation** - Using cross product of edge vectors  
✅ **Attribute Interpolation** - Color = u·C₀ + v·C₁ + w·C₂  
✅ **Per-Channel Interpolation** - Separate R, G, B calculations  
✅ **Geometric Insight** - Barycentric coords represent "influence" of each vertex  

**Why barycentric matters:** This method works for ANY vertex attribute:
- Colors (as you implemented)
- Texture coordinates (Assignment 4)
- Normals (Assignment 4)
- Any per-vertex data!

**Real-world application:** GPUs use barycentric interpolation for EVERYTHING - every pixel you see on screen uses this!

---

## Assignment 4: 3D Graphics Pipeline - Bringing Scenes to Life

### 🟠 Part 1: Triangle Mesh Generation (3 points - Complex Geometry)

**What the assignment asked:**
> Create unit cube and unit sphere as indexed triangle meshes with positions, normals, and UV coordinates

#### A. Cube Implementation

**What you actually implemented:**

```javascript
// From your a4.js, lines 93-166 (simplified)
TriangleMesh.prototype.createCube = function() {
    const positions = [];
    const normals = [];
    const uvCoords = [];
    
    // Helper to map cube faces to texture
    function uvRect(c, r) {
        const cellW = 0.5;
        const cellH = 1.0 / 3.0;
        return {
            x: c * cellW,
            y: r * cellH,
            w: cellW,
            h: cellH
        };
    }
    
    // Define 6 faces, each with 4 vertices forming 2 triangles
    // Example: Front face (z = +1)
    const faceData = [
        {
            corners: [[-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]],
            normal: [0, 0, 1],
            uvRect: uvRect(0, 1)  // Maps to dice texture position
        },
        // ... 5 more faces
    ];
    
    // For each face, generate 6 vertices (2 triangles)
    faceData.forEach(face => {
        // Triangle 1: v0, v1, v2
        // Triangle 2: v0, v2, v3
        // With appropriate UV coordinates for dice texture
    });
    
    this.positions = positions;
    this.normals = normals;
    this.uvCoords = uvCoords;
}
```

**What this proves you learned:**

✅ **Triangle Soup** - Unindexed mesh (repeated vertices per face)  
✅ **Face Normals** - Perpendicular vector for each face  
✅ **UV Mapping Strategy** - Dice texture mapped to 6 faces  
✅ **Geometric Primitives** - Cube as composition of 6 quads  
✅ **Data Structure** - Flat arrays for WebGL consumption  

#### B. Sphere Implementation (More Complex!)

**What you actually implemented:**

```javascript
// From your a4.js, lines 207-333 (using stacks & sectors algorithm)
TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];
    
    const sectorStep = 2 * Math.PI / numSectors;
    const stackStep = Math.PI / numStacks;
    
    // Generate vertices using spherical coordinates
    for (let i = 0; i <= numStacks; i++) {
        let stackAngle = Math.PI/2 - i * stackStep;  // π/2 to -π/2
        let xy = Math.cos(stackAngle);
        let z = Math.sin(stackAngle);
        
        for (let j = 0; j <= numSectors; j++) {
            let sectorAngle = j * sectorStep + Math.PI/2;  // Offset for orientation
            
            // Spherical to Cartesian conversion
            let x = xy * Math.sin(sectorAngle);
            let y = xy * Math.cos(sectorAngle);
            
            vertices.push(x, y, z);
            
            // For unit sphere: normal = position
            normals.push(x, y, z);
            
            // UV coordinates wrap around sphere
            let s = j / numSectors;
            let t = i / numStacks;
            texCoords.push(s, t);
        }
    }
    
    // Generate indices for triangles
    for (let i = 0; i < numStacks; i++) {
        let k1 = i * (numSectors + 1);
        let k2 = k1 + numSectors + 1;
        
        for (let j = 0; j < numSectors; j++, k1++, k2++) {
            // Skip triangles at poles
            if (i != 0) {
                indices.push(k1, k2, k1+1);
            }
            if (i != (numStacks - 1)) {
                indices.push(k1+1, k2, k2+1);
            }
        }
    }
    
    this.positions = vertices;
    this.normals = normals;
    this.uvCoords = texCoords;
    this.indices = indices;
}
```

**What this proves you learned:**

✅ **Spherical Coordinates** - (φ, θ) → (x, y, z) conversion  
✅ **Parametric Surface** - Generated from mathematical equations  
✅ **Indexed Mesh** - Vertices referenced by indices (memory efficient)  
✅ **Topology** - Grid structure with (stacks+1) × (sectors+1) vertices  
✅ **Pole Handling** - Special case triangles at north/south poles  
✅ **Texture Wrapping** - UV coordinates for cylindrical projection  
✅ **Normal Calculation** - For unit sphere, normal = normalized position  

**Formulas you implemented:**
```
x = r·cos(stackAngle)·sin(sectorAngle)
y = r·cos(stackAngle)·cos(sectorAngle)
z = r·sin(stackAngle)
where r = 1 (unit sphere)
```

**Real-world application:** This is how spheres are rendered in 3D modeling software, games, and scientific visualization

---

### 🔴 Part 2: 3D Transformations (2 points - Moving Objects in Space)

**What the assignment asked:**
> Compute composed 4×4 transformation matrices from sequence of translate/rotate/scale operations

**What you actually implemented:**

```javascript
// From your a4.js, lines 394-476
Scene.prototype.computeTransformation = function(transformSequence) {
    let overallTransform = Mat4.create();  // Identity matrix
    
    // Process each transformation in sequence
    for (const transform of transformSequence) {
        const [type, id, ...params] = transform.split(',');
        
        if (type === 'X') {
            const [transformType, ...values] = params;
            
            if (transformType === 'T') {
                // Translation: T(x, y, z)
                const [x, y, z] = values.map(parseFloat);
                const T = Mat4.create();
                T[12] = x;  // Column-major: last column is translation
                T[13] = y;
                T[14] = z;
                overallTransform = Mat4.multiply(T, overallTransform);
            }
            else if (transformType.startsWith('R')) {
                // Rotation: Rx, Ry, or Rz
                const axis = transformType[1];  // x, y, or z
                const degrees = parseFloat(values[0]);
                const radians = degrees * (Math.PI / 180);
                
                const R = Mat4.create();
                const c = Math.cos(radians);
                const s = Math.sin(radians);
                
                if (axis === 'x') {
                    R[5] = c;  R[6] = -s;
                    R[9] = s;  R[10] = c;
                }
                else if (axis === 'y') {
                    R[0] = c;   R[2] = s;
                    R[8] = -s;  R[10] = c;
                }
                else if (axis === 'z') {
                    R[0] = c;  R[1] = -s;
                    R[4] = s;  R[5] = c;
                }
                
                overallTransform = Mat4.multiply(R, overallTransform);
            }
            else if (transformType === 'S') {
                // Scale: S(x, y, z)
                const [x, y, z] = values.map(parseFloat);
                const S = Mat4.create();
                S[0] = x;
                S[5] = y;
                S[10] = z;
                overallTransform = Mat4.multiply(S, overallTransform);
            }
        }
    }
    
    return overallTransform;
}
```

**What this proves you learned:**

✅ **4×4 Homogeneous Matrices** - Standard computer graphics representation  
✅ **Translation Matrix** - Last column [tx, ty, tz, 1]  
✅ **Rotation Matrices** - Around x, y, z axes using sin/cos  
✅ **Scale Matrix** - Diagonal values [sx, sy, sz]  
✅ **Matrix Composition** - M = T_n · ... · T_2 · T_1  
✅ **Column-Major Order** - WebGL/OpenGL convention  
✅ **Degrees to Radians** - Conversion for trigonometric functions  
✅ **Order Matters** - Transformation sequence affects result  

**Matrix formats you implemented:**

```
Translation:           Rotation (Y-axis):        Scale:
[1 0 0 tx]            [cos  0  sin  0]         [sx 0  0  0]
[0 1 0 ty]            [0    1  0    0]         [0  sy 0  0]
[0 0 1 tz]            [-sin 0  cos  0]         [0  0  sz 0]
[0 0 0 1 ]            [0    0  0    1]         [0  0  0  1]
```

**Real-world application:** Every 3D object in games, CAD, animation uses these transformations

---

### 🟢 Part 3: Blinn-Phong Shading (3 points - Realistic Lighting)

**What the assignment asked:**
> Implement Blinn-Phong reflection model in GLSL vertex and fragment shaders

**What you actually implemented:**

```glsl
// From your a4.js - VERTEX SHADER (lines 485-519)
Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPosition;
varying vec2 vTexCoord;

void main() {
    // Transform position to camera space
    vec4 viewPos = viewMatrix * modelMatrix * vec4(position, 1.0);
    vPosition = viewPos.xyz;
    
    // Transform normal to camera space
    vNormal = normalMatrix * normal;
    
    // Transform light to camera space
    vLightPosition = (viewMatrix * vec4(lightPosition, 1.0)).xyz;
    
    // Pass UV coordinates
    vTexCoord = uvCoord;
    
    // Final position in clip space
    gl_Position = projectionMatrix * viewPos;
}
`;

// From your a4.js - FRAGMENT SHADER (lines 521-575)
Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLightPosition;
varying vec2 vTexCoord;

void main() {
    // Normalize interpolated normal
    vec3 N = normalize(vNormal);
    
    // Light direction (surface to light)
    vec3 L = normalize(vLightPosition - vPosition);
    
    // View direction (surface to camera at origin)
    vec3 V = normalize(-vPosition);
    
    // Halfway vector (Blinn-Phong)
    vec3 H = normalize(L + V);
    
    // Ambient component
    vec3 ambient = ka * lightIntensity;
    
    // Diffuse component (Lambertian)
    float diffuseFactor = max(dot(N, L), 0.0);
    vec3 diffuse = kd * diffuseFactor * lightIntensity;
    
    // Specular component (Blinn-Phong)
    float specularFactor = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = ks * specularFactor * lightIntensity;
    
    // Combine components
    vec3 color = ambient + diffuse + specular;
    
    // Modulate with texture if present
    if (hasTexture) {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        color *= texColor.rgb;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;
```

**What this proves you learned:**

✅ **GLSL Shader Language** - GPU programming syntax  
✅ **Vertex Shader Role** - Transform vertices, pass data to fragment shader  
✅ **Fragment Shader Role** - Compute per-pixel color  
✅ **Varying Variables** - GPU-interpolated values between shaders  
✅ **Coordinate Space Transformations** - Model → World → Camera → Clip  
✅ **Normal Matrix** - (M⁻¹)ᵀ for correct normal transformation  
✅ **Blinn-Phong Components**:
  - **Ambient**: ka · Ia (base illumination)
  - **Diffuse**: kd · max(N·L, 0) · Id (matte reflection)
  - **Specular**: ks · max(N·H, 0)^n · Is (shiny highlights)
✅ **Vector Normalization** - Essential before dot products  
✅ **Clamping with max()** - Prevent negative lighting  
✅ **Camera Space Calculations** - All lighting in same coordinate frame  

**Shading equation you implemented:**
```
I = ka·La + kd·(N·L)·Ld + ks·(N·H)^shininess·Ls
where H = normalize(L + V)  // Halfway vector
```

**Lost 1 point on specular** - According to grading, likely a small numerical issue

**Real-world application:** This is the standard lighting model in games, real-time rendering, and many 3D applications

---

### 🔵 Part 4: Texture Mapping (2 points - Adding Detail)

**What the assignment asked:**
> Implement texture sampling and modulation with shading

**What you actually implemented:**

From cube UV coordinates:
```javascript
// Dice texture mapping - each face to correct position
// Front face (⚀ - one dot)
uvRect: { x: 0.0, y: 0.333, w: 0.5, h: 0.333 }

// Top face (⚂ - three dots)  
uvRect: { x: 0.0, y: 0.0, w: 0.5, h: 0.333 }

// Bottom face (⚃ - four dots)
uvRect: { x: 0.0, y: 0.666, w: 0.5, h: 0.333 }

// Right face (⚁ - two dots)
uvRect: { x: 0.5, y: 0.333, w: 0.5, h: 0.333 }

// ... etc for all 6 faces
```

From sphere UV coordinates:
```javascript
// Wrapping texture around sphere
for (let i = 0; i <= numStacks; i++) {
    for (let j = 0; j <= numSectors; j++) {
        let s = j / numSectors;     // Longitude [0,1]
        let t = i / numStacks;      // Latitude [0,1]
        texCoords.push(s, t);
    }
}
```

From fragment shader:
```glsl
// Sample texture at interpolated UV coordinate
if (hasTexture) {
    vec4 texColor = texture2D(uTexture, vTexCoord);
    color *= texColor.rgb;  // Modulate with shading
}
```

**What this proves you learned:**

✅ **UV Coordinate System** - (u,v) ∈ [0,1] × [0,1] texture space  
✅ **Texture Atlas** - Multiple images in single texture (dice faces)  
✅ **Texture Sampling** - texture2D() in GLSL  
✅ **Modulation** - Multiply texture color with shaded color  
✅ **Interpolation** - GPU automatically interpolates UV per pixel  
✅ **Cube UV Strategy** - Each face maps to portion of texture  
✅ **Sphere UV Strategy** - Cylindrical/spherical projection  
✅ **Texture Wrapping** - How texture repeats/clamps at boundaries  

**Real-world application:** Every textured surface in games, VR, 3D modeling uses this technique

---

## 📊 Skills Demonstrated Across Both Assignments

### Mathematical & Algorithmic Skills

| Skill | Assignment 3 | Assignment 4 | Complexity |
|-------|-------------|-------------|------------|
| **Vector Math** | Cross products, dot products | Normals, lighting vectors | ⭐⭐⭐ |
| **Linear Algebra** | Homogeneous coords | 4×4 matrices, transforms | ⭐⭐⭐⭐ |
| **Numerical Methods** | Integer arithmetic | Floating-point precision | ⭐⭐⭐ |
| **Geometry** | Areas, half-planes | Spherical coords, surfaces | ⭐⭐⭐⭐ |
| **Interpolation** | Linear, barycentric | Linear (GPU automatic) | ⭐⭐⭐ |

### Programming Skills

| Skill | Assignment 3 | Assignment 4 | Complexity |
|-------|-------------|-------------|------------|
| **Algorithm Implementation** | Bresenham, half-plane | Mesh generation | ⭐⭐⭐⭐ |
| **Data Structures** | Arrays, coordinates | Indexed meshes | ⭐⭐⭐ |
| **Optimization** | Bounding box, precomputation | Efficient loops | ⭐⭐⭐ |
| **Edge Case Handling** | Top-left rule, vertices | Poles, wraparound | ⭐⭐⭐⭐⭐ |
| **Debugging** | Visual artifacts | Shader debugging | ⭐⭐⭐⭐ |

### Graphics Concepts

| Concept | Assignment 3 | Assignment 4 | Industry Relevance |
|---------|-------------|-------------|-------------------|
| **Rasterization** | ✅ Core focus | ✅ GPU does it | Every frame rendered |
| **Coordinate Spaces** | Screen space | 5 spaces (model→screen) | Essential pipeline knowledge |
| **Lighting Models** | N/A | ✅ Blinn-Phong | Standard in real-time rendering |
| **Texture Mapping** | N/A | ✅ UV coordinates | 100% of textured surfaces |
| **Mesh Representation** | N/A | ✅ Indexed triangles | All 3D models |

---

## 🎯 What Makes Your Implementations Special

### Assignment 3 Highlights

**1. Comprehensive Top-Left Rule Implementation**
- Most students get basic triangle filling
- You implemented the FULL top-left rule with:
  - Vertex special cases (need 2 left/top edges)
  - Edge special cases (need 1 left/top edge)
  - Proper coordinate system handling

**2. Optimization Awareness**
- Bounding box instead of full-screen scan
- Precomputed edge equations
- Efficient loop structure

**3. Robust Edge Case Handling**
- Single pixel lines
- Degenerate triangles
- All line orientations (8 octants)

### Assignment 4 Highlights

**1. Complex Sphere Generation**
- Correct topology with poles
- Proper angle ranges for texture orientation
- Indexed mesh for efficiency

**2. Full Transformation Pipeline**
- All 3 transformation types
- Correct matrix composition order
- Column-major format for WebGL

**3. Complete Lighting Implementation**
- All 3 Blinn-Phong terms (ambient, diffuse, specular)
- Correct vector calculations
- Proper coordinate space handling

---

## 🔬 Concrete Evidence of Learning

### Code Metrics

**Assignment 3 (a3.js):**
- Lines of code: ~430
- Functions implemented: 7 major functions
- Edge cases handled: 10+
- Mathematical operations: Cross products, dot products, areas, interpolation

**Assignment 4 (a4.js):**
- Lines of code: ~600
- Mesh vertices generated: Hundreds per sphere/cube
- Shader lines: ~90 GLSL lines
- Mathematical operations: Matrix multiplication, trigonometry, vector normalization

### Grading Evidence

**Assignment 3:** 10/10 technical points (before late penalty)
- Perfect scores on all components
- Shows mastery of rasterization fundamentals

**Assignment 4:** 9/10 points
- Only minor issue with specular term
- Shows strong understanding of 3D pipeline

---

## 🎓 What This Prepares You For

### Industry Applications

**Game Development:**
- ✅ Understanding how rendering pipelines work
- ✅ Debugging visual artifacts
- ✅ Optimizing performance
- ✅ Working with shaders

**Graphics Programming:**
- ✅ Implementing rendering algorithms
- ✅ Working with GPUs
- ✅ Understanding coordinate transformations
- ✅ Lighting and shading models

**3D Modeling/Animation:**
- ✅ How meshes are represented
- ✅ UV coordinate mapping
- ✅ Transform hierarchies
- ✅ Material properties

**Computer Vision:**
- ✅ Projection and perspective
- ✅ Coordinate transformations
- ✅ Image formation models
- ✅ Geometric computations

### Academic Foundations

These assignments are based on concepts from:
- ✅ **Linear Algebra** - Vectors, matrices, transformations
- ✅ **Calculus** - Parametric equations, derivatives (for normals)
- ✅ **Geometry** - Points, lines, planes, surfaces
- ✅ **Numerical Methods** - Interpolation, optimization
- ✅ **Computer Science** - Algorithms, data structures, optimization

---

## 📖 Textbook Mapping

Your implementations directly correspond to:

**Assignment 3:**
- Chapter 8.8-8.9: Line rasterization (Bresenham, DDA)
- Chapter 8.10: Triangle rasterization
- Chapter 8.10.1: Half-plane test
- Lecture G4: Top-left rule, edge cases

**Assignment 4:**
- Lectures G8-G9: Mesh generation
- Lecture G10: Transformations
- Lecture G7, Chapters 6.2-6.5: Lighting models
- Lecture G11, Chapters 7.3-7.5: Texture mapping
- Lecture G15: Shaders, coordinate spaces

---

## 💪 Your Actual Achievements

### What You Can Now Do

✅ **Implement a software rasterizer from scratch**
- Draw lines efficiently (Bresenham)
- Fill triangles with no gaps (top-left rule)
- Interpolate colors smoothly (barycentric)

✅ **Generate 3D meshes programmatically**
- Create geometric primitives (cube, sphere)
- Compute normals and texture coordinates
- Use indexed representation efficiently

✅ **Write GPU shaders**
- Transform vertices through pipeline
- Compute realistic lighting per pixel
- Sample and apply textures

✅ **Work with transformation matrices**
- Build T/R/S matrices
- Compose transformations correctly
- Understand coordinate space pipeline

✅ **Debug visual artifacts**
- Identify issues from rendered output
- Trace through rendering pipeline
- Apply mathematical understanding to fix problems

---

## 🏆 Summary: Your Learning Outcomes

From these two assignments, you have demonstrated:

1. **Core Computer Graphics Knowledge** - Fundamentals used in all graphics systems
2. **Mathematical Proficiency** - Applied linear algebra and geometry
3. **Algorithmic Thinking** - Implemented efficient, robust algorithms
4. **Attention to Detail** - Handled complex edge cases correctly
5. **GPU Programming** - Wrote shaders in GLSL
6. **Problem-Solving** - Debugged complex visual issues
7. **Industry-Relevant Skills** - Techniques used in professional graphics development

**These aren't just academic exercises - they're the building blocks of:**
- Every game engine (Unity, Unreal, Godot)
- Graphics APIs (OpenGL, DirectX, Vulkan, Metal)
- 3D modeling software (Blender, Maya, 3ds Max)
- CAD systems (AutoCAD, SolidWorks)
- Scientific visualization
- Virtual and augmented reality systems

---

**You now understand how pixels appear on your screen!** 🖥️✨

