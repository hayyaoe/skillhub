import { useEffect, useState } from "react";
import api from "../api/client";

export default function EnrollmentsPage() {
  const [participants, setParticipants] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    participantId: "",
    courseId: "",
  });

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [pRes, cRes, eRes] = await Promise.all([
        api.get("/participants"),
        api.get("/courses"),
        api.get("/enrollments"),
      ]);

      setParticipants(pRes.data);
      setCourses(cRes.data);
      setEnrollments(eRes.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data enrollment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!form.participantId || !form.courseId) {
      alert("Pilih participant dan course");
      return;
    }

    try {
      await api.post("/enrollments", {
        participantId: Number(form.participantId),
        courseId: Number(form.courseId),
      });

      setForm({ participantId: "", courseId: "" });

      fetchAll();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Gagal melakukan enrollment");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus enrollment ini?")) return;

    try {
      await api.delete(`/enrollments/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus enrollment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Enrollments</h2>
        <p className="text-sm text-slate-500">
          Daftarkan peserta ke course tertentu dan kelola semua enrollment.
        </p>
      </div>

      {/* FORM ENROLL */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 max-w-xl">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Add Enrollment</h3>

        <form onSubmit={handleEnroll} className="space-y-4">
          {/* Participant */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Participant</label>
            <select
              name="participantId"
              value={form.participantId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80"
            >
              <option value="">-- Pilih Participant --</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Course</label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80"
            >
              <option value="">-- Pilih Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.instructor}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition"
          >
            Enroll
          </button>
        </form>
      </section>

      {/* LIST ENROLLMENT */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Enrollment List</h3>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">No enrollments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">ID</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">Participant</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">Course</th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((en, idx) => (
                  <tr key={en.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 border-b border-slate-100">{en.id}</td>

                    <td className="px-3 py-2 border-b border-slate-100">
                      {en.participant?.name} —{" "}
                      <span className="text-slate-500 text-xs">{en.participant?.email}</span>
                    </td>

                    <td className="px-3 py-2 border-b border-slate-100">
                      {en.course?.name} —{" "}
                      <span className="text-slate-500 text-xs">{en.course?.instructor}</span>
                    </td>

                    <td className="px-3 py-2 border-b border-slate-100 text-center">
                      <button
                        onClick={() => handleDelete(en.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
