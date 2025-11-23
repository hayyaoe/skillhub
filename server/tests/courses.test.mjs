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

test("POST /api/courses → create course", async () => {
  const payload = {
    name: "Course A",
    instructor: "Mr X",
    description: "Test desc",
  };

  const res = await request(app).post("/api/courses").send(payload);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.name, payload.name);
});

test("POST /api/courses → validate missing fields", async () => {
  const res = await request(app).post("/api/courses").send({
    name: "",
    instructor: "",
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Name and instructor are required");
});

test("GET /api/courses → list courses", async () => {
  await prisma.course.createMany({
    data: [
      { name: "C1", instructor: "I1" },
      { name: "C2", instructor: "I2" },
    ],
  });

  const res = await request(app).get("/api/courses");

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.length, 2);
});

test("GET /api/courses/:id → detail course with participants", async () => {
  const course = await prisma.course.create({
    data: { name: "Backend", instructor: "Lecturer A" },
  });

  const p1 = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  const p2 = await prisma.participant.create({
    data: { name: "P2", email: "p2@example.com" },
  });

  await prisma.enrollment.createMany({
    data: [
      { courseId: course.id, participantId: p1.id },
      { courseId: course.id, participantId: p2.id },
    ],
  });

  const res = await request(app).get(`/api/courses/${course.id}`);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.enrollments.length, 2);

  const names = res.body.enrollments.map((e) => e.participant.name);
  assert.deepEqual(new Set(names), new Set(["P1", "P2"]));
});

test("PUT /api/courses/:id → update course", async () => {
  const c = await prisma.course.create({
    data: { name: "Old", instructor: "Old Inst" },
  });

  const res = await request(app)
    .put(`/api/courses/${c.id}`)
    .send({
      name: "New",
      instructor: "New Inst",
      description: "Updated",
    });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.name, "New");
});

test("DELETE /api/courses/:id → delete course + enrollments", async () => {
  const course = await prisma.course.create({
    data: { name: "Del", instructor: "Teacher" },
  });

  const p = await prisma.participant.create({
    data: { name: "P1", email: "p1@example.com" },
  });

  await prisma.enrollment.create({
    data: { courseId: course.id, participantId: p.id },
  });

  const res = await request(app).delete(`/api/courses/${course.id}`);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Course deleted");

  const check = await prisma.course.findUnique({ where: { id: course.id } });
  assert.equal(check, null);

  const checkEn = await prisma.enrollment.findMany({
    where: { courseId: course.id },
  });
  assert.equal(checkEn.length, 0);
});
