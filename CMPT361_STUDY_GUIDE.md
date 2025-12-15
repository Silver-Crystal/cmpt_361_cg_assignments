# CMPT 361 Computer Graphics - Study Guide for Assignments 3 & 4

This comprehensive study guide covers the key concepts learned from Assignment 3 (Rasterization) and Assignment 4 (3D Graphics Pipeline), along with potential final exam questions.

## Table of Contents
1. [Assignment 3: Rasterization - Key Learning Objectives](#assignment-3-rasterization)
2. [Assignment 4: 3D Graphics Pipeline - Key Learning Objectives](#assignment-4-3d-graphics-pipeline)
3. [Final Exam Preparation - Sample Questions](#final-exam-questions)
4. [Concrete Examples from Implementations](#concrete-examples)

---

## Assignment 3: Rasterization

### 1. Line Rasterization (2 points)

**What You Learned:**
- **DDA Algorithm**: Digital Differential Analyzer for line drawing
- **Bresenham's Algorithm**: Integer-only line rasterization algorithm
- **Handling All Orientations**: Lines with different slopes and directions

**Key Concepts:**
```javascript
// Slope conditions and cases
if (dx >= dy) {
    // Horizontal-dominant case: iterate along x-axis
    // Decision variable: d = 2*dy - dx
    // Update rules:
    //   if (d > 0): increment y, d += 2*(dy - dx)
    //   else: d += 2*dy
}
else {
    // Vertical-dominant case: iterate along y-axis  
    // Decision variable: d = 2*dx - dy
    // Update rules:
    //   if (d > 0): increment x, d += 2*(dx - dy)
    //   else: d += 2*dx
}
```

**Important Details:**
- Handle all 8 octants (all possible line orientations)
- Support lines going in any direction (low-to-high, high-to-low for both x and y)
- Handle degenerate cases (single pixel, horizontal/vertical lines)
- Step direction: `sx = (x1 < x2) ? 1 : -1`, `sy = (y1 < y2) ? 1 : -1`

**Textbook Reference:** Chapter 8.8-8.9

---

### 2. Color Interpolation (1 point)

**What You Learned:**
- Linear interpolation along a line segment
- RGB color channel interpolation
- Parametric representation of points on a line

**Key Concepts:**
```javascript
// Interpolation parameter t ∈ [0, 1]
// t = 0 at start point, t = 1 at end point
t = currentStep / totalSteps;

// Interpolate each color channel
color[channel] = c1[channel] + t * (c2[channel] - c1[channel])
```

**Formula:**
```
C(t) = (1-t)·C₁ + t·C₂
where t = distance_traveled / total_distance
```

---

### 3. Triangle Inside-Outside Test (3 points)

**What You Learned:**
- **Half-plane test** using implicit line equations
- **Cross products** for determining point-line relationships
- **Top-left rule** for handling edge cases

**Key Concepts:**

**Half-Plane Test:**
```javascript
// Line equation: ax + by + c = 0
// For line through (x₀,y₀) and (x₁,y₁):
a = y₁ - y₀
b = x₀ - x₁  
c = x₁·y₀ - x₀·y₁

// Test point (px, py):
f(px, py) = a·px + b·py + c

// If f(p) > 0: point on one side
// If f(p) < 0: point on other side
// If f(p) = 0: point on the line
```

**Top-Left Rule:**
- A pixel is filled if:
  - It is completely inside the triangle (all three half-plane tests positive), OR
  - It is on a **left edge**, OR
  - It is on a **top edge**
  
**Definitions:**
- **Left edge**: Edge where starting vertex has smaller y-coordinate than ending vertex
- **Top edge**: Horizontal edge where both vertices are above the third vertex

**Why Top-Left Rule Matters:**
- Ensures no gaps between adjacent triangles sharing an edge
- Ensures no pixel is colored twice (order independence)
- Standard in graphics hardware (Direct3D, OpenGL)

**Implementation Note:**
```javascript
// For vertices: check if point is at a corner
// Corner pixels need TWO left/top edges to be filled
// Regular edge pixels need ONE left/top edge to be filled
```

**Textbook Reference:** Chapter 8.10.1, Lecture G4

---

### 4. Triangle Rasterization with Bounding Box (2 points)

**What You Learned:**
- Efficient triangle rasterization using bounding boxes
- Avoiding naive pixel-by-pixel screen scanning

**Key Concepts:**
```javascript
// Compute axis-aligned bounding box
xmin = Math.floor(Math.min(x1, x2, x3))
xmax = Math.floor(Math.max(x1, x2, x3))
ymin = Math.floor(Math.min(y1, y2, y3))
ymax = Math.floor(Math.max(y1, y2, y3))

// Only test pixels within bounding box
for (y = ymin; y <= ymax; y++) {
    for (x = xmin; x <= xmax; x++) {
        if (pointIsInsideTriangle(x, y)) {
            setPixel(x, y, color)
        }
    }
}
```

**Performance:**
- Bounding box reduces tests from O(screen_width × screen_height) to O(bbox_width × bbox_height)
- Critical for real-time graphics

---

### 5. Barycentric Color Interpolation (2 points)

**What You Learned:**
- **Barycentric coordinates** for interpolation within triangles
- Smooth color gradients across triangle faces
- Area ratios and their geometric meaning

**Key Concepts:**

**Barycentric Coordinates:**
For point P inside triangle with vertices V₀, V₁, V₂:
```
P = u·V₀ + v·V₁ + w·V₂
where u + v + w = 1
```

**Computing Barycentric Coordinates using Areas:**
```javascript
// Total area of triangle V₀V₁V₂
totalArea = signedArea(V₀, V₁, V₂)

// Sub-areas (using same cross product method as half-plane test)
areaOppositeV₀ = signedArea(V₁, V₂, P)  // Triangle V₁V₂P
areaOppositeV₁ = signedArea(V₂, V₀, P)  // Triangle V₂V₀P  
areaOppositeV₂ = signedArea(V₀, V₁, P)  // Triangle V₀V₁P

// Barycentric coordinates
u = areaOppositeV₀ / totalArea
v = areaOppositeV₁ / totalArea
w = areaOppositeV₂ / totalArea
```

**Color Interpolation:**
```javascript
// Interpolate each RGB channel
color.r = u * V₀.r + v * V₁.r + w * V₂.r
color.g = u * V₀.g + v * V₁.g + w * V₂.g
color.b = u * V₀.b + v * V₁.b + w * V₂.b
```

**Properties:**
- Barycentric coordinates are perspective-invariant (important for 3D)
- Can interpolate any vertex attribute (colors, texture coordinates, normals, etc.)
- u, v, w ≥ 0 for points inside the triangle

**Textbook Reference:** Chapter 8.10

---

## Assignment 4: 3D Graphics Pipeline

### 1. Triangle Mesh Generation (3 points)

**What You Learned:**
- Creating indexed triangle meshes (vertex list + index list)
- Computing vertex positions, normals, and UV coordinates
- Cube and sphere mesh construction algorithms

#### A. Unit Cube

**Specifications:**
- Bottom-left-front corner: (-1, -1, +1)
- Top-right-back corner: (+1, +1, -1)
- 6 faces, each with 2 triangles
- Face normals point outward

**Key Concepts:**
```javascript
// For each face, define 4 vertices with:
// - Position (8 unique corners, but repeated per face)
// - Normal (perpendicular to face)
// - UV coordinates (for texture mapping)

// Example: Front face (z = +1)
positions: [
    -1, -1, +1,  // bottom-left
     1, -1, +1,  // bottom-right
     1,  1, +1,  // top-right
    -1,  1, +1   // top-left
]
normals: [0, 0, 1, ...]  // All pointing in +z direction
```

**UV Mapping for Dice Texture:**
- Each face maps to a section of the texture image
- Front face (⚀): one dot
- Arrangement: ⚅⚄⚀⚁ with ⚂ above ⚅, ⚃ below ⚅
- Careful planning of UV coordinates per vertex

#### B. Unit Sphere (Stacks and Sectors)

**Specifications:**
- Center at origin, radius = 1
- Parameterized using spherical coordinates (φ, θ)
- `numStacks`: latitude divisions
- `numSectors`: longitude divisions

**Spherical Coordinate Equations:**
```javascript
// φ (phi): latitude angle from +y axis (0 to π)
// θ (theta): longitude angle around y-axis (0 to 2π)

stackAngle = π/2 - i * (π / numStacks)
sectorAngle = j * (2π / numSectors)

x = r * cos(stackAngle) * sin(sectorAngle)
y = r * sin(stackAngle)
z = r * cos(stackAngle) * cos(sectorAngle)

// For unit sphere: r = 1
// Normal at surface: n = (x, y, z) / r = (x, y, z)
```

**Topology:**
```javascript
// Vertices per stack: numSectors + 1 (wraparound)
// Total vertices: (numStacks + 1) * (numSectors + 1)

// Indices for triangles:
for (stack) {
    for (sector) {
        k1 = stack * (numSectors + 1) + sector
        k2 = k1 + numSectors + 1
        
        // Two triangles per quad (except poles)
        if (stack != 0) {
            triangle1: [k1, k2, k1+1]
        }
        if (stack != numStacks - 1) {
            triangle2: [k1+1, k2, k2+1]
        }
    }
}
```

**UV Coordinates:**
```javascript
u = sector / numSectors    // [0, 1] around circumference
v = stack / numStacks      // [0, 1] from north to south pole
```

**Textbook Reference:** Lectures G8-G9, http://www.songho.ca/opengl/gl_sphere.html

---

### 2. Transformations (2 points)

**What You Learned:**
- 4×4 transformation matrices
- Translation, rotation, and scaling
- Matrix composition and order of operations

**Key Concepts:**

#### Translation Matrix:
```
T(tx, ty, tz) = | 1  0  0  tx |
                | 0  1  0  ty |
                | 0  0  1  tz |
                | 0  0  0  1  |
```

#### Rotation Matrices:

**Around X-axis (pitch):**
```
Rx(θ) = | 1    0       0     0 |
        | 0  cos(θ) -sin(θ)  0 |
        | 0  sin(θ)  cos(θ)  0 |
        | 0    0       0     1 |
```

**Around Y-axis (yaw):**
```
Ry(θ) = | cos(θ)  0  sin(θ)  0 |
        |   0     1    0     0 |
        |-sin(θ)  0  cos(θ)  0 |
        |   0     0    0     1 |
```

**Around Z-axis (roll):**
```
Rz(θ) = | cos(θ) -sin(θ)  0  0 |
        | sin(θ)  cos(θ)  0  0 |
        |   0       0     1  0 |
        |   0       0     0  1 |
```

#### Scaling Matrix:
```
S(sx, sy, sz) = | sx  0   0   0 |
                | 0   sy  0   0 |
                | 0   0   sz  0 |
                | 0   0   0   1 |
```

**Composing Transformations:**
```javascript
// Order matters! Read right-to-left for composition
// T * R * S means: scale first, then rotate, then translate

// For sequence [T1, R1, S1]:
// Apply in order: M = T1 * R1 * S1

// Example: Rotate object around its center (not origin)
// 1. Translate to origin: T(-cx, -cy, -cz)
// 2. Rotate: R(θ)
// 3. Translate back: T(cx, cy, cz)
// Result: M = T(cx, cy, cz) * R(θ) * T(-cx, -cy, -cz)
```

**Degrees to Radians:**
```javascript
radians = degrees * (Math.PI / 180)
```

**Textbook Reference:** Lecture G10

---

### 3. Shading - Blinn-Phong Reflection Model (3 points)

**What You Learned:**
- Phong illumination model components
- Vertex and fragment shaders in GLSL
- Per-fragment shading calculations

**Blinn-Phong Shading Model:**

The final color is:
```
I = ka * La + kd * (N · L) * Ld + ks * (N · H)^shininess * Ls
```

Where:
- **Ambient Component**: `ka * La`
  - Base illumination (indirect/ambient light)
  - `ka`: ambient reflection coefficient (material property)
  - `La`: ambient light intensity
  
- **Diffuse Component**: `kd * (N · L) * Ld`
  - Matte/Lambertian reflection
  - `kd`: diffuse reflection coefficient (material property)
  - `N`: surface normal (normalized)
  - `L`: light direction (normalized, from surface to light)
  - `Ld`: diffuse light intensity
  
- **Specular Component**: `ks * (N · H)^shininess * Ls`
  - Shiny highlights
  - `ks`: specular reflection coefficient (material property)
  - `H`: halfway vector between view and light directions
  - `shininess`: specular exponent (higher = smaller, sharper highlight)
  - `Ls`: specular light intensity

**Key Vectors:**
```javascript
// L: Light direction (surface point to light)
L = normalize(lightPosition - surfacePosition)

// V: View direction (surface point to camera)
V = normalize(cameraPosition - surfacePosition)

// H: Halfway vector (Blinn-Phong modification)
H = normalize(L + V)

// N: Surface normal (must be normalized)
N = normalize(surfaceNormal)
```

**GLSL Shader Implementation:**

**Vertex Shader:**
```glsl
// Transform vertex position to clip space
gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

// Transform normal to world/camera space
vec3 worldNormal = normalMatrix * normal;

// Pass interpolated values to fragment shader
varying vec3 vNormal;
varying vec3 vPosition;
vNormal = worldNormal;
vPosition = (viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;
```

**Fragment Shader:**
```glsl
// Normalize interpolated normal
vec3 N = normalize(vNormal);

// Light direction
vec3 L = normalize(lightPosition - vPosition);

// View direction (camera at origin in camera space)
vec3 V = normalize(-vPosition);

// Halfway vector
vec3 H = normalize(L + V);

// Compute components
vec3 ambient = ka * lightIntensity;
vec3 diffuse = kd * max(dot(N, L), 0.0) * lightIntensity;
vec3 specular = ks * pow(max(dot(N, H), 0.0), shininess) * lightIntensity;

// Final color
vec3 color = ambient + diffuse + specular;
gl_FragColor = vec4(color, 1.0);
```

**Important Notes:**
- Use `max(dot(), 0.0)` to clamp negative values (light behind surface)
- All vectors must be normalized before dot products
- Normal transformation: use inverse-transpose of model matrix
- `La = Ld = Ls = lightIntensity` (simplified model)

**Coordinate Spaces:**
- Model space: object's local coordinates
- World space: after model transformation
- Camera/View space: after view transformation
- Clip space: after projection transformation

**Textbook Reference:** Lecture G7, Chapters 6.2-6.5

---

### 4. Texturing (2 points)

**What You Learned:**
- Texture coordinate mapping (UV coordinates)
- Texture sampling in fragment shader
- Modulating shaded color with texture color

**Key Concepts:**

**UV Coordinate System:**
- U: horizontal axis [0, 1], left to right
- V: vertical axis [0, 1], bottom to top (OpenGL convention)
- Each vertex has (u, v) texture coordinates
- Fragment shader receives interpolated UV per pixel

**Texture Mapping Process:**
```javascript
// 1. Define UV coordinates per vertex (in mesh generation)
uvCoords = [u0, v0, u1, v1, u2, v2, ...]

// 2. Interpolate UV coordinates (automatic in GPU)
// Fragment shader receives: varying vec2 vTexCoord

// 3. Sample texture at interpolated UV
vec4 texColor = texture2D(uTexture, vTexCoord);

// 4. Modulate with shading
vec3 finalColor = shadedColor * texColor.rgb;
```

**GLSL Implementation:**
```glsl
// Fragment Shader
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

void main() {
    // Compute Blinn-Phong shading
    vec3 shadedColor = ambient + diffuse + specular;
    
    // Apply texture if present
    if (hasTexture) {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        shadedColor *= texColor.rgb;
    }
    
    gl_FragColor = vec4(shadedColor, 1.0);
}
```

**UV Mapping Strategies:**

**Cube:**
- Each face maps to part of texture
- Plan UV grid on paper first
- Corner vertices may have different UVs per face

**Sphere:**
- Cylindrical/spherical projection
- U wraps around longitude (0 to 1)
- V goes from pole to pole (0 to 1)
- Texture orientation depends on angle ranges in sphere generation

**Textbook Reference:** Lecture G11, Chapters 7.3-7.5

---

## Final Exam Questions

### Section 1: Rasterization and 2D Graphics

**Question 1: Line Rasterization**
```
Given a line from (2, 1) to (7, 4):
a) What is the slope category? (horizontal/vertical dominant)
b) Initialize the Bresenham decision variable d₀
c) List the first 3 pixels that would be drawn
d) Show the decision variable updates for these pixels
```

**Answer:**
```
a) dx = 5, dy = 3, dx > dy → horizontal dominant
b) d₀ = 2*dy - dx = 2*3 - 5 = 1
c) Pixels: (2,1), (3,1), (4,2)
d) 
   Step 0: (2,1), d = 1
   Step 1: d > 0, so y++, (3,2), d = 1 + 2*(3-5) = -3
   Step 2: d ≤ 0, (4,2), d = -3 + 2*3 = 3
```

**Question 2: DDA vs. Bresenham**
```
Compare DDA and Bresenham line algorithms:
a) Which uses floating-point arithmetic?
b) Which is more efficient for hardware implementation?
c) Why does Bresenham multiply the decision variable by Δx?
```

**Answer:**
```
a) DDA uses floating-point (increments y by slope m)
b) Bresenham is more efficient (integer-only operations)
c) Multiplying by Δx converts floating-point comparisons 
   to integer comparisons without changing sign
```

**Question 3: Top-Left Rule**
```
Given a triangle with vertices A(0,0), B(4,0), C(2,3):
a) Which edges are "left edges"?
b) Which edges are "top edges"?
c) Should pixel (2,0) be filled? Why or why not?
d) Why do we need the top-left rule?
```

**Answer:**
```
a) Left edges: AB (y increases 0→0, check x), BC (y increases 0→3)
   Actually: Left edge means lower y to higher y
   BC: (4,0)→(2,3) - y increases, so LEFT
   CA: (2,3)→(0,0) - y decreases, not left
   AB: (0,0)→(4,0) - y constant, need to check if top
   
b) Top edge: AB (horizontal, both y=0 below C at y=3)

c) Pixel (2,0) is on edge AB (top edge) → YES, fill it

d) Prevents gaps and double-coloring at shared edges between triangles
```

**Question 4: Barycentric Coordinates**
```
Triangle vertices: V₀(0,0), V₁(6,0), V₂(0,6)
Point P(2,2) is inside the triangle.
a) Compute the barycentric coordinates (u, v, w) for P
b) If vertex colors are V₀=red(1,0,0), V₁=green(0,1,0), 
   V₂=blue(0,0,1), what is the interpolated color at P?
```

**Answer:**
```
a) Using signed area with cross product:
   For triangle with vertices V₀(0,0), V₁(6,0), V₂(0,6)
   Total area = 0.5 * |det([6,0], [0,6])| = 0.5 * 36 = 18
   
   For barycentric coordinates, using signed area formula:
   Area(V₁V₂P) = 0.5 * det([V₂-V₁, P-V₁])
               = 0.5 * det([(-6,6), (-4,2)])
               = 0.5 * ((-6)*2 - 6*(-4)) = 0.5 * 12 = 6
   
   Area(V₂V₀P) = 0.5 * det([V₀-V₂, P-V₂])
               = 0.5 * det([(0,-6), (2,-4)])
               = 0.5 * (0*(-4) - (-6)*2) = 0.5 * 12 = 6
   
   Area(V₀V₁P) = 0.5 * det([V₁-V₀, P-V₀])
               = 0.5 * det([(6,0), (2,2)])
               = 0.5 * (6*2 - 0*2) = 0.5 * 12 = 6
   
   u = 6/18 = 1/3
   v = 6/18 = 1/3
   w = 6/18 = 1/3
   
   Check: u + v + w = 1/3 + 1/3 + 1/3 = 1 ✓
   
b) Color = (1/3)(1,0,0) + (1/3)(0,1,0) + (1/3)(0,0,1) 
         = (1/3, 1/3, 1/3) - gray
```

### Section 2: 3D Graphics and Transformations

**Question 5: Transformation Matrices**
```
Write the 4×4 matrices for:
a) Translation by (3, -2, 5)
b) Rotation by 90° around Y-axis
c) Non-uniform scale (2, 0.5, 1)
d) What is the result of composing them in order S·R·T?
```

**Answer:**
```
a) T = [1 0 0 3]      b) R_y(90°) with cos(90°)=0, sin(90°)=1:
       [0 1 0 -2]                R = [0  0  1 0]
       [0 0 1 5]                     [0  1  0 0]
       [0 0 0 1]                     [-1 0  0 0]
                                     [0  0  0 1]

c) S = [2   0   0 0]
       [0   0.5 0 0]
       [0   0   1 0]
       [0   0   0 1]

d) M = S·R·T applies: translate, rotate, then scale
   Point p' = S·R·T·p
   - First translates by (3,-2,5)
   - Then rotates 90° around Y
   - Then scales non-uniformly
```

**Question 6: Transformation Order**
```
Explain the difference between:
a) T(5,0,0) · R_z(45°) · object
b) R_z(45°) · T(5,0,0) · object

Draw a simple diagram showing the effect on a square at origin.
```

**Answer:**
```
a) Rotate 45° around Z-axis, THEN translate by (5,0,0)
   - Square rotates in place, then shifts right
   
b) Translate right by (5,0,0), THEN rotate 45° around Z-axis
   - Square moves right, then orbits around origin
   - Final position is NOT at (5,0,0)!

Key insight: Matrices read right-to-left in multiplication
The rightmost transformation is applied first to the object
```

**Question 7: Spherical Coordinates**
```
For a unit sphere with stacks=3, sectors=4:
a) How many vertices are generated?
b) How many triangles?
c) Write the equations to compute x,y,z from (φ,θ)
d) What are the UV coordinates for the north pole vertex?
```

**Answer:**
```
a) Vertices = (stacks+1) × (sectors+1) = 4 × 5 = 20 vertices
   (Extra column for texture wraparound)

b) Triangles = stacks × sectors × 2 = 3 × 4 × 2 = 24 triangles
   (Except at poles: first and last stack have only 4 triangles each)
   Actually: 2 × 4 + 2 × 4 + 2 × 4 = 24 triangles

c) x = r·sin(φ)·cos(θ)
   y = r·cos(φ)
   z = r·sin(φ)·sin(θ)
   where φ ∈ [0,π], θ ∈ [0,2π], r = 1

d) North pole: stack=0, so UV = (varies, 0) for different sectors
   Actually (u, v) where u=sector/numSectors, v=0
```

### Section 3: Shading and Lighting

**Question 8: Blinn-Phong Model**
```
Given:
- Surface point P = (1, 0, 0)
- Surface normal N = (1, 0, 0)  
- Light position L_pos = (2, 2, 0)
- Camera at origin
- Material: ka=0.1, kd=0.6, ks=0.3, shininess=32
- Light intensity = (1, 1, 1)

Calculate:
a) Light direction vector L
b) View direction vector V
c) Halfway vector H
d) Ambient component
e) Diffuse component
f) Specular component
```

**Answer:**
```
a) L = normalize(L_pos - P) = normalize((1,2,0)) 
     = (1/√5, 2/√5, 0) ≈ (0.447, 0.894, 0)

b) V = normalize((0,0,0) - P) = normalize((-1,0,0)) = (-1, 0, 0)

c) H = normalize(L + V) = normalize((0.447-1, 0.894, 0))
     = normalize((-0.553, 0.894, 0)) ≈ (-0.526, 0.851, 0)

d) Ambient = ka * I = 0.1 * (1,1,1) = (0.1, 0.1, 0.1)

e) Diffuse = kd * max(N·L, 0) * I
           = 0.6 * max(0.447, 0) * (1,1,1) = (0.268, 0.268, 0.268)

f) Specular = ks * max(N·H, 0)^shininess * I
            = 0.3 * max(-0.526, 0)^32 * (1,1,1) = (0, 0, 0)
            (N·H is negative, so specular = 0)
```

**Question 9: Phong vs. Blinn-Phong**
```
a) What is the key difference between Phong and Blinn-Phong?
b) Which is more efficient and why?
c) Write the formula for the original Phong specular term
```

**Answer:**
```
a) Phong uses reflection vector R
   Blinn-Phong uses halfway vector H

b) Blinn-Phong is more efficient:
   - H = normalize(L + V) is simpler
   - R = 2(N·L)N - L requires more operations
   - Phong: need to compute reflection of L across N

c) Phong specular: ks * (R · V)^shininess * Ls
   where R = 2(N·L)N - L
```

**Question 10: Shader Pipeline**
```
Describe the data flow in the graphics pipeline:
a) What coordinate space are vertices in when entering vertex shader?
b) What does gl_Position represent?
c) What happens between vertex and fragment shader?
d) How do 'varying' variables work?
```

**Answer:**
```
a) Model/object space (local coordinates)

b) gl_Position is the vertex position in clip space
   (after projection transformation)

c) Rasterization:
   - Primitives (triangles) are converted to fragments (pixels)
   - Varying variables are interpolated across triangle
   - One fragment shader invocation per pixel

d) 'varying' variables:
   - Declared in both vertex and fragment shaders
   - Vertex shader writes values
   - GPU interpolates using barycentric coordinates
   - Fragment shader reads interpolated values
   Example: vertex colors, normals, texture coordinates
```

### Section 4: Texture Mapping

**Question 11: UV Coordinates**
```
For a cube face from (-1,-1,z) to (1,1,z):
a) If texture should map entire image to face, what are UV coords?
b) If texture should only use top-left quarter, what are UV coords?
c) What happens if UV coordinates are outside [0,1]?
```

**Answer:**
```
a) Full face mapping:
   (-1,-1,z) → (0, 0)
   ( 1,-1,z) → (1, 0)
   ( 1, 1,z) → (1, 1)
   (-1, 1,z) → (0, 1)

b) Top-left quarter only:
   (-1,-1,z) → (0.0, 0.0)
   ( 1,-1,z) → (0.5, 0.0)
   ( 1, 1,z) → (0.5, 0.5)
   (-1, 1,z) → (0.0, 0.5)

c) Outside [0,1] depends on wrap mode:
   - GL_REPEAT: tiles the texture
   - GL_CLAMP_TO_EDGE: extends edge pixels
   - GL_MIRRORED_REPEAT: mirrors texture
```

**Question 12: Texture Sampling**
```
Write GLSL code to:
a) Sample a texture at UV coordinates
b) Modulate shading with texture
c) Use texture alpha channel for transparency
```

**Answer:**
```glsl
a) vec4 texColor = texture2D(uTexture, vTexCoord);

b) vec3 finalColor = shadedColor * texColor.rgb;
   gl_FragColor = vec4(finalColor, 1.0);

c) vec3 finalColor = shadedColor * texColor.rgb;
   gl_FragColor = vec4(finalColor, texColor.a);
   // Alpha blending must be enabled in WebGL
```

### Section 5: Conceptual Questions

**Question 13: Coordinate Spaces**
```
List and describe the 5 main coordinate spaces in the graphics pipeline.
For each, state what transformation brings you to the next space.
```

**Answer:**
```
1. Model/Object Space
   - Object's local coordinate system
   - Transform: Model Matrix (M) → World Space

2. World Space
   - Shared global coordinate system
   - Transform: View Matrix (V) → Camera/Eye Space

3. Camera/Eye/View Space
   - Camera at origin, looking down -Z axis
   - Transform: Projection Matrix (P) → Clip Space

4. Clip Space
   - Homogeneous coordinates, w ≠ 1
   - Transform: Perspective Division (÷w) → NDC

5. Normalized Device Coordinates (NDC)
   - x,y,z ∈ [-1,1]
   - Transform: Viewport Transform → Screen Space

Combined: P·V·M (projection·view·model)
```

**Question 14: Half-Plane Method**
```
Explain why the half-plane method works for triangle
inside-outside testing. Include:
a) The implicit line equation
b) How to determine which side of line a point is on
c) Why we need to test all three edges
```

**Answer:**
```
a) Implicit line equation: f(x,y) = ax + by + c = 0
   For line through (x₀,y₀) to (x₁,y₁):
   a = y₁ - y₀
   b = x₀ - x₁
   c = x₁·y₀ - x₀·y₁

b) Sign of f(x,y) determines side:
   f(p) > 0: one side
   f(p) < 0: other side
   f(p) = 0: on the line
   
   Direction depends on vertex order (CCW/CW)

c) Triangle = intersection of 3 half-planes
   Point inside IFF it's on correct side of ALL 3 edges
   If vertices ordered CCW, point inside when all f(p) > 0
   (or all f(p) < 0 for CW)
```

**Question 15: Normal Transformation**
```
a) Why can't we transform normals with the model matrix directly?
b) What matrix should be used for normals?
c) Given a model matrix M, derive the normal transformation matrix.
```

**Answer:**
```
a) Normals are directions (vectors), not positions
   Non-uniform scaling breaks perpendicularity
   Example: scale Y by 2 → vertical normal becomes wrong
   
b) Normal Matrix = (M⁻¹)ᵀ 
   = transpose of inverse of model matrix
   (For orthogonal matrices, this simplifies)

c) Derivation:
   Normal n is perpendicular to tangent t: n·t = 0
   After transformation: n'·t' = 0
   If t' = Mt, we need n' such that n'ᵀ·Mt = 0
   This works if n' = (M⁻¹)ᵀn
   Therefore: normal matrix = (M⁻¹)ᵀ
   
   In practice: usually use upper-left 3×3 submatrix
```

---

## Concrete Examples from Implementations

### Example 1: Complete Line Drawing

From Assignment 3 implementation:

```javascript
function drawLine(vertex1, vertex2) {
    const [x1, y1, [r1, g1, b1]] = vertex1;
    const [x2, y2, [r2, g2, b2]] = vertex2;
    
    // Floor coordinates to get integer pixels
    let x1F = Math.floor(x1), x2F = Math.floor(x2);
    let y1F = Math.floor(y1), y2F = Math.floor(y2);
    
    // Calculate absolute differences
    let dx = Math.abs(x2F - x1F);
    let dy = Math.abs(y2F - y1F);
    
    // Handle single pixel case
    if (dx === 0 && dy === 0) {
        setPixel(x1F, y1F, [r1, g1, b1]);
        return;
    }
    
    // Determine step directions
    let sx = (x1F < x2F) ? 1 : -1;
    let sy = (y1F < y2F) ? 1 : -1;
    
    let x = x1F, y = y1F;
    
    if (dx >= dy) {
        // Horizontal-dominant case
        let d = 2 * dy - dx;
        
        for (let i = 0; i <= dx; i++) {
            let t = (dx === 0) ? 0 : i / dx;
            let color = interpolateColor([r1,g1,b1], [r2,g2,b2], t);
            setPixel(x, y, color);
            
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
        
        for (let i = 0; i <= dy; i++) {
            let t = (dy === 0) ? 0 : i / dy;
            let color = interpolateColor([r1,g1,b1], [r2,g2,b2], t);
            setPixel(x, y, color);
            
            if (d > 0) {
                x += sx;
                d += 2 * (dx - dy);
            } else {
                d += 2 * dx;
            }
            y += sy;
        }
    }
}
```

### Example 2: Triangle Rasterization with Top-Left Rule

```javascript
function drawTriangle(v0, v1, v2) {
    // Get bounding box
    let xmin = Math.floor(Math.min(v0[0], v1[0], v2[0]));
    let xmax = Math.floor(Math.max(v0[0], v1[0], v2[0]));
    let ymin = Math.floor(Math.min(v0[1], v1[1], v2[1]));
    let ymax = Math.floor(Math.max(v0[1], v1[1], v2[1]));
    
    // Precompute edge equations (cross products)
    let edge01 = computeEdge(v0, v1);
    let edge12 = computeEdge(v1, v2);
    let edge20 = computeEdge(v2, v0);
    
    // Scan bounding box
    for (let y = ymin; y <= ymax; y++) {
        for (let x = xmin; x <= xmax; x++) {
            let p = [x + 0.5, y + 0.5, 1]; // Pixel center
            
            // Evaluate edge functions
            let w0 = dot(edge12, p); // Opposite v0
            let w1 = dot(edge20, p); // Opposite v1
            let w2 = dot(edge01, p); // Opposite v2
            
            // Check if inside (all same sign)
            if (w0 > 0 && w1 > 0 && w2 > 0) {
                // Strictly inside
                let color = barycentricColor(v0,v1,v2, w0,w1,w2);
                setPixel(x, y, color);
            }
            else if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
                // On edge - check top-left rule
                let onEdge0 = (w0 === 0);
                let onEdge1 = (w1 === 0);
                let onEdge2 = (w2 === 0);
                
                let fill = false;
                if (onEdge0) fill ||= isTopOrLeftEdge(v1, v2);
                if (onEdge1) fill ||= isTopOrLeftEdge(v2, v0);
                if (onEdge2) fill ||= isTopOrLeftEdge(v0, v1);
                
                if (fill) {
                    let color = barycentricColor(v0,v1,v2, w0,w1,w2);
                    setPixel(x, y, color);
                }
            }
        }
    }
}

function isTopOrLeftEdge(v0, v1) {
    let [x0, y0] = v0;
    let [x1, y1] = v1;
    
    // Left edge: y increases (bottom to top in screen coords)
    if (y0 < y1) return true;
    
    // Top edge: horizontal, pointing right
    if (y0 === y1 && x0 < x1) return true;
    
    return false;
}
```

### Example 3: Sphere Mesh Generation

```javascript
function createSphere(numStacks, numSectors) {
    const positions = [];
    const normals = [];
    const uvCoords = [];
    const indices = [];
    
    const sectorStep = 2 * Math.PI / numSectors;
    const stackStep = Math.PI / numStacks;
    
    // Generate vertices
    for (let i = 0; i <= numStacks; i++) {
        let stackAngle = Math.PI/2 - i * stackStep; // π/2 to -π/2
        let xy = Math.cos(stackAngle);
        let z = Math.sin(stackAngle);
        
        for (let j = 0; j <= numSectors; j++) {
            let sectorAngle = j * sectorStep; // 0 to 2π
            
            let x = xy * Math.cos(sectorAngle);
            let y = xy * Math.sin(sectorAngle);
            
            positions.push(x, y, z);
            normals.push(x, y, z); // Unit sphere → normal = position
            uvCoords.push(j / numSectors, i / numStacks);
        }
    }
    
    // Generate indices
    for (let i = 0; i < numStacks; i++) {
        let k1 = i * (numSectors + 1);
        let k2 = k1 + numSectors + 1;
        
        for (let j = 0; j < numSectors; j++, k1++, k2++) {
            if (i !== 0) {
                indices.push(k1, k2, k1 + 1);
            }
            if (i !== numStacks - 1) {
                indices.push(k1 + 1, k2, k2 + 1);
            }
        }
    }
    
    this.positions = positions;
    this.normals = normals;
    this.uvCoords = uvCoords;
    this.indices = indices;
}
```

### Example 4: Complete Shader Pair

```glsl
// VERTEX SHADER
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
    // Transform position to camera space
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    vPosition = viewPosition.xyz;
    
    // Transform normal to camera space
    vNormal = normalMatrix * normal;
    
    // Pass through texture coordinates
    vTexCoord = uvCoord;
    
    // Final clip space position
    gl_Position = projectionMatrix * viewPosition;
}

// FRAGMENT SHADER
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
uniform vec3 lightPosition;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {
    // Normalize interpolated normal
    vec3 N = normalize(vNormal);
    
    // Light direction (in camera space)
    vec3 L = normalize(lightPosition - vPosition);
    
    // View direction (camera at origin)
    vec3 V = normalize(-vPosition);
    
    // Halfway vector
    vec3 H = normalize(L + V);
    
    // Compute Blinn-Phong components
    vec3 ambient = ka * lightIntensity;
    
    float diffuseFactor = max(dot(N, L), 0.0);
    vec3 diffuse = kd * diffuseFactor * lightIntensity;
    
    float specularFactor = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = ks * specularFactor * lightIntensity;
    
    // Combine shading
    vec3 color = ambient + diffuse + specular;
    
    // Apply texture if present
    if (hasTexture) {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        color *= texColor.rgb;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
```

---

## Study Tips for Final Exam

1. **Practice drawing by hand:**
   - Bresenham's algorithm steps for given line
   - Transformation matrices
   - Triangle rasterization with edge cases

2. **Understand the "why":**
   - Why top-left rule prevents gaps
   - Why normals need inverse-transpose transformation
   - Why Blinn-Phong uses halfway vector

3. **Memorize key formulas:**
   - Blinn-Phong shading equation
   - Barycentric coordinate calculation
   - Transformation matrix forms
   - Spherical coordinate conversion

4. **Code reading:**
   - Be able to trace through algorithm steps
   - Identify bugs in rasterization code
   - Explain shader code line-by-line

5. **Conceptual understanding:**
   - Graphics pipeline stages
   - Coordinate space transformations
   - Interpolation (linear, barycentric)
   - Texture mapping process

6. **Common mistakes to avoid:**
   - Forgetting to normalize vectors before dot products
   - Wrong transformation order (remember: right-to-left)
   - Incorrect normal transformation
   - Missing edge cases in rasterization

---

## Additional Resources

**Course Website:** https://yaksoy.github.io/introvc/ (instructor's website)

**Textbook References:**
- Chapter 8: Rasterization (lines, triangles, DDA, Bresenham)
- Chapters 6.2-6.5: Lighting and shading
- Chapters 7.3-7.5: Texture mapping
- Chapter 10: Transformations

**External Resources:**
- Scratchapixel (rasterization tutorials)
- LearnOpenGL (shading, texturing)
- Songho.ca (sphere generation)
- Microsoft Direct3D rasterization rules

---

## Summary of Key Learning Outcomes

### From Assignment 3:
✅ Line rasterization using integer arithmetic (Bresenham/DDA)  
✅ Color interpolation along primitives  
✅ Triangle inside-outside testing with half-plane method  
✅ Efficient bounding box rasterization  
✅ Top-left rule for gap-free triangle rendering  
✅ Barycentric coordinates for interpolation  

### From Assignment 4:
✅ Triangle mesh generation (cube, sphere)  
✅ 3D transformations (translate, rotate, scale, composition)  
✅ Blinn-Phong shading model implementation  
✅ GLSL vertex and fragment shaders  
✅ Texture coordinate mapping (UV coordinates)  
✅ Normal transformation with inverse-transpose  
✅ Graphics pipeline understanding (model→world→camera→clip→screen)  

### Core Competencies:
✅ Implement fundamental graphics algorithms from scratch  
✅ Understand and apply geometric computations  
✅ Work with homogeneous coordinates and matrices  
✅ Write shaders for real-time rendering  
✅ Debug visual artifacts through mathematical understanding  

---

**Good luck on your final exam!** 🎓

