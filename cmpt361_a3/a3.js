import { Framebuffer } from './framebuffer.js';
import { Rasterizer as parentRetadedRasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE
// check https://github.com/Silver-Crystal/cmpt_361_cg_assignments/tree/copilot/fix-complete-a3-code/cmpt361_a3 for github repo which saves this and the other files(has some things like what i used when asking copilot to do something like testing or to go over my code and so on, cause copilot was hella dumb this time, i guess it didnt have enough context so gave that to it)
////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(vertex1, vertex2) and drawTriangle(vertex1, vertex2, v3) below.
////////////////////////////////////////////////////////////////////////////////
class Rasterizer extends parentRetadedRasterizer { // name suggested by an intelligent friend :pray:, gotta do what i gotta do(i think he was calling me retarded);
  // wouldn't work if we were not importing from a3.js in a3.html
  interpolateColor(c1, c2, t) {
    return [
      c1[0] + t * (c2[0] - c1[0]),
      c1[1] + t * (c2[1] - c1[1]),
      c1[2] + t * (c2[2] - c1[2])
    ];

  };
  // take two vertices defining line and rasterize to framebuffer
  drawLine(vertex1, vertex2) {
    const [x1, y1, [r1, g1, b1]] = vertex1;
    const [x2, y2, [r2, g2, b2]] = vertex2;
    console.log("Drawing line from (" + x1 + ", " + y1 + ") to (" + x2 + ", " + y2 + ")");
    // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
    // look in the file generatedCode.js in folder ai on my github repo for code that copilot generated for this function(the code was used as reference material whenever i was stuck) github: https://github.com/Silver-Crystal/cmpt_361_cg_assignments/tree/main/cmpt361_a3
    let color1 = [r1, g1, b1];
    let color2 = [r2, g2, b2];
    // store the floored, int version of x and y coordinates
    let [x1Floored, x2Floored, y1Floored, y2Floored] = [Math.floor(x1), Math.floor(x2), Math.floor(y1), Math.floor(y2)];
    // store the change in x and y coordinate
    let [dx, dy] = [(Math.abs(x2Floored - x1Floored)), (Math.abs(y2Floored - y1Floored))];

    // Handle the single-pixel case where dx == 0 && dy == 0
    if (dx == 0 && dy == 0) {
      this.setPixel(x1Floored, y1Floored, color1);
      return;
    }
    // store the 'step direction', so the step direction in x, and step direction in y
    let [sx, sy] = [((x1Floored < x2Floored) ? 1 : -1), ((y1Floored < y2Floored) ? 1 : -1)];

    // influenced by copilot's code, make two variables for current variables
    let [x, y] = [x1Floored, y1Floored];

    // 'horizontal dominant' case, dx >= dy
    if (dx >= dy) {
      // initialising the decison variable 
      let d = 2 * dy - dx;

      for (let i = 0; i <= dx; i++) {
        // i is the current step, dx is the toal steps
        let t = (dx == 0) ? 0 : i / dx;   // should it be i /dx or i / (dx+1)
        let color = this.interpolateColor(color1, color2, t);
        console.log("  Horizontal case - Drawing pixel at (" + x + ", " + y + ") on iteration i=" + i);
        this.setPixel(x, y, color);


        if (d > 0) {
          y += sy;
          // d -= 2 * (dy - dx);
          d += 2 * (dy - dx);   // i was being stubborn and using -= , noticed bugs, asked copilot, told me that we are supposed to accumlate, ig could be cause the coordinate system is reversed..?
        }
        else {
          d += 2 * dy;
        }
        // stepping in x direction dx + 1 times
        x += sx;

      }

    }
    else {
      console.log("Entering else block.");
      let d = 2 * dx - dy;
      // console.log("Starting d value: " + d);

      for (let i = 0; i <= dy; i++) {
        // i is the current step, dy is the total steps
        let t = (dy == 0) ? 0 : i / dy;   // should it be i /dy or i / (dy+1)
        let color = this.interpolateColor(color1, color2, t);
        console.log("  Vertical case - Drawing pixel at (" + x + ", " + y + ") on iteration i=" + i);
        this.setPixel(x, y, color);
        console.log("Coordinates being coloured: (" + x + ", " + y + ")" );

        if (d > 0) {
          x += sx;
          d += 2 * (dx - dy);
          // d -= 2 * (dx - dy);
        }
        else {
          d += 2 * dx;
        }
        y += sy;
      }
    }

  }


  
  findCommonValueForSavingComputaion(vertex0, vertex1) { // THIS IS NOT THE BAR
    let [x0, y0,] = vertex0; let [x1, y1, ] = vertex1;
    // let vertex0crossvertex1 = [y0 - y1, x1 - x0, x0*y1 - x1*y0]; // could have a problem with the y value as we have a different coordinate system.
    // let vertex0crossvertex1 = [y1 - y0, x1 - x0, x1*y0 - x0*y1  ]; 
    let vertex0crossvertex1 = [y1 - y0, x0 - x1, x1*y0 - x0*y1];    // copilots color, tho ig i could have done the exchanging too.
    return vertex0crossvertex1;
  }

  dot (a, b) {
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  }
  findUsefulValueVolumeAndLineEquation(vertex2orPforFlag0, pForFlag1, flag, vertex0crossvertex1) {
    // the variable pForFlag1 DOES NOT MATTER in ANY area calculations
    // sourced from https://stackoverflow.com/questions/64816766/dot-product-of-two-arrays-in-javascript
    
    if (flag == 0) {
      let [x2, y2, ,] = vertex2orPforFlag0;
      let vertex2Homogeneous = [x2, y2, 1];
      let area = this.dot(vertex0crossvertex1, vertex2Homogeneous);
      return area;
    }
    else if (flag == 1) {
      let axPlusByPlusC = this.dot(vertex0crossvertex1,pForFlag1);
      return axPlusByPlusC;   // for the line with the startng point being vertex0 and the end point being vertex1
    }
  }

  findColor(vertex0, vertex1, vertex2, p, vertex0crossvertex1All) {    // https://www.youtube.com/watch?v=_sZ_8J0EqwM used knowledge or formulas from about 26:36 and 29:32 of the video
    // the p that we are sending here DOES NOT MATTER, here we are calculating AREA, and for area the p DOES NOT MATTER, go read the function definition
    let totalArea = this.findUsefulValueVolumeAndLineEquation(vertex2, p, 0, vertex0crossvertex1All[0]); // for vertex0, vertex1, vertex2, p, 0;; index = 0
    // in these we are sending p, p, because we are calculating the area of the smaller areas. we do NOT use the second p to calculate anything, as the flag is 0, we only use the value that we already calculated and stored vertex0crossvertex1All
    let areaAppositeVertexvertex2 = this.findUsefulValueVolumeAndLineEquation(p, p, 0, vertex0crossvertex1All[0]); // for vertex0, vertex1, p, p, 0 ;;  index = 0  // this is calculating area for the triangle OPPOSITE vertex2, therefore the area will not use vertex2 itslef.
    let areaAppositeVertexvertex0 = this.findUsefulValueVolumeAndLineEquation(p, p, 0, vertex0crossvertex1All[1]); // for vertex1, vertex2, p, p, 0;; index = 1;  // similar to above, will not use 0
    let areaAppositeVertexvertex1 = this.findUsefulValueVolumeAndLineEquation(p, p, 0, vertex0crossvertex1All[2]);  // for vertex2, vertex0, p, p, 0;; index = 2; // similar to above, will not use 1
    
    let u = areaAppositeVertexvertex0 / totalArea; let v = areaAppositeVertexvertex1 / totalArea; let w = areaAppositeVertexvertex2 / totalArea;
    // let pixelColour = u * vertex0[2] + v * vertex1[2] + w * vertex2[2];
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

  
/*
(figured out/guessed when i checked the website- https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage-rules .
so the thing is, if its an vertex, then it needs to pass two tests, so either it needs to be the vertex between two left edges, or a vertex between one top and one left edge)
*/
  pointIsInsideTriangle(vertex0, vertex1, vertex2, p, vertex0crossvertex1All) {
    let pHomogeneous = [p[0], p[1], 1];  // Convert to homogeneous coordinates
    let halfPlaneFlag0 = this.findUsefulValueVolumeAndLineEquation(vertex2, pHomogeneous, 1, vertex0crossvertex1All[0]); // ;; vertex0, vertex1, vertex2, p, 1;; index = 0 ;
    let halfPlaneFlag1 = this.findUsefulValueVolumeAndLineEquation(vertex0, pHomogeneous, 1, vertex0crossvertex1All[1]); // ;; vertex1, vertex2, vertex0, p, 1;; index = 1;
    let halfPlaneFlag2 = this.findUsefulValueVolumeAndLineEquation(vertex1, pHomogeneous, 1, vertex0crossvertex1All[2]); // ;; vertex2, vertex0, vertex1, p, 1;; index = 2;
    if (halfPlaneFlag0 > 0 && halfPlaneFlag1 > 0 && halfPlaneFlag2 > 0) return 1;
    // start of code block written by copilot for debugging
    // Enable/disable detailed logging here
    const ENABLE_EDGE_LOGGING = false;  // Set to true to see all edge pixels
    const ENABLE_VERTEX_LOGGING = false;  // Set to true to see vertex processing
    // end of code block written by copilot for debugging
    // helper arrow functions ig
    const checkLeftEdge = (vertex0, vertex1)=> {
      let [ , y0, ,] = vertex0; let [ , y1, ,]= vertex1;
     if (y0  < y1) return 1;  // left edge if starting point is higher than ending point. coordinate system has been reversed, so y increases as we go down.
      return 0;
    }
    const checkTopEdge = (vertex0,vertex1, vertex2) => { // takes such an input that vertex 0 and vertex 1 are the line that we are checking top edge's existence for.
      let [ , y0, ,] = vertex0; let [ , y1, ,] = vertex1; let [ , y2, ,] = vertex2;
      if (y0 == y1 && y0 < y2) return 1;    // simply checks if vertex1 and vertex2 form a horizontal line, then checks if they are above the last vertex.
      return 0;
    }
    // end of helper functions

    let flagNeeded = 1;
    let comparePoint1Vertex0 = (p[0] == Math.floor(vertex0[0]) && p[1] == Math.floor(vertex0[1])); let comparePoint1Vertex1 = (p[0] == Math.floor(vertex1[0]) && p[1] == Math.floor(vertex1[1])); let comparePoint1Vertex2 = (p[0] == Math.floor(vertex2[0]) && p[1] == Math.floor(vertex2[1]));
    // console.log("Point with color: " + pWithColor + ". String version: " + comparisonStringForPoint); 
    if ( comparePoint1Vertex0 || comparePoint1Vertex1 || comparePoint1Vertex2 ) flagNeeded++;
    if (flagNeeded == 1) {  // basically not a vertex
      // Only log if on an edge (one flag is 0) and logging is enabled
      if (ENABLE_EDGE_LOGGING && (halfPlaneFlag0 == 0 || halfPlaneFlag1 == 0 || halfPlaneFlag2 == 0)) {
        console.log("Edge Point:", p, "Flags:", halfPlaneFlag0, halfPlaneFlag1, halfPlaneFlag2);
      }
      if (halfPlaneFlag0 == 0) return (checkLeftEdge(vertex0, vertex1) || checkTopEdge(vertex0, vertex1, vertex2));
      else if (halfPlaneFlag1 == 0) return (checkLeftEdge(vertex1, vertex2) || checkTopEdge(vertex1, vertex2, vertex0));
      else if (halfPlaneFlag2 == 0) return (checkLeftEdge(vertex2, vertex0) || checkTopEdge(vertex2, vertex0, vertex1));
    }
    else {
      // means it is a vertex
      if (ENABLE_VERTEX_LOGGING) {
        console.log("VERTEX Point:", p, "Flags:", halfPlaneFlag0, halfPlaneFlag1, halfPlaneFlag2);
      }
      let flagFoundTwo = 0;
      // remember, the coordinates to us are provided in an anti clocwise manner.
      if (comparePoint1Vertex0) { // vertex0 means, that it is the corner for the two lines, v0 v1 and v2 v0. therefore the two triangles would be, v0, v1, v2 and v2, v0, v1
        if (checkLeftEdge(vertex0, vertex1)) flagFoundTwo++;
        if (checkLeftEdge(vertex2, vertex0)) flagFoundTwo++;
        if (checkTopEdge(vertex0, vertex1, vertex2)) flagFoundTwo++;
        else if (checkTopEdge(vertex2, vertex0, vertex1)) flagFoundTwo++;   // as there can only be one top edge, if the first one is a top edge, the second one can not be a top edge.
      }
      if (comparePoint1Vertex1) { // vertex1 means that it is shared between lines . v0, v1 and v1, v2. triangles, v0, v1, v2 and v1, v2, v0
        if (checkLeftEdge(vertex0, vertex1)) flagFoundTwo++;
        if (checkLeftEdge(vertex1, vertex2)) flagFoundTwo++;
        if (checkTopEdge(vertex0, vertex1, vertex2)) flagFoundTwo++;
        else if (checkTopEdge(vertex1, vertex2, vertex0)) flagFoundTwo++;   // as there can only be one top edge, if the first one is a top edge, the second one can not be a top edge.
      }
      if (comparePoint1Vertex2) { // vertex1 means that it is shared between lines . v1, v2 and v2, v0. triangles, v1, v2, v0 and v2, v0, v1
        if (checkLeftEdge(vertex1, vertex2)) flagFoundTwo++;
        if (checkLeftEdge(vertex2, vertex0)) flagFoundTwo++;
        if (checkTopEdge(vertex1, vertex2, vertex0)) flagFoundTwo++;
        else if (checkTopEdge(vertex2, vertex0, vertex1)) flagFoundTwo++;   // as there can only be one top edge, if the first one is a top edge, the second one can not be a top edge.
      }
      if (flagFoundTwo == 2) {
        if (ENABLE_VERTEX_LOGGING) {
          console.log("  ✓ Vertex INCLUDED - found 2 left/top edges");
        }
        return 1;
      }
      else {
        if (ENABLE_VERTEX_LOGGING) {
          console.log("  ✗ Vertex EXCLUDED - flagFoundTwo:", flagFoundTwo);
        }
      }

    }  
    return 0;  
  }


  // take 3 vertices defining a solid triangle and rasterize to framebuffer
  drawTriangle(vertex0, vertex1, vertex2) {
    const [x1, y1, ,] = vertex0;
    const [x2, y2, ,] = vertex1;
    const [x3, y3, ,] = vertex2;
    // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
    // let [x1Floored, x2Floored, x3Floored, y1Floored, y2Floored, y3Floored] = [Math.floor(x1), Math.floor(x2), Math.floor(x3), Math.floor(y1), Math.floor(y2), Math.floor(y3)];


    
    
    let [xmin, xmax, ymin, ymax] = [
      Math.floor(Math.min(x1, x2, x3)),
      Math.floor(Math.max(x1, x2, x3)),
      Math.floor(Math.min(y1, y2, y3)),
      Math.floor(Math.max(y1, y2, y3))
    ];  // https://www.youtube.com/watch?v=_sZ_8J0EqwM timestamp 22:13 from the video, this is what he uses
    // let [xstart, ystart] = [xmin,ymin];
    // the origin (0,0) is in top left corner, so x and y are min in the top left corner of the 'bounding box' that prof mentions in the G4 video.
    // so idea is to loop left to right like we normally do in arrays
    // for that the outer loop needs to be y, and inner loop needs to be x(figured it out after a sec, was doing x and y at the start)
    let vertex0crossvertex1All = [this.findCommonValueForSavingComputaion(vertex0,vertex1), this.findCommonValueForSavingComputaion(vertex1, vertex2), this.findCommonValueForSavingComputaion(vertex2, vertex0)];
    // console.log("starting loop: ");
    
    for (let y = ymin; y <= ymax; y++) {
      for (let x = xmin; x <= xmax; x++) {
        let p = [x, y];
        if (this.pointIsInsideTriangle(vertex0, vertex1, vertex2,p, vertex0crossvertex1All) == 1) {
          let color = this.findColor(vertex0, vertex1, vertex2, p, vertex0crossvertex1All);
          this.setPixel(x, y, color);
        }
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////

const DEF_INPUT = [
  "v,10,10,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,10,0.0,0.0,1.0;",
  "v,10,52,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,1;",
  "v,10,10,1.0,1.0,1.0;",
  "v,10,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,10,0.0,0.0,0.0;",
  "v,52,10,0.0,0.0,0.0;",
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// const DEF_INPUT = [ // cases by copilot
//   // ============================================================================
//   // COMPREHENSIVE LINE RASTERIZATION TEST SUITE (64x64 canvas)
//   // ============================================================================
  
//   // ----------------------------------------------------------------------------
//   // OCTANT TESTS: All 8 directions (0° - 360°)
//   // ----------------------------------------------------------------------------
  
//   // OCTANT 0: 0° < θ < 45° (shallow positive slope, dx > dy, right-down)
//   "v,5,5,1.0,0.0,0.0;",    // v0 - start red
//   "v,13,9,0.0,1.0,0.0;",   // v1 - end green
//   "l,0,1;",                 // Line in octant 0
  
//   // OCTANT 1: 45° < θ < 90° (steep positive slope, dy > dx, right-down)
//   "v,16,5,1.0,0.5,0.0;",   // v2 - start orange
//   "v,20,13,0.0,0.5,1.0;",  // v3 - end cyan
//   "l,2,3;",                 // Line in octant 1
  
//   // OCTANT 2: 90° < θ < 135° (steep positive slope, dy > dx, left-down)
//   "v,28,5,1.0,1.0,0.0;",   // v4 - start yellow
//   "v,24,13,0.5,0.0,1.0;",  // v5 - end purple
//   "l,4,5;",                 // Line in octant 2
  
//   // OCTANT 3: 135° < θ < 180° (shallow positive slope, dx > dy, left-down)
//   "v,36,5,0.0,1.0,1.0;",   // v6 - start cyan
//   "v,28,9,1.0,0.0,0.5;",   // v7 - end pink
//   "l,6,7;",                 // Line in octant 3
  
//   // OCTANT 4: 180° < θ < 225° (shallow negative slope, dx > dy, left-up)
//   "v,36,16,1.0,0.0,1.0;",  // v8 - start magenta
//   "v,28,12,0.0,1.0,0.5;",  // v9 - end cyan-green
//   "l,8,9;",                 // Line in octant 4
  
//   // OCTANT 5: 225° < θ < 270° (steep negative slope, dy > dx, left-up)
//   "v,24,24,0.5,1.0,0.0;",  // v10 - start lime
//   "v,20,16,1.0,0.5,0.5;",  // v11 - end salmon
//   "l,10,11;",               // Line in octant 5
  
//   // OCTANT 6: 270° < θ < 315° (steep negative slope, dy > dx, right-up)
//   "v,13,24,0.0,0.5,0.5;",  // v12 - start teal
//   "v,17,16,1.0,1.0,0.5;",  // v13 - end light yellow
//   "l,12,13;",               // Line in octant 6
  
//   // OCTANT 7: 315° < θ < 360° (shallow negative slope, dx > dy, right-up)
//   "v,5,16,0.5,0.0,0.5;",   // v14 - start dark purple
//   "v,13,12,1.0,0.8,0.0;",  // v15 - end orange-gold
//   "l,14,15;",               // Line in octant 7
  
//   // ----------------------------------------------------------------------------
//   // AXIS-ALIGNED AND SPECIAL ANGLE TESTS
//   // ----------------------------------------------------------------------------
  
//   // Pure horizontal line (0°)
//   "v,5,28,1.0,0.0,0.0;",   // v16 - red
//   "v,20,28,0.0,0.0,1.0;",  // v17 - blue
//   "l,16,17;",               // Horizontal line
  
//   // Pure vertical line (90°)
//   "v,24,28,1.0,1.0,0.0;",  // v18 - yellow
//   "v,24,38,0.0,1.0,1.0;",  // v19 - cyan
//   "l,18,19;",               // Vertical line
  
//   // Perfect diagonal (45°, slope = 1)
//   "v,28,28,1.0,0.0,1.0;",  // v20 - magenta
//   "v,38,38,0.0,1.0,0.0;",  // v21 - green
//   "l,20,21;",               // 45° diagonal
  
//   // Perfect diagonal (135°, slope = -1)
//   "v,48,28,1.0,0.5,0.0;",  // v22 - orange
//   "v,38,38,0.0,0.5,1.0;",  // v23 - cyan
//   "l,22,23;",               // 135° diagonal
  
//   // ----------------------------------------------------------------------------
//   // BOUNDARY AND EDGE CASES
//   // ----------------------------------------------------------------------------
  
//   // Very short line (2 pixels)
//   "v,5,42,1.0,0.0,0.0;",   // v24 - red
//   "v,6,42,0.0,1.0,0.0;",   // v25 - green
//   "l,24,25;",               // 2-pixel horizontal
  
//   // Single pixel (dx=0, dy=0) - both coordinates floor to same pixel
//   "v,10.7,42.8,1.0,1.0,0.0;",  // v26 - yellow (floors to 10,42)
//   "v,10.2,42.3,0.0,1.0,1.0;",  // v27 - cyan (floors to 10,42)
//   "l,26,27;",                   // Single pixel
  
//   // Very short vertical (2 pixels)
//   "v,14,42,0.5,0.5,1.0;",  // v28 - light blue
//   "v,14,43,1.0,0.5,0.5;",  // v29 - light red
//   "l,28,29;",               // 2-pixel vertical
  
//   // Short diagonal (3 pixels)
//   "v,18,42,1.0,0.0,0.5;",  // v30 - pink
//   "v,20,44,0.0,1.0,0.5;",  // v31 - light green
//   "l,30,31;",               // Short diagonal
  
//   // ----------------------------------------------------------------------------
//   // BIDIRECTIONAL TESTS (verify symmetry)
//   // ----------------------------------------------------------------------------
  
//   // Draw octant 0 in reverse (should look identical)
//   "v,5,48,0.0,1.0,0.0;",   // v32 - end green (reversed)
//   "v,13,52,1.0,0.0,0.0;",  // v33 - start red (reversed)
//   "l,32,33;",               // Octant 0 reversed (v1→v0 instead of v0→v1)
  
//   // Draw octant 1 in reverse
//   "v,16,48,0.0,0.5,1.0;",  // v34 - end cyan (reversed)
//   "v,20,56,1.0,0.5,0.0;",  // v35 - start orange (reversed)
//   "l,34,35;",               // Octant 1 reversed
  
//   // Draw horizontal in reverse
//   "v,36,48,0.0,0.0,1.0;",  // v36 - blue (reversed)
//   "v,28,48,1.0,0.0,0.0;",  // v37 - red (reversed)
//   "l,36,37;",               // Horizontal reversed
  
//   // ----------------------------------------------------------------------------
//   // STRESS TESTS
//   // ----------------------------------------------------------------------------
  
//   // Long horizontal line (tests performance and color interpolation)
//   "v,5,60,1.0,0.0,0.0;",   // v38 - red
//   "v,58,60,0.0,0.0,1.0;",  // v39 - blue
//   "l,38,39;",               // 50+ pixel line
  
//   // Long vertical line
//   "v,32,28,1.0,1.0,0.0;",  // v40 - yellow
//   "v,32,60,1.0,0.0,1.0;",  // v41 - magenta
//   "l,40,41;",               // 30+ pixel line
  
//   // Long diagonal
//   "v,42,32,0.0,1.0,0.0;",  // v42 - green
//   "v,58,48,1.0,0.0,0.0;",  // v43 - red
//   "l,42,43;"                // Long diagonal line
// ].join("\n");


// const DEF_INPUT = [// triangle // test cases done by copilot, not me
//   // TEST 1: Square split diagonally - diagonal shared edge
//   "v,10,10,1.0,0.0,0.0;",  // v0 - top-left - red
//   "v,20,10,0.0,1.0,0.0;",  // v1 - top-right - green
//   "v,10,20,0.0,0.0,1.0;",  // v2 - bottom-left - blue
//   "v,20,20,1.0,1.0,0.0;",  // v3 - bottom-right - yellow
//   // "t,0,2,3;",              // Triangle 1
//   // "t,0,3,1;",              // Triangle 2
  
//   // TEST 2: Horizontal shared edge (top edge rule)
//   "v,25,10,1.0,0.0,0.0;",  // v4 - left - red
//   "v,35,10,0.0,1.0,0.0;",  // v5 - right - green
//   "v,30,5,0.0,0.0,1.0;",   // v6 - top - blue
//   "v,30,15,1.0,1.0,0.0;",  // v7 - bottom - yellow
//   // "t,6,4,5;",              // Triangle 1: upward
//   // "t,4,7,5;",              // Triangle 2: downward
  
//   // TEST 3: Vertical shared edge (left edge rule)
//   "v,45,10,1.0,0.0,0.0;",  // v8 - top - red
//   "v,45,20,0.0,1.0,0.0;",  // v9 - bottom - green
//   "v,40,15,0.0,0.0,1.0;",  // v10 - left - blue
//   "v,50,15,1.0,1.0,0.0;",  // v11 - right - yellow
//   // "t,8,10,9;",             // Left triangle - FIXED: (45,10)→(40,15)→(45,20) anti-clockwise
//   // "t,8,9,11;",             // Right triangle - FIXED: (45,10)→(45,20)→(50,15) anti-clockwise
  
//   // TEST 4: Diamond pattern (4 triangles, shared center vertex)
//   "v,30,25,1.0,0.0,0.0;",  // v12 - top - red
//   "v,25,30,0.0,1.0,0.0;",  // v13 - left - green
//   "v,35,30,0.0,0.0,1.0;",  // v14 - right - blue
//   "v,30,35,1.0,1.0,0.0;",  // v15 - bottom - yellow
//   "v,30,30,1.0,1.0,1.0;",  // v16 - center - white
//   // "t,12,16,14;",           // Top-right
//   // "t,14,16,15;",           // Bottom-right
//   // "t,15,16,13;",           // Bottom-left
//   // "t,13,16,12;",           // Top-left
  
//   // TEST 5: Right triangle (axis-aligned edges)
//   "v,10,25,1.0,0.0,0.0;",  // v17 - top-left - red
//   "v,10,35,0.0,1.0,0.0;",  // v18 - bottom-left - green
//   "v,20,35,0.0,0.0,1.0;",  // v19 - bottom-right - blue
//   // "t,17,18,19;",           // Right triangle
  
//   // TEST 6: Small triangle
//   "v,10,40,1.0,0.0,0.0;",  // v20 - red
//   "v,16,46,0.0,1.0,0.0;",  // v21 - green
//   "v,16,40,0.0,0.0,1.0;",  // v22 - blue
//   // "t,20,21,22;",           // Small triangle
  
//   // TEST 7: Triangle with thin shape
//   "v,25,40,1.0,0.0,0.0;",  // v23 - red
//   "v,30,40,0.0,1.0,0.0;",  // v24 - green
//   "v,27,42,0.0,0.0,1.0;",  // v25 - blue
//   "t,23,24,25;",           // Thin triangle
  
//   // TEST 8: Vertex at pixel center
//   "v,40,40,1.0,0.0,0.0;",  // v26 - center vertex - red
//   "v,35,45,0.0,1.0,0.0;",  // v27 - green
//   "v,45,45,0.0,0.0,1.0;",  // v28 - blue
//   // "t,26,27,28;",           // Triangle
  
//   // TEST 9: Flat/degenerate triangle (horizontal line)
//   // removed test, was told that we wont have this

  
//   // TEST 10: Multiple triangles with shared vertex
//   "v,50,40,1.0,1.0,1.0;",  // v32 - center - white
//   "v,45,35,1.0,0.0,0.0;",  // v33 - top-left - red
//   "v,55,35,0.0,1.0,0.0;",  // v34 - top-right - green
//   "v,55,45,0.0,0.0,1.0;",  // v35 - bottom-right - blue
//   "v,45,45,1.0,1.0,0.0;",  // v36 - bottom-left - yellow
//   // "t,32,34,33;",           // Top triangle - FIXED: anticlockwise
//   // "t,32,35,34;",           // Right triangle - FIXED: anticlockwise
//   // "t,32,36,35;",           // Bottom triangle - FIXED: anticlockwise
//   // "t,32,33,36;"            // Left triangle - FIXED: anticlockwise
// ].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
