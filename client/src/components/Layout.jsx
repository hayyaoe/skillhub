import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-1 rounded-md text-sm font-medium ${
      location.pathname.startsWith(path)
        ? "bg-slate-800 text-white"
        : "text-slate-100 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-slate-50 shadow">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">
              SkillHub Dashboard
            </h1>
            <nav className="flex gap-2">
              <Link to="/participants" className={linkClass("/participants")}>
                Participants
              </Link>
              <Link to="/courses" className={linkClass("/courses")}>
                Courses
              </Link>
              <Link to="/enrollments" className={linkClass("/enrollments")}>
                Enrollments
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
