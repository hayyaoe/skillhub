import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/index.js";
import prisma from "../src/prisma.js";

test.beforeEach(async () => {
  await prisma.enrollment.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.course.deleteMany();
});

test("POST /api/enrollments → create enrollment", async () => {
  const p = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  const c = await prisma.course.create({
    data: { name: "C1", instructor: "I1" },
  });

  const res = await request(app).post("/api/enrollments").send({
    participantId: p.id,
    courseId: c.id,
  });

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.participantId, p.id);
});

test("POST /api/enrollments → duplicate enrollment returns 400", async () => {
  const p = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  const c = await prisma.course.create({
    data: { name: "C1", instructor: "I1" },
  });

  await prisma.enrollment.create({
    data: { participantId: p.id, courseId: c.id },
  });

  const res = await request(app).post("/api/enrollments").send({
    participantId: p.id,
    courseId: c.id,
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Participant already enrolled in this course");
});

test("GET /api/enrollments → list enrollments with participant+course", async () => {
  const p = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  const c = await prisma.course.create({
    data: { name: "C1", instructor: "I1" },
  });

  await prisma.enrollment.create({
    data: { participantId: p.id, courseId: c.id },
  });

  const res = await request(app).get("/api/enrollments");

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].participant.name, "P1");
  assert.equal(res.body[0].course.name, "C1");
});

test("DELETE /api/enrollments/:id → delete enrollment", async () => {
  const p = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  const c = await prisma.course.create({
    data: { name: "C1", instructor: "I1" },
  });

  const e = await prisma.enrollment.create({
    data: { participantId: p.id, courseId: c.id },
  });

  const res = await request(app).delete(`/api/enrollments/${e.id}`);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Enrollment deleted");

  const check = await prisma.enrollment.findUnique({
    where: { id: e.id },
  });

  assert.equal(check, null);
});
