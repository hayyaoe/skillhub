import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

// GET /api/courses untuk lihat list semua kelas
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { id: "asc" },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get courses" });
  }
});

// GET /api/courses/:id untuh lihat detail kelas dan peserta yang ikut keleas tersebut
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            participant: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get course" });
  }
});

// POST /api/courses untuk buat kelas baru
router.post("/", async (req, res) => {
  const { name, description, instructor } = req.body;

  if (!name || !instructor) {
    return res
      .status(400)
      .json({ message: "Name and instructor are required" });
  }

  try {
    const newCourse = await prisma.course.create({
      data: { name, description, instructor },
    });
    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create course" });
  }
});

// PUT /api/courses/:id untuk update kelas
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, instructor } = req.body;

  try {
    const updated = await prisma.course.update({
      where: { id },
      data: { name, description, instructor },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update course" });
  }
});

// DELETE /api/courses/:id untuk hapus kelas beserta enrollment-nya
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.enrollment.deleteMany({
      where: { courseId: id },
    });

    await prisma.course.delete({
      where: { id },
    });

    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

export default router;
