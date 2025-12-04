import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { SessionDetails } from '@/components/student/SessionDetails';
import { SuccessScreen } from '@/components/student/SuccessScreen';

export function StudentPages() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/session/:sessionId" element={<SessionDetails />} />
      <Route path="/success" element={<SuccessScreen />} />
    </Routes>
  );
}
