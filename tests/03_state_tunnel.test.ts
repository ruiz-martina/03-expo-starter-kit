import fs from "fs";
import path from "path";

console.log("=================================================================");
console.log("🥊 EJECUTANDO PRUEBAS: RETO 03 — Reactividad con useState (tunnel.tsx)");
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

const tunnelPath = path.resolve(process.cwd(), "app/(tabs)/tunnel.tsx");
assert(fs.existsSync(tunnelPath), "El archivo app/(tabs)/tunnel.tsx existe");

const content = fs.readFileSync(tunnelPath, "utf-8");

// Eliminar comentarios para no evaluar código comentado
const cleanCode = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

const getFunctionBody = (code: string, fnName: string) => {
  const match = code.match(new RegExp(`const\\s+${fnName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{([\\s\\S]*?)\\};?`));
  return match ? match[1] : '';
};

assert(cleanCode.includes("useState"), "Importa y utiliza el hook 'useState'", "Usa const [tunelActivo, setTunelActivo] = useState(false);");

assert(
  /const\s*\[\s*tunelActivo\s*,\s*setTunelActivo\s*\]\s*=\s*useState/.test(cleanCode),
  "Declara el estado reactivo [tunelActivo, setTunelActivo] activo (no comentado)",
  "Descomenta o escribe: const [tunelActivo, setTunelActivo] = useState(false);"
);

assert(
  !/const\s+tunelActivo\s*=\s*(false|true)\s*;/.test(cleanCode),
  "Elimina la constante estática 'const tunelActivo = false;'",
  "Borra la línea 'const tunelActivo = false;' para que la app use el estado reactivo useState"
);

const toggleBody = getFunctionBody(cleanCode, 'toggleTunel');
assert(
  toggleBody.includes("setTunelActivo") &&
  (toggleBody.includes("!tunelActivo") || toggleBody.includes("!prev")),
  "Implementa la función toggleTunel para alternar el estado con setTunelActivo",
  "Dentro de toggleTunel usa: setTunelActivo(!tunelActivo) o setTunelActivo(prev => !prev);"
);

assert(
  cleanCode.includes("tunelActivo ?") || cleanCode.includes("if (tunelActivo)"),
  "Renderiza condicionalmente el estado del túnel en la UI",
  "Usa el operador ternario tunelActivo ? ... : ... en el Card o Button"
);

console.log("\n-----------------------------------------------------------------");
if (testsFallidos === 0) {
  console.log("🎉 ¡FELICITACIONES! Reto 03 superado con éxito. (1.00 / 1.00 pt)");
  console.log("-----------------------------------------------------------------\n");
  process.exit(0);
} else {
  console.log(`⚠️ Tienes ${testsFallidos} prueba(s) pendiente(s). Revisa app/(tabs)/tunnel.tsx y vuelve a ejecutar.`);
  console.log("-----------------------------------------------------------------\n");
  process.exit(1);
}
