import { Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import ParticipantsPage from "./pages/ParticipantsPage";
import ParticipantDetailPage from "./pages/ParticipantDetailPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import EnrollmentsPage from "./pages/EnrollmentsPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashborad" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/participants/:id" element={<ParticipantDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/enrollments" element={<EnrollmentsPage />} />
      </Routes>
    </Layout>
  );
}
