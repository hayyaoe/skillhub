import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

// GET /api/dashboard/summary untuk return rangkuman data partisipan, course, dll.
router.get("/summary", async (req, res) => {
  try {
    const [totalParticipants, totalCourses, totalEnrollments, recentParticipants, recentCourses] =
      await Promise.all([
        prisma.participant.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.participant.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.course.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    res.json({
      totals: {
        participants: totalParticipants,
        courses: totalCourses,
        enrollments: totalEnrollments,
      },
      recentParticipants,
      recentCourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get dashboard summary" });
  }
});

export default router;
