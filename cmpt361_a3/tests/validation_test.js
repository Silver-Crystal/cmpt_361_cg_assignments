// VALIDATION TESTS - Copy individual tests to DEF_INPUT to verify correctness
// Enable console logging in a3.js to see pixel-by-pixel output

// ============================================================================
// VALIDATION TEST 1: Horizontal Line (dx=5, dy=0)
// ============================================================================
// Expected: 6 pixels from (10,10) to (15,10)
// Pixels: (10,10), (11,10), (12,10), (13,10), (14,10), (15,10)
// Color: Red gradually blending to blue
const TEST_HORIZONTAL = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - red
  "v,15,10,0.0,0.0,1.0;",  // v1 - blue
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 2: Vertical Line (dx=0, dy=5)
// ============================================================================
// Expected: 6 pixels from (20,10) to (20,15)
// Pixels: (20,10), (20,11), (20,12), (20,13), (20,14), (20,15)
// Color: Red gradually blending to blue
const TEST_VERTICAL = [
  "v,20,10,1.0,0.0,0.0;",  // v0 - red
  "v,20,15,0.0,0.0,1.0;",  // v1 - blue
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 3: Perfect 45° Diagonal (dx=dy=5)
// ============================================================================
// Expected: 6 pixels from (10,20) to (15,25)
// Pixels: (10,20), (11,21), (12,22), (13,23), (14,24), (15,25)
// Color: Red gradually blending to green
const TEST_DIAGONAL_45 = [
  "v,10,20,1.0,0.0,0.0;",  // v0 - red
  "v,15,25,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 4: Shallow Slope (dx=8, dy=3) - Octant 0
// ============================================================================
// Expected: 9 pixels, more horizontal steps than vertical
// Should show gradual staircase pattern
const TEST_OCTANT_0 = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - red
  "v,18,13,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 5: Steep Slope (dx=3, dy=8) - Octant 1
// ============================================================================
// Expected: 9 pixels, more vertical steps than horizontal
// Should show vertical-dominant staircase
const TEST_OCTANT_1 = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - red
  "v,13,18,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 6: Single Pixel (dx=0, dy=0)
// ============================================================================
// Expected: Exactly 1 pixel at (15,15)
// Both vertices floor to same pixel
const TEST_SINGLE_PIXEL = [
  "v,15.7,15.8,1.0,0.0,0.0;",  // v0 - floors to (15,15)
  "v,15.2,15.1,0.0,1.0,0.0;",  // v1 - floors to (15,15)
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 7: Two Pixel Line (dx=1, dy=0)
// ============================================================================
// Expected: Exactly 2 pixels at (10,20) and (11,20)
// Tests loop boundary: should do dx+1 = 2 iterations
const TEST_TWO_PIXELS = [
  "v,10,20,1.0,0.0,0.0;",  // v0 - red
  "v,11,20,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 8: Bidirectional Test (Symmetry)
// ============================================================================
// Both lines should draw identical pixels, just with reversed colors
const TEST_BIDIRECTIONAL = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - red
  "v,20,15,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;",                 // Draw red→green
  
  "v,10,25,0.0,1.0,0.0;",  // v2 - green
  "v,20,30,1.0,0.0,0.0;",  // v3 - red
  "l,2,3;"                  // Draw green→red (should match above pattern)
].join("\n");

// ============================================================================
// VALIDATION TEST 9: Negative Slope (going up-left)
// ============================================================================
// Expected: Line from (20,20) to (10,15), moving left-up
// Tests octant 4 behavior
const TEST_NEGATIVE_SLOPE = [
  "v,20,20,1.0,0.0,0.0;",  // v0 - red
  "v,10,15,0.0,1.0,0.0;",  // v1 - green
  "l,0,1;"
].join("\n");

// ============================================================================
// VALIDATION TEST 10: All 8 Octants Mini Test
// ============================================================================
// Draws 8 short lines radiating from center in all directions
const TEST_ALL_OCTANTS = [
  "v,32,32,1.0,1.0,1.0;",  // v0 - center (white)
  
  // Octant 0: right-down shallow
  "v,38,35,1.0,0.0,0.0;",  // v1 - red
  "l,0,1;",
  
  // Octant 1: right-down steep
  "v,35,38,1.0,0.5,0.0;",  // v2 - orange
  "l,0,2;",
  
  // Octant 2: left-down steep
  "v,29,38,1.0,1.0,0.0;",  // v3 - yellow
  "l,0,3;",
  
  // Octant 3: left-down shallow
  "v,26,35,0.0,1.0,0.0;",  // v4 - green
  "l,0,4;",
  
  // Octant 4: left-up shallow
  "v,26,29,0.0,1.0,1.0;",  // v5 - cyan
  "l,0,5;",
  
  // Octant 5: left-up steep
  "v,29,26,0.0,0.0,1.0;",  // v6 - blue
  "l,0,6;",
  
  // Octant 6: right-up steep
  "v,35,26,1.0,0.0,1.0;",  // v7 - magenta
  "l,0,7;",
  
  // Octant 7: right-up shallow
  "v,38,29,1.0,0.0,0.5;",  // v8 - pink
  "l,0,8;"
].join("\n");

// ============================================================================
// HOW TO USE THESE TESTS
// ============================================================================
/*
1. Copy any test constant above
2. In a3.js, replace DEF_INPUT with the test
3. In a3.js, uncomment the console.log statements (lines 22, 52, 79)
4. Refresh browser and check console output
5. Verify pixel-by-pixel output matches expected behavior

Example for TEST_HORIZONTAL:
- Should see exactly 6 console logs
- x should increment from 10 to 15
- y should stay at 10 for all pixels
- No pixel at x=16 (common bug)

Example for TEST_DIAGONAL_45:
- Should see exactly 6 console logs
- Both x and y should increment together: (10,20), (11,21), (12,22), etc.
- Color should gradually blend from red to green

Common Issues to Check:
❌ Off-by-one: Drawing 7 pixels instead of 6 for dx=5
❌ Wrong direction: Line going wrong way
❌ Color interpolation: Abrupt color changes instead of smooth gradient
❌ Single pixel: Crashes or draws nothing when dx=dy=0
❌ Asymmetry: Forward and backward lines look different
*/

// ============================================================================
// PIXEL COUNT VALIDATION
// ============================================================================
/*
Quick reference for expected pixel counts:

dx=0, dy=0  → 1 pixel   (single pixel case)
dx=1, dy=0  → 2 pixels  (horizontal)
dx=0, dy=1  → 2 pixels  (vertical)
dx=5, dy=0  → 6 pixels  (horizontal)
dx=0, dy=5  → 6 pixels  (vertical)
dx=5, dy=5  → 6 pixels  (45° diagonal)
dx=8, dy=3  → 9 pixels  (shallow slope)
dx=3, dy=8  → 9 pixels  (steep slope)

Formula: max(dx, dy) + 1 pixels

The +1 is because we include BOTH endpoints!
*/

// Export all tests (though not used directly, helps with documentation)
export {
  TEST_HORIZONTAL,
  TEST_VERTICAL,
  TEST_DIAGONAL_45,
  TEST_OCTANT_0,
  TEST_OCTANT_1,
  TEST_SINGLE_PIXEL,
  TEST_TWO_PIXELS,
  TEST_BIDIRECTIONAL,
  TEST_NEGATIVE_SLOPE,
  TEST_ALL_OCTANTS
};
