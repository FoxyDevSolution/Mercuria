import LoginScreen from './screens/LoginScreen';
import { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Factory, ShoppingBag, ArchiveIcon,
  Menu, X, Plus, Search, ChevronRight, ArrowLeft, Trash2,
  TrendingUp, CheckCircle2, AlertCircle, Filter, Calendar
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Screen = "dashboard" | "materia-prima" | "produccion" | "ventas" | "inventario";

interface RawMaterial {
  id: string;
  nombre: string;
  tipo: string;
  color: string;
  tamaño: string;
  cantidad: number;
  descripcion: string;
  precio: number;
}

interface Estampa {
  id: string;
  nombre: string;
  diseño: string;
}

interface ProductionRecord {
  id: string;
  materiaId: string;
  estampaId: string;
  cantidad: number;
  costoTotal: number;
  fecha: string;
}

interface FinishedProduct {
  id: string;
  nombre: string;
  produccionId: string;
  cantidad: number;
  precio: number;
}

interface SaleRecord {
  id: string;
  productoId: string;
  cantidad: number;
  cliente: string;
  tipoVenta: "Online" | "Presencial";
  fecha: string;
  total: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_MATERIAS: RawMaterial[] = [
  { id: "MP-001", nombre: "Remera algodón blanca", tipo: "Remera", color: "Blanco", tamaño: "M", cantidad: 128, descripcion: "Algodón 100% peinado 180g", precio: 2800 },
  { id: "MP-002", nombre: "Remera algodón negra", tipo: "Remera", color: "Negro", tamaño: "L", cantidad: 74, descripcion: "Algodón 100% peinado 180g", precio: 2800 },
  { id: "MP-003", nombre: "Remera oversize gris", tipo: "Remera Oversize", color: "Gris", tamaño: "XL", cantidad: 43, descripcion: "Algodón 100% 200g corte oversize", precio: 3500 },
  { id: "MP-004", nombre: "Buzo canguro crema", tipo: "Buzo", color: "Crema", tamaño: "M", cantidad: 21, descripcion: "French terry 320g con bolsillo", precio: 6200 },
  { id: "MP-005", nombre: "Remera dry-fit azul", tipo: "Remera Sport", color: "Azul", tamaño: "S", cantidad: 56, descripcion: "Poliéster dry-fit 150g", precio: 2400 },
  { id: "MP-006", nombre: "Buzo canguro negro", tipo: "Buzo", color: "Negro", tamaño: "L", cantidad: 15, descripcion: "French terry 320g con bolsillo", precio: 6200 },
];

const MOCK_ESTAMPAS: Estampa[] = [
  { id: "EST-001", nombre: "Logo Clásico", diseño: "Serigrafía" },
  { id: "EST-002", nombre: "Paisaje Griego", diseño: "DTF" },
  { id: "EST-003", nombre: "Tipografía Bold", diseño: "Sublimación" },
];

const MOCK_PRODUCTOS: FinishedProduct[] = [
  { id: "PT-001", nombre: "Remera blanca c/ logo", produccionId: "PR-001", cantidad: 40, precio: 8500 },
  { id: "PT-002", nombre: "Remera negra paisaje", produccionId: "PR-002", cantidad: 28, precio: 9200 },
  { id: "PT-003", nombre: "Buzo canguro clásico", produccionId: "PR-003", cantidad: 12, precio: 14500 },
  { id: "PT-004", nombre: "Remera oversize bold", produccionId: "PR-004", cantidad: 18, precio: 10800 },
];

const MOCK_VENTAS: SaleRecord[] = [
  { id: "V-001", productoId: "PT-001", cantidad: 5, cliente: "Valentina Torres", tipoVenta: "Online", fecha: "2025-07-01", total: 42500 },
  { id: "V-002", productoId: "PT-002", cantidad: 3, cliente: "Marco Ferreyra", tipoVenta: "Presencial", fecha: "2025-07-02", total: 27600 },
  { id: "V-003", productoId: "PT-003", cantidad: 2, cliente: "Lucía Mendez", tipoVenta: "Online", fecha: "2025-07-04", total: 29000 },
  { id: "V-004", productoId: "PT-001", cantidad: 8, cliente: "Rodrigo Sáenz", tipoVenta: "Presencial", fecha: "2025-07-05", total: 68000 },
  { id: "V-005", productoId: "PT-004", cantidad: 4, cliente: "Camila Ríos", tipoVenta: "Online", fecha: "2025-07-06", total: 43200 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

function Btn({ variant = "primary", size = "md", fullWidth = false, children, className = "", ...rest }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-display tracking-widest transition-all duration-200 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-light-brown focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-dark-brown text-off-white border-dark-brown hover:bg-medium-brown",
    secondary: "bg-transparent text-dark-brown border-dark-brown hover:bg-beige-brown",
    ghost: "bg-transparent text-medium-brown border-transparent hover:bg-beige-brown/60",
    danger: "bg-transparent text-red-700 border-red-300 hover:bg-red-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-[11px]",
    lg: "px-6 py-3.5 text-[11px]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-body text-[11px] uppercase tracking-widest text-medium-brown">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full border border-beige-brown bg-off-white/60 px-3 py-2.5 font-body text-sm text-dark-brown placeholder-light-brown/70 focus:border-medium-brown focus:outline-none focus:ring-1 focus:ring-medium-brown transition-colors ${className}`}
      {...rest}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

function Select({ className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`w-full border border-beige-brown bg-off-white/60 px-3 py-2.5 font-body text-sm text-dark-brown focus:border-medium-brown focus:outline-none focus:ring-1 focus:ring-medium-brown transition-colors ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea({ className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      rows={3}
      className={`w-full border border-beige-brown bg-off-white/60 px-3 py-2.5 font-body text-sm text-dark-brown placeholder-light-brown/70 focus:border-medium-brown focus:outline-none focus:ring-1 focus:ring-medium-brown transition-colors resize-none ${className}`}
      {...rest}
    />
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "online" | "presencial";
}

function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    default: "bg-beige-brown/40 text-medium-brown",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    online: "bg-sky-100 text-sky-800",
    presencial: "bg-violet-100 text-violet-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-display tracking-wider uppercase ${styles[variant]}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS RING
// ─────────────────────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 80, label }: { pct: number; size?: number; label: string }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ display: "block" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#cfb798"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#3a2c19"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm font-bold text-dark-brown">{pct}%</span>
        </div>
      </div>
      <span className="font-body text-[11px] text-medium-brown text-center">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GREEK ORNAMENT
// ─────────────────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-beige-brown/60" />
      <span className="text-beige-brown text-xs">✦</span>
      <div className="flex-1 h-px bg-beige-brown/60" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMenu?: () => void;
  dark?: boolean;
}

function ScreenHeader({ title, subtitle, onBack, onMenu, dark = false }: ScreenHeaderProps) {
  return (
    <div className={`px-5 pt-5 pb-4 ${dark ? "bg-dark-brown" : "bg-dark-brown"}`}>
      <div className="flex items-center gap-3 mb-3">
        {onBack && (
          <button onClick={onBack} className="text-off-white/70 hover:text-off-white transition-colors p-1 -ml-1">
            <ArrowLeft size={18} />
          </button>
        )}
        {onMenu && (
          <button onClick={onMenu} className="text-off-white/70 hover:text-off-white transition-colors">
            <Menu size={20} />
          </button>
        )}
        <div className="flex-1">
          {subtitle && (
            <p className="font-body text-[10px] uppercase tracking-widest text-light-brown mb-0.5">{subtitle}</p>
          )}
          <h1 className="font-display text-lg font-bold text-off-white">{title}</h1>
        </div>
        <span className="font-display text-[10px] tracking-[0.2em] text-light-brown/60">MERCURIA</span>
      </div>
      <Divider />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — DASHBOARD PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const totalStock = MOCK_MATERIAS.reduce((s, m) => s + m.cantidad, 0);
  const totalVentas = MOCK_VENTAS.reduce((s, v) => s + v.total, 0);

  const stats = [
    {
      label: "Producción",
      sub: "Materia prima y control de estampas",
      pct: 50,
      icon: Factory,
      screen: "produccion" as Screen,
    },
    {
      label: "Ventas",
      sub: "Artículos para la venta, registros y ganancias",
      pct: 75,
      icon: ShoppingBag,
      screen: "ventas" as Screen,
    },
    {
      label: "Inventario",
      sub: "Control de stock y estadísticas",
      pct: 30,
      icon: ArchiveIcon,
      screen: "inventario" as Screen,
    },
  ];

  const quickNav = [
    { label: "Producción", sub: "Materia prima · Estampas", icon: Factory, screen: "produccion" as Screen },
    { label: "Ventas", sub: "Registro · Catálogo · Historial", icon: ShoppingBag, screen: "ventas" as Screen },
    { label: "Inventario", sub: "Stock unificado · Filtros", icon: ArchiveIcon, screen: "inventario" as Screen },
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="¡Bienvenido de vuelta, Marco!" subtitle="Dashboard" />

      <div className="flex-1 overflow-y-auto bg-beige-brown/30">
        {/* Summary strip */}
        <div className="bg-beige-brown/50 px-5 py-4 flex justify-between border-b border-beige-brown/60">
          {[
            { val: `${totalStock}`, lbl: "Unidades en stock" },
            { val: `$${(totalVentas / 1000).toFixed(0)}k`, lbl: "Ingresos del mes" },
            { val: `${MOCK_VENTAS.length}`, lbl: "Ventas registradas" },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="text-center">
              <p className="font-display text-xl font-bold text-dark-brown">{val}</p>
              <p className="font-body text-[10px] text-medium-brown mt-0.5 leading-tight max-w-[70px]">{lbl}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Stat cards */}
          <p className="font-body text-[10px] uppercase tracking-widest text-light-brown mb-3">Resumen del negocio</p>
          <div className="space-y-3">
            {stats.map(({ label, sub, pct, icon: Icon, screen }) => (
              <button
                key={label}
                onClick={() => onNavigate(screen)}
                className="w-full bg-off-white border border-beige-brown/60 p-4 flex items-center gap-4 text-left hover:border-light-brown hover:shadow-sm transition-all duration-200 group"
              >
                <ProgressRing pct={pct} size={70} label="" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-bold text-dark-brown group-hover:text-medium-brown transition-colors">{label}</p>
                  <p className="font-body text-xs text-light-brown mt-1 leading-snug">{sub}</p>
                  <div className="mt-2 h-1.5 bg-beige-brown/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dark-brown transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={16} className="text-light-brown shrink-0" />
              </button>
            ))}
          </div>

          <Divider />

          {/* Quick nav */}
          <p className="font-body text-[10px] uppercase tracking-widest text-light-brown mb-3">Acceso rápido</p>
          <div className="grid grid-cols-1 gap-3">
            {quickNav.map(({ label, sub, icon: Icon, screen }) => (
              <button
                key={label}
                onClick={() => onNavigate(screen)}
                className="bg-dark-brown text-off-white px-5 py-4 flex items-center gap-4 text-left hover:bg-medium-brown transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-off-white/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-off-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-bold tracking-wide">{label}</p>
                  <p className="font-body text-[11px] text-off-white/60 mt-0.5">{sub}</p>
                </div>
                <ChevronRight size={15} className="text-off-white/40 group-hover:text-off-white/70 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — GESTIÓN DE MATERIA PRIMA
// ─────────────────────────────────────────────────────────────────────────────

type MateriaPrimaTab = "form" | "listado";

interface MateriaPrimaProps {
  materias: RawMaterial[];
  onAdd: (m: RawMaterial) => void;
  onDelete: (id: string) => void;
}

const TIPOS = ["Remera", "Remera Oversize", "Remera Sport", "Buzo", "Campera", "Calza"];
const COLORES = ["Blanco", "Negro", "Gris", "Azul", "Rojo", "Verde", "Crema", "Beige"];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

function MateriaPrima({ materias, onAdd, onDelete }: MateriaPrimaProps) {
  const [tab, setTab] = useState<MateriaPrimaTab>("form");
  const [form, setForm] = useState({
    nombre: "", tipo: TIPOS[0], color: COLORES[0], tamaño: TALLAS[2],
    cantidad: "", descripcion: "", precio: "",
  });
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!form.nombre || !form.cantidad) return;
    const newM: RawMaterial = {
      id: `MP-${String(materias.length + 1).padStart(3, "0")}`,
      nombre: form.nombre,
      tipo: form.tipo,
      color: form.color,
      tamaño: form.tamaño,
      cantidad: Number(form.cantidad),
      descripcion: form.descripcion,
      precio: Number(form.precio) || 0,
    };
    onAdd(newM);
    setAdded(true);
    setForm({ nombre: "", tipo: TIPOS[0], color: COLORES[0], tamaño: TALLAS[2], cantidad: "", descripcion: "", precio: "" });
    setTimeout(() => setAdded(false), 2000);
  }

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Materia Prima" subtitle="Producción" />

      {/* Tabs */}
      <div className="flex border-b border-beige-brown bg-off-white">
        {(["form", "listado"] as MateriaPrimaTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 font-display text-[10px] tracking-widest uppercase transition-colors ${
              tab === t
                ? "bg-dark-brown text-off-white"
                : "text-medium-brown hover:bg-beige-brown/40"
            }`}
          >
            {t === "form" ? "Agregar" : "Listado"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-off-white/40">
        {tab === "form" ? (
          <div className="p-5 space-y-4">
            <Field label="Nombre del producto">
              <Input value={form.nombre} onChange={e => update("nombre", e.target.value)} placeholder="Ej: Remera algodón blanca" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={form.tipo} onChange={e => update("tipo", e.target.value)}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Color">
                <Select value={form.color} onChange={e => update("color", e.target.value)}>
                  {COLORES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Talle">
                <Select value={form.tamaño} onChange={e => update("tamaño", e.target.value)}>
                  {TALLAS.map(t => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Cantidad">
                <Input type="number" min="0" value={form.cantidad} onChange={e => update("cantidad", e.target.value)} placeholder="0" />
              </Field>
            </div>

            <Field label="Precio unitario ($)">
              <Input type="number" min="0" step="100" value={form.precio} onChange={e => update("precio", e.target.value)} placeholder="0.00" />
            </Field>

            <Field label="Descripción">
              <Textarea value={form.descripcion} onChange={e => update("descripcion", e.target.value)} placeholder="Material, gramaje, características..." />
            </Field>

            <Divider />

            <div className="flex flex-col gap-3 pt-1">
              <Btn fullWidth size="lg" variant="primary" onClick={handleAdd}>
                {added ? <><CheckCircle2 size={14} /> Agregado al stock</> : <><Plus size={14} /> Agregar al stock</>}
              </Btn>
              <Btn fullWidth size="lg" variant="secondary" onClick={() => setTab("listado")}>
                Consultar stock
              </Btn>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <p className="font-body text-[11px] uppercase tracking-widest text-light-brown mb-4">
              {materias.length} productos registrados
            </p>
            <div className="border border-beige-brown overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_0.7fr_0.4fr] bg-dark-brown px-3 py-2.5">
                {["Código", "Producto", "Cant.", ""].map(h => (
                  <span key={h} className="font-display text-[9px] tracking-widest uppercase text-off-white/70">{h}</span>
                ))}
              </div>
              {materias.map((m, i) => (
                <div
                  key={m.id}
                  className={`grid grid-cols-[1fr_2fr_0.7fr_0.4fr] px-3 py-3 items-center border-b border-beige-brown/40 ${
                    i % 2 === 0 ? "bg-off-white" : "bg-off-white/50"
                  } hover:bg-beige-brown/30 transition-colors`}
                >
                  <span className="font-body text-[11px] text-light-brown italic">{m.id}</span>
                  <div>
                    <p className="font-body text-xs text-dark-brown leading-snug">{m.nombre}</p>
                    <p className="font-body text-[10px] text-light-brown">{m.tipo} · {m.color} · {m.tamaño}</p>
                  </div>
                  <span className={`font-display text-sm font-bold ${m.cantidad < 25 ? "text-amber-700" : "text-dark-brown"}`}>
                    {m.cantidad}
                  </span>
                  <button
                    onClick={() => onDelete(m.id)}
                    className="text-beige-brown hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <Btn fullWidth size="lg" variant="primary" onClick={() => setTab("form")}>
                <Plus size={13} /> Agregar materia prima
              </Btn>
              <Btn fullWidth size="lg" variant="secondary">
                Exportar listado
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — REGISTRO DE PRODUCCIÓN
// ─────────────────────────────────────────────────────────────────────────────

interface ProduccionProps {
  materias: RawMaterial[];
  estampas: Estampa[];
  records: ProductionRecord[];
  onAdd: (r: ProductionRecord) => void;
}

function Produccion({ materias, estampas, records, onAdd }: ProduccionProps) {
  const [form, setForm] = useState({
    materiaId: materias[0]?.id ?? "",
    estampaId: estampas[0]?.id ?? "",
    cantidad: "",
    costoTotal: "",
  });
  const [registered, setRegistered] = useState(false);

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleRegister() {
    if (!form.cantidad) return;
    onAdd({
      id: `PR-${String(records.length + 1).padStart(3, "0")}`,
      materiaId: form.materiaId,
      estampaId: form.estampaId,
      cantidad: Number(form.cantidad),
      costoTotal: Number(form.costoTotal) || 0,
      fecha: new Date().toISOString().split("T")[0],
    });
    setRegistered(true);
    setForm({ materiaId: materias[0]?.id ?? "", estampaId: estampas[0]?.id ?? "", cantidad: "", costoTotal: "" });
    setTimeout(() => setRegistered(false), 2000);
  }

  const selectedMateria = materias.find(m => m.id === form.materiaId);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Registro de Producción" subtitle="Producción" />

      <div className="flex-1 overflow-y-auto bg-off-white/40 p-5 space-y-4">
        {/* Info preview */}
        {selectedMateria && (
          <div className="bg-beige-brown/30 border border-beige-brown/60 px-4 py-3 flex items-start gap-3">
            <Package size={16} className="text-medium-brown mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-xs text-medium-brown font-semibold">{selectedMateria.nombre}</p>
              <p className="font-body text-[11px] text-light-brown">Stock disponible: <strong>{selectedMateria.cantidad}</strong> unidades</p>
            </div>
          </div>
        )}

        <Field label="Materia prima">
          <Select value={form.materiaId} onChange={e => update("materiaId", e.target.value)}>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.cantidad} u.)</option>
            ))}
          </Select>
        </Field>

        <Field label="Estampa / Diseño">
          <Select value={form.estampaId} onChange={e => update("estampaId", e.target.value)}>
            {estampas.map(e => (
              <option key={e.id} value={e.id}>{e.nombre} — {e.diseño}</option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cantidad a producir">
            <Input
              type="number"
              min="1"
              value={form.cantidad}
              onChange={e => update("cantidad", e.target.value)}
              placeholder="0"
            />
          </Field>
          <Field label="Costo total del lote ($)">
            <Input
              type="number"
              min="0"
              step="100"
              value={form.costoTotal}
              onChange={e => update("costoTotal", e.target.value)}
              placeholder="0.00"
            />
          </Field>
        </div>

        <Divider />

        <Btn fullWidth size="lg" variant="primary" onClick={handleRegister}>
          {registered
            ? <><CheckCircle2 size={14} /> Producción registrada</>
            : <><Factory size={14} /> Registrar producción</>}
        </Btn>

        {/* Recent records */}
        {records.length > 0 && (
          <div className="mt-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-light-brown mb-3">Últimos registros</p>
            <div className="space-y-2">
              {[...records].reverse().slice(0, 5).map(r => {
                const mat = materias.find(m => m.id === r.materiaId);
                const est = estampas.find(e => e.id === r.estampaId);
                return (
                  <div key={r.id} className="bg-off-white border border-beige-brown/50 px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-body text-xs text-dark-brown">{mat?.nombre ?? r.materiaId}</p>
                      <p className="font-body text-[10px] text-light-brown">{est?.nombre} · {r.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-bold text-dark-brown">{r.cantidad} u.</p>
                      {r.costoTotal > 0 && <p className="font-body text-[10px] text-light-brown">${r.costoTotal.toLocaleString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — GESTIÓN DE VENTAS
// ─────────────────────────────────────────────────────────────────────────────

type VentasTab = "catalogo" | "registrar" | "historial";

interface VentasProps {
  productos: FinishedProduct[];
  ventas: SaleRecord[];
  onVenta: (v: SaleRecord) => void;
}

function Ventas({ productos, ventas, onVenta }: VentasProps) {
  const [tab, setTab] = useState<VentasTab>("catalogo");
  const [selectedProducto, setSelectedProducto] = useState<string | null>(null);
  const [form, setForm] = useState({
    productoId: productos[0]?.id ?? "",
    cantidad: "",
    cliente: "",
    tipoVenta: "Presencial" as "Online" | "Presencial",
  });
  const [registered, setRegistered] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleVenta() {
    if (!form.cantidad || !form.cliente) return;
    const prod = productos.find(p => p.id === form.productoId);
    onVenta({
      id: `V-${String(ventas.length + 1).padStart(3, "0")}`,
      productoId: form.productoId,
      cantidad: Number(form.cantidad),
      cliente: form.cliente,
      tipoVenta: form.tipoVenta,
      fecha: new Date().toISOString().split("T")[0],
      total: (prod?.precio ?? 0) * Number(form.cantidad),
    });
    setRegistered(true);
    setForm({ productoId: productos[0]?.id ?? "", cantidad: "", cliente: "", tipoVenta: "Presencial" });
    setTimeout(() => { setRegistered(false); setTab("historial"); }, 1500);
  }

  const filteredVentas = useMemo(() =>
    ventas.filter(v => !dateFilter || v.fecha.startsWith(dateFilter)),
    [ventas, dateFilter]
  );

  const totalFiltrado = filteredVentas.reduce((s, v) => s + v.total, 0);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Ventas" subtitle="Gestión comercial" />

      {/* Tabs */}
      <div className="flex border-b border-beige-brown bg-off-white">
        {(["catalogo", "registrar", "historial"] as VentasTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 font-display text-[9px] tracking-widest uppercase transition-colors ${
              tab === t ? "bg-dark-brown text-off-white" : "text-medium-brown hover:bg-beige-brown/40"
            }`}
          >
            {t === "catalogo" ? "Catálogo" : t === "registrar" ? "Registrar" : "Historial"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-off-white/40">
        {/* ── Catálogo ── */}
        {tab === "catalogo" && (
          <div className="p-5 space-y-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-light-brown">Productos disponibles</p>
            {productos.map(p => (
              <div
                key={p.id}
                className={`bg-off-white border p-4 transition-all ${
                  selectedProducto === p.id ? "border-dark-brown shadow-sm" : "border-beige-brown/60 hover:border-light-brown"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-[10px] text-light-brown italic">{p.id}</span>
                      <Badge variant={p.cantidad > 20 ? "success" : "warning"}>
                        {p.cantidad > 20 ? "Disponible" : "Stock bajo"}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-dark-brown font-semibold">{p.nombre}</p>
                    <p className="font-body text-xs text-light-brown mt-0.5">{p.cantidad} unidades · ${p.precio.toLocaleString()} c/u</p>
                  </div>
                  <Btn
                    size="sm"
                    variant={selectedProducto === p.id ? "primary" : "secondary"}
                    onClick={() => {
                      setSelectedProducto(p.id);
                      setForm(f => ({ ...f, productoId: p.id }));
                      setTab("registrar");
                    }}
                  >
                    Vender
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Registrar venta ── */}
        {tab === "registrar" && (
          <div className="p-5 space-y-4">
            <Field label="Producto">
              <Select value={form.productoId} onChange={e => update("productoId", e.target.value)}>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} — ${p.precio.toLocaleString()}</option>
                ))}
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Cantidad">
                <Input type="number" min="1" value={form.cantidad} onChange={e => update("cantidad", e.target.value)} placeholder="0" />
              </Field>
              <Field label="Tipo de venta">
                <Select value={form.tipoVenta} onChange={e => update("tipoVenta", e.target.value as "Online" | "Presencial")}>
                  <option>Presencial</option>
                  <option>Online</option>
                </Select>
              </Field>
            </div>

            <Field label="Cliente">
              <Input value={form.cliente} onChange={e => update("cliente", e.target.value)} placeholder="Nombre del cliente" />
            </Field>

            {/* Preview total */}
            {form.cantidad && form.productoId && (
              <div className="bg-beige-brown/30 border border-beige-brown px-4 py-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs text-medium-brown">Total estimado</span>
                  <span className="font-display text-lg font-bold text-dark-brown">
                    ${((productos.find(p => p.id === form.productoId)?.precio ?? 0) * Number(form.cantidad)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Divider />

            <Btn fullWidth size="lg" variant="primary" onClick={handleVenta}>
              {registered
                ? <><CheckCircle2 size={14} /> Venta registrada</>
                : <><TrendingUp size={14} /> Registrar venta</>}
            </Btn>
          </div>
        )}

        {/* ── Historial ── */}
        {tab === "historial" && (
          <div className="p-5">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-brown" />
                <Input
                  type="month"
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
              {dateFilter && (
                <Btn size="sm" variant="ghost" onClick={() => setDateFilter("")}>
                  <X size={12} /> Limpiar
                </Btn>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-off-white border border-beige-brown/60 px-3 py-2.5 text-center">
                <p className="font-display text-base font-bold text-dark-brown">{filteredVentas.length}</p>
                <p className="font-body text-[10px] text-light-brown">Transacciones</p>
              </div>
              <div className="flex-1 bg-off-white border border-beige-brown/60 px-3 py-2.5 text-center">
                <p className="font-display text-base font-bold text-dark-brown">${totalFiltrado.toLocaleString()}</p>
                <p className="font-body text-[10px] text-light-brown">Total facturado</p>
              </div>
            </div>

            {/* Table */}
            <div className="border border-beige-brown overflow-hidden">
              <div className="grid grid-cols-[0.7fr_1.5fr_0.6fr_0.9fr] bg-dark-brown px-3 py-2.5">
                {["Fecha", "Producto", "Cant.", "Total"].map(h => (
                  <span key={h} className="font-display text-[9px] tracking-widest uppercase text-off-white/70">{h}</span>
                ))}
              </div>
              {filteredVentas.length === 0 ? (
                <div className="py-8 text-center bg-off-white">
                  <p className="font-body text-xs text-light-brown">No hay ventas en el período seleccionado</p>
                </div>
              ) : (
                [...filteredVentas].reverse().map((v, i) => {
                  const prod = productos.find(p => p.id === v.productoId);
                  return (
                    <div
                      key={v.id}
                      className={`grid grid-cols-[0.7fr_1.5fr_0.6fr_0.9fr] px-3 py-3 border-b border-beige-brown/30 items-center ${
                        i % 2 === 0 ? "bg-off-white" : "bg-off-white/50"
                      }`}
                    >
                      <span className="font-body text-[10px] text-light-brown">{v.fecha.slice(5)}</span>
                      <div>
                        <p className="font-body text-[11px] text-dark-brown leading-snug">{prod?.nombre ?? v.productoId}</p>
                        <Badge variant={v.tipoVenta === "Online" ? "online" : "presencial"}>{v.tipoVenta}</Badge>
                      </div>
                      <span className="font-display text-xs font-bold text-dark-brown">{v.cantidad}</span>
                      <span className="font-display text-xs font-bold text-dark-brown">${v.total.toLocaleString()}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — INVENTARIO UNIFICADO
// ─────────────────────────────────────────────────────────────────────────────

interface InventarioProps {
  materias: RawMaterial[];
  productos: FinishedProduct[];
}

function Inventario({ materias, productos }: InventarioProps) {
  const [query, setQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "materia" | "terminado">("todos");

  const allItems = useMemo(() => [
    ...materias.map(m => ({ id: m.id, nombre: m.nombre, categoria: "Materia Prima", tipo: m.tipo, cantidad: m.cantidad, precio: m.precio, alerta: m.cantidad < 25 })),
    ...productos.map(p => ({ id: p.id, nombre: p.nombre, categoria: "Producto Terminado", tipo: "Terminado", cantidad: p.cantidad, precio: p.precio, alerta: p.cantidad < 15 })),
  ], [materias, productos]);

  const filtered = useMemo(() => allItems.filter(item => {
    const matchQuery = !query || item.nombre.toLowerCase().includes(query.toLowerCase()) || item.id.toLowerCase().includes(query.toLowerCase());
    const matchTipo = tipoFiltro === "todos" || (tipoFiltro === "materia" && item.categoria === "Materia Prima") || (tipoFiltro === "terminado" && item.categoria === "Producto Terminado");
    return matchQuery && matchTipo;
  }), [allItems, query, tipoFiltro]);

  const totalMateria = materias.reduce((s, m) => s + m.cantidad, 0);
  const totalTerminado = productos.reduce((s, p) => s + p.cantidad, 0);
  const alertas = allItems.filter(i => i.alerta).length;

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Inventario" subtitle="Vista unificada" />

      <div className="flex-1 overflow-y-auto bg-off-white/40">
        {/* Summary cards */}
        <div className="grid grid-cols-3 border-b border-beige-brown/40">
          <div className="py-4 px-4 bg-beige-brown/40 text-center border-r border-beige-brown/40">
            <p className="font-display text-xl font-bold text-dark-brown">{totalMateria}</p>
            <p className="font-body text-[10px] text-medium-brown mt-0.5">Materia prima</p>
          </div>
          <div className="py-4 px-4 bg-beige-brown/20 text-center border-r border-beige-brown/40">
            <p className="font-display text-xl font-bold text-dark-brown">{totalTerminado}</p>
            <p className="font-body text-[10px] text-medium-brown mt-0.5">Terminados</p>
          </div>
          <div className={`py-4 px-4 text-center ${alertas > 0 ? "bg-amber-50" : "bg-off-white"}`}>
            <p className={`font-display text-xl font-bold ${alertas > 0 ? "text-amber-700" : "text-dark-brown"}`}>{alertas}</p>
            <p className="font-body text-[10px] text-medium-brown mt-0.5">Alertas</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-brown" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar por código o nombre..."
                className="pl-9 text-xs"
              />
            </div>
            <Select
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value as typeof tipoFiltro)}
              className="w-32 text-xs"
            >
              <option value="todos">Todos</option>
              <option value="materia">Materia Prima</option>
              <option value="terminado">Terminados</option>
            </Select>
          </div>

          {/* Section: Materia Prima */}
          {(tipoFiltro === "todos" || tipoFiltro === "materia") && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package size={14} className="text-medium-brown" />
                <p className="font-display text-xs tracking-widest uppercase text-medium-brown">Stock Materia Prima</p>
              </div>
              <div className="border border-beige-brown overflow-hidden">
                <div className="grid grid-cols-[0.8fr_2fr_0.6fr_0.9fr] bg-dark-brown px-3 py-2">
                  {["Código", "Producto", "Cant.", "Valor"].map(h => (
                    <span key={h} className="font-display text-[9px] tracking-widest uppercase text-off-white/70">{h}</span>
                  ))}
                </div>
                {filtered.filter(i => i.categoria === "Materia Prima").map((item, i) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[0.8fr_2fr_0.6fr_0.9fr] px-3 py-3 border-b border-beige-brown/30 items-center ${
                      i % 2 === 0 ? "bg-off-white" : "bg-off-white/50"
                    } ${item.alerta ? "border-l-2 border-l-amber-400" : ""}`}
                  >
                    <span className="font-body text-[10px] text-light-brown italic">{item.id}</span>
                    <div>
                      <p className="font-body text-[11px] text-dark-brown leading-snug">{item.nombre}</p>
                      <p className="font-body text-[10px] text-light-brown">{item.tipo}</p>
                    </div>
                    <span className={`font-display text-sm font-bold ${item.alerta ? "text-amber-700" : "text-dark-brown"}`}>
                      {item.cantidad}
                      {item.alerta && <AlertCircle size={10} className="inline ml-1 text-amber-500" />}
                    </span>
                    <span className="font-body text-[11px] text-medium-brown">${(item.precio * item.cantidad / 1000).toFixed(1)}k</span>
                  </div>
                ))}
                {filtered.filter(i => i.categoria === "Materia Prima").length === 0 && (
                  <div className="py-6 text-center bg-off-white">
                    <p className="font-body text-xs text-light-brown">Sin resultados</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Productos Terminados */}
          {(tipoFiltro === "todos" || tipoFiltro === "terminado") && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-medium-brown" />
                <p className="font-display text-xs tracking-widest uppercase text-medium-brown">Stock Productos Terminados</p>
              </div>
              <div className="border border-beige-brown overflow-hidden">
                <div className="grid grid-cols-[0.8fr_2fr_0.6fr_0.9fr] bg-medium-brown px-3 py-2">
                  {["Código", "Producto", "Cant.", "Valor"].map(h => (
                    <span key={h} className="font-display text-[9px] tracking-widest uppercase text-off-white/70">{h}</span>
                  ))}
                </div>
                {filtered.filter(i => i.categoria === "Producto Terminado").map((item, i) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[0.8fr_2fr_0.6fr_0.9fr] px-3 py-3 border-b border-beige-brown/30 items-center ${
                      i % 2 === 0 ? "bg-off-white" : "bg-off-white/50"
                    } ${item.alerta ? "border-l-2 border-l-amber-400" : ""}`}
                  >
                    <span className="font-body text-[10px] text-light-brown italic">{item.id}</span>
                    <p className="font-body text-[11px] text-dark-brown">{item.nombre}</p>
                    <span className={`font-display text-sm font-bold ${item.alerta ? "text-amber-700" : "text-dark-brown"}`}>
                      {item.cantidad}
                      {item.alerta && <AlertCircle size={10} className="inline ml-1 text-amber-500" />}
                    </span>
                    <span className="font-body text-[11px] text-medium-brown">${(item.precio * item.cantidad / 1000).toFixed(1)}k</span>
                  </div>
                ))}
                {filtered.filter(i => i.categoria === "Producto Terminado").length === 0 && (
                  <div className="py-6 text-center bg-off-white">
                    <p className="font-body text-xs text-light-brown">Sin resultados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  screen: Screen;
  label: string;
  icon: React.ElementType;
  group?: Screen; // for highlighting parent tabs
}

const NAV_ITEMS: NavItem[] = [
  { screen: "dashboard", label: "Inicio", icon: LayoutDashboard },
  { screen: "materia-prima", label: "Producción", icon: Factory, group: "materia-prima" },
  { screen: "ventas", label: "Ventas", icon: ShoppingBag },
  { screen: "inventario", label: "Inventario", icon: ArchiveIcon },
];

interface BottomNavProps {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

function BottomNav({ active, onNavigate }: BottomNavProps) {
  const isActive = (item: NavItem) => active === item.screen || active === item.group;

  return (
    <nav className="border-t border-beige-brown/60 bg-dark-brown flex">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active_ = isActive(item);
        return (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 transition-colors ${
              active_ ? "text-off-white" : "text-off-white/35 hover:text-off-white/60"
            }`}
          >
            <Icon size={18} strokeWidth={active_ ? 2 : 1.5} />
            <span className={`font-body text-[9px] tracking-wider ${active_ ? "text-off-white" : "text-off-white/35"}`}>
              {item.label}
            </span>
            {active_ && <div className="w-4 h-0.5 bg-light-brown" />}
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCCIÓN HUB (sub-navigation for produccion module)
// ─────────────────────────────────────────────────────────────────────────────

type ProduccionSub = "hub" | "materia-prima" | "produccion";

interface ProduccionHubProps {
  materias: RawMaterial[];
  estampas: Estampa[];
  records: ProductionRecord[];
  onAddMateria: (m: RawMaterial) => void;
  onDeleteMateria: (id: string) => void;
  onAddRecord: (r: ProductionRecord) => void;
}

function ProduccionHub({ materias, estampas, records, onAddMateria, onDeleteMateria, onAddRecord }: ProduccionHubProps) {
  const [sub, setSub] = useState<ProduccionSub>("hub");

  if (sub === "materia-prima") {
    return (
      <div className="flex flex-col h-full">
        <MateriaPrima materias={materias} onAdd={onAddMateria} onDelete={onDeleteMateria} />
        <div className="border-t border-beige-brown/40 bg-off-white px-4 py-2">
          <Btn size="sm" variant="ghost" onClick={() => setSub("hub")}>
            <ArrowLeft size={12} /> Volver a Producción
          </Btn>
        </div>
      </div>
    );
  }

  if (sub === "produccion") {
    return (
      <div className="flex flex-col h-full">
        <Produccion materias={materias} estampas={estampas} records={records} onAdd={onAddRecord} />
        <div className="border-t border-beige-brown/40 bg-off-white px-4 py-2">
          <Btn size="sm" variant="ghost" onClick={() => setSub("hub")}>
            <ArrowLeft size={12} /> Volver a Producción
          </Btn>
        </div>
      </div>
    );
  }

  // Hub
  const cards = [
    {
      id: "materia-prima" as ProduccionSub,
      icon: Package,
      title: "Agregar a Stock",
      sub: "Nueva materia prima. Cargá remeras, buzos y más.",
      badge: `${materias.length} productos`,
    },
    {
      id: "produccion" as ProduccionSub,
      icon: Factory,
      title: "Registro de Producción",
      sub: "Anotá tu producción. Usá materia prima y estampas.",
      badge: `${records.length} lotes`,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader title="Producción" subtitle="Módulo de fabricación" />
      <div className="flex-1 overflow-y-auto bg-off-white/40 p-5 space-y-3">
        <p className="font-body text-[10px] uppercase tracking-widest text-light-brown mb-4">Seleccioná una sección</p>
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setSub(card.id)}
              className="w-full bg-off-white border border-beige-brown/60 p-5 flex items-start gap-4 text-left hover:border-light-brown hover:shadow-sm transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-dark-brown flex items-center justify-center shrink-0">
                <Icon size={20} className="text-off-white" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-dark-brown group-hover:text-medium-brown transition-colors">{card.title}</p>
                <p className="font-body text-xs text-light-brown mt-1 leading-snug">{card.sub}</p>
                <span className="inline-block mt-2 font-body text-[10px] bg-beige-brown/50 text-medium-brown px-2 py-0.5">{card.badge}</span>
              </div>
              <ChevronRight size={16} className="text-light-brown shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE FRAME
// ─────────────────────────────────────────────────────────────────────────────

interface MobileFrameProps {
  children: React.ReactNode;
}

function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-dark-brown/95 p-8">
      <div className="w-[375px] h-[720px] bg-off-white shadow-2xl border-2 border-medium-brown/40 overflow-hidden flex flex-col relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark-brown/90 rounded-b-xl z-10" />
        <div className="flex-1 overflow-hidden flex flex-col pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [materias, setMaterias] = useState<RawMaterial[]>(MOCK_MATERIAS);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [ventas, setVentas] = useState<SaleRecord[]>(MOCK_VENTAS);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  function addMateria(m: RawMaterial) {
    setMaterias(prev => [m, ...prev]);
  }

  function deleteMateria(id: string) {
    setMaterias(prev => prev.filter(m => m.id !== id));
  }

  function addRecord(r: ProductionRecord) {
    setRecords(prev => [r, ...prev]);
  }

  function addVenta(v: SaleRecord) {
    setVentas(prev => [v, ...prev]);
  }

  function renderScreen() {
    switch (screen) {
      case "dashboard":
        return <Dashboard onNavigate={setScreen} />;

      case "materia-prima":
      case "produccion":
        return (
          <ProduccionHub
            materias={materias}
            estampas={MOCK_ESTAMPAS}
            records={records}
            onAddMateria={addMateria}
            onDeleteMateria={deleteMateria}
            onAddRecord={addRecord}
          />
        );

      case "ventas":
        return (
          <Ventas
            productos={MOCK_PRODUCTOS}
            ventas={ventas}
            onVenta={addVenta}
          />
        );

      case "inventario":
        return <Inventario materias={materias} productos={MOCK_PRODUCTOS} />;

      default:
        return null;
    }
  }

  return (
    <div className="font-body">
      <MobileFrame>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {renderScreen()}
          </div>
          <BottomNav active={screen} onNavigate={setScreen} />
        </div>
      </MobileFrame>
    </div>
  );
}
