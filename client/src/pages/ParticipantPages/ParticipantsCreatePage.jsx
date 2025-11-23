import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import ParticipantForm from "../../components/ParticipantForm";

export default function ParticipantsCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
      await api.post("/participants", form);
      navigate("/participants");
    } catch (err) {
      console.error(err);
      alert("Failed to create participant.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Back */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Add Participant
          </h2>
          <p className="text-sm text-slate-500">
            Add a new participant to SkillHub.
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
        isEditing={false}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
