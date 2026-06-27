import { useEffect, useRef } from "react";
import * as THREE from "three";

const RINGS_STYLES = `
  .rings-creative-section {
    position: relative;
    width: 100%;
  }

  .rings-creative-canvas-container {
    position: fixed;
    inset:0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .rings-creative-scroll-wrapper {
    position: relative;
    height: 400vh;
    z-index: 2;
  }
`;

const POLE_HEIGHT = 9.5;
const BASE_THICKNESS = 1.0;
const POLE_TOP_Y = POLE_HEIGHT - BASE_THICKNESS / 2;

const RING_CONFIGS = [
  { color: 0x511bca, radius: 3.5, tube: 0.9, heightOffset: 0.8 },
  { color: 0xff00ff, radius: 3.2, tube: 0.85, heightOffset: 2.2 },
  { color: 0x00a8ff, radius: 2.9, tube: 0.8, heightOffset: 3.5 },
  { color: 0x00cc44, radius: 2.6, tube: 0.75, heightOffset: 4.7 },
  { color: 0xffe000, radius: 2.3, tube: 0.7, heightOffset: 5.8 },
  { color: 0xffa500, radius: 2.0, tube: 0.65, heightOffset: 6.8 },
  { color: 0xff5500, radius: 1.7, tube: 0.6, heightOffset: 7.7 },
];

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function clampMap(value, startSrc, endSrc, startDst, endDst) {
  if (value <= startSrc) return startDst;
  if (value >= endSrc) return endDst;
  const ratio = (value - startSrc) / (endSrc - startSrc);
  return startDst + ratio * (endDst - startDst);
}

export default function RingsCreative() {
  const sectionRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    toyParts: [],
    placedCircles: [],
    scrollProgress: 0,
    currentProgressSmooth: 0,
    rafId: 0,
    paused: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const canvasContainer = canvasContainerRef.current;
    if (!section || !canvasContainer) return undefined;

    const state = stateRef.current;

    function getValidFloorPosition(objectRadius) {
      let x = 0;
      let z = 0;
      let valid = false;
      let attempts = 0;
      const maxAttempts = 1500;
      const placed = state.placedCircles;

      while (!valid && attempts < maxAttempts) {
        attempts++;
        const angle = Math.random() * Math.PI * 2;
        const expandRange = attempts > 200 ? (attempts / 200) * 2.0 : 0;
        const distance = 6.0 + Math.random() * (4.0 + expandRange);

        x = Math.cos(angle) * distance;
        z = Math.sin(angle) * distance;

        valid = true;
        for (let i = 0; i < placed.length; i++) {
          const p = placed[i];
          const dx = x - p.x;
          const dz = z - p.z;
          const distanceBetweenCenters = Math.sqrt(dx * dx + dz * dz);
          const requiredClearance = objectRadius + p.radius + 0.3;

          if (distanceBetweenCenters < requiredClearance) {
            valid = false;
            break;
          }
        }
      }
      placed.push({ x, z, radius: objectRadius });
      return { x, z };
    }

    function updateCameraFOV() {
      if (!state.camera) return;
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect < 1.6) {
        state.camera.fov = 45 + (1.6 - aspect) * 22;
      } else {
        state.camera.fov = 45;
      }
      state.camera.updateProjectionMatrix();
    }

    function createStaticBase() {
      const baseGeo = new THREE.CylinderGeometry(5.2, 5.5, BASE_THICKNESS, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0;
      state.scene.add(baseMesh);

      const poleGeo = new THREE.CylinderGeometry(0.6, 0.7, POLE_HEIGHT, 32);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.y = POLE_HEIGHT / 2;
      state.scene.add(poleMesh);

      state.placedCircles.push({ x: 0, z: 0, radius: 5.6 });
    }

    function createPhysicsStyleScatter() {
      const totalItems = RING_CONFIGS.length + 1;
      const windowSegment = 1 / totalItems;

      RING_CONFIGS.forEach((config, idx) => {
        const ringGeo = new THREE.TorusGeometry(config.radius, config.tube, 16, 64);
        ringGeo.rotateX(Math.PI / 2);

        const ringMat = new THREE.MeshStandardMaterial({
          color: config.color,
          roughness: 0.3,
          metalness: 0.1,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        state.scene.add(ringMesh);

        const outerBoundRadius = config.radius + config.tube;
        const pos = getValidFloorPosition(outerBoundRadius);
        const scatterY = config.tube - 0.2;

        const scatterRotX = (Math.random() - 0.5) * 0.2;
        const scatterRotZ = (Math.random() - 0.5) * 0.2;
        const scatterRotY = Math.random() * Math.PI * 2;

        state.toyParts.push({
          mesh: ringMesh,
          scatterX: pos.x,
          scatterY,
          scatterZ: pos.z,
          scatterRotX,
          scatterRotY,
          scatterRotZ,
          finalX: 0,
          finalY: config.heightOffset,
          finalZ: 0,
          finalRotY: 0,
          startScroll: idx * windowSegment,
          endScroll: (idx + 1) * windowSegment,
        });
      });

      const bearHeadGroup = new THREE.Group();
      const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffe000, roughness: 0.4 });
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });

      const mainHeadGeo = new THREE.SphereGeometry(1.4, 32, 32);
      const mainHead = new THREE.Mesh(mainHeadGeo, yellowMat);
      mainHead.scale.set(1.1, 1, 1);
      bearHeadGroup.add(mainHead);

      const earGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const leftEar = new THREE.Mesh(earGeo, yellowMat);
      leftEar.position.set(-1, 1.1, 0);
      bearHeadGroup.add(leftEar);

      const rightEar = leftEar.clone();
      rightEar.position.x = 1;
      bearHeadGroup.add(rightEar);

      const snoutGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const snout = new THREE.Mesh(
        snoutGeo,
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }),
      );
      snout.position.set(0, -0.1, 1.2);
      snout.scale.set(1.2, 0.8, 0.6);
      bearHeadGroup.add(snout);

      const noseTipGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const noseTip = new THREE.Mesh(noseTipGeo, blackMat);
      noseTip.position.set(0, 0, 1.5);
      bearHeadGroup.add(noseTip);

      const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const leftEye = new THREE.Mesh(eyeGeo, blackMat);
      leftEye.position.set(-0.4, 0.4, 1.25);
      bearHeadGroup.add(leftEye);

      const rightEye = leftEye.clone();
      rightEye.position.x = 0.4;
      bearHeadGroup.add(rightEye);

      state.scene.add(bearHeadGroup);

      const headFloorRadius = 1.5;
      const headPos = getValidFloorPosition(headFloorRadius);
      const headIdx = RING_CONFIGS.length;

      state.toyParts.push({
        mesh: bearHeadGroup,
        scatterX: headPos.x,
        scatterY: 1.2,
        scatterZ: headPos.z,
        scatterRotX: (Math.random() - 0.5) * 0.1,
        scatterRotY: Math.random() * Math.PI * 2,
        scatterRotZ: (Math.random() - 0.5) * 0.1,
        finalX: 0,
        finalY: 8.8,
        finalZ: 0,
        finalRotY: 0,
        startScroll: headIdx * windowSegment,
        endScroll: 1.0,
      });
    }

    function init() {
      state.scene = new THREE.Scene();
      state.scene.background = null;

      state.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      state.camera.position.set(0, 15, 32);
      state.camera.lookAt(0, 4, 0);
      updateCameraFOV();

      state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      state.renderer.setSize(window.innerWidth, window.innerHeight);
      const isMobile = getIsMobile();
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
      state.renderer.shadowMap.enabled = true;

      canvasContainer.appendChild(state.renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      state.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(15, 40, 20);
      dirLight.castShadow = true;
      state.scene.add(dirLight);

      createStaticBase();
      createPhysicsStyleScatter();

      handleScroll();
      animate();
    }

    function handleScroll() {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const containerTop = section.offsetTop;
      const containerHeight = section.offsetHeight;
      const containerBottom = containerTop + containerHeight;

      const isSectionInView =
        scrollTop >= containerTop &&
        scrollTop <= containerBottom - viewportHeight;

      canvasContainer.style.opacity = isSectionInView ? "1" : "0";

      console.log("scrollTop",scrollTop)
      console.log("viewportHeight",viewportHeight)
      console.log("containerTop",containerTop)
      console.log("containerHeight",containerHeight)
      console.log("containerBottom",containerBottom)
      console.log("#######################################")


      // Assembly progress: starts when the section top hits the viewport top,
      // completes when the section bottom hits the viewport bottom.
      const startAnimating = containerTop;
      const endAnimating = containerBottom - viewportHeight;

      if (scrollTop < startAnimating) {
        state.scrollProgress = 0;
      } else if (scrollTop > endAnimating) {
        state.scrollProgress = 1;
      } else {
        state.scrollProgress = (scrollTop - startAnimating) / (endAnimating - startAnimating);
      }
    }

    function animate() {
      state.rafId = window.requestAnimationFrame(animate);

      if (state.paused) return;

      state.currentProgressSmooth = lerp(state.currentProgressSmooth, state.scrollProgress, 0.07);

      state.toyParts.forEach((part) => {
        const itemProgress = clampMap(
          state.currentProgressSmooth,
          part.startScroll,
          part.endScroll,
          0,
          1,
        );

        if (itemProgress <= 0) {
          part.mesh.position.set(part.scatterX, part.scatterY, part.scatterZ);
          part.mesh.rotation.set(part.scatterRotX, part.scatterRotY, part.scatterRotZ);
        } else if (itemProgress >= 1) {
          part.mesh.position.set(part.finalX, part.finalY, part.finalZ);
          part.mesh.rotation.set(0, part.finalRotY, 0);
        } else {
          const peakY = POLE_TOP_Y + 3.0;

          let currentY;
          if (itemProgress < 0.4) {
            const localProgress = clampMap(itemProgress, 0, 0.4, 0, 1);
            currentY = lerp(part.scatterY, peakY, localProgress);
          } else if (itemProgress < 0.6) {
            currentY = peakY;
          } else {
            const localProgress = clampMap(itemProgress, 0.6, 1.0, 0, 1);
            currentY = lerp(peakY, part.finalY, localProgress);
          }

          const currentX = lerp(part.scatterX, part.finalX, itemProgress);
          const currentZ = lerp(part.scatterZ, part.finalZ, itemProgress);
          const currentRotX = lerp(part.scatterRotX, 0, itemProgress);
          const currentRotY = lerp(part.scatterRotY, part.finalRotY, itemProgress);
          const currentRotZ = lerp(part.scatterRotZ, 0, itemProgress);

          part.mesh.position.set(currentX, currentY, currentZ);
          part.mesh.rotation.set(currentRotX, currentRotY, currentRotZ);
        }
      });

      state.renderer.render(state.scene, state.camera);
    }

    function onWindowResize() {
      if (state.camera && state.renderer) {
        state.camera.aspect = window.innerWidth / window.innerHeight;
        updateCameraFOV();
        state.renderer.setSize(window.innerWidth, window.innerHeight);
        handleScroll();
      }
    }

    init();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onWindowResize);

    let visibilityObserver;
    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          state.paused = !entry.isIntersecting;
        },
        { rootMargin: "200px 0px" },
      );
      visibilityObserver.observe(section);
    }

    // Re-measure scroll progress when surrounding sections (e.g. Categories
    // skeleton → real content) change height, which shifts this section's
    // offsetTop without firing scroll/resize.
    let layoutObserver;
    if (typeof ResizeObserver !== "undefined") {
      layoutObserver = new ResizeObserver(() => {
        handleScroll();
      });
      layoutObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onWindowResize);

      if (visibilityObserver) visibilityObserver.disconnect();
      if (layoutObserver) layoutObserver.disconnect();

      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }

      if (state.scene) {
        state.scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m.dispose());
          }
        });
      }

      if (state.renderer) {
        state.renderer.dispose();
        if (state.renderer.domElement && state.renderer.domElement.parentNode) {
          state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
        }
      }

      state.scene = null;
      state.camera = null;
      state.renderer = null;
      state.toyParts = [];
      state.placedCircles = [];
    };
  }, []);

  return (
    <>
      <style>{RINGS_STYLES}</style>
      <section
        ref={sectionRef}
        className="rings-creative-section"
        id="rings-creative"
        aria-label="Stack ring toy 3D scroll animation"
      >
        <div ref={canvasContainerRef} className="rings-creative-canvas-container" />
        <div className="rings-creative-scroll-wrapper" />
      </section>
    </>
  );
}
