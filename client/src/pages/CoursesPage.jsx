import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    instructor: "",
  });

  const isEditing = form.id !== null;
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      instructor: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.instructor) {
      alert("Name dan instructor wajib diisi");
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/courses/${form.id}`, {
          name: form.name,
          description: form.description,
          instructor: form.instructor,
        });
      } else {
        await api.post("/courses", {
          name: form.name,
          description: form.description,
          instructor: form.instructor,
        });
      }

      resetForm();
      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan course");
    }
  };

  const handleEdit = (course) => {
    setForm({
      id: course.id,
      name: course.name,
      description: course.description || "",
      instructor: course.instructor || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus course ini?")) return;

    try {
      await api.delete(`/courses/${id}`);
      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus course");
    }
  };

  const goToDetail = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Courses</h2>
        <p className="text-sm text-slate-500">
          Kelola data kelas SkillHub.
        </p>
      </div>

      {/* FORM */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-xl">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          {isEditing ? "Edit Course" : "Add New Course"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              placeholder="Contoh: Dasar Pemrograman Web"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Instructor <span className="text-red-500">*</span>
            </label>
            <input
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              placeholder="Nama pengajar"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 resize-none"
              placeholder="Deskripsi singkat materi yang dipelajari"
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

      {/* LIST AS CARDS */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">
            Course List
          </h3>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && courses.length === 0 && (
          <p className="text-sm text-slate-500">No courses found.</p>
        )}

        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/40"
              >
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">ID #{c.id}</p>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Instructor:{" "}
                    <span className="font-medium">{c.instructor}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                    {c.description || "Tidak ada deskripsi."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => goToDetail(c.id)}
                    className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    View Detail
                  </button>
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1.5 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
