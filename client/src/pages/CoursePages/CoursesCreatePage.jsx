import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import CourseForm from "../../components/CourseForm";

export default function CoursesCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    instructor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.instructor) {
      alert("Name and instructor are required.");
      return;
    }

    try {
      await api.post("/courses", {
        name: form.name,
        description: form.description,
        instructor: form.instructor,
      });
      navigate("/courses");
    } catch (err) {
      console.error(err);
      alert("Failed to create course.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Back */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Add Course</h2>
          <p className="text-sm text-slate-500">
            Add a new course to SkillHub.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          <span className="text-sm">←</span>
          <span>Back to List</span>
        </button>
      </div>

      <CourseForm
        form={form}
        isEditing={false}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
