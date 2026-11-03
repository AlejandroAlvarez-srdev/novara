"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Box, MoveHorizontal, Pause, Play, Plus, Minus, RotateCcw } from "lucide-react";
import type { ArchitectureController, SceneParameters } from "./architecture-scene";

const finishes = [{ id: "arena", label: "Arena", color: "#d8c7a8", description: "Calidez natural. Una arquitectura que encuentra su lugar en el paisaje." }, { id: "oliva", label: "Oliva", color: "#879073", description: "Tonos que dialogan con la vegetación y acercan el exterior a tu espacio." }, { id: "terracota", label: "Terracota", color: "#b87551", description: "Materia con carácter. Un acento cálido que transforma la experiencia." }] as const;

export default function ArchitectureExperience() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ArchitectureController | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [parameters, setParameters] = useState<SceneParameters>({ finish: "arena", exploded: 0, rotating: false });
  const parametersRef = useRef(parameters);
  parametersRef.current = parameters;

  useEffect(() => {
    let cancelled = false, started = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setParameters(value => ({ ...value, rotating: !motion.matches }));
    const motionChange = () => { if (motion.matches) setParameters(value => ({ ...value, rotating: false })); };
    motion.addEventListener("change", motionChange);
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true; observer.disconnect();
      try {
        const { createArchitectureScene } = await import("./architecture-scene");
        if (cancelled || !canvas.current) return;
        controller.current = createArchitectureScene(canvas.current, parametersRef.current, () => { if (!cancelled) { setStatus("fallback"); controller.current?.dispose(); controller.current = null; } });
        setStatus("ready");
      } catch { if (!cancelled) setStatus("fallback"); }
    }, { rootMargin: "350px" });
    if (section.current) observer.observe(section.current);
    return () => { cancelled = true; observer.disconnect(); controller.current?.dispose(); controller.current = null; motion.removeEventListener("change", motionChange); };
  }, []);

  useEffect(() => { controller.current?.update(parameters); }, [parameters]);
  const finish = finishes.find(item => item.id === parameters.finish)!;

  return <section ref={section} className="architecture-experience" id="experiencia" aria-labelledby="experience-title">
    <div className="experience-heading"><p className="eyebrow"><span className="live-dot" /> NOVARA LAB / EXPLORACIÓN INTERACTIVA</p><span className="experience-edition">VOLUMEN 01 — CONCEPTO RESIDENCIAL</span></div>
    <div className="experience-layout">
      <div className="experience-copy"><p className="eyebrow experience-kicker">IMAGINA. EXPLORA. TRANSFORMA.</p><h2 id="experience-title">Una idea.<br />Todas sus<br /><em>perspectivas.</em></h2><p>Descubre cómo se siente un espacio antes de habitarlo. Gira la maqueta, explora sus niveles y encuentra tu combinación.</p>
        {status !== "fallback" && <fieldset className="finish-picker" disabled={status !== "ready"}><legend>01 / ELIGE LA MATERIALIDAD</legend><div>{finishes.map(item => <button key={item.id} type="button" aria-label={`Acabado ${item.label}`} aria-pressed={item.id === parameters.finish} className={item.id === parameters.finish ? "selected" : ""} onClick={() => setParameters(value => ({ ...value, finish: item.id }))}><i style={{ background: item.color }} /><span>{item.label}</span></button>)}</div><p aria-live="polite">{finish.description}</p></fieldset>}
        <a className="text-link" href="#contacto">Imaginemos tu próximo espacio <ArrowUpRight size={18} /></a>
      </div>
      <div className={`model-viewer ${status}`} data-status={status}>
        <div className="model-topline"><span><Box size={15} /> CASA / ESTUDIO DE VOLUMEN</span><span>{status === "ready" ? "3D EN TIEMPO REAL" : status === "loading" ? "PREPARANDO EL ESPACIO" : "VISTA CONCEPTUAL"}</span></div>
        <div className="model-canvas-wrap">
          <canvas ref={canvas} className="model-canvas" tabIndex={status === "ready" ? 0 : -1} role="img" aria-label="Maqueta arquitectónica 3D interactiva de una casa de dos niveles" aria-describedby="model-instructions" hidden={status === "fallback"} />
          {status === "loading" && <div className="model-loading"><Box size={38} strokeWidth={1} /><span>Una nueva perspectiva está tomando forma.</span></div>}
          {status === "fallback" && <div className="model-fallback"><Image src="/images/architecture-concept.webp" alt="Concepto residencial de Novara, alternativa ilustrada a la maqueta" fill sizes="(max-width: 900px) 100vw, 65vw" /><p>Explora esta idea en imágenes. La vista 3D no está disponible en este dispositivo.</p></div>}
          {status === "ready" && <><div className="model-orbit-hint" id="model-instructions"><MoveHorizontal size={16} /><span>Arrastra para girar <i /> Usa las flechas del teclado</span></div><div className="model-tools"><button type="button" aria-label={parameters.rotating ? "Pausar giro" : "Activar giro"} onClick={() => setParameters(value => ({ ...value, rotating: !value.rotating }))}>{parameters.rotating ? <Pause size={16} /> : <Play size={16} />}</button><button type="button" aria-label="Acercar maqueta" onClick={() => controller.current?.zoom(1)}><Plus size={17} /></button><button type="button" aria-label="Alejar maqueta" onClick={() => controller.current?.zoom(-1)}><Minus size={17} /></button><button type="button" aria-label="Restablecer vista" onClick={() => { controller.current?.reset(); setParameters(value => ({ ...value, exploded: 0, rotating: false })); }}><RotateCcw size={16} /></button></div></>}
        </div>
        {status !== "fallback" && <div className="model-bottomline"><label htmlFor="exploded-view"><span>02 / EXPLORA LA ESTRUCTURA</span><strong>{parameters.exploded > 0 ? "Cada parte, un propósito." : "Todo comienza con una visión."}</strong></label><div className="model-range"><span>Unir</span><input id="exploded-view" type="range" min="0" max="100" value={parameters.exploded} disabled={status !== "ready"} aria-label="Separar niveles de la maqueta" onChange={event => setParameters(value => ({ ...value, exploded: Number(event.target.value) }))} /><span>Separar</span></div></div>}
        <p className="model-credit">Maqueta conceptual interactiva. No representa una obra ejecutada ni un diseño técnico para construcción.</p>
      </div>
    </div>
  </section>;
}
