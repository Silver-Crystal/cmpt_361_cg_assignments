# CMPT 361 Quick Reference - Learning Outcomes Summary

## 📚 What We Learned from Assignment 3 & 4

### Assignment 3: 2D Rasterization (10 points)

| Topic | Points | What You Implemented | Key Concepts |
|-------|--------|---------------------|--------------|
| **Line Rasterization** | 2 | Bresenham/DDA algorithm for drawing lines in all orientations | • Decision variables<br>• Integer-only arithmetic<br>• Handling 8 octants<br>• dx vs dy cases |
| **Color Interpolation** | 1 | Linear RGB interpolation along lines | • Parametric t ∈ [0,1]<br>• C(t) = (1-t)C₁ + tC₂ |
| **Triangle Inside Test** | 3 | Half-plane method with top-left rule | • Implicit line equations<br>• Cross products<br>• Edge cases (shared edges) |
| **Triangle Rasterization** | 2 | Bounding box + inside test | • AABB optimization<br>• Avoid full-screen scan |
| **Barycentric Interpolation** | 2 | Color blending using area ratios | • (u,v,w) coordinates<br>• Area method<br>• Attribute interpolation |

**Grade:** 10/10 (Late penalty applied: -100%, final: 0/10)

---

### Assignment 4: 3D Graphics Pipeline (10 points)

| Topic | Points | What You Implemented | Key Concepts |
|-------|--------|---------------------|--------------|
| **Mesh Generation** | 3 | Cube & sphere triangle meshes | • Indexed meshes<br>• Positions, normals, UVs<br>• Stacks & sectors (sphere) |
| **Transformations** | 2 | 4×4 matrices for T/R/S composition | • Translation matrix<br>• Rotation matrices (x,y,z)<br>• Scale matrix<br>• Order matters! |
| **Shading** | 3 | Blinn-Phong in GLSL shaders | • Ambient + Diffuse + Specular<br>• N·L, N·H calculations<br>• Vertex/fragment shaders |
| **Texturing** | 2 | UV mapping & texture sampling | • UV coordinates [0,1]<br>• texture2D() in GLSL<br>• Modulation with shading |

**Grade:** 9/10 (Lost 1 point on specular component)

---

## 🎯 Core Skills Demonstrated

### Mathematical Foundations
- ✅ **Vector Operations**: dot products, cross products, normalization
- ✅ **Linear Algebra**: matrix multiplication, inverse, transpose
- ✅ **Parametric Equations**: lines, interpolation
- ✅ **Coordinate Systems**: homogeneous coordinates, barycentric coordinates
- ✅ **Geometric Computations**: areas, signed distances

### Algorithmic Thinking
- ✅ **Bresenham's Algorithm**: Efficient integer-only line drawing
- ✅ **Half-Plane Method**: Triangle rasterization
- ✅ **Bounding Box Optimization**: Reduce computational complexity
- ✅ **Edge Cases**: Top-left rule, degenerate triangles, single pixels

### Graphics Pipeline Understanding
- ✅ **Coordinate Spaces**: Model → World → Camera → Clip → NDC → Screen
- ✅ **Transformations**: How objects move in 3D space
- ✅ **Shading Models**: How light interacts with surfaces
- ✅ **Texture Mapping**: Applying images to 3D geometry

### Programming Skills
- ✅ **JavaScript/WebGL**: Client-side graphics programming
- ✅ **GLSL Shaders**: GPU programming
- ✅ **Debugging**: Visual artifacts, edge cases, numerical issues

---

## 📝 Final Exam Topics (Predicted)

### High Priority (Very Likely)

#### 1. Bresenham's Algorithm
**Sample Question Types:**
- Given a line, compute first N pixels
- Initialize decision variable d₀
- Explain why it works
- Handle different slopes

**What to Know:**
```
Horizontal-dominant (dx ≥ dy):
  d₀ = 2dy - dx
  Update: d > 0 ? d += 2(dy-dx) : d += 2dy

Vertical-dominant (dx < dy):
  d₀ = 2dx - dy
  Update: d > 0 ? d += 2(dx-dy) : d += 2dx
```

#### 2. Triangle Rasterization
**Sample Question Types:**
- Given triangle, which pixels to fill?
- Apply top-left rule
- Compute barycentric coordinates
- Interpolate vertex colors

**What to Know:**
```
Half-plane test: f(x,y) = ax + by + c
  a = y₁ - y₀
  b = x₀ - x₁
  c = x₁y₀ - x₀y₁

Top-left rule:
  Left edge: y₀ < y₁
  Top edge: y₀ = y₁ AND above third vertex
```

#### 3. Transformation Matrices
**Sample Question Types:**
- Write 4×4 matrix for T/R/S
- Compose transformations
- Transform given point
- Explain order of operations

**What to Know:**
```
Translation: T = [I | t]
                 [0 | 1]

Rotation (e.g., Y-axis):
  Ry(θ) = [cos -0  sin  0]
          [0    1   0   0]
          [-sin 0  cos  0]
          [0    0   0   1]

Composition: M = T·R·S (apply right to left)
```

#### 4. Blinn-Phong Shading
**Sample Question Types:**
- Compute shading at a point
- Calculate L, V, H vectors
- Explain each component (ambient/diffuse/specular)
- Difference from original Phong

**What to Know:**
```
I = ka·La + kd(N·L)Ld + ks(N·H)^n·Ls

Where:
  N = surface normal (normalized)
  L = light direction (normalized)
  V = view direction (normalized)
  H = halfway vector = normalize(L + V)
```

#### 5. Barycentric Coordinates
**Sample Question Types:**
- Compute (u,v,w) for point in triangle
- Interpolate colors
- Explain geometric meaning

**What to Know:**
```
Using signed areas:
  u = Area(V₁,V₂,P) / Area(V₀,V₁,V₂)
  v = Area(V₂,V₀,P) / Area(V₀,V₁,V₂)
  w = Area(V₀,V₁,P) / Area(V₀,V₁,V₂)

Property: u + v + w = 1

Interpolation: value = u·V₀ + v·V₁ + w·V₂
```

---

### Medium Priority (Likely)

#### 6. Coordinate Spaces
- List 5 coordinate spaces in order
- Which matrices transform between them
- What gl_Position represents

#### 7. Texture Mapping
- UV coordinate system
- How to map texture to cube face
- GLSL texture sampling: `texture2D()`

#### 8. Normal Transformation
- Why not use model matrix?
- Correct matrix: (M⁻¹)ᵀ
- When can you skip this?

#### 9. Sphere Generation
- Stacks and sectors algorithm
- Spherical coordinate equations
- Vertex count, triangle count

---

### Lower Priority (Possible)

#### 10. DDA vs. Bresenham
- Compare efficiency
- When to use each
- Floating-point vs. integer

#### 11. Shader Pipeline
- Vertex shader role
- Fragment shader role
- What are 'varying' variables

#### 12. WebGL Specifics
- What is a framebuffer
- setPixel implementation
- Indexed vs. non-indexed meshes

---

## 💡 Quick Formulas Reference

### Rasterization

**Line Drawing (Bresenham):**
```
if (dx ≥ dy):
  d = 2dy - dx
  for each x step:
    plot(x, y)
    if d > 0: y++, d += 2(dy-dx)
    else: d += 2dy
```

**Half-Plane Test:**
```
f(x,y) = (y₁-y₀)x + (x₀-x₁)y + (x₁y₀-x₀y₁)
inside if: f(p) > 0 for all 3 edges
```

**Barycentric:**
```
u = signedArea(V₁,V₂,P) / totalArea
P_interpolated = u·V₀ + v·V₁ + w·V₂
```

---

### Transformations

**Translation:**
```
T(tx,ty,tz) = [1 0 0 tx]
              [0 1 0 ty]
              [0 0 1 tz]
              [0 0 0  1]
```

**Rotation around Y:**
```
Ry(θ) = [ cos(θ)  0  sin(θ)  0]
        [   0     1    0     0]
        [-sin(θ)  0  cos(θ)  0]
        [   0     0    0     1]
```

**Scaling:**
```
S(sx,sy,sz) = [sx  0   0  0]
              [ 0  sy  0  0]
              [ 0   0  sz 0]
              [ 0   0   0 1]
```

**Composition:**
```
M = Tn · ... · T2 · T1
Apply right-to-left: p' = M·p
```

---

### Shading

**Blinn-Phong:**
```
I = Ia + Id + Is

Ia = ka · La
Id = kd · max(N·L, 0) · Ld
Is = ks · max(N·H, 0)^shininess · Ls

where: H = normalize(L + V)
```

**Normal Transformation:**
```
N' = (M⁻¹)ᵀ · N
```

---

### Sphere Generation

**Spherical to Cartesian:**
```
x = r·sin(φ)·cos(θ)
y = r·cos(φ)
z = r·sin(φ)·sin(θ)

φ ∈ [0,π]    (latitude)
θ ∈ [0,2π]   (longitude)
```

**Vertex Count:**
```
vertices = (stacks+1) × (sectors+1)
triangles ≈ 2 × stacks × sectors
```

---

## 🎓 Study Strategy

### 1 Week Before Exam
- [ ] Read through full study guide
- [ ] Review lecture slides on rasterization, transformations, shading
- [ ] Practice writing transformation matrices
- [ ] Trace through Bresenham algorithm by hand

### 3 Days Before Exam
- [ ] Work through all sample questions
- [ ] Memorize Blinn-Phong formula
- [ ] Practice barycentric coordinate calculations
- [ ] Review top-left rule cases

### 1 Day Before Exam
- [ ] Review quick formulas
- [ ] Practice drawing coordinate space diagram
- [ ] Go through your assignment code
- [ ] Get good sleep!

### Exam Day
- Bring calculator for matrix/vector math
- Draw diagrams for spatial reasoning questions
- Check units (degrees vs radians!)
- Read questions carefully (top-left rule is tricky!)

---

## 📊 Grading Breakdown (What Matters Most)

Based on assignment grades, these topics were weighted most:

1. **Triangle Inside/Outside (3 pts)** - Most difficult, most weight
2. **Mesh Generation (3 pts)** - Cube + sphere implementation
3. **Shading (3 pts)** - All three Blinn-Phong components
4. **Line Rasterization (2 pts)** - Must handle all cases
5. **Transformations (2 pts)** - Matrix composition
6. **Bounding Box (2 pts)** - Optimization technique
7. **Barycentric (2 pts)** - Smooth interpolation
8. **Texturing (2 pts)** - UV mapping
9. **Color Interpolation (1 pt)** - Linear lerp

**Focus your studying on items 1-5 above!**

---

## 🔗 Additional Resources

**Course Materials:**
- Assignment 3 README: `cmpt361_a3/README.md`
- Assignment 4 README: `cmpt361_a4/README.md`
- Full study guide: `CMPT361_STUDY_GUIDE.md`

**External References:**
- Bresenham context: `cmpt361_a3/context/Bresenham_al.txt`
- Sphere algorithm: http://www.songho.ca/opengl/gl_sphere.html
- WebGL fundamentals: https://webglfundamentals.org

**Your Implementations:**
- Line/triangle code: `cmpt361_a3/a3.js`
- Mesh/shading code: `cmpt361_a4/a4.js`

---

## ✅ Self-Check Questions

Before the exam, make sure you can answer YES to all:

- [ ] Can I write Bresenham algorithm from memory?
- [ ] Do I understand the top-left rule and why it matters?
- [ ] Can I compute barycentric coordinates for a given point?
- [ ] Do I know all 3 transformation matrices (T, R, S)?
- [ ] Can I explain matrix composition order?
- [ ] Do I know the Blinn-Phong formula by heart?
- [ ] Can I calculate L, V, H vectors given positions?
- [ ] Do I understand the difference between model/world/camera space?
- [ ] Can I write UV coordinates for a cube face?
- [ ] Do I know the spherical coordinate equations?

If you answered NO to any, review that topic!

---

**Good luck! You've got this! 🚀**

*Study smart, not just hard. Focus on understanding concepts, not just memorizing formulas.*

