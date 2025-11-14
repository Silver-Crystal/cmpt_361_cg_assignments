# CMPT 361 Assignment 3 - Rasterization Project
### user additions
-keep in mind that the coordinates start from the top left and then go down (so as you move down, y value increases, as you go right, the x value increases).
- Whenever user prompts, check for all changes and refer to some necessary files such as- README.md(always check these, especially README.md for context). Also read any other files mentioned and shared by the user.
-(figured out/guessed when i checked the website- https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage-rules .
so the thing is, if its an vertex, then it needs to pass two tests, so either it needs to be the vertex between two left edges, or a vertex between one top and one left edge)
- so for normal points on edge which are NOT vertices, we do the normal tests and return true when one of the checks pass for the top edge rule pass, but for vertices we only return true when TWO checks pass(and that is indeed correct)
- we go anticlockwise for the vertices, any input is also supposed to be anti clockwise
- for some edge to be a left edge, the y coordinate of the starting point has to be higher than the ending point.(thanks to the anticlockwise rule).
- for some edge to be a top edge, the two vertices making up the edge have to have the same y value and need to be highe than the third vertex.
- edges DO NOT go in clockwise direction, so if we have a triangle t, 0, 2, 1(where 0, 2, 1 are ordered in anti clockwise direction), the possible edges are only 0->2, 2->1, 1->0, 1->2 is not an edge that we will ever use, or think about -as it goes in clocwise direction
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
- Coordinates are floored to integer pixels: `Math.floor(x1)`, `Math.floor(y1)` (might change in some cases, might also use ceil when we want the max value)

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
- **Loop structure is CORRECT**: `for (let i = 0; i <= dx; i++)` draws dx+1 pixels (e.g., from x=10 to x=15 is 6 pixels, requires dx+1 iterations where dx=5)
  - The final `x += sx` or `y += sy` after drawing the last pixel is harmless - it increments a local variable that's immediately discarded when the loop exits
  - **DO NOT "fix" this by adding `if (i < dx)` checks** - the algorithm is already correct as-is
  - The loop needs dx+1 iterations because a line segment of length dx requires dx+1 pixels to render (includes both endpoints)

**Triangle Rasterization:**
- Implement **top-left rule** for edge cases (shared edges should not double-draw)
- Use half-plane test or barycentric coordinates for inside/outside determination
- Avoid naive pixel iteration - use bounding box approach
- **Barycentric interpolation**: For point P with vertices v1, v2, v3:
  - Calculate area of full triangle: `Area(v1,v2,v3)`
  - Calculate sub-triangle areas: `u = Area(P,v2,v3) / Area(v1,v2,v3)`, `v = Area(v1,P,v3) / Area(v1,v2,v3)`, `w = Area(v1,v2,P) / Area(v1,v2,v3)`
  - Point inside if u, v, w all >= 0 and u + v + w = 1
  - Color at P: `color = u*color1 + v*color2 + w*color3`
  - Area calculation using cross product: `Area = 0.5 * |(x2-x1)(y3-y1) - (x3-x1)(y2-y1)|`
      - can change the coordinates to homogeneous coordinates(by adding 1 at the end -eg. for v1 - (x1, y1,1)) and calculate the volume 
        volume(v1,v2,v3) = (v1xv2).v3
        i.e the solution of cross product(of v1 and v2) dot product with v3
        the cross product is basically (a, b, c) from line equation for line v0->v1
        so doing a dot product with p instead of with v3, we get ax+by+c

## Common Pitfalls

1. **Inverted decision variable logic**: Coordinates start from the top left corner, as mentioned, x increases in the right direction, y increases as we go down.

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
"v,20,10,1.0,0.0,0.0; v,40,10,0.0,1.0,0.0; v,30,30,0.0,0.0,1.0; v,40,30,1.0,1.0,0.0; t,0,2,1; t,3,1,2;"
```

**Debugging:**
- Check browser console for `setPixel()` assertion failures
- Use `console.log()` in `a3.js` to trace pixel generation- important

can also ask the user to test the program and the user will make a file with the console output, read the console output for that.

## Reference Materials

See `context/Bresenham_al.txt` for textbook algorithm description. Note Exercise 8.14 asks to derive initial decision variable value (`d₀ = 2*Δy - Δx` for 0 ≤ m ≤ 1 case).

Existing `ai/plan.txt` contains implementation planning notes but may reference older code versions. - more like record keeping so be careful of trying to use it in current implementations.
