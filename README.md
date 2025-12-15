# CMPT 361 Computer Graphics - Study Materials

This repository contains two major computer graphics assignments and comprehensive study materials for the CMPT 361 final exam.

## 📁 Repository Structure

```
cmpt_361_cg_assignments/
├── cmpt361_a3/              # Assignment 3: 2D Rasterization
│   ├── a3.js                # Line & triangle rasterization implementation
│   ├── README.md            # Assignment specifications
│   └── grading.txt          # Grade: 10/10 (technical)
│
├── cmpt361_a4/              # Assignment 4: 3D Graphics Pipeline  
│   ├── a4.js                # Mesh generation, transformations, shading
│   ├── README.md            # Assignment specifications
│   └── grading.txt          # Grade: 9/10
│
└── Study Materials:
    ├── CMPT361_STUDY_GUIDE.md         # 📚 Main comprehensive guide
    ├── QUICK_REFERENCE.md             # ⚡ Quick review cheat sheet
    ├── LEARNING_OUTCOMES_VISUAL.md    # 🎯 Detailed code analysis
    └── README.md                      # 👈 You are here
```

## 📚 Study Materials Overview

### 1. [CMPT361_STUDY_GUIDE.md](./CMPT361_STUDY_GUIDE.md) - Main Study Guide
**36,000+ words | Comprehensive exam preparation**

This is your **primary study resource** covering:

#### Assignment 3: Rasterization (10 points)
- ✅ Line Rasterization (Bresenham/DDA algorithm)
- ✅ Color Interpolation (linear RGB blending)
- ✅ Triangle Inside-Outside Test (half-plane method)
- ✅ Triangle Rasterization (bounding box optimization)
- ✅ Barycentric Color Interpolation (smooth gradients)

#### Assignment 4: 3D Graphics Pipeline (10 points)
- ✅ Triangle Mesh Generation (cube & sphere)
- ✅ 3D Transformations (T/R/S matrices)
- ✅ Blinn-Phong Shading (ambient/diffuse/specular)
- ✅ Texture Mapping (UV coordinates)

#### 15 Practice Questions with Full Solutions
- Bresenham's algorithm step-by-step
- Top-left rule application
- Barycentric coordinate calculations
- Transformation matrix composition
- Blinn-Phong lighting computations
- Shader pipeline understanding
- And more!

#### Concrete Code Examples
- Complete line drawing implementation
- Triangle rasterization with top-left rule
- Sphere mesh generation
- Full vertex and fragment shaders

---

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick Review
**10,000+ words | Essential formulas and concepts**

Perfect for **last-minute review** before the exam:

- 📊 **Summary Tables** - Learning outcomes by assignment
- 🎯 **Predicted Exam Topics** - High/medium/low priority
- 💡 **Quick Formulas** - All essential equations at a glance
- ✅ **Self-Check Questions** - Verify your understanding
- 📖 **Study Strategy** - Timeline for exam preparation
- 🔗 **Resource Links** - Textbook chapters and external resources

Key Features:
- Topic priorities (what to focus on)
- Formula reference sheet
- Grading breakdown analysis
- Time-based study schedule

---

### 3. [LEARNING_OUTCOMES_VISUAL.md](./LEARNING_OUTCOMES_VISUAL.md) - Detailed Code Analysis
**30,000+ words | Deep dive into your implementations**

This document **shows exactly what you learned** by examining your actual code:

- 🔍 **Code Breakdown** - Every major function explained
- 📝 **Line-by-Line Analysis** - What each implementation proves
- 📊 **Skills Matrix** - Math, programming, graphics concepts
- 🎯 **Concrete Evidence** - Code metrics and grading results
- 🏆 **Achievement Summary** - What you can now do
- 💼 **Industry Relevance** - Real-world applications

Includes:
- Your actual implementation code with annotations
- Proof of skills demonstrated
- Complexity ratings
- Career preparation insights

---

## 🎯 Quick Start Guide

### For Final Exam Prep (Recommended Order):

1. **Start Here (1 week before):** Read [CMPT361_STUDY_GUIDE.md](./CMPT361_STUDY_GUIDE.md)
   - Focus on Assignment 3 & 4 learning objectives
   - Review key concepts and formulas
   
2. **Practice (3 days before):** Work through practice questions
   - 15 sample questions in study guide
   - Solutions provided for self-check
   - Focus on high-priority topics

3. **Quick Review (1 day before):** Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
   - Memorize essential formulas
   - Review priority topics
   - Self-check questions

4. **Deep Dive (if needed):** Refer to [LEARNING_OUTCOMES_VISUAL.md](./LEARNING_OUTCOMES_VISUAL.md)
   - Understand your implementations deeply
   - See concrete code examples
   - Verify your understanding

### For Understanding What You Learned:

Start with [LEARNING_OUTCOMES_VISUAL.md](./LEARNING_OUTCOMES_VISUAL.md) to see:
- What each assignment taught you
- Your actual code implementations
- Skills you demonstrated
- How it applies to industry

---

## 📖 What You Learned

### Assignment 3: Rasterization Fundamentals

**Core Skills:**
- ✅ Bresenham's line drawing (integer-only algorithm)
- ✅ Linear color interpolation along lines
- ✅ Half-plane triangle test (implicit line equations)
- ✅ Top-left rule (gap-free rendering)
- ✅ Bounding box optimization
- ✅ Barycentric coordinate interpolation

**Grade:** 10/10 technical points (0/10 after late penalty)

**Why It Matters:** This is how every pixel you see on screen is drawn. These are the fundamental algorithms in all graphics hardware (GPUs).

### Assignment 4: 3D Graphics Pipeline

**Core Skills:**
- ✅ Mesh generation (cube, sphere with stacks & sectors)
- ✅ Indexed triangle meshes
- ✅ 4×4 transformation matrices (translate, rotate, scale)
- ✅ Matrix composition
- ✅ Blinn-Phong shading model
- ✅ GLSL vertex and fragment shaders
- ✅ Texture mapping with UV coordinates

**Grade:** 9/10 points (minor specular issue)

**Why It Matters:** This is the complete 3D rendering pipeline used in games, CAD, VR/AR, and all real-time 3D graphics.

---

## 🎓 Topics Likely on Final Exam

### High Priority ⭐⭐⭐
1. **Bresenham's Algorithm** - Step-by-step execution
2. **Triangle Rasterization** - Half-plane test, top-left rule
3. **Barycentric Coordinates** - Calculation and interpolation
4. **Transformation Matrices** - T/R/S composition
5. **Blinn-Phong Shading** - Computing lighting at a point

### Medium Priority ⭐⭐
6. **Coordinate Spaces** - Model, world, camera, clip, screen
7. **Texture Mapping** - UV coordinates, sampling
8. **Normal Transformation** - Why use (M⁻¹)ᵀ
9. **Sphere Generation** - Stacks & sectors algorithm

### Lower Priority ⭐
10. **DDA vs Bresenham** - Efficiency comparison
11. **Shader Pipeline** - Vertex vs fragment shader roles
12. **WebGL Specifics** - Indexed meshes, framebuffers

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed exam preparation strategy.

---

## 📊 Assignment Grades Summary

| Assignment | Topic | Points Earned | Total | Notes |
|------------|-------|---------------|-------|-------|
| A3 | Line Rasterization | 2.0 | 2.0 | Perfect ✓ |
| A3 | Color Interpolation | 1.0 | 1.0 | Perfect ✓ |
| A3 | Triangle Inside Test | 3.0 | 3.0 | Perfect ✓ |
| A3 | Triangle Rasterization | 2.0 | 2.0 | Perfect ✓ |
| A3 | Barycentric Interpolation | 2.0 | 2.0 | Perfect ✓ |
| **A3 Total** | | **10.0** | **10.0** | Late penalty: -100% |
| | | | | |
| A4 | Mesh Generation | 3.0 | 3.0 | Perfect ✓ |
| A4 | Transformations | 2.0 | 2.0 | Perfect ✓ |
| A4 | Shading | 2.0 | 3.0 | Specular off |
| A4 | Texturing | 2.0 | 2.0 | Perfect ✓ |
| **A4 Total** | | **9.0** | **10.0** | |

**Technical Proficiency:** 19/20 points (95%)

Both assignments demonstrated strong understanding of computer graphics fundamentals!

---

## 💡 Key Formulas to Memorize

### Rasterization

**Bresenham (horizontal-dominant):**
```
d₀ = 2dy - dx
if (d > 0): y++, d += 2(dy - dx)
else:       d += 2dy
```

**Half-Plane Test:**
```
f(x,y) = (y₁-y₀)x + (x₀-x₁)y + (x₁y₀ - x₀y₁)
Point inside if: f(p) > 0 (for all 3 edges, CCW winding)
```

**Barycentric Coordinates:**
```
u = Area(V₁,V₂,P) / Area(V₀,V₁,V₂)
v = Area(V₂,V₀,P) / Area(V₀,V₁,V₂)
w = Area(V₀,V₁,P) / Area(V₀,V₁,V₂)
where u + v + w = 1
```

### Transformations

**Translation:**
```
T = [1 0 0 tx]
    [0 1 0 ty]
    [0 0 1 tz]
    [0 0 0  1]
```

**Rotation (Y-axis):**
```
Ry(θ) = [ cos(θ)  0  sin(θ)  0]
        [   0     1    0     0]
        [-sin(θ)  0  cos(θ)  0]
        [   0     0    0     1]
```

**Composition:** M = T_n · ... · T₂ · T₁ (apply right-to-left)

### Shading

**Blinn-Phong:**
```
I = ka·La + kd·max(N·L,0)·Ld + ks·max(N·H,0)^n·Ls
where H = normalize(L + V)
```

### Sphere Generation

**Spherical to Cartesian:**
```
x = r·sin(φ)·cos(θ)
y = r·cos(φ)  
z = r·sin(φ)·sin(θ)
```

---

## 🔗 Additional Resources

### Course Materials
- **Assignment 3 Specs:** [cmpt361_a3/README.md](./cmpt361_a3/README.md)
- **Assignment 4 Specs:** [cmpt361_a4/README.md](./cmpt361_a4/README.md)
- **Bresenham Context:** [cmpt361_a3/context/Bresenham_al.txt](./cmpt361_a3/context/Bresenham_al.txt)

### Your Implementations
- **Line/Triangle Code:** [cmpt361_a3/a3.js](./cmpt361_a3/a3.js)
- **Mesh/Shading Code:** [cmpt361_a4/a4.js](./cmpt361_a4/a4.js)

### External References
- **Course Website:** https://yaksoy.github.io/introvc/
- **Sphere Algorithm:** http://www.songho.ca/opengl/gl_sphere.html
- **WebGL Shaders:** https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
- **Scratchapixel:** https://www.scratchapixel.com/ (rasterization tutorials)
- **LearnOpenGL:** https://learnopengl.com/ (shading, texturing)

### Textbook References
- **Chapter 8:** Rasterization (lines, triangles)
- **Chapters 6.2-6.5:** Lighting and shading
- **Chapters 7.3-7.5:** Texture mapping
- **Chapter 10:** Transformations

---

## ✅ Final Exam Self-Check

Before the exam, ensure you can answer YES to all:

### Rasterization
- [ ] Can I execute Bresenham's algorithm by hand?
- [ ] Do I understand why the top-left rule prevents gaps?
- [ ] Can I compute barycentric coordinates for any point?
- [ ] Can I determine if a point is inside a triangle?

### Transformations
- [ ] Can I write T, R, and S matrices from memory?
- [ ] Do I understand matrix multiplication order (right-to-left)?
- [ ] Can I compose multiple transformations correctly?

### Shading
- [ ] Can I write the Blinn-Phong formula?
- [ ] Can I compute L, V, H vectors given positions?
- [ ] Do I know what each term (ambient/diffuse/specular) represents?

### Pipeline
- [ ] Can I list the 5 coordinate spaces in order?
- [ ] Do I understand what gl_Position is?
- [ ] Can I explain vertex vs fragment shader roles?

### Meshes
- [ ] Can I describe how to generate a sphere mesh?
- [ ] Do I understand indexed vs non-indexed meshes?
- [ ] Can I explain UV coordinate mapping?

If you answered NO to any, review that topic in the study guide!

---

## 🎯 Study Strategy Recommendations

### One Week Before Exam
1. Read full [CMPT361_STUDY_GUIDE.md](./CMPT361_STUDY_GUIDE.md) cover-to-cover
2. Review lecture slides for each topic
3. Go through your assignment code to refresh memory
4. Make flashcards for key formulas

### Three Days Before Exam
1. Work through all 15 practice questions
2. Focus on high-priority topics (see [QUICK_REFERENCE.md](./QUICK_REFERENCE.md))
3. Practice writing matrices and computing coordinates
4. Review edge cases (top-left rule, pole triangles, etc.)

### One Day Before Exam
1. Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for formula review
2. Complete self-check questions
3. Skim [LEARNING_OUTCOMES_VISUAL.md](./LEARNING_OUTCOMES_VISUAL.md) for confidence
4. Get good sleep! 😴

### Exam Day
- ✅ Bring calculator for matrix math
- ✅ Draw diagrams for spatial questions
- ✅ Remember: degrees vs radians conversion
- ✅ Check your work (especially sign errors)
- ✅ Read questions carefully (top-left rule is tricky!)

---

## 🏆 What You've Accomplished

Through these assignments, you have:

✅ **Implemented core graphics algorithms** from scratch  
✅ **Mastered mathematical foundations** (linear algebra, geometry)  
✅ **Written GPU shader programs** in GLSL  
✅ **Generated 3D geometry** procedurally  
✅ **Applied realistic lighting** models  
✅ **Handled complex edge cases** correctly  
✅ **Optimized algorithms** for performance  

**You now understand how pixels appear on your screen!** 🖥️✨

These skills are directly applicable to:
- Game development (Unity, Unreal Engine)
- Graphics programming (OpenGL, DirectX, Vulkan)
- 3D modeling and animation
- Computer vision and robotics
- Virtual and augmented reality
- Scientific visualization

---

## 📝 Notes

- **Late Penalty:** Assignment 3 received -100% late penalty but demonstrated perfect technical understanding
- **Specular Issue:** Assignment 4 lost 1 point on specular component, likely a minor implementation detail
- **Overall Performance:** 95% technical proficiency across both assignments

The study materials in this repository are comprehensive and should fully prepare you for the CMPT 361 final exam!

---

## 📞 Questions?

If you have questions about any of the study materials:
1. Review the detailed explanations in [CMPT361_STUDY_GUIDE.md](./CMPT361_STUDY_GUIDE.md)
2. Check the quick formulas in [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. See concrete examples in [LEARNING_OUTCOMES_VISUAL.md](./LEARNING_OUTCOMES_VISUAL.md)
4. Refer to the assignment READMEs for original specifications
5. Review your actual implementation code

---

**Good luck on your final exam! You've got this! 🚀**

*Remember: Understanding concepts is more valuable than memorizing formulas. These materials provide both!*

