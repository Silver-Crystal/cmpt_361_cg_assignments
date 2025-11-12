# CMPT 361 Assignment 3 - Rasterization Project

## Project Overview
This is a computer graphics assignment implementing line and triangle rasterization algorithms from scratch. The project uses a custom framebuffer and teaches fundamental graphics concepts like Bresenham's algorithm, barycentric coordinates, and the top-left rasterization rule.

## Architecture

**Core Components:**
- `framebuffer.js`: WebGL-based pixel buffer - provides `setPixel(x, y, color)` interface
  - Stores pixels in 1D array (`buffer[y * pixelsWide + x]`)
  - **Do not modify**: WebGL rendering converts buffer to screen triangles in `display()`
  - Validates coordinates are integers and within bounds via assertions
- `rasterizer.js`: Text parser that converts vertex definitions into draw calls
  - `parse()` method splits input by `;` and builds vertex array `V[]`
  - Calls `drawTriangle()` first, then `drawLine()`, finally point pixels (layering order)
- `a3.js`: Student implementation file - **only file that should be modified**
  - Implement `drawLine(v1, v2)` and `drawTriangle(v1, v2, v3)` prototypes
  - Access framebuffer via `this.setPixel(x, y, [r, g, b])`
- `a3.html`: Browser interface with text input and canvas output
  - Loads module dynamically, supports URL params (`?pixelsWide=128`, `?input=...`)

**Data Flow:**
1. Text input (`v,x,y,r,g,b;` format) → `Rasterizer.parse()` 
2. Parser builds vertex array `V[]` and calls `drawLine()` or `drawTriangle()`
3. Implementation uses `this.setPixel(x, y, [r, g, b])` to write pixels
4. `Framebuffer.display()` renders buffer to WebGL canvas

## Critical Constraints

**DO NOT modify:**
- Import/export statements in `a3.js`
- Any file except `a3.js`
- The `setPixel()` interface or framebuffer implementation

**Coordinate System:**
- Origin (0,0) is **top-left corner**
- x increases right, y increases downward
- Only positive coordinates are used
- Coordinates are floored to integer pixels: `Math.floor(x1)`, `Math.floor(y1)`

**Pixel Specification:**
- Colors are RGB arrays with floats in [0,1]: `[r, g, b]`
- `setPixel()` requires integer coordinates and will assert if floats are passed

## Algorithm Requirements

**Bresenham's Line Algorithm:**
- Must handle all slopes and directions (8 octants)
- Two cases: dx >= dy (horizontal-dominant) and dy > dx (vertical-dominant)
- Decision variable initialization: `d = 2*dy - dx` (horizontal) or `d = 2*dx - dy` (vertical)
- **Sign convention from textbook**: When `d > 0`, line is closer to lower pixel, do NOT increment y
- Linear color interpolation: `t = step / total_steps`, then `color_channel = c1 + t*(c2-c1)`

**Triangle Rasterization:**
- Implement **top-left rule** for edge cases (shared edges should not double-draw)
- Use half-plane test or barycentric coordinates for inside/outside determination
- Avoid naive pixel iteration - use bounding box approach
- **Barycentric interpolation**: For point P with vertices v1, v2, v3:
  - Calculate area of full triangle: `Area(v1,v2,v3)`
  - Calculate sub-triangle areas: `α = Area(P,v2,v3) / Area(v1,v2,v3)`, `β = Area(v1,P,v3) / Area(v1,v2,v3)`, `γ = Area(v1,v2,P) / Area(v1,v2,v3)`
  - Point inside if α, β, γ all >= 0 and α + β + γ = 1
  - Color at P: `color = α*color1 + β*color2 + γ*color3`
  - Area calculation using cross product: `Area = 0.5 * |(x2-x1)(y3-y1) - (x3-x1)(y2-y1)|`

## Common Pitfalls

1. **Wrong initial pixel positions**: Must floor coordinates before starting Bresenham loop
2. **Inverted decision variable logic**: Existing commented code (lines 24-104) may have different sign convention than textbook
3. **Single-pixel edge case**: When `dx == 0 && dy == 0`, handle separately
4. **Color interpolation denominator**: Check for zero when `dx == 0` or `dy == 0`
5. **Step direction confusion**: `sx` and `sy` can be -1 or +1 independently based on endpoint ordering

## Development Workflow

**Running the project:**
```bash
python3 -m http.server
# Navigate to http://localhost:8000/a3.html
```

**Testing approach:**
- Default input creates two triangles and a square outline (see `DEF_INPUT` in `a3.js`)
- Expected output: `output.png` shows correct rendering
- Test all octants manually by adding vertices with various slopes
- **Important**: Default input doesn't test top-left rule - create custom test cases

**Test case examples:**
```javascript
// Horizontal line (slope = 0)
"v,10,20,1.0,0.0,0.0; v,50,20,0.0,0.0,1.0; l,0,1;"

// Vertical line (dx = 0)
"v,30,10,1.0,1.0,0.0; v,30,50,0.0,1.0,1.0; l,0,1;"

// Single pixel (dx = 0, dy = 0)
"v,25.7,25.9,1.0,0.0,1.0; v,25.3,25.1,1.0,0.0,1.0; l,0,1;"

// Steep negative slope (dy > dx, downward)
"v,40,10,1.0,0.0,0.0; v,45,50,0.0,1.0,0.0; l,0,1;"

// Diagonal (slope = 1)
"v,10,10,1.0,1.0,1.0; v,30,30,0.0,0.0,0.0; l,0,1;"

// Adjacent triangles (test top-left rule - no gaps/overlaps)
"v,20,10,1.0,0.0,0.0; v,40,10,0.0,1.0,0.0; v,30,30,0.0,0.0,1.0; v,40,30,1.0,1.0,0.0; t,0,1,2; t,1,3,2;"
```

**Debugging:**
- Check browser console for `setPixel()` assertion failures
- Use `console.log()` in `a3.js` to trace pixel generation
- Clear browser cache if changes don't reflect (common issue)

## Reference Materials

See `context/Bresenham_al.txt` for textbook algorithm description. Note Exercise 8.14 asks to derive initial decision variable value (`d₀ = 2*Δy - Δx` for 0 ≤ m ≤ 1 case).

Existing `ai/plan.txt` contains implementation planning notes but may reference older code versions.
