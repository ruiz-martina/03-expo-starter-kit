import fs from "fs";
import path from "path";

console.log("=================================================================");
console.log("🥊 EJECUTANDO PRUEBAS: RETO 02 — Props & Variantes de Button.tsx");
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

const buttonPath = path.resolve(process.cwd(), "components/ui/Button.tsx");
assert(fs.existsSync(buttonPath), "El archivo components/ui/Button.tsx existe");

const content = fs.readFileSync(buttonPath, "utf-8");

// Eliminar comentarios para no evaluar pistas ni TODOs
const cleanCode = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

console.log("🔍 Verificando Tipado de Variantes y Clases de Tailwind...");

// 1. Verificar tipo de unión ButtonVariant en código activo
const variantTypeMatch = cleanCode.match(/type\s+ButtonVariant\s*=\s*([^;]+);/);
const variantTypeContent = variantTypeMatch ? variantTypeMatch[1] : '';

assert(
  variantTypeContent.includes("'primary'") &&
  variantTypeContent.includes("'secondary'") &&
  variantTypeContent.includes("'danger'") &&
  variantTypeContent.includes("'success'"),
  "Define el tipo ButtonVariant con las 4 opciones: 'primary' | 'secondary' | 'danger' | 'success'",
  "Define: export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';"
);

// 2. Extraer cuerpo del objeto variantStyles
const variantMatch = cleanCode.match(/variantStyles\s*(:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};?/);
const variantBody = variantMatch ? variantMatch[2] : '';

assert(
  variantBody.includes("bg-yellow-300"),
  "Variante 'primary' configurada con 'bg-yellow-300' dentro del objeto variantStyles",
  "Agrega primary: 'bg-yellow-300 text-black' dentro de variantStyles"
);
assert(
  variantBody.includes("bg-cyan-300"),
  "Variante 'secondary' configurada con 'bg-cyan-300' dentro del objeto variantStyles",
  "Agrega secondary: 'bg-cyan-300 text-black' dentro de variantStyles"
);
assert(
  variantBody.includes("bg-pink-400"),
  "Variante 'danger' configurada con 'bg-pink-400' dentro del objeto variantStyles",
  "Agrega danger: 'bg-pink-400 text-black' dentro de variantStyles"
);
assert(
  variantBody.includes("bg-emerald-300"),
  "Variante 'success' configurada con 'bg-emerald-300' dentro del objeto variantStyles",
  "Agrega success: 'bg-emerald-300 text-black' dentro de variantStyles"
);

assert(
  cleanCode.includes("shadow-[3px_3px_0px_0px_#000000]") || cleanCode.includes("border-[3px]"),
  "Aplica bordes definidos y estilos modulares con Tailwind"
);

console.log("\n-----------------------------------------------------------------");
if (testsFallidos === 0) {
  console.log("🎉 ¡FELICITACIONES! Reto 02 superado con éxito. (1.00 / 1.00 pt)");
  console.log("-----------------------------------------------------------------\n");
  process.exit(0);
} else {
  console.log(`⚠️ Tienes ${testsFallidos} prueba(s) pendiente(s). Completa Button.tsx y vuelve a ejecutar.`);
  console.log("-----------------------------------------------------------------\n");
  process.exit(1);
}
