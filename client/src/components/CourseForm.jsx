import React from "react";

export default function CourseForm({
  form,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-xl">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        {isEditing ? "Edit Course" : "Add New Course"}
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Course Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Course Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            placeholder="Example: Introduction to Web Development"
          />
        </div>

        {/* Instructor */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Instructor <span className="text-red-500">*</span>
          </label>
          <input
            name="instructor"
            value={form.instructor}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            placeholder="Enter instructor name"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 resize-none"
            placeholder="Short overview of what this course covers"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 
                       px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
          >
            {isEditing ? "Update" : "Create"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 
                         px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
