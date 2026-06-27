import { useEffect, useRef } from "react";

const BUBBLE_STYLES = `
  .bubble-creative-section {
    position: relative;
    height: 250vh;
    background: linear-gradient(to bottom, #0b0f19, #111827, #0b0f19);
  }

  .bubble-creative-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    padding-left: 10%;
    overflow: hidden;
  }

  .bubble-creative-wand {
    position: relative;
    display: flex;
    align-items: center;
    transform: rotate(-12deg);
    z-index: 10;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
    flex-shrink: 0;
  }

  .bubble-creative-wand-handle {
    width: 180px;
    height: 10px;
    background: linear-gradient(to bottom, #94a3b8, #cbd5e1, #64748b);
    border-radius: 4px 0 0 4px;
    transition: all 0.3s ease;
  }

  .bubble-creative-wand-ring {
    width: 70px;
    height: 70px;
    border: 7px solid #cbd5e1;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.4);
    margin-left: -2px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
  }

  .bubble-creative-wand-ring::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(236,72,153,0.15) 50%, rgba(59,130,246,0.15) 80%, transparent 100%);
  }

  .bubble-creative-bubble {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s ease;
  }

  .bubble-creative-product-image {
    width: 85%;
    height: 85%;
    object-fit: contain;
    border-radius: 50%;
    background: white;
    padding: 5%;
    z-index: 1;
    pointer-events: none;
  }

  .bubble-creative-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 50%;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(circle at 35% 35%,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.05) 20%,
      rgba(244, 63, 94, 0.15) 45%,
      rgba(56, 189, 248, 0.15) 70%,
      rgba(255, 255, 255, 0.2) 90%,
      rgba(255, 255, 255, 0) 100%);
    box-shadow:
      inset 0 0 15px rgba(255, 255, 255, 0.5),
      inset -3px -3px 10px rgba(56, 189, 248, 0.3),
      inset 3px 3px 10px rgba(251, 113, 133, 0.3);
    animation: bubble-creative-wobble 4s ease-in-out infinite alternate;
  }

  .bubble-creative-overlay::after {
    content: '';
    position: absolute;
    top: 12%; left: 15%;
    width: 22%; height: 12%;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    transform: rotate(-25deg);
  }

  @keyframes bubble-creative-wobble {
    0% { transform: scale(1, 1) rotate(0deg); }
    50% { transform: scale(1.03, 0.97) rotate(2deg); }
    100% { transform: scale(0.97, 1.03) rotate(-2deg); }
  }

  @media (max-width: 768px) {
    .bubble-creative-wand-handle { width: 100px; height: 7px; }
    .bubble-creative-wand-ring { width: 50px; height: 50px; border-width: 5px; }
    .bubble-creative-bubble { width: 85px !important; height: 85px !important; }
    .bubble-creative-sticky { padding-left: 5%; }
  }

  @media (max-width: 480px) {
    .bubble-creative-wand-handle { width: 60px; height: 5px; }
    .bubble-creative-wand-ring { width: 40px; height: 40px; border-width: 4px; }
    .bubble-creative-bubble { width: 65px !important; height: 65px !important; }
    .bubble-creative-sticky { padding-left: 4%; }
  }
`;

const BUBBLE_PRODUCTS = [
  { name: "Wooden Train", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsYjDa8wHQrMLsimcEJm2L4Je7_SY0bmR5Q&s" },
  { name: "Teddy Bear", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJDFTXkFW_3jrHTPmivkWztTaQdaOJCBrLBA&s" },
  { name: "Colorful Blocks", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4cMIWE15IzMXjb_Q28GV2JqciSPpCHSeKcg&s" },
  { name: "Toy Rocket", img: "https://wellify.in/cdn/shop/products/Littles-Junior-Ring-Top-Tile-02.jpg?v=1674021250" },
  { name: "Doll House", img: "https://mmtoyworld.com/cdn/shop/files/love-baby-airplain-ride-on-toy-for-kids-_1_423b72b2-e403-4c39-bf14-aed4c57440b2.jpg?v=1684332473&width=1445" },
  { name: "Board Game", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDQuM6ESZOd7l4T4mnkAfg7VWSj_bkF8gaEw&s" },
];

const BASE_BUBBLE_SIZE = 120;
const MOBILE_BUBBLE_SIZE_768 = 85;
const MOBILE_BUBBLE_SIZE_480 = 65;

function getResponsiveBubbleSize() {
  if (typeof window === "undefined") return BASE_BUBBLE_SIZE;
  if (window.innerWidth <= 480) return MOBILE_BUBBLE_SIZE_480;
  if (window.innerWidth <= 768) return MOBILE_BUBBLE_SIZE_768;
  return BASE_BUBBLE_SIZE;
}

export default function BubbleCreative() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const wandRef = useRef(null);
  const stateRef = useRef({ throttleTimeout: false, productIndex: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const stickyContainer = stickyRef.current;
    const wand = wandRef.current;
    if (!section || !stickyContainer || !wand) return undefined;

    const state = stateRef.current;

    function onScroll() {
      const sectionRect = section.getBoundingClientRect();
      if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
        if (!state.throttleTimeout) {
          createProductBubble();
          state.throttleTimeout = true;
          window.setTimeout(() => {
            state.throttleTimeout = false;
          }, 600);
        }
      }
    }

    function createProductBubble() {
      const currentProduct = BUBBLE_PRODUCTS[state.productIndex % BUBBLE_PRODUCTS.length];
      state.productIndex += 1;

      const bubbleContainer = document.createElement("div");
      bubbleContainer.classList.add("bubble-creative-bubble");

      const img = document.createElement("img");
      img.classList.add("bubble-creative-product-image");
      img.src = currentProduct.img;
      img.alt = currentProduct.name;
      bubbleContainer.appendChild(img);

      const overlay = document.createElement("div");
      overlay.classList.add("bubble-creative-overlay");
      bubbleContainer.appendChild(overlay);

      const wandRect = wand.getBoundingClientRect();
      const containerRect = stickyContainer.getBoundingClientRect();

      const finalSize = getResponsiveBubbleSize();

      const dynamicOffset = wandRect.width * 0.15;
      const ringCenterX = wandRect.left + (wandRect.width - dynamicOffset) - containerRect.left;
      const ringCenterY = wandRect.top + wandRect.height / 2 - containerRect.top;

      const duration = Math.random() * 1500 + 4500;
      const driftDistanceX = Math.random() * (window.innerWidth * 0.15) + window.innerWidth * 0.5;
      const driftDistanceY = (Math.random() - 0.3) * (window.innerHeight * 0.25);

      bubbleContainer.style.width = `${finalSize}px`;
      bubbleContainer.style.height = `${finalSize}px`;
      bubbleContainer.style.left = `${ringCenterX - finalSize / 2}px`;
      bubbleContainer.style.top = `${ringCenterY - finalSize / 2}px`;

      stickyContainer.appendChild(bubbleContainer);

      if (typeof bubbleContainer.animate !== "function") {
        bubbleContainer.remove();
        return;
      }

      const driftAnimation = bubbleContainer.animate(
        [
          { transform: "translate(0px, 0px) scale(0.01, 0.15)", opacity: 0 },
          {
            transform: `translate(${finalSize * 0.4}px, ${driftDistanceY * 0.05}px) scale(1)`,
            opacity: 1,
            offset: 0.12,
          },
          {
            transform: `translate(${driftDistanceX * 0.88}px, ${driftDistanceY * 0.88}px) scale(1)`,
            opacity: 0.9,
            offset: 0.9,
          },
          {
            transform: `translate(${driftDistanceX}px, ${driftDistanceY}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.22, 1, 0.3, 1)",
        },
      );

      driftAnimation.onfinish = () => {
        bubbleContainer.remove();
      };
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      // Remove any in-flight bubbles still attached to the sticky container.
      stickyContainer.querySelectorAll(".bubble-creative-bubble").forEach((node) => node.remove());
    };
  }, []);

  return (
    <>
      <style>{BUBBLE_STYLES}</style>
      <section
        ref={sectionRef}
        className="bubble-creative-section"
        id="bubble-creative"
        aria-label="Product bubble stream scroll animation"
      >
        <div ref={stickyRef} className="bubble-creative-sticky" id="bubble-creative-sticky">
          <div ref={wandRef} className="bubble-creative-wand" id="bubble-creative-wand">
            <div className="bubble-creative-wand-handle" />
            <div className="bubble-creative-wand-ring" />
          </div>
        </div>
      </section>
    </>
  );
}
