import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import ParticipantForm from "../../components/ParticipantForm";

export default function ParticipantsEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        const res = await api.get(`/participants/${id}`);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load participant data.");
        navigate("/participants");
      } finally {
        setLoading(false);
      }
    };

    loadParticipant();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      alert("Name and email are required.");
      return;
    }

    try {
      await api.put(`/participants/${id}`, form);
      navigate("/participants");
    } catch (err) {
      console.error(err);
      alert("Failed to update participant.");
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
            Edit Participant
          </h2>
          <p className="text-sm text-slate-500">
            Update participant information for SkillHub.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/participants")}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          <span className="text-sm">←</span>
          <span>Back to List</span>
        </button>
      </div>

      <ParticipantForm
        form={form}
        isEditing={true}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/participants")}
      />
    </div>
  );
}
