import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LecturerDashboard } from '@/components/lecturer/LecturerDashboard';
import { CreateSession } from '@/components/lecturer/CreateSession';
import { ActiveSession } from '@/components/lecturer/ActiveSession';

export function LecturerPages() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'lecturer') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<LecturerDashboard />} />
      <Route path="/create-session" element={<CreateSession />} />
      <Route path="/active-session" element={<ActiveSession />} />
    </Routes>
  );
}
