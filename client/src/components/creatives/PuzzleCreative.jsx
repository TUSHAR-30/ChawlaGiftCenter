import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PUZZLE_STYLES = `
  :root {
    --puzzle-width: 800px;
    --puzzle-height: 500px;
    --grid-rows: 5;
    --grid-cols: 6;
  }

  @media (max-width: 768px) {
    :root {
      --puzzle-width: 90vw;
      --puzzle-height: 60vw;
    }
  }

  .puzzle-creative-scroll-container {
    height: 400vh;
  }

  .puzzle-creative-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .puzzle-creative-board {
    position: relative;
    width: var(--puzzle-width);
    height: var(--puzzle-height);
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    gap: 2px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .puzzle-creative-piece {
    position: relative;
    background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop');
    background-size: var(--puzzle-width) var(--puzzle-height);
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    will-change: transform, opacity;
  }

  .puzzle-creative-hint {
    position: absolute;
    bottom: 10%;
    text-align: center;
    color: white;
    opacity: 0.8;
    transition: opacity 0.5s;
    font-family: 'Be Vietnam Pro', system-ui, sans-serif;
    font-size: 14px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .puzzle-creative-completed {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    pointer-events: none;
    transition: opacity 1s;
  }

  .puzzle-creative-completed h2 {
    font-family: 'Playball', cursive;
    font-size: 2.5rem;
    font-style: italic;
  }
`;

const PUZZLE_IMAGE =
  "shop/inside2.jpg";
const ROWS = 5;
const COLS = 6;

export default function PuzzleCreative() {
  const sectionRef = useRef(null);
  const boardRef = useRef(null);
  const hintRef = useRef(null);
  const completedRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const board = boardRef.current;
    const hint = hintRef.current;
    const completed = completedRef.current;
    if (!section || !board || !hint || !completed) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const pieces = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const piece = document.createElement("div");
        piece.className = "puzzle-creative-piece";

        const posX = (c / (COLS - 1)) * 100;
        const posY = (r / (ROWS - 1)) * 100;
        piece.style.backgroundImage = `url('${PUZZLE_IMAGE}')`;
        piece.style.backgroundPosition = `${posX}% ${posY}%`;

        board.appendChild(piece);
        pieces.push(piece);
      }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          hint.style.opacity = Math.max(0, 1 - self.progress * 2);
          completed.style.opacity = self.progress > 0.95 ? 1 : 0;
        },
      },
    });

    pieces.forEach((piece) => {
      const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
      const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
      const randomRotation = (Math.random() - 0.5) * 180;
      const randomScale = 0.5 + Math.random();

      tl.from(
        piece,
        {
          x: randomX,
          y: randomY,
          rotation: randomRotation,
          scale: randomScale,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        0,
      );
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();

      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });

      pieces.forEach((piece) => {
        if (piece.parentNode) piece.parentNode.removeChild(piece);
      });

      hint.style.opacity = "";
      completed.style.opacity = "";
    };
  }, []);

  return (
    <>
      <style>{PUZZLE_STYLES}</style>
      <section
        ref={sectionRef}
        className="puzzle-creative-scroll-container"
        id="puzzle-creative"
        aria-label="Scroll puzzle assembly animation"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="puzzle-creative-sticky">
          <div ref={boardRef} className="puzzle-creative-board" id="puzzle-creative-board" />
          <div ref={hintRef} className="puzzle-creative-hint" id="puzzle-creative-hint">
            Keep scrolling to assemble...
          </div>
          <div
            ref={completedRef}
            className="puzzle-creative-completed"
            id="puzzle-creative-completed"
          >
            <h2>Masterpiece Assembled</h2>
          </div>
        </div>
      </section>
    </>
  );
}
