import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function EnrollmentsListPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enrollments");
      setEnrollments(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load enrollment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const goToCreate = () => navigate("/enrollments/create");

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enrollment?")) return;

    try {
      await api.delete(`/enrollments/${id}`);
      await fetchEnrollments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete enrollment.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Enrollments</h2>
          <p className="text-sm text-slate-500">
            View and manage all participant–course enrollments in SkillHub.
          </p>
        </div>

        <button
          onClick={goToCreate}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          + Add Enrollment
        </button>
      </div>

      {/* Enrollment List */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          Enrollment List
        </h3>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">No enrollments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    Participant
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    Course
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((en, idx) => (
                  <tr
                    key={en.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 border-b border-slate-100">
                      {en.id}
                    </td>

                    <td className="px-3 py-2 border-b border-slate-100">
                      {en.participant?.name} —{" "}
                      <span className="text-slate-500 text-xs">
                        {en.participant?.email}
                      </span>
                    </td>

                    <td className="px-3 py-2 border-b border-slate-100">
                      {en.course?.name} —{" "}
                      <span className="text-slate-500 text-xs">
                        {en.course?.instructor}
                      </span>
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
