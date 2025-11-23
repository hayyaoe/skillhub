import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function ParticipantsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await api.get(`/participants/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load participant details.");
        navigate("/participants");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id, navigate]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-500">Participant not found.</p>
        <button
          onClick={() => navigate("/participants")}
          className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800"
        >
          ← Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Participant Details
          </h2>
          <p className="text-sm text-slate-500">
            Complete information about the participant and their enrolled
            courses.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/participants")}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <span className="text-sm">←</span>
            <span>Back to List</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/participants/${id}/edit`)}
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 max-w-2xl">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Participant
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{data.name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-500">Email</p>
            <p className="font-medium break-all">{data.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-slate-500">Phone</p>
            <p className="font-medium">
              {data.phone || <span className="text-slate-400">—</span>}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-3">
        <h3 className="text-base font-semibold text-slate-800">
          Enrolled Courses
        </h3>

        {(!data.enrollments || data.enrollments.length === 0) && (
          <p className="text-sm text-slate-500">
            This participant is not enrolled in any course.
          </p>
        )}

        {data.enrollments && data.enrollments.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {data.enrollments.map((enroll) => (
              <li key={enroll.id} className="py-2 text-sm">
                <p className="font-medium text-slate-900">
                  {enroll.course.name}
                </p>
                {enroll.course.instructor && (
                  <p className="text-xs text-slate-500">
                    Instructor: {enroll.course.instructor}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
