import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import CourseList from "../../components/CourseList";

export default function CoursesListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const goToCreate = () => navigate("/courses/create");
  const goToEdit = (id) => navigate(`/courses/${id}/edit`);
  const goToDetail = (id) => navigate(`/courses/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      await fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Courses</h2>
          <p className="text-sm text-slate-500">
            Manage course data for SkillHub.
          </p>
        </div>

        <button
          onClick={goToCreate}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          + Add Course
        </button>
      </div>

      <CourseList
        courses={courses}
        loading={loading}
        error={error}
        onDetail={goToDetail}
        onEdit={(c) => goToEdit(c.id)}
        onDelete={handleDelete}
      />
    </div>
  );
}
