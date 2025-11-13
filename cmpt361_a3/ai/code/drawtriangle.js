// copilot code
  // Helper: compute edge function for CCW triangle; positive = left/inside
  edgeFunction(ax, ay, bx, by, px, py) {
    return (px - ax) * (by - ay) - (py - ay) * (bx - ax);
  }

  // Helper: top-left rule - edge is inclusive if it's a top edge or left edge
  isTopLeft(dy, dx) {
    // Top edge: dy == 0 && dx > 0 (going right)
    // Left edge: dy < 0 (going up in screen space, which is negative y)
    return dy < 0 || (dy === 0 && dx > 0);
  }

  // take 3 vertices defining a solid triangle and rasterize to framebuffer
  drawTriangle (v1, v2, v3) {
    const [x1, y1, [r1, g1, b1]] = v1;
    const [x2, y2, [r2, g2, b2]] = v2;
    const [x3, y3, [r3, g3, b3]] = v3;

    // Compute bounding box with pixel-center sampling
    const minX = Math.floor(Math.min(x1, x2, x3));
    const maxX = Math.floor(Math.max(x1, x2, x3));
    const minY = Math.floor(Math.min(y1, y2, y3));
    const maxY = Math.floor(Math.max(y1, y2, y3));

    // Precompute edge deltas for top-left rule
    const dx12 = x2 - x1, dy12 = y2 - y1;
    const dx23 = x3 - x2, dy23 = y3 - y2;
    const dx31 = x1 - x3, dy31 = y1 - y3;

    const isTL12 = this.isTopLeft(dy12, dx12);
    const isTL23 = this.isTopLeft(dy23, dx23);
    const isTL31 = this.isTopLeft(dy31, dx31);

    // Compute total area for barycentric coordinates (2x area to avoid division)
    const areaTriangle = this.edgeFunction(x1, y1, x2, y2, x3, y3);
    
    // Degenerate triangle check
    if (Math.abs(areaTriangle) < 0.0001) return;

    // Iterate over bounding box
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        // Sample at pixel center
        const px = x + 0.5;
        const py = y + 0.5;

        // Compute edge functions
        const w1 = this.edgeFunction(x2, y2, x3, y3, px, py); // Area opposite v1
        const w2 = this.edgeFunction(x3, y3, x1, y1, px, py); // Area opposite v2
        const w3 = this.edgeFunction(x1, y1, x2, y2, px, py); // Area opposite v3

        // Apply top-left rule for edge cases
        const inside1 = w1 > 0 || (w1 === 0 && isTL23);
        const inside2 = w2 > 0 || (w2 === 0 && isTL31);
        const inside3 = w3 > 0 || (w3 === 0 && isTL12);

        if (inside1 && inside2 && inside3) {
          // Normalize barycentric coordinates
          const b1 = w1 / areaTriangle;
          const b2 = w2 / areaTriangle;
          const b3 = w3 / areaTriangle;

          // Interpolate color
          const color = [
            b1 * r1 + b2 * r2 + b3 * r3,
            b1 * g1 + b2 * g2 + b3 * g3,
            b1 * b1 + b2 * b2 + b3 * b3
          ];

          this.setPixel(x, y, color);
        }
      }
    }
  }
  // copilot code ends
