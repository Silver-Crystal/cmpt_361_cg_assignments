# Triangle Test Cases - Instructions

## Quick Start

The file `triangle_test_cases.js` contains 10 comprehensive test cases for validating the `drawTriangle()` implementation, particularly the top-left rule.

## How to Use

### Method 1: Copy-Paste into a3.html
1. Open `a3.html` in your browser
2. Open `tests/triangle_test_cases.js`
3. Copy any test case string (e.g., `TEST_1_ADJACENT_DIAGONAL`)
4. Paste it into the text input box in the browser
5. Click "Update" button
6. Check console output (F12 → Console tab)

### Method 2: Modify DEF_INPUT in a3.js
```javascript
// In a3.js, replace the DEF_INPUT constant:
const DEF_INPUT = `
v,20,10,1.0,0.0,0.0;
v,40,10,0.0,1.0,0.0;
v,30,30,0.0,0.0,1.0;
v,40,30,1.0,1.0,0.0;
t,0,2,1;
t,3,1,2;
`;
```

## Controlling Console Output

In `a3.js`, the `pointIsInsideTriangle()` function now has two logging flags:

```javascript
const ENABLE_EDGE_LOGGING = false;  // Set true to see all edge pixels
const ENABLE_VERTEX_LOGGING = true;  // Set true to see vertex processing
```

**Recommended settings:**
- For small triangles: Both `true` - see everything
- For large triangles: `ENABLE_EDGE_LOGGING = false`, `ENABLE_VERTEX_LOGGING = true` - only see vertices
- For production: Both `false` - no logging

## Test Case Descriptions

### TEST 1: Adjacent Diagonal Triangles ⭐ CRITICAL
**Purpose:** Test shared diagonal edge handling
**Expected:** 
- Shared edge (40,10)→(30,30) colored by Triangle 2 only (it's a left edge)
- Vertex (40,10) excluded from both triangles (only 1 qualifying edge)
- No gaps, no double-coloring

**What to check in console:**
```
VERTEX Point: [40, 10] Flags: 0 0 200
  ✗ Vertex EXCLUDED - flagFoundTwo: 1
```

### TEST 2: Horizontal Shared Edge ⭐ CRITICAL
**Purpose:** Test top edge rule with two triangles meeting at horizontal edge
**Expected:** 
- Lower triangle owns the shared horizontal edge (top edge rule)
- Upper triangle excludes the shared edge

### TEST 3: Diamond (4 Triangles)
**Purpose:** Stress test with 4 triangles meeting at center
**Expected:** No gaps between any triangles

### TEST 4: Small Single Triangle
**Purpose:** Basic sanity check
**Expected:** Clean triangle with ~20-40 pixels filled

### TEST 5: Thin Triangle
**Purpose:** Near-degenerate case
**Expected:** Few pixels, possibly line-like appearance

### TEST 6: Right Triangle
**Purpose:** Test axis-aligned edges (vertical + horizontal)
**Expected:** Clean 90-degree corner

### TEST 7: Vertical Shared Edge
**Purpose:** Test left edge rule with vertical shared edge
**Expected:** Only left triangle colors the shared edge

### TEST 8: Vertex at Center
**Purpose:** Test vertex coordinate flooring
**Expected:** Vertex at (15,15) properly handled

### TEST 9: Flat Triangle (Degenerate)
**Purpose:** All vertices on same y-line
**Expected:** Little to no pixels (area ≈ 0)

### TEST 10: Multiple Shared Vertex
**Purpose:** 4 triangles meeting at one central point
**Expected:** Center vertex handled consistently

## Interpreting Console Output

### Interior Points (no console output when ENABLE_EDGE_LOGGING = false)
- All flags > 0
- Automatically included

### Edge Points (logged when ENABLE_EDGE_LOGGING = true)
```
Edge Point: [25, 15] Flags: 100 0 50
                              ^   ^  ^
                              |   |  |
                   flag0 > 0 -+   |  |
           flag1 = 0 (on edge) ---+  |
                   flag2 > 0 --------+
```
- Checks if edge is left or top edge
- Returns 1 if owned by this triangle

### Vertex Points (logged when ENABLE_VERTEX_LOGGING = true)
```
VERTEX Point: [40, 10] Flags: 0 0 200
  ✗ Vertex EXCLUDED - flagFoundTwo: 1
```
- Two flags = 0 means it's a triangle vertex
- Needs 2 qualifying edges (left or top)
- `flagFoundTwo: 1` means only 1 qualifying edge → excluded
- `flagFoundTwo: 2` means 2 qualifying edges → included

## Common Issues to Watch For

### ❌ Double-Coloring
**Symptom:** Shared edge appears in wrong color (second triangle overwrites)
**Check:** Console should NOT show both triangles including the same edge pixels

### ❌ Gaps
**Symptom:** White pixels between adjacent triangles
**Check:** Every pixel in bounding box should belong to exactly one triangle

### ❌ Wrong Vertex Ownership
**Symptom:** Vertex colored by wrong triangle or missing
**Check:** Vertex should only be included if `flagFoundTwo: 2`

## Expected Output Examples

### Good Output (TEST 1):
```
Drawing triangle: t, 0, 2, 1 (Triangle 1)
VERTEX Point: [40, 10] Flags: 0 0 200
  ✗ Vertex EXCLUDED - flagFoundTwo: 1

Drawing triangle: t, 3, 1, 2 (Triangle 2)
VERTEX Point: [40, 10] Flags: 0 0 200
  ✗ Vertex EXCLUDED - flagFoundTwo: 1
```
✓ Both triangles exclude shared vertex (40,10)

### Bad Output:
```
Drawing triangle: t, 0, 2, 1
VERTEX Point: [40, 10] Flags: 0 0 200
  ✓ Vertex INCLUDED - found 2 left/top edges  ❌ WRONG!
```
✗ First triangle should not include this vertex

## Quick Test Procedure

1. **Start with TEST_4_SMALL_TRIANGLE**
   - Should produce clean small triangle
   - ~20-40 pixels filled
   - Verify all vertices handled

2. **Run TEST_1_ADJACENT_DIAGONAL** ⭐
   - Most critical test
   - Check vertex (40,10) excluded by both
   - Check no gaps in diagonal edge

3. **Run TEST_2_HORIZONTAL_SHARED**
   - Verify top edge rule
   - Lower triangle owns horizontal edge

4. **Run TEST_3_DIAMOND**
   - Visual check: complete square, no gaps
   - Center point handled correctly

5. **Run remaining tests** for edge cases

## Performance Tips

For large triangles (>100 pixels):
- Set `ENABLE_EDGE_LOGGING = false` to avoid console spam
- Use small test cases for detailed debugging
- The bounding box approach should handle large triangles efficiently

## Debugging Checklist

- [ ] Vertices are in anti-clockwise order
- [ ] Left edge: y0 < y1 (y increases downward)
- [ ] Top edge: y0 == y1 && y0 < y2
- [ ] Vertices need 2 qualifying edges
- [ ] Non-vertex edge points need 1 qualifying edge
- [ ] Interior points (all flags > 0) always included
- [ ] Cross product sign matches screen coordinates
- [ ] Homogeneous coordinates used for dot product

## Need More Tests?

Create custom tests using this format:
```javascript
const MY_TEST = [
  "v,x1,y1,r,g,b;",  // vertex 0
  "v,x2,y2,r,g,b;",  // vertex 1
  "v,x3,y3,r,g,b;",  // vertex 2
  "t,0,1,2;"         // triangle using vertices 0,1,2
].join("\n");
```

**Tips for custom tests:**
- Keep triangles small (10-30 pixel range) for manageable output
- Use distinct colors to identify which triangle owns pixels
- Test specific edge cases you're concerned about
- Adjacent triangles should share exactly one edge or vertex
