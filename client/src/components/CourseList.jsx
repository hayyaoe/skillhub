import React from "react";

export default function CourseList({
  courses,
  loading,
  error,
  onDetail,
  onEdit,
  onDelete,
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Course List</h3>
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
                  onClick={() => onDetail(c.id)}
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  View Detail
                </button>
                <button
                  onClick={() => onEdit(c)}
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
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
  );
}
