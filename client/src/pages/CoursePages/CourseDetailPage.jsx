import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";

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
        setError("Course not found.");
      } else {
        setError("Failed to load course details.");
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
          ← Back to List
        </button>
        <p className="text-sm text-slate-500">Loading course details...</p>
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
          ← Back to List
        </button>
        <p className="text-sm text-red-500">{error || "Course not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Back + Edit */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Course Details
          </h2>
          <p className="text-sm text-slate-500">
            Complete information about the course and enrolled participants.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <span className="text-sm">←</span>
            <span>Back to List</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/courses/${id}/edit`)}
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Main course info card */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3 max-w-2xl">
        <div>
          <p className="text-xs text-slate-500">Course ID #{course.id}</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {course.name}
          </h3>
          <p className="text-sm text-slate-600">
            Instructor: <span className="font-medium">{course.instructor}</span>
          </p>
        </div>

        {course.description && (
          <p className="text-sm text-slate-700">{course.description}</p>
        )}
      </section>

      {/* Enrolled participants */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 max-w-2xl space-y-3">
        <h3 className="text-base font-semibold text-slate-800">
          Enrolled Participants
        </h3>

        {!course.enrollments || course.enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No participants enrolled in this course.
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
