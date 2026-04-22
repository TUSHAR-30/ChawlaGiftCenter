import { Suspense, useEffect, useRef, useState } from "react";



import { Canvas, useFrame } from "@react-three/fiber";



import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";



import { MdViewInAr,MdOpenInFull,MdClose } from "react-icons/md";







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







function ModelFallback() {



  return (



    <Html center>



      <div className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary shadow-lg">



        Loading Model



      </div>



    </Html>



  );



}







function ProductModel({ modelSrc, scale = 1.75, speed = 0.4 }) {



  const groupRef = useRef(null);



  const { scene } = useGLTF(modelSrc);







  useFrame((_, delta) => {



    if (!groupRef.current) {



      return;



    }







    groupRef.current.rotation.y += delta * speed;



  });







  return (



    <group ref={groupRef}>



      <Center>



        <primitive object={scene.clone()} scale={scale} />



      </Center>



    </group>



  );



}







function ModelCanvas({ modelSrc, scale = 1.75, speed = 0.4, camera = { position: [0, 0.4, 4.7], fov: 34 } }) {



  return (



    <Canvas camera={camera} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>



      <ambientLight intensity={1.1} />



      <directionalLight position={[4, 5, 5]} intensity={2.2} />



      <directionalLight position={[-3, 2, -4]} intensity={0.75} />



      <spotLight position={[0, 6, 3]} intensity={1.7} angle={0.42} penumbra={1} />



      <Suspense fallback={<ModelFallback />}>



        <ProductModel modelSrc={modelSrc} scale={scale} speed={speed} />



        <Environment preset="city" />



      </Suspense>



      <OrbitControls



        enablePan={false}



        enableZoom={false}



        minPolarAngle={Math.PI / 2.2}



        maxPolarAngle={Math.PI / 1.8}



      />



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



            <ModelCanvas modelSrc={item.modelSrc} scale={2.05} speed={0.28} camera={{ position: [0, 0.35, 4.4], fov: 30 }} />



          </div>







        </div>



      </div>



    </div>



  );



}







function ShowcaseBlock({ item, onOpen }) {



  return (



    <div className="relative mx-auto h-[330px] w-full max-w-6xl sm:h-[390px] md:h-[430px] lg:h-[520px]">



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



            <ModelCanvas modelSrc={item.modelSrc} />



          </div>







          <div className="relative mt-4 flex items-center justify-center gap-2.5 sm:gap-3">



            <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-on-primary sm:px-4 sm:py-2 sm:text-xs">



              3D



            </span>



            {/* <span className="rounded-full border border-primary/35 bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-primary backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs">



              AR



            </span> */}



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



























































































































































































// import { Suspense, useEffect, useMemo, useRef, useState, startTransition } from "react";



// import * as THREE from "three";



// import { Canvas, useFrame } from "@react-three/fiber";



// import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";







// const showcaseItems = [



//   {



//     id: "category1",



//     title: "Space Products",



//     modelSrc: "/category1/model.glb",



//     backgroundSrc: "/category1/env/background.png",



//     leftImageSrc: "/category1/image3.png",



//     rightImageSrc: "/category1/image2.png",



//   },



//   {



//     id: "category2",



//     title: "Avengers Products",



//     modelSrc: "/category2/model.glb",



//     backgroundSrc: "/category2/env/background.png",



//     leftImageSrc: "/category2/image1.avif",



//     rightImageSrc: "/category2/image2.png",



//   },



// ];







// function mapMaterials(sourceMaterial, createMaterial) {



//   if (Array.isArray(sourceMaterial)) {



//     return sourceMaterial.map((entry) => createMaterial(entry));



//   }







//   return createMaterial(sourceMaterial);



// }







// function patchHologramMaterial(material) {



//   material.userData.hologramShader = null;







//   material.onBeforeCompile = (shader) => {



//     shader.uniforms.uTime = { value: 0 };



//     shader.uniforms.uGlowColor = { value: new THREE.Color("#6df7ff") };



//     shader.uniforms.uEdgeColor = { value: new THREE.Color("#e7ffff") };







//     shader.vertexShader = shader.vertexShader.replace(



//       "#include <common>",



//       `#include <common>



//       varying vec3 vHologramWorldPosition;`



//     );







//     shader.vertexShader = shader.vertexShader.replace(



//       "#include <project_vertex>",



//       `vHologramWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;



//       #include <project_vertex>`



//     );







//     shader.fragmentShader = shader.fragmentShader.replace(



//       "#include <common>",



//       `#include <common>



//       uniform float uTime;



//       uniform vec3 uGlowColor;



//       uniform vec3 uEdgeColor;



//       varying vec3 vHologramWorldPosition;`



//     );







//     shader.fragmentShader = shader.fragmentShader.replace(



//       "#include <dithering_fragment>",



//       `float stripeA = sin((vHologramWorldPosition.y * 22.0) - (uTime * 4.4)) * 0.5 + 0.5;



//       float stripeB = sin((vHologramWorldPosition.y * 40.0) - (uTime * 6.2)) * 0.5 + 0.5;



//       float stripes = stripeA * 0.7 + stripeB * 0.3;



//       float hologramView = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));



//       float fresnel = pow(hologramView, 1.8);



//       float luminance = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));



//       float lowerGlow = smoothstep(0.0, 0.55, 1.0 - clamp(vHologramWorldPosition.y + 0.15, 0.0, 1.0));



//       vec3 cyanBody = mix(uGlowColor * 0.55, uEdgeColor, luminance * 0.46);



//       vec3 hologramGlow = uGlowColor * (stripes * 0.16 + fresnel * 0.82 + lowerGlow * 0.22);



//       gl_FragColor.rgb = cyanBody + hologramGlow;



//       gl_FragColor.a = clamp(0.16 + luminance * 0.22 + fresnel * 0.4 + stripes * 0.05 + lowerGlow * 0.08, 0.0, 0.82);



//       #include <dithering_fragment>`



//     );







//     material.userData.hologramShader = shader;



//   };







//   material.needsUpdate = true;



// }







// function buildHologramMaterial(sourceMaterial) {



//   const hologramMaterial = new THREE.MeshPhysicalMaterial({



//     color: new THREE.Color("#74f7ff"),



//     map: sourceMaterial.map || null,



//     transparent: true,



//     opacity: 0.26,



//     side: THREE.DoubleSide,



//     roughness: 0.2,



//     metalness: 0.0,



//     transmission: 0.0,



//     emissive: new THREE.Color("#75efff"),



//     emissiveIntensity: 0.18,



//     depthWrite: false,



//     blending: THREE.NormalBlending,



//   });







//   hologramMaterial.normalMap = sourceMaterial.normalMap || null;



//   patchHologramMaterial(hologramMaterial);



//   return hologramMaterial;



// }







// function addHologramEdges(mesh) {



//   if (mesh.isSkinnedMesh) {



//     return [];



//   }







//   const edges = new THREE.LineSegments(



//     new THREE.EdgesGeometry(mesh.geometry, 34),



//     new THREE.LineBasicMaterial({



//       color: "#b8ffff",



//       transparent: true,



//       opacity: 0.16,



//       blending: THREE.AdditiveBlending,



//       depthWrite: false,



//     })



//   );







//   edges.renderOrder = 3;



//   edges.visible = false;



//   mesh.add(edges);



//   return [edges];



// }







// function disposeOverlays(entries) {



//   entries.forEach(({ mesh, overlays }) => {



//     overlays.forEach((overlay) => {



//       mesh.remove(overlay);



//       overlay.geometry?.dispose?.();



//       overlay.material?.dispose?.();



//     });



//   });



// }







// function ModelFallback() {



//   return (



//     <Html center>



//       <div className="rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary shadow-lg">



//         Loading Model



//       </div>



//     </Html>



//   );



// }







// function ProductModel({ modelSrc, scale = 1.75, speed = 0.4, hologramEnabled = false }) {



//   const groupRef = useRef(null);



//   const { scene } = useGLTF(modelSrc);



//   const clonedScene = useMemo(() => scene.clone(), [scene]);



//   const materialEntriesRef = useRef([]);



//   const hologramMaterialsRef = useRef([]);



//   const overlayEntriesRef = useRef([]);



//   const frameGateRef = useRef(0);







//   useEffect(() => {



//     const materialEntries = [];



//     const hologramMaterials = [];



//     const overlayEntries = [];







//     clonedScene.traverse((child) => {



//       if (!child.isMesh) {



//         return;



//       }







//       const originalMaterial = child.material;



//       const hologramMaterial = mapMaterials(originalMaterial, buildHologramMaterial);



//       const overlays = addHologramEdges(child);







//       materialEntries.push({



//         mesh: child,



//         originalMaterial,



//         hologramMaterial,



//         overlays,



//       });







//       if (Array.isArray(hologramMaterial)) {



//         hologramMaterials.push(...hologramMaterial);



//       } else {



//         hologramMaterials.push(hologramMaterial);



//       }







//       overlayEntries.push({ mesh: child, overlays });



//     });







//     materialEntriesRef.current = materialEntries;



//     hologramMaterialsRef.current = hologramMaterials;



//     overlayEntriesRef.current = overlayEntries;







//     materialEntries.forEach(({ mesh, originalMaterial, overlays }) => {



//       mesh.material = originalMaterial;



//       overlays.forEach((overlay) => {



//         overlay.visible = false;



//       });



//     });







//     return () => {



//       materialEntries.forEach(({ mesh, originalMaterial, hologramMaterial }) => {



//         mesh.material = originalMaterial;



//         if (Array.isArray(hologramMaterial)) {



//           hologramMaterial.forEach((material) => material.dispose?.());



//         } else {



//           hologramMaterial.dispose?.();



//         }



//       });







//       disposeOverlays(overlayEntries);



//       materialEntriesRef.current = [];



//       hologramMaterialsRef.current = [];



//       overlayEntriesRef.current = [];



//     };



//   }, [clonedScene]);







//   useEffect(() => {



//     materialEntriesRef.current.forEach(({ mesh, originalMaterial, hologramMaterial, overlays }) => {



//       mesh.material = hologramEnabled ? hologramMaterial : originalMaterial;



//       overlays.forEach((overlay) => {



//         overlay.visible = hologramEnabled;



//       });



//     });



//   }, [hologramEnabled]);







//   useFrame((state, delta) => {



//     if (groupRef.current) {



//       groupRef.current.rotation.y += delta * speed;



//     }







//     if (!hologramEnabled) {



//       return;



//     }







//     frameGateRef.current += 1;



//     if (frameGateRef.current % 2 !== 0) {



//       return;



//     }







//     hologramMaterialsRef.current.forEach((material) => {



//       const shader = material.userData.hologramShader;



//       if (shader) {



//         shader.uniforms.uTime.value = state.clock.elapsedTime;



//       }



//     });



//   });







//   return (



//     <group ref={groupRef}>



//       <Center>



//         <primitive object={clonedScene} scale={scale} />



//       </Center>



//     </group>



//   );



// }







// function ModelCanvas({



//   modelSrc,



//   scale = 1.75,



//   speed = 0.4,



//   hologramEnabled = false,



//   camera = { position: [0, 0.4, 4.7], fov: 34 },



// }) {



//   const dpr = hologramEnabled ? [1, 1] : [1, 1.35];







//   return (



//     <Canvas



//       camera={camera}



//       dpr={dpr}



//       gl={{ alpha: true, antialias: !hologramEnabled, powerPreference: "high-performance" }}



//       performance={{ min: 0.7 }}



//     >



//       <ambientLight intensity={1.1} />



//       <directionalLight position={[4, 5, 5]} intensity={2.2} />



//       <directionalLight position={[-3, 2, -4]} intensity={0.75} />



//       <spotLight position={[0, 6, 3]} intensity={1.7} angle={0.42} penumbra={1} />



//       <Suspense fallback={<ModelFallback />}>



//         <ProductModel modelSrc={modelSrc} scale={scale} speed={speed} hologramEnabled={hologramEnabled} />



//         {!hologramEnabled ? <Environment preset="city" /> : null}



//       </Suspense>



//       <OrbitControls



//         enablePan={false}



//         enableZoom={false}



//         minPolarAngle={Math.PI / 2.2}



//         maxPolarAngle={Math.PI / 1.8}



//       />



//     </Canvas>



//   );



// }







// function SideImage({ src, alt, className }) {



//   return (



//     <div className={`group relative ${className}`}>



//       <div className="absolute inset-[10%] rounded-full bg-primary/10 blur-3xl" />



//       <img



//         alt={alt}



//         className="relative h-full w-full object-cover drop-shadow-[0_28px_38px_rgba(148,163,184,0.22)] transition-transform duration-700 group-hover:scale-[1.03]"



//         src={src}



//       />



//     </div>



//   );



// }







// function ToolbarButton({ active = false, icon, label, onClick }) {



//   return (



//     <button



//       aria-label={label}



//       className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${



//         active



//           ? "border-cyan-300 bg-cyan-100 text-cyan-700"



//           : "border-transparent bg-transparent text-on-surface-variant hover:bg-slate-100"



//       }`}



//       onClick={onClick}



//       type="button"



//     >



//       <span className="material-symbols-outlined text-base sm:text-lg">{icon}</span>



//     </button>



//   );



// }







// function FullscreenViewer({ item, hologramEnabled, onClose, onToggleHologram }) {



//   useEffect(() => {



//     const previousOverflow = document.body.style.overflow;







//     function handleKeyDown(event) {



//       if (event.key === "Escape") {



//         onClose();



//       }



//     }







//     document.body.style.overflow = "hidden";



//     window.addEventListener("keydown", handleKeyDown);







//     return () => {



//       document.body.style.overflow = previousOverflow;



//       window.removeEventListener("keydown", handleKeyDown);



//     };



//   }, [onClose]);







//   return (



//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:px-6" onClick={onClose}>



//       <div



//         className="relative w-full max-w-6xl overflow-hidden rounded-[2.4rem] border border-white/20 bg-white/12 p-3 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.75)] sm:p-5"



//         onClick={(event) => event.stopPropagation()}



//       >



//         <div



//           className="relative overflow-hidden rounded-[2rem] border border-white/25 bg-cover bg-center bg-no-repeat p-4 sm:p-5"



//           style={{ backgroundImage: `url('${item.backgroundSrc}')` }}



//         >



//           <div className="absolute inset-0 bg-slate-950/12" />



//           <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-white/92 px-2 py-1 text-on-surface-variant shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:right-5 sm:top-5">



//             <ToolbarButton



//               active={hologramEnabled}



//               icon="blur_on"



//               label={`Toggle hologram mode for ${item.title}`}



//               onClick={onToggleHologram}



//             />



//             <ToolbarButton active={false} icon="close" label="Close fullscreen viewer" onClick={onClose} />



//           </div>







//           <div className="relative h-[58vh] min-h-[360px] overflow-hidden rounded-[1.8rem] bg-transparent sm:min-h-[460px] lg:h-[72vh] lg:max-h-[760px]">



//             <ModelCanvas



//               camera={{ position: [0, 0.35, 4.4], fov: 30 }}



//               hologramEnabled={hologramEnabled}



//               modelSrc={item.modelSrc}



//               scale={2.05}



//               speed={0.28}



//             />



//           </div>



//         </div>



//       </div>



//     </div>



//   );



// }







// function ShowcaseBlock({ item, hologramEnabled, onOpen, onToggleHologram }) {



//   return (



//     <div className="relative mx-auto h-[330px] w-full max-w-6xl sm:h-[390px] md:h-[430px] lg:h-[520px]">



//       <div className="mb-6 text-center">



//         <p className="text-xs font-black uppercase tracking-[0.28em] text-primary/80">{item.title}</p>



//       </div>







//       <div className="pointer-events-none absolute left-0 top-1/2 w-[41%] -translate-y-1/2 sm:w-[35%] md:w-[33%] lg:w-[31%]">



//         <SideImage



//           alt={`${item.title} left preview`}



//           className="aspect-[1.2/1] -rotate-[4deg] translate-x-[-2%] sm:translate-x-[12%] lg:translate-x-[18%]"



//           src={item.leftImageSrc}



//         />



//       </div>







//       <div className="pointer-events-none absolute right-0 top-1/2 w-[42%] -translate-y-1/2 sm:w-[36%] md:w-[34%] lg:w-[32%]">



//         <SideImage



//           alt={`${item.title} right preview`}



//           className="aspect-[1.22/1] rotate-[4deg] -translate-x-[-2%] sm:-translate-x-[12%] lg:-translate-x-[18%]"



//           src={item.rightImageSrc}



//         />



//       </div>







//       <div className="relative z-10 mx-auto w-[52%] min-w-0 max-w-[430px] sm:w-[42%] md:w-[38%] lg:w-[34%]">



//         <div className="absolute inset-x-6 top-8 h-24 rounded-full bg-primary/12 blur-3xl" />



//         <div



//           className="relative overflow-hidden rounded-[2.1rem] border border-[#eef2f7] bg-white bg-cover bg-center bg-no-repeat p-3 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.28)] sm:p-4"



//           style={{ backgroundImage: `url('${item.backgroundSrc}')` }}



//         >



//           <div className={`absolute inset-0 ${hologramEnabled ? "bg-slate-950/18" : "bg-white/10"}`} />



//           <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-[#eef2f7] bg-white/95 px-2 py-1 text-on-surface-variant shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-sm">



//             <ToolbarButton



//               active={hologramEnabled}



//               icon="blur_on"



//               label={`Toggle hologram mode for ${item.title}`}



//               onClick={onToggleHologram}



//             />



//             <ToolbarButton active={false} icon="open_in_full" label={`Open ${item.title} in fullscreen`} onClick={() => onOpen(item)} />



//           </div>







//           <div className="relative h-[260px] overflow-hidden rounded-[1.7rem] bg-transparent sm:h-[310px] md:h-[340px] lg:h-[430px]">



//             <ModelCanvas hologramEnabled={hologramEnabled} modelSrc={item.modelSrc} />



//           </div>







//           <div className="relative mt-4 flex items-center justify-center gap-2.5 sm:gap-3">



//             <span className={`rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] sm:px-4 sm:py-2 sm:text-xs ${



//               hologramEnabled ? "bg-cyan-400 text-slate-950" : "bg-primary text-on-primary"



//             }`}>



//               {hologramEnabled ? "Holo" : "3D"}



//             </span>



//             <span className={`rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xs ${



//               hologramEnabled



//                 ? "border-cyan-300 bg-slate-950/40 text-cyan-100"



//                 : "border-primary/35 bg-white/80 text-primary"



//             }`}>



//               {hologramEnabled ? "Live Scan" : "AR"}



//             </span>



//           </div>



//         </div>



//       </div>



//     </div>



//   );



// }







// export default function ProductShowcaseSection() {



//   const [activeItem, setActiveItem] = useState(null);



//   const [hologramModes, setHologramModes] = useState(() =>



//     Object.fromEntries(showcaseItems.map((item) => [item.id, false]))



//   );







//   function toggleHologram(itemId) {



//     startTransition(() => {



//       setHologramModes((current) => ({



//         ...current,



//         [itemId]: !current[itemId],



//       }));



//     });



//   }







//   return (



//     <>



//       <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f9fafb_0%,#ffffff_100%)] py-16 sm:py-18">



//         <div className="soft-shapes left-[8%] top-16 h-36 w-36 rounded-full bg-primary-container/70" />



//         <div className="soft-shapes bottom-12 right-[10%] h-40 w-40 rounded-full bg-secondary-container/70" />







//         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">



//           <div className="mx-auto mb-10 max-w-2xl text-center">



//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary shadow-[0_12px_24px_-18px_rgba(31,41,55,0.25)]">



//               <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>



//                 deployed_code



//               </span>



//               3D Product View



//             </div>



//             <h2 className="text-2xl font-black tracking-tight text-on-surface sm:text-3xl lg:text-4xl">



//               Explore the Product From Every Angle



//             </h2>



//             <p className="mt-3 text-sm font-medium text-on-surface-variant sm:text-base">



//               A closer look at standout pieces, framed by real product moments from each collection.



//             </p>



//           </div>







//           <div className="space-y-14 sm:space-y-18 lg:space-y-22">



//             {showcaseItems.map((item) => (



//               <ShowcaseBlock



//                 hologramEnabled={Boolean(hologramModes[item.id])}



//                 item={item}



//                 key={item.id}



//                 onOpen={setActiveItem}



//                 onToggleHologram={() => toggleHologram(item.id)}



//               />



//             ))}



//           </div>



//         </div>



//       </section>







//       {activeItem ? (



//         <FullscreenViewer



//           hologramEnabled={Boolean(hologramModes[activeItem.id])}



//           item={activeItem}



//           onClose={() => setActiveItem(null)}



//           onToggleHologram={() => toggleHologram(activeItem.id)}



//         />



//       ) : null}



//     </>



//   );



// }







// showcaseItems.forEach((item) => {



//   useGLTF.preload(item.modelSrc);



// });



