import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CourseDetailPage from "./pages/CoursePages/CourseDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ParticipantsListPage from "./pages/ParticipantPages/ParticipantsListPage";
import ParticipantsCreatePage from "./pages/ParticipantPages/ParticipantsCreatePage";
import ParticipantsEditPage from "./pages/ParticipantPages/ParticipantsEditPage";
import ParticipantsDetailPage from "./pages/ParticipantPages/ParticipantDetailPage";
import CoursesListPage from "./pages/CoursePages/CoursesListPage";
import CoursesCreatePage from "./pages/CoursePages/CoursesCreatePage";
import CoursesEditPage from "./pages/CoursePages/CoursesEditPage";
import EnrollmentsCreatePage from "./pages/EnrollmentPages/EnrollmentsCreatePage";
import EnrollmentsListPage from "./pages/EnrollmentPages/EnrollmentsListPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashborad" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/participants" element={<ParticipantsListPage />} />
        <Route path="/participants/create" element={<ParticipantsCreatePage /> }/>
        <Route path="/participants/:id/edit" element={<ParticipantsEditPage />} />
        <Route path="/participants/:id" element={<ParticipantsDetailPage />} />
        <Route path="/courses" element={<CoursesListPage />} />
        <Route path="/courses/create" element={<CoursesCreatePage />} />
        <Route path="/courses/:id/edit" element={<CoursesEditPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/enrollments" element={<EnrollmentsListPage />} />
        <Route path="/enrollments/create" element={<EnrollmentsCreatePage />} />
      </Routes>
    </Layout>
  );
}
