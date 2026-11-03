"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const moments = [
  { title: "La luz dibuja.", image: "/images/courtyard-concept.webp", text: "Sombras que cambian. Espacios que se descubren a cada hora.", label: "01 / LUZ Y FORMA" },
  { title: "La materia habla.", image: "/images/interior-concept.webp", text: "Texturas honestas. Detalles que se sienten antes de explicarse.", label: "02 / TEXTURA Y CALIDEZ" },
  { title: "El paisaje abraza.", image: "/images/twilight-concept.webp", text: "Un diálogo continuo entre lo que construimos y lo que nos rodea.", label: "03 / NATURALEZA Y EQUILIBRIO" },
];

export default function VisualJourney() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const next = Math.max(0, Math.min(moments.length - 1, index));
    const item = track.current?.children[next] as HTMLElement | undefined;
    if (item && track.current) track.current.scrollTo({ left: item.offsetLeft - (track.current.children[0] as HTMLElement).offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section className="visual-journey" aria-labelledby="journey-title">
    <div className="journey-heading"><div><p className="eyebrow">UNA FORMA DE MIRAR EL MUNDO</p><h2 id="journey-title">Los espacios también<br />se <em>sienten.</em></h2></div><div className="journey-navigation"><span>DESLIZA Y DESCUBRE</span><button type="button" aria-label="Momento anterior" disabled={active === 0} onClick={() => go(active - 1)}><ArrowLeft size={20} /></button><button type="button" aria-label="Momento siguiente" disabled={active === moments.length - 1} onClick={() => go(active + 1)}><ArrowRight size={20} /></button></div></div>
    <div ref={track} className="journey-track" tabIndex={0} role="region" aria-label="Recorrido visual por luz, materia y paisaje" onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); go(active + (event.key === "ArrowRight" ? 1 : -1)); } }} onScroll={() => { if (!track.current) return; const children = Array.from(track.current.children) as HTMLElement[]; const distance = children.map(item => Math.abs(item.offsetLeft - children[0].offsetLeft - track.current!.scrollLeft)); setActive(distance.indexOf(Math.min(...distance))); }}>
      {moments.map(moment => <article className="journey-card" key={moment.title}><Image src={moment.image} alt={`Visualización conceptual: ${moment.title}`} fill sizes="(max-width: 600px) 100vw, 75vw" /><span className="journey-label">{moment.label}</span><div><h3>{moment.title}</h3><p>{moment.text}</p><a href="#contacto" aria-label={`Hablemos de tu proyecto: ${moment.title}`}><ArrowUpRight size={27} /></a></div><small>VISUALIZACIÓN CONCEPTUAL</small></article>)}
    </div>
    <div className="journey-bottom"><span>DISEÑAR ES IMAGINAR CÓMO QUIERES VIVIR.</span><span aria-live="polite">0{active + 1} <i /> 03</span></div>
  </section>;
}
