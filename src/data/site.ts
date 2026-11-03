export const company = {
  name: "Novara Grupo Constructor",
  email: "gerencia@novaraconstructora.com",
  phone: "+57 312 818 8085",
  whatsapp: "573128188085",
  address: "CC Pasaje Solano · Local 1–15",
  city: "Duitama, Boyacá",
  maps: "https://www.google.com/maps/search/?api=1&query=CC+Pasaje+Solano+Duitama+Boyaca",
};

export const whatsappLink = (message = "Hola, Novara. Me gustaría conversar sobre un proyecto.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;

export const concepts = [
  {
    id: "habitar",
    category: "Residencial",
    title: "Habitar en armonía",
    subtitle: "Arquitectura que conecta con el entorno.",
    image: "/images/architecture-concept.webp",
    alt: "Visualización conceptual de una residencia en piedra y madera rodeada de vegetación",
    description: "Una exploración de la relación entre arquitectura y naturaleza: espacios abiertos, materiales cálidos y luz que acompaña cada momento del día. Un punto de partida para imaginar un hogar a tu medida.",
    details: ["Conexión interior y exterior", "Materiales con carácter", "Luz natural como protagonista"],
    credit: "Visualización conceptual generada con IA. No corresponde a una obra ejecutada por Novara.",
  },
  {
    id: "perspectiva",
    category: "Urbano",
    title: "Nuevas perspectivas",
    subtitle: "Una mirada a la ciudad del mañana.",
    image: "/images/architecture-perspective.webp",
    alt: "Fotografía de referencia arquitectónica de edificios vista desde abajo",
    description: "La escala, la estructura y el ritmo de las fachadas nos invitan a pensar cómo se transforma una ciudad. Una referencia visual para conversar sobre espacios que reúnen diseño y funcionalidad.",
    details: ["Lectura del contexto", "Estructura y proporción", "Visión de futuro"],
    credit: "Imagen de referencia incluida en el manual de identidad. No representa una obra acreditada a Novara.",
  },
  {
    id: "esencia",
    category: "Interiores",
    title: "La esencia del espacio",
    subtitle: "El bienestar está en los detalles.",
    image: "/images/interior-concept.webp",
    alt: "Visualización conceptual de un interior de doble altura con materiales naturales y vistas al jardín",
    description: "Texturas, proporciones y luz en equilibrio. Este concepto explora interiores serenos, con materiales naturales y una distribución pensada para disfrutar la vida cotidiana.",
    details: ["Texturas naturales", "Espacios para disfrutar", "Continuidad y amplitud"],
    credit: "Visualización conceptual generada con IA. No corresponde a una obra ejecutada por Novara.",
  },
  {
    id: "atardecer",
    category: "Residencial",
    title: "Cuando cae la tarde",
    subtitle: "La arquitectura también se vive de noche.",
    image: "/images/twilight-concept.webp",
    alt: "Concepto de residencia al anochecer con reflejos en una piscina y vistas a las montañas",
    description: "Un estudio de atmósferas: reflejos, luz cálida y espacios que se abren al paisaje. Una invitación a pensar cómo se transforma un hogar a lo largo del día.",
    details: ["Iluminación con intención", "Reflejos y paisaje", "Espacios para compartir"],
    credit: "Visualización conceptual generada con IA. No corresponde a una obra ejecutada por Novara.",
  },
  {
    id: "umbral",
    category: "Interiores",
    title: "Entre luz y materia",
    subtitle: "El silencio también tiene arquitectura.",
    image: "/images/courtyard-concept.webp",
    alt: "Concepto de patio de piedra natural con olivo y escalera flotante",
    description: "La luz recorre la piedra, una escalera flota junto al muro y un árbol conecta el espacio con el cielo. Una exploración del equilibrio entre naturaleza, proporción y materialidad.",
    details: ["Luz cenital", "Materiales naturales", "Un respiro interior"],
    credit: "Visualización conceptual generada con IA. No corresponde a una obra ejecutada por Novara.",
  },
  {
    id: "horizonte",
    category: "Urbano",
    title: "Un nuevo horizonte",
    subtitle: "Otra manera de encontrarse con la ciudad.",
    image: "/images/urban-concept.webp",
    alt: "Concepto de edificio residencial con terrazas verdes en un paisaje andino",
    description: "Terrazas que conectan con el paisaje y fachadas que encuentran su ritmo entre vegetación, piedra y madera. Un concepto para imaginar una vida urbana más cercana al entorno.",
    details: ["Terrazas ajardinadas", "Escala y proporción", "Conexión con el paisaje"],
    credit: "Visualización conceptual generada con IA. No corresponde a una obra ejecutada por Novara.",
  },
] as const;

export type Concept = (typeof concepts)[number];

export const services = [
  { number: "01", title: "Diseño", summary: "Le damos forma a tu visión.", description: "Partimos de tus ideas, del lugar y de tu forma de vivir para explorar espacios con identidad. Distribución, materialidad y luz se piensan como un conjunto.", tags: "Concepto · Arquitectura · Espacio" },
  { number: "02", title: "Planificación", summary: "Cada decisión, con una dirección.", description: "Organizamos las etapas y definimos el alcance de tu proyecto. Una ruta clara permite tomar decisiones informadas antes de empezar a construir.", tags: "Alcance · Etapas · Coordinación" },
  { number: "03", title: "Construcción", summary: "Hacemos tangible lo que imaginas.", description: "Llevamos el diseño al espacio construido, integrando el cuidado por los detalles y la solidez técnica en cada etapa del proceso.", tags: "Ejecución · Detalle · Acompañamiento" },
];
