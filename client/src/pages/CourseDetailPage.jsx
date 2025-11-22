import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("Course tidak ditemukan.");
      } else {
        setError("Gagal memuat detail course.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const goBack = () => {
    navigate("/courses");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="text-xs mb-2 text-slate-600 hover:text-slate-900"
        >
          ← Back to Courses
        </button>
        <p className="text-sm text-slate-500">Loading course detail...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="text-xs mb-2 text-slate-600 hover:text-slate-900"
        >
          ← Back to Courses
        </button>
        <p className="text-sm text-red-500">{error || "Course tidak ditemukan."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="text-xs text-slate-600 hover:text-slate-900"
      >
        ← Back to Courses
      </button>

      {/* Info utama course */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
        <div>
          <p className="text-xs text-slate-500">Course ID #{course.id}</p>
          <h2 className="text-xl font-semibold text-slate-900">
            {course.name}
          </h2>
          <p className="text-sm text-slate-600">
            Instructor:{" "}
            <span className="font-medium">{course.instructor}</span>
          </p>
        </div>

        {course.description && (
          <p className="text-sm text-slate-700">{course.description}</p>
        )}
      </section>

      {/* Peserta terdaftar */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-3">
          Peserta Terdaftar
        </h3>

        {course.enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada peserta yang terdaftar di course ini.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {course.enrollments.map((en) => (
              <li
                key={en.id}
                className="flex items-center justify-between border-b last:border-b-0 border-slate-100 pb-1"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {en.participant?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {en.participant?.email}
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  Enrollment ID #{en.id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
