import React from "react";

export default function ParticipantForm({
  form,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 max-w-2xl">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800">
          {isEditing ? "Edit Participant" : "Add New Participant"}
        </h3>
        <p className="text-xs text-slate-500">
          Isi data peserta SkillHub dengan lengkap.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Row: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              placeholder="Nama peserta"
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
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
              placeholder="email@contoh.com"
            />
          </div>
        </div>

        {/* Row: Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Phone (opsional)
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
            placeholder="No. HP peserta"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-2">
          <p className="text-xs text-slate-500">
            Kolom bertanda <span className="text-red-500">*</span> wajib diisi.
          </p>

          <div className="flex gap-2 justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
