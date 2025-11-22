import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

// GET /api/enrollments untuk list enrollments
router.get("/", async (req, res) => {
  try {
    const items = await prisma.enrollment.findMany({
      include: {
        participant: true,
        course: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get enrollments" });
  }
});

// POST /api/enrollments untuk daftarin peserta ke kelas
// body: { participantId, courseId }
router.post("/", async (req, res) => {
  const { participantId, courseId } = req.body;

  if (!participantId || !courseId) {
    return res
      .status(400)
      .json({ message: "participantId and courseId are required" });
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        participantId: Number(participantId),
        courseId: Number(courseId),
      },
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    // kasih cek kalau duplicate combination, ketika peserta sudah pernah daftar
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Participant already enrolled in this course" });
    }
    res.status(500).json({ message: "Failed to enroll participant" });
  }
});

// GET /api/participants/:id/courses untuk lihat list kelas yg diikuti peserta
router.get("/participant/:id/courses", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { participantId: id },
      include: { course: true },
    });

    res.json(enrollments.map((e) => e.course));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get courses for participant" });
  }
});

// GET /api/courses/:id/participants untuk lihat list peserta di 1 kelas
router.get("/course/:id/participants", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id },
      include: { participant: true },
    });

    res.json(enrollments.map((e) => e.participant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get participants for course" });
  }
});

// DELETE /api/enrollments/:id untuk hapus atau membatakan pendaftaran
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.enrollment.delete({
      where: { id },
    });

    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete enrollment" });
  }
});

export default router;
