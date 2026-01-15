import React, { useRef, useEffect } from "react";

const BlobCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Configuration
    const color = "#DC2626"; // Tailwind Red-600
    const pointsCount = 8;
    const speed = 0.02; // Speed of morphing
    const baseRadius = 180;
    const variation = 30; // How much it wiggles

    // Initialize points with random phases
    const points = Array.from({ length: pointsCount }, (_, i) => ({
      angle: (Math.PI * 2 * i) / pointsCount,
      phase: Math.random() * Math.PI * 2, // Random starting position in the sine wave
    }));

    const render = (time) => {
      // Resize canvas to fit container (responsive)
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.beginPath();

      // Calculate the coordinates of the first point
      const getCoord = (p) => {
        // We use sine waves to make the radius oscillate smoothly over time
        const r = baseRadius + Math.sin(p.phase + time * speed) * variation;
        return {
          x: centerX + r * Math.cos(p.angle),
          y: centerY + r * Math.sin(p.angle),
        };
      };

      // Draw the blob using curves
      const firstPoint = getCoord(points[0]);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 0; i < points.length; i++) {
        const curr = getCoord(points[i]);
        const next = getCoord(points[(i + 1) % points.length]);

        // Calculate midpoint (control point) for smooth quadratic curve
        const mx = (curr.x + next.x) / 2;
        const my = (curr.y + next.y) / 2;

        ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
      }

      ctx.closePath();
      ctx.fill();

      // Request next frame
      animationFrameId = requestAnimationFrame(() => render(time + 1));
    };

    // Start animation loop
    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ filter: "blur(40px)", opacity: 0.8 }} // Adds a glow effect
    />
  );
};

export default BlobCanvas;
