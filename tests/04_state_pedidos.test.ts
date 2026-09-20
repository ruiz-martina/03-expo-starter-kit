import fs from "fs";
import path from "path";

console.log("=================================================================");
console.log("🥊 EJECUTANDO PRUEBAS: RETO 04 — Desafío Bar Salesiano Mobile");
console.log("=================================================================\n");

let testsFallidos = 0;

function assert(condicion: boolean, descripcion: string, pista?: string) {
  if (condicion) {
    console.log(`  ✅ [PASÓ]: ${descripcion}`);
  } else {
    console.log(`  ❌ [FALLÓ]: ${descripcion}`);
    if (pista) console.log(`     👉 PISTA: ${pista}`);
    testsFallidos++;
  }
}

const pedidosPath = path.resolve(process.cwd(), "app/(tabs)/pedidos.tsx");
assert(fs.existsSync(pedidosPath), "El archivo app/(tabs)/pedidos.tsx existe");

const content = fs.readFileSync(pedidosPath, "utf-8");

// Eliminar comentarios para no evaluar pistas ni TODOs comentados
const cleanCode = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

const getFunctionBody = (code: string, fnName: string) => {
  const match = code.match(new RegExp(`const\\s+${fnName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([\\s\\S]*?)\\};?`));
  return match ? match[1] : '';
};

console.log("🔍 Verificando Estructura de Estados con useState...");
assert(cleanCode.includes("useState"), "Importa y utiliza el hook 'useState'", "Usa useState(0)");

assert(
  /const\s*\[\s*total\s*,\s*setTotal\s*\]\s*=\s*useState/.test(cleanCode),
  "Declara el estado reactivo [total, setTotal] activo (no comentado)",
  "Descomenta: const [total, setTotal] = useState(0);"
);

assert(
  /const\s*\[\s*items\s*,\s*setItems\s*\]\s*=\s*useState/.test(cleanCode),
  "Declara el estado reactivo [items, setItems] activo (no comentado)",
  "Descomenta: const [items, setItems] = useState(0);"
);

assert(
  !/const\s+total\s*=\s*0\s*;/.test(cleanCode) && !/const\s+items\s*=\s*0\s*;/.test(cleanCode),
  "Elimina las constantes fijas 'const total = 0;' y 'const items = 0;'",
  "Borra las líneas fijas 'const total = 0;' y 'const items = 0;'"
);

console.log("\n🔍 Verificando Funciones de Suma Directa...");
const sanducheBody = getFunctionBody(cleanCode, 'agregarSanduche');
assert(
  sanducheBody.includes("1.25") && (sanducheBody.includes("setTotal") || sanducheBody.includes("total +")),
  "agregarSanduche suma 1.25 al total",
  "Dentro de agregarSanduche usa: setTotal(total + 1.25) y setItems(items + 1)"
);

const empanadaBody = getFunctionBody(cleanCode, 'agregarEmpanada');
assert(
  empanadaBody.includes("0.75") && (empanadaBody.includes("setTotal") || empanadaBody.includes("total +")),
  "agregarEmpanada suma 0.75 al total",
  "Dentro de agregarEmpanada usa: setTotal(total + 0.75) y setItems(items + 1)"
);

const vaciarBody = getFunctionBody(cleanCode, 'vaciarCarrito');
assert(
  vaciarBody.includes("setTotal") &&
  /setTotal\s*\(\s*0\s*\)/.test(vaciarBody) &&
  /setItems\s*\(\s*0\s*\)/.test(vaciarBody),
  "vaciarCarrito restablece total e items a 0",
  "Dentro de vaciarCarrito llama a setTotal(0) y setItems(0)"
);

console.log("\n-----------------------------------------------------------------");
if (testsFallidos === 0) {
  console.log("🎉 ¡FELICITACIONES! Reto 04 superado con éxito. (1.00 / 1.00 pt)");
  console.log("-----------------------------------------------------------------\n");
  process.exit(0);
} else {
  console.log(`⚠️ Tienes ${testsFallidos} prueba(s) pendiente(s). Revisa app/(tabs)/pedidos.tsx y vuelve a ejecutar.`);
  console.log("-----------------------------------------------------------------\n");
  process.exit(1);
}
