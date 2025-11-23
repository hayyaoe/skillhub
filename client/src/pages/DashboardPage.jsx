import { useEffect, useState } from "react";
import api from "../api/client";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-red-500">
        Failed to load dashboard information.
      </p>
    );
  }

  const { totals, recentParticipants, recentCourses } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          A quick overview of SkillHub activity: participants, courses, and enrollments.
        </p>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Participants"
          value={totals.participants}
          subtitle="Registered participants"
        />
        <StatCard
          label="Total Courses"
          value={totals.courses}
          subtitle="Available courses"
        />
        <StatCard
          label="Total Enrollments"
          value={totals.enrollments}
          subtitle="Active enrollments"
        />
      </section>

      {/* Recent Data */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Participants */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-slate-800 mb-2">
            Recent Participants
          </h3>

          {recentParticipants.length === 0 ? (
            <p className="text-sm text-slate-500">No participants yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentParticipants.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between border-b last:border-b-0 border-slate-100 pb-2"
                >
                  <div>
                    <p className="font-medium text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.email}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    ID #{p.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Courses */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <h3 className="text-base font-semibold text-slate-800 mb-2">
            Recent Courses
          </h3>

          {recentCourses.length === 0 ? (
            <p className="text-sm text-slate-500">No courses available.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentCourses.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between border-b last:border-b-0 border-slate-100 pb-2"
                >
                  <div>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      Instructor: {c.instructor}
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    ID #{c.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, subtitle }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
