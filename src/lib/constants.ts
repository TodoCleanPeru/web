// Configuración global del sitio - editable
export const SITE = {
  name: "Todo Clean Perú",
  tagline: "Servicios para tu hogar, tu familia y tu tranquilidad",
  whatsapp: "51999999999", // sin "+", incluir país. Editable.
  email: "contacto@todocleanperu.com",
  phone: "+51 999 999 999",
  address: "Lima, Perú",
};

export const waLink = (msg: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
