import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c2f9023b/health", (c) => {
  return c.json({ status: "ok" });
});

// Clientes endpoints
app.get("/make-server-c2f9023b/clients", async (c) => {
  try {
    const clients = await kv.getByPrefix("client:");
    return c.json({ success: true, data: clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-c2f9023b/clients", async (c) => {
  try {
    const body = await c.req.json();
    const clientId = `client:${Date.now()}`;
    await kv.set(clientId, body);
    return c.json({ success: true, data: { id: clientId, ...body } });
  } catch (error) {
    console.error("Error creating client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-c2f9023b/clients/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Ordens de Serviço endpoints
app.get("/make-server-c2f9023b/service-orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    return c.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching service orders:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-c2f9023b/service-orders", async (c) => {
  try {
    const body = await c.req.json();
    const orderId = `order:${Date.now()}`;
    await kv.set(orderId, body);
    return c.json({ success: true, data: { id: orderId, ...body } });
  } catch (error) {
    console.error("Error creating service order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-c2f9023b/service-orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting service order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Estoque endpoints
app.get("/make-server-c2f9023b/inventory", async (c) => {
  try {
    const products = await kv.getByPrefix("product:");
    return c.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-c2f9023b/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const productId = `product:${Date.now()}`;
    await kv.set(productId, body);
    return c.json({ success: true, data: { id: productId, ...body } });
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-c2f9023b/inventory/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);