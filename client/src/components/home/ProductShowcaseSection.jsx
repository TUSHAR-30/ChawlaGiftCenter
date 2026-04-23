import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { MdClose, MdOpenInFull, MdViewInAr } from "react-icons/md";

const showcaseItems = [
  {
    id: "category1",
    title: "Space Products",
    modelSrc: "/category1/model.glb",
    backgroundSrc: "/category1/env/background.png",
    leftImageSrc: "/category1/image3.png",
    rightImageSrc: "/category1/image2.png",
  },
  {
    id: "category2",
    title: "Avengers Products",
    modelSrc: "/category2/model.glb",
    backgroundSrc: "/category2/env/background.png",
    leftImageSrc: "/category2/image1.avif",
    rightImageSrc: "/category2/image2.png",
  },
];

function useViewportMount(rootMargin = "320px 0px") {
  const elementRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    if (!elementRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return [elementRef, isNearViewport];
}

function ModelFallback() {
  return (
    <Html center>
      <div className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary shadow-lg">
        Loading Model
      </div>
    </Html>
  );
}

function StaticModelPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[1.7rem] bg-white/20 backdrop-blur-[2px]">
      <div className="rounded-full border border-white/70 bg-white/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-primary shadow-[0_12px_24px_-18px_rgba(31,41,55,0.3)]">
        3D Preview Ready
      </div>
    </div>
  );
}

function ProductModel({ modelSrc, scale = 1.75, speed = 0.32 }) {
  const groupRef = useRef(null);
  const { scene } = useGLTF(modelSrc);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={scale} />
      </Center>
    </group>
  );
}

function ModelCanvas({ modelSrc, scale = 1.75, speed = 0.32, camera = { position: [0, 0.35, 4.5], fov: 32 } }) {
  return (
    <Canvas
      camera={camera}
      dpr={[1, 1.1]}
      frameloop="always"
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      performance={{ min: 0.7 }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 4, 5]} intensity={1.6} />
      <directionalLight position={[-2, 2, -3]} intensity={0.55} />
      <Suspense fallback={<ModelFallback />}>
        <ProductModel modelSrc={modelSrc} scale={scale} speed={speed} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.15} maxPolarAngle={Math.PI / 1.85} />
    </Canvas>
  );
}

function SideImage({ src, alt, className }) {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute inset-[10%] rounded-full bg-primary/10 blur-3xl" />
      <img
        alt={alt}
        className="relative h-full w-full object-cover drop-shadow-[0_28px_38px_rgba(148,163,184,0.22)] transition-transform duration-700 group-hover:scale-[1.03]"
        src={src}
      />
    </div>
  );
}

function FullscreenViewer({ item, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:px-6" onClick={onClose}>
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-[2.4rem] border border-white/20 bg-white/12 p-3 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.75)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-cover bg-center bg-no-repeat p-4 sm:p-5"
          style={{ backgroundImage: `url('${item.backgroundSrc}')` }}
        >
          <div className="absolute inset-0 bg-slate-950/12" />
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-white/92 px-2 py-1 text-on-surface-variant shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:right-5 sm:top-5">
            <button
              aria-label="Close fullscreen viewer"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              onClick={onClose}
              type="button"
            >
              <MdClose className="cursor-pointer text-lg" />
            </button>
          </div>

          <div className="relative h-[58vh] min-h-[360px] overflow-hidden rounded-[1.8rem] bg-transparent sm:min-h-[460px] lg:h-[72vh] lg:max-h-[760px]">
            <ModelCanvas modelSrc={item.modelSrc} scale={2} speed={0.24} camera={{ position: [0, 0.3, 4.15], fov: 30 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowcaseBlock({ item, onOpen }) {
  const [containerRef, shouldMountCanvas] = useViewportMount();

  return (
    <div ref={containerRef} className="relative mx-auto h-[330px] w-full max-w-6xl sm:h-[390px] md:h-[430px] lg:h-[520px]">
      <div className="mb-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary/80">{item.title}</p>
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 w-[41%] -translate-y-1/2 sm:w-[35%] md:w-[33%] lg:w-[31%]">
        <SideImage
          alt={`${item.title} left preview`}
          className="aspect-[1.2/1] -rotate-[4deg] translate-x-[-2%] sm:translate-x-[12%] lg:translate-x-[18%]"
          src={item.leftImageSrc}
        />
      </div>

      <div className="pointer-events-none absolute right-0 top-1/2 w-[42%] -translate-y-1/2 sm:w-[36%] md:w-[34%] lg:w-[32%]">
        <SideImage
          alt={`${item.title} right preview`}
          className="aspect-[1.22/1] rotate-[4deg] -translate-x-[-2%] sm:-translate-x-[12%] lg:-translate-x-[18%]"
          src={item.rightImageSrc}
        />
      </div>

      <div className="relative z-10 mx-auto w-[52%] min-w-0 max-w-[430px] sm:w-[42%] md:w-[38%] lg:w-[34%]">
        <div className="absolute inset-x-6 top-8 h-24 rounded-full bg-primary/12 blur-3xl" />
        <div
          className="relative overflow-hidden rounded-[2.1rem] border border-[#eef2f7] bg-white bg-cover bg-center bg-no-repeat p-3 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.28)] sm:p-4"
          style={{ backgroundImage: `url('${item.backgroundSrc}')` }}
        >
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[#eef2f7] bg-white/95 px-2 py-1 text-on-surface-variant shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-sm">
            <button
              aria-label={`Open ${item.title} in fullscreen`}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              onClick={() => onOpen(item)}
              type="button"
            >
              <MdOpenInFull className="cursor-pointer text-base sm:text-lg" />
            </button>
          </div>

          <div className="relative h-[260px] overflow-hidden rounded-[1.7rem] bg-transparent sm:h-[310px] md:h-[340px] lg:h-[430px]">
            {shouldMountCanvas ? <ModelCanvas modelSrc={item.modelSrc} /> : <StaticModelPlaceholder />}
          </div>

          <div className="relative mt-4 flex items-center justify-center gap-2.5 sm:gap-3">
            <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-on-primary sm:px-4 sm:py-2 sm:text-xs">
              3D
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcaseSection() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,251,235,0.68),rgba(255,255,255,0.98)_24%,rgba(239,246,255,0.72)_100%)] py-16 sm:py-18">
        <div className="soft-shapes left-[8%] top-16 h-36 w-36 rounded-full bg-primary-container/70" />
        <div className="soft-shapes bottom-12 right-[10%] h-40 w-40 rounded-full bg-secondary-container/70" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary shadow-[0_12px_24px_-18px_rgba(31,41,55,0.25)]">
              <MdViewInAr className="text-base" />
              3D Product View
            </div>
            <h2 className="text-2xl font-black tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
              Explore the Product From Every Angle
            </h2>
            <p className="mt-3 text-sm font-medium text-on-surface-variant sm:text-base">
              A closer look at standout pieces, framed by real product moments from each collection.
            </p>
          </div>

          <div className="space-y-14 sm:space-y-18 lg:space-y-22">
            {showcaseItems.map((item) => (
              <ShowcaseBlock item={item} key={item.id} onOpen={setActiveItem} />
            ))}
          </div>
        </div>
      </section>

      {activeItem ? <FullscreenViewer item={activeItem} onClose={() => setActiveItem(null)} /> : null}
    </>
  );
}

showcaseItems.forEach((item) => {
  useGLTF.preload(item.modelSrc);
});
