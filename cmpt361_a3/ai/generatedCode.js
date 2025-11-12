// start of block 1
/* copilot generated code using the question 8.14 from exercises in chapter 8 in the course book as prompt:
  
  Write a program to generate the locations of pixels along a rasterized line
  segment using Bresenham’s algorithm. Check that your program works for all
  slopes and all possible locations of the endpoints. What is the initial value of
  the decision variable?
  (question from the book)
  (does generate line with color connecting the four vertices.)
  code: 

  // Floor the coordinates to get integer pixel positions
  let xi1 = Math.floor(x1);
  let yi1 = Math.floor(y1);
  let xi2 = Math.floor(x2);
  let yi2 = Math.floor(y2);
  
  // Calculate differences
  let dx = Math.abs(xi2 - xi1);
  let dy = Math.abs(yi2 - yi1);
  
  // Determine direction of line
  let sx = (xi1 < xi2) ? 1 : -1;  // step in x direction
  let sy = (yi1 < yi2) ? 1 : -1;  // step in y direction
  
  // Current position
  let x = xi1;
  let y = yi1;
  
  // BRESENHAM'S ALGORITHM
  // We need to handle two cases: |slope| <= 1 and |slope| > 1
  
  if (dx >= dy) {
    // Case 1: |slope| <= 1 (more horizontal line)
    // Initial decision variable: d = 2*dy - dx
    let decision = 2 * dy - dx;
    
    // Calculate total distance for color interpolation
    let totalSteps = dx;
    let step = 0;
    
    for (let i = 0; i <= dx; i++) {
      // Interpolate color based on distance along line
      let t = (totalSteps === 0) ? 0 : step / totalSteps;
      let r = r1 + t * (r2 - r1);
      let g = g1 + t * (g2 - g1);
      let b = b1 + t * (b2 - b1);
      
      this.setPixel(x, y, [r, g, b]);
      
      if (decision > 0) {
        // Move diagonally (increment both x and y)
        y += sy;
        decision += 2 * (dy - dx);
      } else {
        // Move horizontally only
        decision += 2 * dy;
      }
      
      x += sx;
      step++;
    }
  } else {
    // Case 2: |slope| > 1 (more vertical line)
    // Initial decision variable: d = 2*dx - dy
    let decision = 2 * dx - dy;
    
    // Calculate total distance for color interpolation
    let totalSteps = dy;
    let step = 0;
    
    for (let i = 0; i <= dy; i++) {
      // Interpolate color based on distance along line
      let t = (totalSteps === 0) ? 0 : step / totalSteps;
      let r = r1 + t * (r2 - r1);
      let g = g1 + t * (g2 - g1);
      let b = b1 + t * (b2 - b1);
      
      this.setPixel(x, y, [r, g, b]);
      
      if (decision > 0) {
        // Move diagonally (increment both x and y)
        x += sx;
        decision += 2 * (dx - dy);
      } else {
        // Move vertically only
        decision += 2 * dx;
      }
      
      y += sy;
      step++;
    }
    code block ended
*/
// end of block 1