import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function EnrollmentsCreatePage() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    participantId: "",
    courseId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
          api.get("/participants"),
          api.get("/courses"),
        ]);
        setParticipants(pRes.data);
        setCourses(cRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load participants or courses.");
        navigate("/enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!form.participantId || !form.courseId) {
      alert("Please select a participant and a course.");
      return;
    }

    try {
      await api.post("/enrollments", {
        participantId: Number(form.participantId),
        courseId: Number(form.courseId),
      });

      setForm({ participantId: "", courseId: "" });
      navigate("/enrollments");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to create enrollment.");
      }
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header + Back */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Add Enrollment
          </h2>
          <p className="text-sm text-slate-500">
            Assign a participant to a course in SkillHub.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/enrollments")}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          <span className="text-sm">←</span>
          <span>Back to List</span>
        </button>
      </div>

      {/* Form Card */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 max-w-xl space-y-4">
        <h3 className="text-base font-semibold text-slate-800">
          Enrollment Information
        </h3>

        <form onSubmit={handleEnroll} className="space-y-4">
          {/* Participant */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Participant <span className="text-red-500">*</span>
            </label>
            <select
              name="participantId"
              value={form.participantId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80"
            >
              <option value="">-- Select Participant --</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.instructor}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition"
            >
              Enroll
            </button>
            <button
              type="button"
              onClick={() => navigate("/enrollments")}
              className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
