import { Framebuffer } from './framebuffer.js';
import { Rasterizer as parentRetadedRasterizer} from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////
class Rasterizer extends parentRetadedRasterizer { // name suggested by an intelligent friend :pray:, gotta do what i gotta do
  // wouldn't work if we were not importing from a3.js in a3.html
  interpolateColor (c1, c2, t) {
    return[
      c1[0] + t * (c2[0] - c1[0]), 
      c1[1] + t * (c2[1] - c1[1]),
      c1[2] + t * (c2[2] - c1[2])
    ];

  };

  // take two vertices defining line and rasterize to framebuffer
  drawLine (v1, v2) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;
    // console.log("Start point coordinates of point 1: (" + x1 + ", " + y1 + ")");
    // console.log("Start point coordinates of point 2: (" + x2 + ", " + y2 + ")");
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
    let [sx, sy] = [ ( (x1Floored<x2Floored)? 1 : -1), ( (y1Floored<y2Floored)? 1 : -1) ];
    
    // influenced by copilot's code, make two variables for current variables
    let [x, y] = [x1Floored, y1Floored];

    // 'horizontal dominant' case, dx >= dy
    if (dx >= dy) {
      // initialising the decison variable 
      let d = 2 * dy - dx;
      
      for (let i = 0; i <= dx; i++) {
        // i is the current step, dx is the toal steps
        let t  = (dx == 0)? 0 : i/dx;   // should it be i /dx or i / (dx+1)
        let color = this.interpolateColor(color1, color2, t);
        this.setPixel(x, y, color);
        
        
        if (d > 0) {
          // closer to the lower y, don't step in the y direction - is what its supposed to be according to the book, but but, T-T, it works in this way, had to exchange the code snippet in  this if block and the else block(could be cause of me using sx and sy ... idk)
          y += sy;
          d -= 2 * (dy - dx );
        }
        else {
          d -= 2 * dy;
          // closer to the upper y, step in the y direction.
          
        }
        // stepping in x direction dx + 1 times
        x += sx;
        
      }
      
    }
    else {
      // console.log("Entering else block.");
      let d = 2 * dx - dy;
      // console.log("Starting d value: " + d);
      
      for (let i = 0; i <= dy; i++) {
        // i is the current step, dy is the total steps
        let t  = (dy == 0)? 0 : i/dy;   // should it be i /dy or i / (dy+1)
        let color = this.interpolateColor(color1, color2, t);
        this.setPixel(x, y, color);
        // console.log("Coordinates being coloured: (" + x + ", " + y + ")" );

        if (d >0) {
          x += sx;
          d -= 2 * (dx  - dy);
        }
        else {
          d -= 2 * dx ;
        }
        y += sy;
      }
    } 

  }



  findTopEdge  (T)  {
    let TopEdgeExists = 0; let lineNumber = 0; let [v1, v2, v3] = T; let [x1, y1,] = v1; let [x2, y2, ] = v2; let [x3, y3, ] = v3;
    if ( (y1 == y2) && (y1 < y3)) {  // checks if y1 and y2 are on the same level followed by checking // basically, checks if y1 and thus, y2 are higher
      TopEdgeExists = 1;
      lineNumber = 0;     // line 1(index 0) is made up of v1 <->v2
    }
    // else if ((y1 == y3) && (y1 < y2)) { // checks if y1 and y2 are same, thus, form a horizontal line     followed by // checks if y1, thus in turn y3, are higher than y2
    else if ((y1 == y3) && (y1 > y2)) { 
        TopEdgeExists = 1;
        lineNumber = 2;   // line 3(index 2) is made up of v3<->v1
    }
    else if ( (y2 == y3) && (y2 < y1)) { // checks if y2 and y3 form a horizontal line. followed by// checks if y2 and y3 are less than y1, and thus in turn, higher than y1
        TopEdgeExists = 1;
        lineNumber = 1;   // line 2 (index 1) is made up of v2<->v3
    }
    return [TopEdgeExists, lineNumber];
  }
  findLeftEdge (T) {
      // end point is strictly less than starting point(of a line)
      // end point of line 1 is v2, line 2 is v3, line 3 is v1
      let LeftEdge1Exists = 0; let LeftEdge2Exists = 0; let lineNumberForLeftEdge1 = 0; let lineNumberForLeftEdge2 = 0; let [v1, v2, v3] = T; let [x1, y1, ] = v1; let [x2, y2, ] = v2; let [x3, y3, ] = v3;
      // lets just assume, we only need to check y, wait thats true, cause of the anticlockwise rule, we only need that
      // if (y2 > y1) { // check end point of line 1 is strictly lower than starting point of line 1 ], so in our coordinate3 system, y2 has a higher value.
      if (y2 < y1) {
        LeftEdge1Exists = 1;
        lineNumberForLeftEdge1 = 0;
      }
      if (y3 > y2) {
      // if (y3 < y2) {
        if (LeftEdge1Exists) {
          LeftEdge2Exists = 1;
          lineNumberForLeftEdge2 = 1; 
        }
        else {
          LeftEdge1Exists = 1;
          lineNumberForLeftEdge1 = 1;
        }
      }
      // if (y1 > y3) { // check if line 3, - end point - vertex 1, is lower than vertex 3, i.e y value of v1 is greater than y value of v3
      if (y1 < y3) {
        if (LeftEdge1Exists) {
          LeftEdge2Exists = 1;
          lineNumberForLeftEdge2 = 2;
        }
        else {
          LeftEdge1Exists = 1;
          lineNumberForLeftEdge1 = 2;
        }
      }
      return [LeftEdge1Exists, lineNumberForLeftEdge1, LeftEdge2Exists, lineNumberForLeftEdge2];
  }

  pointIsInsideOrOnEdge (line,point) {
      // checks if point is on the left of the given line
      const [
        [x1, y1, ,],
        [x2, y2, ,]
      ] = line;
      const [x,y] = point;
      // trying to implement ax + by + c
     
      let val = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
      // the 'book' formula acording to chatgpt.
      return val; 
  }
    
  pointIsInsideTriangle (vertex1,vertex2,vertex3,point) {
    // ax + by + c = 0;, if this is greater than 0, then is on the left of a line
    // the format [x1,y1] == point is wrong, you CAN NOT compare two arrays, need to convert both to strings instead by using JSON.stringify
    const line1 = [vertex1,vertex2]; const line2 = [vertex2,vertex3]; const line3 = [vertex3,vertex1]; const Triangle = [vertex1, vertex2, vertex3];
    let pointIsInsideTriangleFlag = 0;
    
    // found out about arrow functions :p
    
    // functions moved from here to outside the function

    let val1 = this.pointIsInsideOrOnEdge(line1,point); let val2  = this.pointIsInsideOrOnEdge(line2, point); let val3 = this.pointIsInsideOrOnEdge(line3, point);

    if ( ( val1 > 0) && (val2 > 0) && (val3 > 0)) {
      // if ( (val3 > 0) ) {
      pointIsInsideTriangleFlag = 1;
    }
    else if ( ( (val1 >= 0) && (val2 >= 0) && (val3 >= 0)) ) {
      let vals = [val1, val2, val3];
      let [TopEdgeExists, lineNumberForTopEdge] = this.findTopEdge(Triangle);
      let [LeftEdge1Exists, lineNumberForLeftEdge1, LeftEdge2Exists, lineNumberForLeftEdge2] = this.findLeftEdge(Triangle);
      if (TopEdgeExists && (vals[lineNumberForTopEdge] == 0)) {
          pointIsInsideTriangleFlag = 1;
      }
      if (LeftEdge1Exists && (vals[lineNumberForLeftEdge1] == 0)) {  
        pointIsInsideTriangleFlag = 1;
      }
      if (LeftEdge2Exists && (vals[lineNumberForLeftEdge2] == 0)) {
        pointIsInsideTriangleFlag = 1;
      }
    }
    else {
    }
    return pointIsInsideTriangleFlag;
  }

  // take 3 vertices defining a solid triangle and rasterize to framebuffer
  drawTriangle (v1, v2, v3) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;
    const [x3, y3, [r3, g3, b3]] = v3;
    // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
    let [x1Floored, x2Floored, x3Floored, y1Floored, y2Floored, y3Floored] = [Math.floor(x1), Math.floor(x2), Math.floor(x3), Math.floor(y1), Math.floor(y2), Math.floor(y3)]; 
    

    let color = [r3, g3, b3];
    
    
    let [xmin, xmax, ymin, ymax]= [
      Math.floor(Math.min(x1Floored, x2Floored, x3Floored)),
      Math.ceil(Math.max(x1Floored, x2Floored, x3Floored)),
      Math.floor(Math.min(y1Floored, y2Floored, y3Floored)),
      Math.ceil(Math.max(y1Floored, y2Floored, y3Floored))
    ];
    // let [xstart, ystart] = [xmin,ymin];
    // the origin (0,0) is in top left corner, so x and y are min in the top left corner of the 'bounding box' that prof mentions in the G4 video.
    // so idea is to loop left to right like we normally do in arrays
    // for that the outer loop needs to be y, and inner loop needs to be x(figured it out after a sec, was doing x and y at the start)
    for (let y = ymin; y <= ymax; y++) {
      for (let x = xmin ; x <= xmax; x++ ) {
        let p = [x,y];
        if (this.pointIsInsideTriangle(v1, v2, v3, p) == 1) {
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
  // "v,52,10,0.0,0.0,0.0;",
  "v,52,10,0.0,0.0,0.0;"
  // "l,4,5;",
  // "l,5,6;",
  // "l,6,7;",
  // "l,7,4;"
].join("\n");

// const DEF_INPUT = [
//   "v,10,10,1.0,0.0,0.0;",
//   "v,10,16,1.0,1.0,1.0;",
//   "v,16,16,0.0,1.0,0.0;",
//   "t, 0, 1, 2;"
// ].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
