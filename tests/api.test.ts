import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import { createApp, parseSafeJson } from "../server";

describe("API Health & Validation Suite", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("GET /api/health", () => {
    it("should return apiConfigured: false when GEMINI_API_KEY is not set", async () => {
      delete process.env.GEMINI_API_KEY;
      const app = createApp();
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "ok",
        apiConfigured: false,
      });
    });

    it("should return apiConfigured: true when GEMINI_API_KEY is set", async () => {
      process.env.GEMINI_API_KEY = "test-api-key-12345";
      const app = createApp();
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "ok",
        apiConfigured: true,
      });
    });
  });

  describe("POST /api/audit Validation", () => {
    it("should return 400 when businessName is missing or empty", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/audit")
        .send({
          industry: "Retail",
          description: "Manual inventory bottleneck",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Business Name is required/i);
    });

    it("should return 400 when industry is missing or empty", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/audit")
        .send({
          businessName: "Acme Corp",
          description: "Manual invoice review bottleneck",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Industry is required/i);
    });

    it("should return 400 when description is missing or whitespace only", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/audit")
        .send({
          businessName: "Acme Corp",
          industry: "Logistics",
          description: "   ",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Description.*required/i);
    });

    it("should return 500 with helpful error when GEMINI_API_KEY is missing", async () => {
      delete process.env.GEMINI_API_KEY;
      const app = createApp();
      const res = await request(app)
        .post("/api/audit")
        .send({
          businessName: "Acme Logistics",
          industry: "Transportation",
          description: "High manual overhead in dispatch coordination.",
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Gemini API key is not configured/i);
    });
  });

  describe("POST /api/agent/chat Validation", () => {
    it("should return 400 when message is missing", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/agent/chat")
        .send({
          systemInstruction: "You are a customer service specialist.",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid non-empty message/i);
    });

    it("should return 400 when systemInstruction is missing", async () => {
      const app = createApp();
      const res = await request(app)
        .post("/api/agent/chat")
        .send({
          message: "Hello world",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/system instruction is required/i);
    });

    it("should return 500 when GEMINI_API_KEY is not configured", async () => {
      delete process.env.GEMINI_API_KEY;
      const app = createApp();
      const res = await request(app)
        .post("/api/agent/chat")
        .send({
          systemInstruction: "You are a helpful agent.",
          message: "Can you help automate emails?",
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Gemini API key is not configured/i);
    });
  });

  describe("parseSafeJson Helper", () => {
    it("should parse standard raw JSON string", () => {
      const sample = '{"company": "AutoAudit", "status": "active"}';
      expect(parseSafeJson(sample)).toEqual({
        company: "AutoAudit",
        status: "active",
      });
    });

    it("should parse markdown code-fenced JSON with ```json", () => {
      const sample = '```json\n{\n  "hoursSaved": 40,\n  "roi": "300%"\n}\n```';
      expect(parseSafeJson(sample)).toEqual({
        hoursSaved: 40,
        roi: "300%",
      });
    });

    it("should parse JSON surrounded by explanatory text and code fence", () => {
      const sample = 'Here is your report:\n```json\n{"success": true}\n```\nHope that helps!';
      expect(parseSafeJson(sample)).toEqual({
        success: true,
      });
    });
  });

  describe("generateContentWithFallback Resilience", () => {
    it("should return result from primary model when it succeeds", async () => {
      const { generateContentWithFallback } = await import("../server");
      const mockGenerateContent = vi.fn().mockResolvedValue({ text: "Success output" });
      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      };

      const result = await generateContentWithFallback(mockAi, { contents: "Test prompt" });
      expect(result.text).toBe("Success output");
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it("should fallback to secondary model when the first model fails", async () => {
      const { generateContentWithFallback } = await import("../server");
      const mockGenerateContent = vi
        .fn()
        .mockRejectedValueOnce(new Error("Resource exhausted on primary"))
        .mockResolvedValueOnce({ text: "Secondary model success" });

      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      };

      const result = await generateContentWithFallback(mockAi, { contents: "Test prompt" });
      expect(result.text).toBe("Secondary model success");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it("should throw an error when all fallback models fail", async () => {
      const { generateContentWithFallback } = await import("../server");
      const mockGenerateContent = vi
        .fn()
        .mockRejectedValue(new Error("Model quota exceeded"));

      const mockAi = {
        models: {
          generateContent: mockGenerateContent,
        },
      };

      await expect(
        generateContentWithFallback(mockAi, { contents: "Test prompt" })
      ).rejects.toThrow(/quota exceeded/i);
    });
  });
});
