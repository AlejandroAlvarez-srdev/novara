"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowRight, ArrowDown, Plus, Minus, Menu, X, MapPin, Mail, Phone, Check, Download, MessageCircle } from "lucide-react";
import { company, concepts, services, whatsappLink, type Concept } from "@/data/site";
import HeroExperience from "./hero-experience";
import ArchitectureExperience from "./architecture-experience";
import VisualJourney from "./visual-journey";

const links = [["Nosotros", "nosotros"], ["Servicios", "servicios"], ["Experiencia 3D", "experiencia"], ["Nuestra visión", "vision"], ["El proceso", "proceso"]] as const;

function ContactForm() {
  const [summary, setSummary] = useState("");
  const [draft, setDraft] = useState({ name: "", email: "", service: "", message: "" });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (summary) resultRef.current?.focus(); }, [summary]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    setDraft({ name: value("name"), email: value("email"), service: value("service"), message: value("message") });
    setSummary(`Hola, Novara. Me gustaría conversar sobre mi proyecto.\n\nNombre: ${value("name")}\nCorreo: ${value("email")}\nMe interesa: ${value("service")}\n\nMi idea:\n${value("message")}`);
    setCopied(false);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "mi-proyecto-novara.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (summary) return <div className="contact-result" ref={resultRef} tabIndex={-1}>
    <span className="result-icon"><Check size={24} /></span>
    <h3>Tu idea ya tiene un comienzo.</h3>
    <p>Tu consulta está lista. Ábrela en WhatsApp y envíala para comenzar la conversación con Novara.</p>
    <pre>{summary}</pre>
    <a className="button button-clay" href={whatsappLink(summary)} target="_blank" rel="noopener noreferrer">Continuar en WhatsApp <ArrowUpRight size={18} /></a>
    <div className="result-actions">
      <button type="button" onClick={() => setSummary("")}>Editar consulta</button>
      <button type="button" onClick={download}><Download size={14} /> Descargar</button>
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}>{copied ? "Copiado" : "Copiar"}</button>
    </div>
    <p className="form-note" role="status">{copyError ? "No fue posible copiar. Puedes descargar el resumen." : "Aún no se ha enviado ningún mensaje."}</p>
  </div>;

  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row">
      <label>Tu nombre<input name="name" autoComplete="name" placeholder="¿Cómo te llamas?" required minLength={2} maxLength={100} pattern=".*\S.*" defaultValue={draft.name} /></label>
      <label>Correo electrónico<input name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required maxLength={200} defaultValue={draft.email} /></label>
    </div>
    <label>¿Qué tienes en mente?<select name="service" defaultValue={draft.service} required><option value="" disabled>Selecciona una opción</option><option>Diseño arquitectónico</option><option>Planificación de un proyecto</option><option>Construcción</option><option>Un proyecto de principio a fin</option><option>Quiero orientación</option></select></label>
    <label>Cuéntanos un poco más<textarea name="message" placeholder="Una idea, un lugar, un espacio por transformar…" required minLength={10} maxLength={1500} rows={3} defaultValue={draft.message} /></label>
    <p className="form-note">Prepararemos tu mensaje para WhatsApp. Tú decides cuándo enviarlo.</p>
    <button type="submit" className="button button-clay">Preparar mi consulta <ArrowUpRight size={19} /></button>
  </form>;
}

export default function NovaraSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(0);
  const [filter, setFilter] = useState("Todos");
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 32);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(el => { el.classList.add("will-reveal"); observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
      if (event.key === "Tab") {
        const items = [menuButtonRef.current, ...Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    const media = window.matchMedia("(min-width: 901px)");
    const resize = () => { if (media.matches) setMenuOpen(false); };
    media.addEventListener("change", resize); document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", keydown); media.removeEventListener("change", resize); };
  }, [menuOpen]);

  useEffect(() => {
    if (selectedConcept) { dialogRef.current?.showModal(); }
  }, [selectedConcept]);

  function closeConcept() { dialogRef.current?.close(); setSelectedConcept(null); }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="reading-progress" ref={progressRef} aria-hidden="true" />
    <header className={`site-header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <a href="#inicio" className="brand" aria-label="Novara, inicio" onClick={() => setMenuOpen(false)}><Image src="/brand/logo-white.webp" width={240} height={63} alt="Novara Grupo Constructor" priority /></a>
      <button ref={menuButtonRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav ref={navRef} id="main-navigation" className={menuOpen ? "open" : ""} aria-label="Navegación principal">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a className="nav-contact" href="#contacto" onClick={() => setMenuOpen(false)}>Hablemos <ArrowUpRight size={17} /></a>
      </nav>
    </header>

    <main id="contenido">
      <HeroExperience />

      <div className="principles-bar" aria-label="Nuestra esencia"><span>VISIÓN QUE INSPIRA</span><i /><span>DISEÑO QUE CONECTA</span><i /><span>CONFIANZA QUE PERDURA</span><i /><span>ESPACIOS CON PROPÓSITO</span></div>

      <section className="about section-wrap" id="nosotros">
        <div className="section-label" data-reveal><span className="section-number">01 /</span> SOMOS NOVARA</div>
        <div className="about-main" data-reveal>
          <h2>La solidez de construir.<br />La emoción de <em>crear.</em></h2>
          <a className="about-visual" href="#experiencia" aria-label="Explorar nuestra experiencia arquitectónica 3D"><Image src="/images/courtyard-concept.webp" alt="Concepto de patio donde la luz natural transforma la piedra" fill sizes="(max-width: 600px) 90vw, 30vw" /><span>LA LUZ ES NUESTRO PRIMER MATERIAL <ArrowUpRight size={19} /></span><small>Visualización conceptual</small></a>
          <div className="about-copy"><p>Creemos que un gran espacio empieza mucho antes de la primera piedra. Empieza con una idea, una conversación y una visión compartida.</p><p>En Novara integramos diseño, planificación y construcción para transformar esa visión en proyectos reales, seguros y elegantes. Te acompañamos en cada etapa, con sensibilidad estética y solidez técnica.</p><a className="text-link" href="#servicios">Conoce cómo lo hacemos <ArrowUpRight size={18} /></a></div>
          <div className="about-signoff"><span>UNA VISIÓN INTEGRAL.</span><span>INFINITAS POSIBILIDADES.</span><span className="location"><MapPin size={13} /> DUITAMA, BOYACÁ</span></div>
        </div>
      </section>

      <ArchitectureExperience />

      <section className="services-section" id="servicios">
        <div className="services-image"><Image src="/images/interior-concept.webp" alt="Concepto visual de un interior cálido, abierto a la luz natural" fill sizes="(max-width: 900px) 100vw, 47vw" /><span className="image-caption">EL DETALLE LO TRANSFORMA TODO <span>Concepto visual</span></span></div>
        <div className="services-content">
          <p className="eyebrow"><span className="section-number">02 /</span> LO QUE HACEMOS</p>
          <h2>De la primera idea<br />al último <em>detalle.</em></h2>
          <p className="section-description">Tres disciplinas. Una misma visión para tu proyecto.</p>
          <div className="services-list">{services.map((service, index) => <div key={service.number} className={`service ${activeService === index ? "active" : ""}`}>
            <button className="service-trigger" type="button" aria-expanded={activeService === index} aria-controls={`service-panel-${index}`} onClick={() => setActiveService(activeService === index ? null : index)}><span className="service-number">{service.number}</span><span>{service.title}</span>{activeService === index ? <Minus size={19} /> : <Plus size={19} />}</button>
            <div className="service-panel" id={`service-panel-${index}`} hidden={activeService !== index}><p className="service-summary">{service.summary}</p><p>{service.description}</p><span className="service-tags">{service.tags}</span></div>
          </div>)}</div>
          <a className="text-link" href="#contacto">Demos forma a tu proyecto <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="vision section-wrap" id="vision">
        <div className="section-label" data-reveal><span className="section-number">03 /</span> NUESTRA VISIÓN</div>
        <div className="vision-main">
          <div className="section-heading" data-reveal><h2>Espacios para vivir.<br />Ideas para <em>trascender.</em></h2><p>Una mirada a las posibilidades del espacio.<br />Explora nuestro universo de inspiración.</p></div>
          <div className="filters" role="group" aria-label="Filtrar conceptos">{["Todos", "Residencial", "Urbano", "Interiores"].map(category => <button key={category} type="button" className={filter === category ? "selected" : ""} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === "Todos" && <sup>{String(concepts.length).padStart(2, "0")}</sup>}</button>)}</div>
          <div className={`concept-grid ${filter !== "Todos" ? "filtered" : ""}`} aria-live="polite">{concepts.filter(concept => filter === "Todos" || filter === concept.category).map((concept) => <button className={`concept-card concept-${concept.id}`} type="button" key={concept.id} onClick={() => setSelectedConcept(concept)} aria-label={`Explorar ${concept.title}`}>
            <div className="concept-image"><Image src={concept.image} alt={concept.alt} fill sizes="(max-width: 650px) 100vw, (max-width: 900px) 50vw, 42vw" /><span className="concept-tag">{concept.category}</span><span className="concept-arrow"><ArrowUpRight size={24} /></span><span className="concept-credit">{concept.id === "perspectiva" ? "Referencia de marca" : "Visualización conceptual"}</span></div>
            <div className="concept-title"><div><h3>{concept.title}</h3><p>{concept.subtitle}</p></div><span>{String(concepts.indexOf(concept) + 1).padStart(2, "0")}</span></div>
          </button>)}</div>
          <p className="vision-note">Imágenes de inspiración y conceptos visuales. No corresponden a un portafolio de obras ejecutadas.</p>
        </div>
      </section>

      <VisualJourney />

      <section className="manifesto"><div className="manifesto-grid" aria-hidden="true" /><Image src="/brand/symbol-white.webp" className="manifesto-symbol" alt="" width={116} height={122} /><p className="eyebrow">MÁS ALLÁ DE CONSTRUIR</p><h2 data-reveal>Elevamos ideas.<br />Construimos <em>futuro.</em></h2><p>Cada espacio es una oportunidad para avanzar.<br />Cada proyecto, el comienzo de algo extraordinario.</p><a className="button button-outline" href="#contacto">Construyamos lo que sigue <ArrowUpRight size={18} /></a><span className="manifesto-coordinate">NOVARA / UNA VISIÓN QUE NOS MUEVE</span></section>

      <section className="process section-wrap" id="proceso">
        <div className="section-label" data-reveal><span className="section-number">04 /</span> A TU LADO</div>
        <div className="process-main"><div className="section-heading" data-reveal><h2>Un camino claro.<br />Una visión <em>compartida.</em></h2><p>Construir confianza también es parte del proceso.<br />Así empezamos a trabajar contigo.</p></div>
          <div className="process-grid">{[
            ["01", "Te escuchamos", "Nos cuentas qué imaginas, qué necesitas y qué hace especial tu proyecto."],
            ["02", "Le damos forma", "Exploramos posibilidades y definimos contigo una dirección de diseño."],
            ["03", "Trazamos el camino", "Acordamos el alcance, las etapas y los próximos pasos para avanzar."],
            ["04", "Lo hacemos realidad", "Integramos diseño y construcción, acompañándote durante el proceso."],
          ].map(([number, title, description]) => <article className="process-step" key={number} data-reveal><div className="step-top"><span>{number}</span><ArrowRight size={20} /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="contact section-wrap" id="contacto">
        <div className="contact-heading" data-reveal><p className="eyebrow"><span className="section-number">05 /</span> EL SIGUIENTE PASO</p><h2>Todo comienza<br />con una <em>idea.</em></h2><p>La tuya puede ser nuestro próximo gran proyecto.<br />Conversemos y empecemos a darle forma.</p><div className="contact-details"><a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><Phone size={18} /><span><small>HABLEMOS</small>{company.phone}</span><ArrowUpRight size={16} /></a><a href={`mailto:${company.email}`}><Mail size={18} /><span><small>ESCRÍBENOS</small>{company.email}</span><ArrowUpRight size={16} /></a><a href={company.maps} target="_blank" rel="noopener noreferrer"><MapPin size={18} /><span><small>ENCUÉNTRANOS EN DUITAMA</small>{company.address}<br />Boyacá, Colombia</span><ArrowUpRight size={16} /></a></div></div>
        <div className="contact-form-wrap"><ContactForm /></div>
      </section>
    </main>

    <footer className="footer"><div className="footer-top"><a href="#inicio" aria-label="Novara, volver al inicio"><Image src="/brand/logo-white.webp" width={248} height={65} alt="Novara Grupo Constructor" /></a><p>Visión para crear.<br />Solidez para construir.</p><a className="footer-up" href="#inicio" aria-label="Volver arriba"><ArrowUpRight size={24} /></a></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Novara Grupo Constructor.</p><span>DISEÑO · PLANIFICACIÓN · CONSTRUCCIÓN</span><p>Duitama, Boyacá — Colombia</p></div></footer>

    <a className="floating-contact" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Conversar con Novara por WhatsApp"><MessageCircle size={23} /><span>Hablemos</span></a>

    <dialog ref={dialogRef} className="concept-dialog" aria-label={selectedConcept?.title ?? "Concepto visual"} onClose={() => setSelectedConcept(null)} onClick={event => { if (event.target === event.currentTarget) closeConcept(); }}>
      {selectedConcept && <div className="dialog-inner"><button type="button" className="dialog-close" autoFocus onClick={closeConcept} aria-label="Cerrar concepto"><X size={22} /></button><div className="dialog-image"><Image src={selectedConcept.image} alt={selectedConcept.alt} fill sizes="(max-width: 700px) 100vw, 850px" /></div><div className="dialog-content"><p className="eyebrow">{selectedConcept.category} / INSPIRACIÓN</p><h2>{selectedConcept.title}</h2><p>{selectedConcept.description}</p><ul>{selectedConcept.details.map(detail => <li key={detail}>{detail}</li>)}</ul><p className="dialog-credit">{selectedConcept.credit}</p><a className="button button-clay" href={whatsappLink(`Hola, Novara. Me inspira el concepto «${selectedConcept.title}» y me gustaría conversar sobre mi proyecto.`)} target="_blank" rel="noopener noreferrer">Conversemos sobre tu idea <ArrowUpRight size={18} /></a></div></div>}
    </dialog>
  </>;
}
