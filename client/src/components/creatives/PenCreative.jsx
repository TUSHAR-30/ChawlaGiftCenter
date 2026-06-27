import { useEffect, useRef } from "react";

const PEN_STYLES = `
  .pen-creative-section {
    position: relative;
    height: 400vh;
    background: radial-gradient(circle, #fdfbfa 0%, #f7f3e9 100%);
  }

  .pen-creative-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .pen-creative-canvas {
    width: 90vw;
    max-width: 1000px;
    height: auto;
    overflow: visible;
  }

  .pen-creative-text {
    font-family: "Playball", cursive;
    font-size: 110px;
    fill: #162636;
    letter-spacing: 1px;
  }

  .pen-creative-mask-line {
    fill: none;
    stroke: #ffffff;
    stroke-width: 75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .pen-creative-pen {
    position: fixed;
    left: 0;
    top: 0;
    transform-origin: 20px 115px;
    pointer-events: none;
    filter: drop-shadow(4px 12px 10px rgba(22, 38, 54, 0.18));
    will-change: transform;
    z-index: 50;
    display: none;
  }
`;

export default function PenCreative() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const penRef = useRef(null);
  const rafRef = useRef(0);
  const pathDataRef = useRef([]);
  const totalTextLengthRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const svgElement = svgRef.current;
    const pen = penRef.current;
    if (!section || !svgElement || !pen) return undefined;

    const path1 = svgElement.querySelector("#pen-creative-path-word1");
    const path2 = svgElement.querySelector("#pen-creative-path-word2");
    const maskPaths = [path1, path2].filter(Boolean);
    if (maskPaths.length === 0) return undefined;

    let totalTextLength = 0;
    let pathData = [];

    function initPath() {
      totalTextLength = 0;
      pathData = [];
      maskPaths.forEach((path) => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        pathData.push({ element: path, length: len, startGlobalOffset: totalTextLength });
        totalTextLength += len;
      });
      totalTextLengthRef.current = totalTextLength;
      pathDataRef.current = pathData;
      pen.style.display = "block";
    }

    function updateDrawing() {
      const sectionRect = section.getBoundingClientRect();
      const sectionHeight = section.clientHeight - window.innerHeight;
      let progress = -sectionRect.top / sectionHeight;
      progress = Math.max(0, Math.min(1, progress));
      if (sectionRect.top > 0) {
        progress = 0;
      }

      const globalDrawTarget = totalTextLength * progress;
      let activePenPosition = { x: 120, y: 135 };

      pathData.forEach((data) => {
        const element = data.element;
        const start = data.startGlobalOffset;
        const end = start + data.length;
        if (globalDrawTarget >= end) {
          element.style.strokeDashoffset = 0;
          activePenPosition = element.getPointAtLength(data.length);
        } else if (globalDrawTarget <= start) {
          element.style.strokeDashoffset = data.length;
        } else {
          const localDrawLength = globalDrawTarget - start;
          element.style.strokeDashoffset = data.length - localDrawLength;
          activePenPosition = element.getPointAtLength(localDrawLength);
        }
      });

      const svgMatrix = svgElement.getScreenCTM();
      if (svgMatrix) {
        const penX = activePenPosition.x * svgMatrix.a + svgMatrix.e - 20;
        const penY = activePenPosition.y * svgMatrix.d + svgMatrix.f - 115;
        pen.style.transform = `translate3d(${penX}px, ${penY}px, 0) rotate(-16deg)`;
      }
    }

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        updateDrawing();
      });
    }

    initPath();
    updateDrawing();

    window.addEventListener("resize", () => {
      initPath();
      updateDrawing();
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      pen.style.display = "none";
    };
  }, []);

  return (
    <>
      <style>{PEN_STYLES}</style>
      <section
        ref={sectionRef}
        className="pen-creative-section"
        id="pen-creative"
        aria-label="Chawla Gifts hand-written scroll animation"
      >
        <div className="pen-creative-sticky">
          <svg
            ref={svgRef}
            className="pen-creative-canvas"
            id="pen-creative-main-svg"
            viewBox="0 0 1000 250"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="pen-creative-mask-word1" maskUnits="userSpaceOnUse">
                <path
                  id="pen-creative-path-word1"
                  className="pen-creative-mask-line"
                  d="M 120 135 C 100 130, 95 90, 125 70 C 150 45, 175 75, 160 115 C 160 115, 162 100, 165 85 C 170 85, 185 50, 195 50 C 190 75, 180 145, 195 145 C 205 145, 215 110, 235 110 C 250 110, 245 145, 260 145 C 275 135, 280 110, 295 110 C 310 110, 305 145, 325 145 C 335 125, 345 50, 350 50 C 345 75, 340 145, 355 145 C 370 145, 375 110, 395 110 C 410 110, 405 145, 435 135"
                />
              </mask>
              <mask id="pen-creative-mask-word2" maskUnits="userSpaceOnUse">
                <path
                  id="pen-creative-path-word2"
                  className="pen-creative-mask-line"
                  d="M 545 135 C 525 120, 530 55, 570 55 C 605 55, 580 120, 550 125 C 545 130, 585 135, 590 165 C 595 195, 555 210, 545 195 C 540 180, 580 145, 615 135 C 625 115, 635 105, 640 145 C 650 120, 660 55, 665 50 C 660 80, 645 185, 655 195 C 665 200, 675 155, 695 135 C 705 115, 715 65, 715 65 C 710 85, 705 145, 720 145 C 735 145, 750 115, 740 135 C 735 145, 755 145, 785 125 L 630 80 L 655 80"
                />
              </mask>
            </defs>
            <text x="100" y="150" className="pen-creative-text" mask="url(#pen-creative-mask-word1)">
              Chawla
            </text>
            <text x="520" y="150" className="pen-creative-text" mask="url(#pen-creative-mask-word2)">
              Gifts
            </text>
          </svg>
          <svg
            ref={penRef}
            className="pen-creative-pen"
            id="pen-creative-pen"
            width="40"
            height="120"
            viewBox="0 0 40 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 10 0 L 30 0 L 30 70 L 25 85 L 23 85 L 21 110 L 20 115 L 19 110 L 17 85 L 15 85 L 10 70 Z" fill="#0c171a" />
            <path d="M 15 85 L 25 85 L 23 105 L 20 115 L 17 105 Z" fill="#cfab34" />
            <line x1="20" y1="100" x2="20" y2="115" stroke="#0c171a" strokeWidth="0.7" />
            <circle cx="20" cy="100" r="1" fill="#0c171a" />
          </svg>
        </div>
      </section>
    </>
  );
}
