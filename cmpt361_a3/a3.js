import { Framebuffer } from './framebuffer.js';
import { Rasterizer as BaseRasterizer} from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////
class Rasterizer extends BaseRasterizer {

  interpolateColor(color1, color2, t) {
    return [
      (1 - t) * color1[0] + t * color2[0],
      (1 - t) * color1[1] + t * color2[1],
      (1 - t) * color1[2] + t * color2[2],
    ];
  }

  // take two vertices defining line and rasterize to framebuffer
  drawLine (v1, v2) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;

    let color1 = [r1, g1, b1];
    let color2 = [r2, g2, b2];
    
    let [x1Floored, x2Floored, y1Floored, y2Floored] = [Math.floor(x1), Math.floor(x2), Math.floor(y1), Math.floor(y2)]; 
    let [dx, dy] = [(Math.abs(x2Floored - x1Floored)), (Math.abs(y2Floored - y1Floored))];
    
    if (dx == 0 && dy == 0) {
      this.setPixel(x1Floored, y1Floored, color1);
      return;
    }
    let [sx, sy] = [ ( (x1Floored<x2Floored)? 1 : -1), ( (y1Floored<y2Floored)? 1 : -1) ];
    
    let [x, y] = [x1Floored, y1Floored];

    if (dx >= dy) {
      let d = 2 * dy - dx;
      
      for (let i = 0; i <= dx; i++) {
        let t  = (dx == 0)? 0 : i/dx;
        let color = this.interpolateColor(color1, color2, t);
        this.setPixel(x, y, color);
        
        if (d > 0) {
          y += sy;
          d -= 2 * (dy - dx );
        }
        else {
          d -= 2 * dy;
        }
        x += sx;
      }
    }
    else {
      let d = 2 * dx - dy;
      
      for (let i = 0; i <= dy; i++) {
        let t  = (dy == 0)? 0 : i/dy;
        let color = this.interpolateColor(color1, color2, t);
        this.setPixel(x, y, color);

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
    const line1 = [vertex1,vertex2];
    const line2 = [vertex2,vertex3];
    const line3 = [vertex3,vertex1];
    
    const pointIsInsideOrOnEdge = (line,point) => {
      const [
        [x0, y0, ,],
        [x1, y1, ,]
      ] = line;
      const [x,y] = point;
      let [a, b, c] = [
        y1 - y0,
        x0 - x1,
        x0 * y1 - x1 * y0
      ];
      let val = a * x + b * y + c;
      let ans = [val > 0, val == 0];
      return ans;
    }
    
    let val1 = pointIsInsideOrOnEdge(line1,point); 
    let val2 = pointIsInsideOrOnEdge(line2, point); 
    let val3 = pointIsInsideOrOnEdge(line3, point);
    
    if (val1[0] && val2[0] && val3[0] ) {
      return 1;
    }
    else {
      let valAll = [val1, val2, val3, val1]; 
      let lineAll = [line1, line2, line3, line1];
      for (let i = 0; i < 3; i++) {
        let[[xtemp0, ytemp0, ,], [xtemp1, ytemp1, ,]] = lineAll[i];
        let [[xtemp2, ytemp2],[]] = lineAll[i+1];
        if (valAll[i][1] == 1) {
          if (ytemp0 == ytemp1 && ytemp1 > ytemp2) {
            return 1;
          }
          else if (ytemp1 > ytemp0) {
            return 1;
          }
        }
      }
      
      return 0;
    }
  }
  

  // Helper function to compute barycentric coordinates
  computeBarycentricCoords(x, y, v1, v2, v3) {
    const [x1, y1] = [v1[0], v1[1]];
    const [x2, y2] = [v2[0], v2[1]];
    const [x3, y3] = [v3[0], v3[1]];
    
    const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    const lambda1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denom;
    const lambda2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denom;
    const lambda3 = 1 - lambda1 - lambda2;
    
    return [lambda1, lambda2, lambda3];
  }

  // take 3 vertices defining a solid triangle and rasterize to framebuffer
  drawTriangle (v1, v2, v3) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;
    const [x3, y3, [r3, g3, b3]] = v3;

    let [xmin, xmax, ymin, ymax]= [
      Math.floor(Math.min(x1, x2, x3)),
      Math.floor(Math.max(x1, x2, x3)),
      Math.floor(Math.min(y1, y2, y3)),
      Math.floor(Math.max(y1, y2, y3))
    ];

    for (let y = ymin; y <= ymax; y++) {
      for (let x = xmin; x <= xmax; x++ ) {
        let p = [x,y];
        if (this.pointIsInsideTriangle(v1, v2, v3, p)) {
          const [lambda1, lambda2, lambda3] = this.computeBarycentricCoords(x, y, v1, v2, v3);
          const color = [
            lambda1 * r1 + lambda2 * r2 + lambda3 * r3,
            lambda1 * g1 + lambda2 * g2 + lambda3 * g3,
            lambda1 * b1 + lambda2 * b2 + lambda3 * b3
          ];
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
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
