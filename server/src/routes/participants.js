import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

// GET /api/participants untuk lihat semua participants
router.get("/", async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { id: "asc" },
    });
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get participants" });
  }
});

// GET /api/participants/:id untuk lihat detail peserta dan kelas yang diambil olehnya
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get participant" });
  }
});

// POST /api/participants untuk buat peserta baru
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const newParticipant = await prisma.participant.create({
      data: { name, email, phone },
    });
    res.status(201).json(newParticipant);
  } catch (err) {
    console.error(err);
    // misal email duplikat
    res.status(500).json({ message: "Failed to create participant" });
  }
});

// PUT /api/participants/:id  untuk update data peserta
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone } = req.body;

  try {
    const updated = await prisma.participant.update({
      where: { id },
      data: { name, email, phone },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update participant" });
  }
});

// DELETE /api/participants/:id untuk hapus peserta sekalian se enrollment-nya
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.enrollment.deleteMany({
      where: { participantId: id },
    });

    await prisma.participant.delete({
      where: { id },
    });

    res.json({ message: "Participant deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete participant" });
  }
});

export default router;
