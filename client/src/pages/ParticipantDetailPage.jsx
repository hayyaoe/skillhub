import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ParticipantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchParticipant = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/participants/${id}`);
      setParticipant(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("Participant tidak ditemukan.");
      } else {
        setError("Gagal memuat detail participant.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, [id]);

  const goBack = () => {
    navigate("/participants");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="text-xs mb-2 text-slate-600 hover:text-slate-900"
        >
          ← Back to Participants
        </button>
        <p className="text-sm text-slate-500">Loading participant detail...</p>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="text-xs mb-2 text-slate-600 hover:text-slate-900"
        >
          ← Back to Participants
        </button>
        <p className="text-sm text-red-500">
          {error || "Participant tidak ditemukan."}
        </p>
      </div>
    );
  }

  const enrollments = participant.enrollments || [];

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="text-xs text-slate-600 hover:text-slate-900"
      >
        ← Back to Participants
      </button>

      {/* Info utama participant */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-3">
        <div>
          <p className="text-xs text-slate-500">
            Participant ID #{participant.id}
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            {participant.name}
          </h2>
        </div>

        <div className="space-y-1 text-sm text-slate-700">
          <p>
            <span className="font-medium">Email:</span>{" "}
            <span className="text-slate-800">{participant.email}</span>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <span className="text-slate-800">
              {participant.phone || "-"}
            </span>
          </p>
        </div>
      </section>

      {/* Kelas yang diikuti */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-3">
          Kelas yang Diikuti
        </h3>

        {enrollments.length === 0 ? (
          <p className="text-sm text-slate-500">
            Peserta ini belum terdaftar di kelas mana pun.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {enrollments.map((en) => (
              <li
                key={en.id}
                className="flex items-center justify-between border-b last:border-b-0 border-slate-100 pb-1"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {en.course?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Instructor: {en.course?.instructor}
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
