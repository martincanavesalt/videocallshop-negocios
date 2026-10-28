/* =========================================================
   CONTENIDO DE LA LANDING — todo lo editable está acá
   =========================================================
   Las secciones de "Ya venden con VideoCallShop" y "Testimonios" se muestran
   SOLO cuando cargás contenido real en CLIENTES y TESTIMONIOS. Mientras estén
   vacías, no aparecen (nunca publicar testimonios o logos inventados).
   ========================================================= */

export const MARCA = {
  nombre: "VideoCallShop",
  dominio: "quierovendermas.com.ar",
  lema: "Comprá con alguien que te asesore.",
  web: "videocallshop.com",
  instagram: "VideoCallShop.ok",
  email: "videocallshoppping@gmail.com",
  whatsapp: "5493412668558", // solo dígitos, formato internacional sin "+"
  whatsappVisible: "341 266 8558",
  whatsappMensaje: "¡Hola! Quiero saber más de VideoCallShop para mi negocio.",
};

export const HERO = {
  etiqueta: "App de ventas por videollamada para comercios",
  titulo: "Vendé en vivo.",
  tituloAcento: "Vendé más.",
  bajada:
    "Con VideoCallShop atendés por videollamada como si el cliente estuviera en el mostrador: " +
    "le mostrás el producto, lo asesorás y cerrás la venta en el momento.",
  destacados: ["Cobrás en la llamada", "Envíos integrados", "Solo necesitás un celular"],
  // Foto del hero: reemplazá src/assets/hero.jpg por la foto real de un comerciante
  // en su local (vertical, idealmente 1200 × 1500 px). Texto alternativo:
  imagenAlt: "Comerciante mostrando un producto por videollamada desde su local",
};

// Logos de comercios que ya usan la app (con su permiso).
// Poné cada logo en public/clientes/ y agregalo así:
//   { nombre: "Indumentaria Sol", logo: "/clientes/indumentaria-sol.png" },
export const CLIENTES = [];

// Medios de pago y envío. Para mostrar el logo oficial, guardá el archivo en
// public/logos/ con el nombre indicado (SVG o PNG con fondo transparente).
// Si el archivo no está, se muestra el nombre en texto.
// Dejá solo los que realmente funcionan con la app.
export const INTEGRACIONES = [
  { nombre: "Mercado Pago", logo: "/logos/mercadopago.svg" },
  { nombre: "Tiendanube", logo: "/logos/tiendanube.svg" },
  { nombre: "Tarjetas de crédito y débito", logo: "/logos/tarjetas.svg" },
  { nombre: "Transferencia", logo: "/logos/transferencia.svg" },
  { nombre: "Andreani", logo: "/logos/andreani.svg" },
  { nombre: "Correo Argentino", logo: "/logos/correo-argentino.svg" },
  { nombre: "OCA", logo: "/logos/oca.svg" },
];

export const PASOS = [
  {
    titulo: "Tu cliente pide la videollamada",
    texto: "Desde tu Instagram, WhatsApp o el link de tu tienda, con un solo toque.",
  },
  {
    titulo: "Le mostrás el producto en vivo",
    texto: "Talles, colores, detalles. Lo asesorás como en el mostrador y respondés todo en el momento.",
  },
  {
    titulo: "Cobrás y coordinás el envío",
    texto: "Le mandás el pago en la llamada, elige el envío y la venta queda cerrada antes de cortar.",
  },
];

// Video de la app funcionando (30 a 60 s).
//  - Video propio: subilo a public/video/demo.mp4 y poné tipo "mp4", src "/video/demo.mp4".
//  - YouTube: tipo "youtube", src "https://www.youtube.com/embed/ID_DEL_VIDEO".
//  - Instagram (reel): tipo "instagram", src con la URL del reel.
export const VIDEO = {
  tipo: "instagram",
  src: "https://www.instagram.com/reel/DWriMTYjtqh/",
  titulo: "Así se ve una venta por videollamada con VideoCallShop",
};

export const BENEFICIOS = [
  {
    icono: "clock",
    titulo: "Vendé en los tiempos muertos",
    texto: "Cuando el local está tranquilo, atendés clientes que no pueden acercarse. Cada hora del mostrador rinde más.",
  },
  {
    icono: "person",
    titulo: "Atención personalizada",
    texto: "Asesorás cara a cara, como en el mostrador, estén donde estén tus clientes. Es tu diferencial.",
  },
  {
    icono: "card",
    titulo: "Cobro en la misma llamada",
    texto: "El cliente ve el producto, pregunta y paga sin cortar. La decisión se toma en vivo.",
  },
  {
    icono: "truck",
    titulo: "Envíos integrados",
    texto: "Coordinás la entrega en el momento de la compra o el cliente retira por el local.",
  },
];

// Testimonios reales (con permiso del comercio). Foto en public/testimonios/.
//   { nombre: "María López", local: "Indumentaria Sol", rubro: "Indumentaria",
//     foto: "/testimonios/maria.jpg", frase: "..." },
export const TESTIMONIOS = [];

// Planes: unifican "por tipo de negocio" y "por minutos". Precios en ARS por mes, por marca.
export const PLANES = [
  {
    id: "plan-60",
    nombre: "Plan 60",
    idealPara: "Emprendedores",
    descripcion: "Para empezar a vender por videollamada y validar el canal con tus clientes.",
    minutos: "60",
    unidad: "minutos por mes",
    precio: "200.000",
  },
  {
    id: "plan-120",
    nombre: "Plan 120",
    idealPara: "Locales",
    descripcion: "Para locales que ya venden en vivo y quieren atender más clientes cada mes.",
    minutos: "120",
    unidad: "minutos por mes",
    precio: "300.000",
    recomendado: true,
  },
  {
    id: "plan-ilimitado",
    nombre: "Plan Ilimitado",
    idealPara: "Marcas y cadenas",
    descripcion: "Para marcas con varias sucursales que hacen del vivo un canal de venta permanente.",
    minutos: "∞",
    unidad: "minutos ilimitados",
    precio: "500.000",
  },
];
export const PLAN_INCLUYE = [
  "Uso de la aplicación",
  "Vivos (Live Shopping)",
  "Personal Shopper",
  "Locales y usuarios ilimitados",
];
export const PLANES_LEGAL =
  "Precios en pesos argentinos, por mes y por marca. Consultá condiciones e impuestos antes de contratar.";

export const RUBROS = ["Indumentaria", "Calzado", "Hogar y deco", "Electro", "Cosmética", "Otro"];

// ⚠️ PERMANENCIA: completá la respuesta real antes de publicar (no inventar condiciones).
export const FAQS = [
  {
    q: "¿Cuánto cuesta?",
    a: "Hay tres planes por marca: $200.000 por mes (60 minutos), $300.000 (120 minutos) e Ilimitado a $500.000. El precio es el mismo sin importar cuántos locales o usuarios tengas. Precios en pesos argentinos; consultá impuestos.",
  },
  {
    q: "¿Hay permanencia mínima?",
    a: "Los planes son mensuales. En la demo te contamos las condiciones de contratación y de baja.",
  },
  {
    q: "¿Necesito equipamiento especial?",
    a: "No. Con un celular con buena cámara y conexión estable ya podés empezar. Te damos tips para que la imagen y el sonido se vean bien.",
  },
  {
    q: "¿Cómo me pagan los clientes?",
    a: "Durante la llamada le enviás el pago por el medio que prefiera. El cliente paga sin cortar y la venta queda cerrada en el momento.",
  },
  {
    q: "¿Y el envío?",
    a: "Lo coordinás en el mismo momento de la venta, o el cliente retira en el local.",
  },
  {
    q: "¿Cuánto tardo en empezar?",
    a: "Agendá la demo, te mostramos la app y te ayudamos a configurar tu cuenta para que hagas tu primera venta en vivo.",
  },
];
