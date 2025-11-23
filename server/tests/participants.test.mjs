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

test("POST /api/participants → create participant", async () => {
  const payload = {
    name: "User A",
    email: "usera@example.com",
    phone: "0800000000",
  };

  const res = await request(app).post("/api/participants").send(payload);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.name, payload.name);
  assert.equal(res.body.email, payload.email);
});

test("POST /api/participants → validate missing name/email", async () => {
  const res = await request(app).post("/api/participants").send({
    name: "",
    email: "",
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Name and email are required");
});

test("GET /api/participants → list participants", async () => {
  await prisma.participant.createMany({
    data: [
      { name: "A", email: "a@example.com" },
      { name: "B", email: "b@example.com" },
    ],
  });

  const res = await request(app).get("/api/participants");

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 2);
});

test("GET /api/participants/:id → detail includes enrollments + course", async () => {
  const course = await prisma.course.create({
    data: {
      name: "Test Course",
      instructor: "Teacher X",
    },
  });

  const p = await prisma.participant.create({
    data: {
      name: "Detail User",
      email: "detail@example.com",
    },
  });

  await prisma.enrollment.create({
    data: {
      participantId: p.id,
      courseId: course.id,
    },
  });

  const res = await request(app).get(`/api/participants/${p.id}`);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.name, "Detail User");

  assert.equal(res.body.enrollments.length, 1);
  assert.equal(res.body.enrollments[0].course.name, "Test Course");
});

test("PUT /api/participants/:id → update participant", async () => {
  const p = await prisma.participant.create({
    data: { name: "Old", email: "old@example.com" },
  });

  const res = await request(app).put(`/api/participants/${p.id}`).send({
    name: "New",
    email: "new@example.com",
    phone: "088888888",
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.name, "New");
  assert.equal(res.body.phone, "088888888");
});

test("DELETE /api/participants/:id → delete participant", async () => {
  const p = await prisma.participant.create({
    data: { name: "To Delete", email: "del@example.com" },
  });

  const res = await request(app).delete(`/api/participants/${p.id}`);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Participant deleted");

  const check = await prisma.participant.findUnique({ where: { id: p.id } });
  assert.equal(check, null);
});
