import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
  });

  const isEditing = form.id !== null;

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/participants");
      setParticipants(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ id: null, name: "", email: "", phone: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.email) {
        alert("Name dan email wajib diisi");
        return;
      }

      if (isEditing) {
        await api.put(`/participants/${form.id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
      } else {
        await api.post("/participants", {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });
      }

      resetForm();
      fetchParticipants();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan participant");
    }
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus participant ini?")) return;
    try {
      await api.delete(`/participants/${id}`);
      fetchParticipants();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus participant");
    }
  };

  const goToDetail = (id) => {
    navigate(`/participants/${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Participants</h2>
        <p className="text-sm text-slate-500">
          Kelola data peserta SkillHub (tambah, edit, hapus).
        </p>
      </div>

      {/* FORM */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-xl">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          {isEditing ? "Edit Participant" : "Add New Participant"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* LIST */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-800">
            Participant List
          </h3>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && participants.length === 0 && (
          <p className="text-sm text-slate-500">No participants found.</p>
        )}

        {!loading && participants.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600 border-b">
                    Phone
                  </th>
                  <th className="px-3 py-2 text-center font-medium text-slate-600 border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-3 py-2 border-b border-slate-100">
                      {p.id}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {p.name}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {p.email}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      {p.phone || "-"}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => goToDetail(p.id)}
                          className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2 py-1 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
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
