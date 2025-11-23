import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import ParticipantList from "../../components/ParticipantList";

export default function ParticipantsListPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/participants");
      setParticipants(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load participants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const goToCreate = () => navigate("/participants/create");
  const goToEdit = (id) => navigate(`/participants/${id}/edit`);
  const goToDetail = (id) => navigate(`/participants/${id}`);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    try {
      await api.delete(`/participants/${id}`);
      fetchParticipants();
    } catch (err) {
      console.error(err);
      alert("Failed to delete participant.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Participants</h2>
          <p className="text-sm text-slate-500">
            Manage participant data for SkillHub.
          </p>
        </div>

        <button
          onClick={goToCreate}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          + Add Participant
        </button>
      </div>

      <ParticipantList
        participants={participants}
        loading={loading}
        error={error}
        onDetail={goToDetail}
        onEdit={(p) => goToEdit(p.id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
