import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/index.js";
import prisma from "../src/prisma.js";

test("GET /api/health should return status ok", async () => {
  const res = await request(app).get("/api/health");

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { status: "ok" });
});

