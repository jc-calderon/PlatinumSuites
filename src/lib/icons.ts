/**
 * Iconos SVG de Lucide (https://lucide.dev, licencia ISC).
 * Se insertan como SVG en el HTML durante el build: no añaden JavaScript al cliente.
 */
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Building2,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Globe,
  Images,
  Info,
  KeyRound,
  Landmark,
  ListChecks,
  LogOut,
  MapPin,
  Map as MapIcon,
  Maximize2,
  Menu,
  MessageCircle,
  Microwave,
  Mountain,
  Phone,
  Recycle,
  ShieldAlert,
  ShoppingCart,
  Siren,
  Sparkles,
  Star,
  TriangleAlert,
  Tv,
  Users,
  Utensils,
  Waves,
  Wifi,
  X,
  Lightbulb,
  CircleAlert,
  Croissant,
  Pill,
  Trees,
  Store,
  Footprints,
  LayoutGrid,
} from 'lucide-static';

export const icons = {
  'arrow-left': ArrowLeft,
  'arrow-up-right': ArrowUpRight,
  bed: BedDouble,
  building: Building2,
  car: Car,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  clock: Clock,
  copy: Copy,
  globe: Globe,
  images: Images,
  info: Info,
  key: KeyRound,
  landmark: Landmark,
  list: ListChecks,
  'log-out': LogOut,
  'map-pin': MapPin,
  map: MapIcon,
  maximize: Maximize2,
  menu: Menu,
  message: MessageCircle,
  microwave: Microwave,
  mountain: Mountain,
  phone: Phone,
  recycle: Recycle,
  shield: ShieldAlert,
  cart: ShoppingCart,
  siren: Siren,
  sparkles: Sparkles,
  star: Star,
  warning: TriangleAlert,
  tv: Tv,
  users: Users,
  utensils: Utensils,
  waves: Waves,
  wifi: Wifi,
  x: X,
  tip: Lightbulb,
  alert: CircleAlert,
  croissant: Croissant,
  pill: Pill,
  trees: Trees,
  store: Store,
  footprints: Footprints,
  grid: LayoutGrid,
} as const;

export type IconName = keyof typeof icons;

/** Devuelve el SVG listo para insertar, decorativo (aria-hidden) y del tamaño indicado. */
export function iconSvg(name: IconName, size = 20, className = 'icon'): string {
  return icons[name]
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\swidth="\d+"/, ` width="${size}"`)
    .replace(/\sheight="\d+"/, ` height="${size}"`)
    .replace(/class="[^"]*"/, `class="${className}" aria-hidden="true" focusable="false"`);
}

/** Icono de cada sección de la guía, por su {#id} estable. */
export const sectionIcons: Record<string, IconName> = {
  bienvenida: 'sparkles',
  suite: 'bed',
  llegada: 'key',
  estacionamiento: 'car',
  wifi: 'wifi',
  tv: 'tv',
  cocina: 'microwave',
  piscina: 'waves',
  reglas: 'list',
  basura: 'recycle',
  'antes-de-irse': 'log-out',
  alrededores: 'map-pin',
  contacto: 'message',
  airbnb: 'star',
};

/** Icono por categoría de lugar. */
export const categoryIcons: Record<string, IconName> = {
  supermarket: 'cart',
  pharmacy: 'pill',
  food: 'utensils',
  bakery: 'croissant',
  typical: 'utensils',
  landmark: 'landmark',
  nature: 'trees',
  museum: 'building',
  market: 'store',
  walk: 'footprints',
};
