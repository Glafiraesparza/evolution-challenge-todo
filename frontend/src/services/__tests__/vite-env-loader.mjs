// frontend/src/services/__tests__/vite-env-loader.mjs
// Solo para pruebas en Node: define import.meta.env como objeto vacío,
// igual que hace Vite en el navegador. No se usa en la app real.

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);

  // Solo modificamos los archivos del servicio, no node_modules ni las pruebas
  if (result.format === "module" && url.endsWith("/services/taskService.js")) {
    const original = result.source.toString();
    result.source = "import.meta.env ??= {};\n" + original;
  }

  return result;
}