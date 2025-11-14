// wrriten by copilot through prompt- test cases for testing draw triangle function(especially for the top left rule). (either choose triangles that are smaller, or make the logging for special cases only.)
// added context files were ../.github/copilot-instructions.md and ../README.md

// Test cases for drawTriangle function - Top-Left Rule validation
// Keep triangles small to make console output manageable

// TEST 1: Two triangles forming a square (better test for shared edges)
// Expected: No gaps, no double-coloring on diagonal shared edge
const TEST_1_ADJACENT_DIAGONAL = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - top-left - red
  "v,20,10,0.0,1.0,0.0;",  // v1 - top-right - green
  "v,10,20,0.0,0.0,1.0;",  // v2 - bottom-left - blue
  "v,20,20,1.0,1.0,0.0;",  // v3 - bottom-right - yellow
  "t,0,2,3;",              // Triangle 1: top-left to bottom diagonal
  "t,0,3,1;"               // Triangle 2: top-right to bottom diagonal
].join("\n");

// TEST 2: Two triangles sharing a horizontal edge (top edge)
// Expected: Only the lower triangle (downward-pointing) colors the shared edge
const TEST_2_HORIZONTAL_SHARED = [
  "v,10,20,1.0,0.0,0.0;",  // v0 - red
  "v,30,20,0.0,1.0,0.0;",  // v1 - green
  "v,20,10,0.0,0.0,1.0;",  // v2 - blue (top vertex)
  "v,20,30,1.0,1.0,0.0;",  // v3 - yellow (bottom vertex)
  "t,2,0,1;",              // Triangle 1: upward-pointing
  "t,0,3,1;"               // Triangle 2: downward-pointing (owns the shared edge)
].join("\n");

// TEST 3: Four triangles forming a square (diamond pattern)
// Expected: No gaps between any triangles
const TEST_3_DIAMOND = [
  "v,15,10,1.0,0.0,0.0;",  // v0 - top - red
  "v,10,15,0.0,1.0,0.0;",  // v1 - left - green
  "v,20,15,0.0,0.0,1.0;",  // v2 - right - blue
  "v,15,20,1.0,1.0,0.0;",  // v3 - bottom - yellow
  "v,15,15,1.0,1.0,1.0;",  // v4 - center - white
  "t,0,4,2;",              // Top-right triangle
  "t,2,4,3;",              // Bottom-right triangle
  "t,3,4,1;",              // Bottom-left triangle
  "t,1,4,0;"               // Top-left triangle
].join("\n");

// TEST 4: Single small triangle to verify basic rasterization
// Expected: All interior pixels colored, edges follow top-left rule
const TEST_4_SMALL_TRIANGLE = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - red
  "v,16,16,0.0,1.0,0.0;",  // v1 - green
  "v,16,10,0.0,0.0,1.0;",  // v2 - blue
  "t,0,1,2;"
].join("\n");

// TEST 5: Degenerate case - Very small triangle (nearly a line)
const TEST_5_THIN_TRIANGLE = [
  "v,10,10,1.0,0.0,0.0;",
  "v,15,10,0.0,1.0,0.0;",
  "v,12,12,0.0,0.0,1.0;",
  "t,0,1,2;"
].join("\n");

// TEST 6: Right triangle with vertical and horizontal edges
// Tests top edge (horizontal) and left edge (vertical) rules
const TEST_6_RIGHT_TRIANGLE = [
  "v,10,10,1.0,0.0,0.0;",  // v0 - top-left - red
  "v,10,20,0.0,1.0,0.0;",  // v1 - bottom-left - green
  "v,20,20,0.0,0.0,1.0;",  // v2 - bottom-right - blue
  "t,0,1,2;"
].join("\n");

// TEST 7: Adjacent triangles sharing a vertical edge
// Expected: Only one triangle colors the shared vertical edge
const TEST_7_VERTICAL_SHARED = [
  "v,15,10,1.0,0.0,0.0;",  // v0 - red
  "v,15,20,0.0,1.0,0.0;",  // v1 - green
  "v,10,15,0.0,0.0,1.0;",  // v2 - blue (left)
  "v,20,15,1.0,1.0,0.0;",  // v3 - yellow (right)
  "t,0,1,2;",              // Left triangle
  "t,0,3,1;"               // Right triangle
].join("\n");

// TEST 8: Triangle with one vertex at exact pixel center
// Tests vertex inclusion rules
const TEST_8_VERTEX_CENTER = [
  "v,15,15,1.0,0.0,0.0;",  // Center vertex
  "v,10,20,0.0,1.0,0.0;",
  "v,20,20,0.0,0.0,1.0;",
  "t,0,1,2;"
].join("\n");

// TEST 9: Horizontal line triangle (degenerate)
// removed test, was told that we wont have this

// TEST 10: Multiple triangles with shared vertex at center
// Tests vertex ownership when multiple triangles meet
const TEST_10_SHARED_VERTEX = [
  "v,15,15,1.0,1.0,1.0;",  // v0 - center - white
  "v,10,10,1.0,0.0,0.0;",  // v1 - top-left
  "v,20,10,0.0,1.0,0.0;",  // v2 - top-right
  "v,20,20,0.0,0.0,1.0;",  // v3 - bottom-right
  "v,10,20,1.0,1.0,0.0;",  // v4 - bottom-left
  "t,0,1,2;",
  "t,0,2,3;",
  "t,0,3,4;",
  "t,0,4,1;"
].join("\n");

// Export all test cases
export const TRIANGLE_TESTS = {
  TEST_1_ADJACENT_DIAGONAL,
  TEST_2_HORIZONTAL_SHARED,
  TEST_3_DIAMOND,
  TEST_4_SMALL_TRIANGLE,
  TEST_5_THIN_TRIANGLE,
  TEST_6_RIGHT_TRIANGLE,
  TEST_7_VERTICAL_SHARED,
  TEST_8_VERTEX_CENTER,
//   TEST_9_FLAT_TRIANGLE,
  TEST_10_SHARED_VERTEX
};

// Usage instructions:
// Copy one of these test cases into the input box in a3.html
// Or temporarily replace DEF_INPUT in a3.js with one of these
// Check console output for proper edge handling

// Expected behaviors to verify:
// 1. No pixels should have flags that are all > 0 AND be rejected (would indicate interior point missed)
// 2. Pixels with one flag = 0 should check left/top edge rules
// 3. Pixels with two flags = 0 (vertices) should require 2 left/top edges
// 4. Shared edges between triangles should be colored by exactly one triangle
// 5. No gaps should appear between adjacent triangles
// 6. Overlapping triangles should produce blended colors (last triangle wins)
