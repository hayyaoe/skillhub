import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ParticipantsPage from "./pages/ParticipantsPage";
import CoursesPage from "./pages/CoursesPage";
import EnrollmentsPage from "./pages/EnrollmentsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/participants" replace />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/enrollments" element={<EnrollmentsPage />} />
      </Routes>
    </Layout>
  );
}
