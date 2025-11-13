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


  pointIsInsideTriangle (vertex1,vertex2,vertex3,point) {
    // console.log("Entered the helper function pointIsInsideTriangle." );
    // ax + by + c = 0;, if this is greater than 0, then is on the left of a line
    const line1 = [vertex1,vertex2];
    const line2 = [vertex2,vertex3];
    const line3 = [vertex3,vertex1];
    
    // found out about arrow functions :p
    const pointIsInsideOrOnEdge = (line,point) => {
      // console.log("Entered the helper function pointIsInsideOrOnEdge." );

      const [
        [x0, y0, ,],
        [x1, y1, ,]
      ] = line;
      const [x,y] = point;
      // trying to implement ax + by + c
      let [a, b, c] = [
        y1 - y0,
        x0 - x1,
        x0 * y1 - x1 * y0
        // x1*y0 - x0*y1
      ];
      // for c, the video shows x0y1 - x1y0, but my notes from class say x1y0 - x0y1. if there are any problems that can be solved by changing that, do it.
      let val = a * x + b * y + c;
      // ans = [val > 0, val == 0];
      let ans = [val > 0, val == 0];
      // console.log("returning " + ans + "from the function pointIsInsideOrOnEdge.");
      return ans;
    }
    // const triangle = [vertex1, vertex2, vertex3];
    // let [x0, y0] = vertex1; let [x1, y1] = vertex2; let [x2, y2] = vertex3;
    


    
    let val1 = pointIsInsideOrOnEdge(line1,point); let val2  = pointIsInsideOrOnEdge(line2, point); let val3 = pointIsInsideOrOnEdge(line3, point);
    // console.log("Reached line 134.");
    // console.log("val1[0]: " + val1[0]+ ", val2[0]: "+ val2[0] + ", val3[0]: " + val3[0] + ".");
    // console.log("val1[0] && val2[0] && val3[0]: " + val1[0] && val2[0] && val3[0] );
    if (val1[0] && val2[0] && val3[0] ) {
      // console.log("The point is on the left of all the sides, return 1.");
      return 1;
    }
    else {
      // console.log("Entered the else statement as the point was not strictly inside the triangle.");
      // let line = line1;

    // else if (val2[1] == 1) {
        // if (y1 == y2 && y2 > y0) return 1;  
      // }
      // else if (val3[1] == 1) 
        // if (y0 == y2 && y2 > y1) return 1;
      // else {
        // iterate through all lines and check if the line is a left edge or not, and if the point lies on that edge or not
      let valAll = [val1, val2, val3, val1]; 
      // the frick, why is it solved if i add val1 at the end
      let lineAll = [line1, line2, line3, line1]; // i added line 1 at the end so i can just do i++ and still access the same element- that i want to access, line 1
      for (let i = 0; i < 3; i++) {
        // console.log("i: " + i);
        let[[xtemp0, ytemp0, ,], [xtemp1, ytemp1, ,]] = lineAll[i];  // try removing x here as we have no need for it.
        // console.log("ytemp0: " + ytemp0);
        // console.log("ytemp1: " + ytemp1);
        // let [[xtemp2, ytemp2],[]] = lineAll[i++];
        let [[xtemp2, ytemp2],[]] = lineAll[i+1];
        // console.log("ytemp2 for now: " + ytemp2);
        // console.log(valAll[i][1]);
        if (valAll[i][1] == 1) {
          // console.log("Passed the check valAll[i][1] == 1.");
          // console.log("i.e " + valAll[i][1] + " == 1: " + valAll[i][1]); 
          if (ytemp0 == ytemp1 && ytemp1 > ytemp2) { // checks if line 1 is the top line
            // first checks if the two vertex making the line have the same y, basically are horizontal, then goes on to check if one of them is higher than the last point of the third vertex.
            // console.log("exiting the pointIsInsideTriangle function with a return value of 1 from the first if condition with i: " + i + ".");
            return 1;
          }
          else if (ytemp1 > ytemp0) {
            // console.log("exiting the pointIsInsideTriangle function with a return value of 1 from the first if condition with i: " + i + ".");
            return 1; // basically is a left edge.
          }
        }
      }
      
      // console.log("exiting the pointIsInsideTriangle function with a return value of 0 .");
      return 0;
      // i think i see why one would use ts now T-T
    }
  }
  


  // take 3 vertices defining a solid triangle and rasterize to framebuffer
  drawTriangle (v1, v2, v3) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;
    const [x3, y3, [r3, g3, b3]] = v3;
    // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
    this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
    this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
    this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
    
    let color = [r3, g3, b3];

    let [xmin, xmax, ymin, ymax]= [
      Math.ceil(Math.min(x1, x2, x3)),
      Math.ceil(Math.max(x1, x2, x3)),
      Math.ceil(Math.min(y1, y2, y3)),
      Math.ceil(Math.max(y1, y2, y3))
    ];
    console.log("Min x value: " + xmin + ", Min y value: " + ymin + ", Max x value: " + xmax + ", Max y value: " + ymax);
    // let [xstart, ystart] = [xmin,ymin];
    // the origin (0,0) is in top left corner, so x and y are min in the top left corner of the 'bounding box' that prof mentions in the G4 video.
    // so idea is to loop left to right like we normally do in arrays
    // for that the outer loop needs to be y, and inner loop needs to be x(figured it out after a sec, was doing x and y at the start)
    for (let y = ymin; y <= ymax; y++) {
      console.log("Y value: " + y);
      for (let x = xmin; x <= xmax; x++ ) {
        console.log("X value: " + x);
        let p = [x,y];
        if (this.pointIsInsideTriangle(v1, v2, v3, p)) {
          console.log("returned 1 from the function, coloring this pixel now.")
          this.setPixel(x, y, color);
          // this.setPixel(x, y, [160,160,160]);
        }
      }
    }
    console.log("Exiting the drawTriangle function.");
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
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
