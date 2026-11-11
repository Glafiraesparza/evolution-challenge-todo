// frontend/src/services/__tests__/taskService.mock.test.mjs
// Prueba taskService.js simulando fetch. No necesita backend.
// Se ejecuta con: node --test

import { test } from "node:test";
import assert from "node:assert/strict";

const service = await import("../taskService.js");

// ---------- Ayudantes para simular fetch ----------

const llamadas = []; // guarda cada llamada para revisarla después

function simularFetch(status, body) {
  globalThis.fetch = async (url, options) => {
    llamadas.push({ url, options });
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => {
        if (body === undefined) throw new Error("Sin cuerpo JSON");
        return body;
      },
    };
  };
}

const tareaEjemplo = {
  id: 1,
  title: "Estudiar FastAPI",
  description: "Revisar los endpoints",
  completed: false,
  created_at: "2026-11-10T18:00:00Z",
  updated_at: "2026-11-10T18:00:00Z",
};

// ---------- Pruebas ----------

test("getTasks usa GET /tasks y devuelve la lista", async () => {
  llamadas.length = 0;
  simularFetch(200, [tareaEjemplo]);

  const resultado = await service.getTasks();

  assert.equal(llamadas[0].url, "http://localhost:8000/tasks");
  assert.deepEqual(resultado, [tareaEjemplo]);
});

test("getTasks devuelve [] cuando no hay tareas", async () => {
  simularFetch(200, []);
  assert.deepEqual(await service.getTasks(), []);
});

test("getTask usa GET /tasks/{id}", async () => {
  llamadas.length = 0;
  simularFetch(200, tareaEjemplo);

  const resultado = await service.getTask(1);

  assert.equal(llamadas[0].url, "http://localhost:8000/tasks/1");
  assert.equal(resultado.id, 1);
});

test("createTask usa POST con JSON y Content-Type", async () => {
  llamadas.length = 0;
  simularFetch(201, tareaEjemplo);
  const datos = { title: "Estudiar FastAPI", description: "", completed: false };

  const resultado = await service.createTask(datos);

  assert.equal(llamadas[0].url, "http://localhost:8000/tasks");
  assert.equal(llamadas[0].options.method, "POST");
  assert.equal(
    llamadas[0].options.headers["Content-Type"],
    "application/json"
  );
  assert.deepEqual(JSON.parse(llamadas[0].options.body), datos);
  assert.equal(resultado.id, 1);
});

test("updateTask usa PUT /tasks/{id} con JSON", async () => {
  llamadas.length = 0;
  simularFetch(200, { ...tareaEjemplo, completed: true });
  const datos = { title: "Estudiar FastAPI", description: "", completed: true };

  const resultado = await service.updateTask(1, datos);

  assert.equal(llamadas[0].url, "http://localhost:8000/tasks/1");
  assert.equal(llamadas[0].options.method, "PUT");
  assert.deepEqual(JSON.parse(llamadas[0].options.body), datos);
  assert.equal(resultado.completed, true);
});

test("deleteTask usa DELETE y con 204 NO lee JSON", async () => {
  llamadas.length = 0;
  simularFetch(204, undefined); // si intentara leer JSON, fallaría

  const resultado = await service.deleteTask(1);

  assert.equal(llamadas[0].url, "http://localhost:8000/tasks/1");
  assert.equal(llamadas[0].options.method, "DELETE");
  assert.equal(resultado, null);
});

test("404 lanza error con el mensaje del backend y status", async () => {
  simularFetch(404, { detail: "Tarea no encontrada" });

  await assert.rejects(() => service.getTask(999), (error) => {
    assert.equal(error.message, "Tarea no encontrada");
    assert.equal(error.status, 404);
    return true;
  });
});

test("422 lanza error con los mensajes de validación", async () => {
  simularFetch(422, {
    detail: [
      { msg: "String should have at least 1 character", loc: ["body", "title"] },
    ],
  });

  await assert.rejects(() => service.createTask({ title: "" }), (error) => {
    assert.match(error.message, /at least 1 character/);
    assert.equal(error.status, 422);
    return true;
  });
});

test("error de red lanza mensaje claro", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };

  await assert.rejects(() => service.getTasks(), (error) => {
    assert.match(error.message, /No se pudo conectar/);
    return true;
  });
});

test("error 500 sin JSON usa mensaje genérico", async () => {
  simularFetch(500, undefined);

  await assert.rejects(() => service.getTasks(), (error) => {
    assert.match(error.message, /Error 500/);
    return true;
  });
});