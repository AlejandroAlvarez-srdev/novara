"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Box, Pause, Play } from "lucide-react";

const scenes = [
  { image: "/images/architecture-concept.webp", name: "Habitar", detail: "Arquitectura en armonía", alt: "Concepto de una residencia contemporánea entre jardines" },
  { image: "/images/twilight-concept.webp", name: "Sentir", detail: "El espacio cobra vida", alt: "Concepto de una residencia iluminada al anochecer con espejo de agua" },
  { image: "/images/urban-concept.webp", name: "Trascender", detail: "Una nueva perspectiva", alt: "Concepto de un edificio de terrazas ajardinadas frente al paisaje andino" },
];

export default function HeroExperience() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { reduced.current = media.matches; setPlaying(!media.matches); };
    change(); media.addEventListener("change", change);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", change); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!playing || focused || !visible || !pageVisible) return;
    const timer = setInterval(() => setActive(value => (value + 1) % scenes.length), 7500);
    return () => clearInterval(timer);
  }, [playing, focused, visible, pageVisible, active]);

  const choose = (index: number) => { setActive(index); setPlaying(false); };

  return <section ref={root} className={`hero hero-immersive ${playing && !focused && visible && pageVisible ? "is-playing" : ""}`} id="inicio" aria-labelledby="hero-title"
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onPointerMove={event => {
      if (event.pointerType !== "mouse" || reduced.current || !root.current) return;
      const rect = root.current.getBoundingClientRect();
      root.current.style.setProperty("--hero-x", `${(event.clientX / rect.width - .5) * 12}px`);
      root.current.style.setProperty("--hero-y", `${((event.clientY - rect.top) / rect.height - .5) * 9}px`);
    }} onPointerLeave={() => { root.current?.style.setProperty("--hero-x", "0px"); root.current?.style.setProperty("--hero-y", "0px"); }}>
    <div className="hero-stage" aria-hidden="true">{scenes.map((scene, index) => <div key={scene.name} className={`hero-frame ${index === active ? "active" : ""}`}><Image src={scene.image} alt="" fill sizes="(max-width: 900px) 1600px, 100vw" priority={index === 0} quality={85} /></div>)}</div>
    <div className="hero-shade" />
    <div className="hero-side-label" aria-hidden="true">NOVARA — ESPACIOS PARA TRASCENDER</div>
    <div className="hero-content">
      <p className="eyebrow hero-eyebrow"><span className="small-line" /> DISEÑAMOS. PLANIFICAMOS. CONSTRUIMOS.</p>
      <h1 id="hero-title">Construimos<br />lo que <em>imaginas.</em></h1>
      <p className="hero-description">Transformamos ideas en espacios que inspiran.<br className="desktop-break" /> Con visión, solidez y atención a cada detalle.</p>
      <div className="hero-actions"><a className="button button-light" href="#vision">Explora nuestra visión <ArrowUpRight size={20} /></a><a className="hero-3d-link" href="#experiencia"><span><Box size={19} strokeWidth={1.3} /></span> Vívelo en 3D <ArrowUpRight size={15} /></a></div>
    </div>
    <div className="hero-scene-caption" aria-live="off"><span>{String(active + 1).padStart(2, "0")} / 03</span><p key={active}>{scenes[active].detail}</p><small>VISUALIZACIÓN CONCEPTUAL</small></div>
    <div className="hero-bottom"><a className="scroll-link" href="#nosotros"><span><ArrowDown size={16} /></span> EL FUTURO SE CONSTRUYE HOY</a>
      <div className="scene-navigation" role="group" aria-label="Escenas de portada">
        {scenes.map((scene, index) => <button key={scene.name} className={`scene-button ${active === index ? "active" : ""}`} type="button" aria-label={`Ver escena ${scene.name}`} aria-pressed={active === index} onClick={() => choose(index)}><span className="scene-thumb"><Image src={scene.image} width={92} height={58} alt="" /></span><span className="scene-name"><small>0{index + 1}</small>{scene.name}</span><i key={`${index}-${active}`} /></button>)}
        <button type="button" className="scene-pause" aria-label={playing ? "Pausar escenas" : "Reproducir escenas"} onClick={() => { setPlaying(!playing); setFocused(false); }}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      </div>
    </div>
  </section>;
}
