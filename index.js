// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  compatibilityResults;
  currentUserId;
  currentResultId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.compatibilityResults = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentResultId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createCompatibilityResult(insertResult) {
    const id = this.currentResultId++;
    const result = {
      ...insertResult,
      partner1DateOfBirth: insertResult.partner1DateOfBirth || null,
      partner1BirthTime: insertResult.partner1BirthTime || null,
      partner2DateOfBirth: insertResult.partner2DateOfBirth || null,
      partner2BirthTime: insertResult.partner2BirthTime || null,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.compatibilityResults.set(id, result);
    return result;
  }
  async getCompatibilityResults() {
    return Array.from(this.compatibilityResults.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  async deleteAllCompatibilityResults() {
    this.compatibilityResults.clear();
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var compatibilityResults = pgTable("compatibility_results", {
  id: serial("id").primaryKey(),
  partner1Name: text("partner1_name").notNull(),
  partner2Name: text("partner2_name").notNull(),
  partner1DateOfBirth: text("partner1_date_of_birth"),
  partner1BirthTime: text("partner1_birth_time"),
  partner2DateOfBirth: text("partner2_date_of_birth"),
  partner2BirthTime: text("partner2_birth_time"),
  partner1AbjadValue: integer("partner1_abjad_value").notNull(),
  partner2AbjadValue: integer("partner2_abjad_value").notNull(),
  partner1DigitalRoot: integer("partner1_digital_root").notNull(),
  partner2DigitalRoot: integer("partner2_digital_root").notNull(),
  partner1Element: text("partner1_element").notNull(),
  partner2Element: text("partner2_element").notNull(),
  nameCompatibilityScore: integer("name_compatibility_score").notNull(),
  lifePathCompatibilityScore: integer("life_path_compatibility_score"),
  overallCompatibilityScore: integer("overall_compatibility_score").notNull(),
  compatibilityLevel: text("compatibility_level").notNull(),
  insights: text("insights").notNull(),
  marriageAdvice: text("marriage_advice").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertCompatibilityResultSchema = createInsertSchema(compatibilityResults).omit({
  id: true,
  createdAt: true
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/compatibility-results", async (req, res) => {
    try {
      const results = await storage.getCompatibilityResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compatibility results" });
    }
  });
  app2.post("/api/compatibility-results", async (req, res) => {
    try {
      const validatedData = insertCompatibilityResultSchema.parse(req.body);
      const result = await storage.createCompatibilityResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid compatibility result data" });
    }
  });
  app2.delete("/api/compatibility-results", async (req, res) => {
    try {
      await storage.deleteAllCompatibilityResults();
      res.status(200).json({ message: "All compatibility results cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear compatibility results" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
