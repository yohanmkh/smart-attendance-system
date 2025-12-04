import React, { createContext, useContext, useState, useCallback } from 'react';
import { Session, NearbySession, AttendanceRecord, SessionType, AttendanceStatus } from '@/types/attendance';

interface SessionContextType {
  activeSession: Session | null;
  nearbySessions: NearbySession[];
  attendanceRecords: AttendanceRecord[];
  createSession: (title: string, type: SessionType, allowedLateness: number) => Session;
  endSession: () => void;
  submitAttendance: (sessionId: string, studentId: string, studentName: string) => AttendanceRecord;
  refreshNearbySessions: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Mock nearby sessions for students
const mockNearbySessions: NearbySession[] = [
  {
    id: 'sess-001',
    title: 'Introduction to Algorithms',
    lecturerId: 'lec-001',
    lecturerName: 'Dr. Sarah Johnson',
    type: 'face-to-face',
    allowedLateness: 10,
    latitude: 1.2966,
    longitude: 103.7764,
    startTime: new Date(),
    isActive: true,
    presentCount: 23,
    distance: 15,
  },
  {
    id: 'sess-002',
    title: 'Data Structures Lab',
    lecturerId: 'lec-002',
    lecturerName: 'Prof. Michael Lee',
    type: 'face-to-face',
    allowedLateness: 15,
    latitude: 1.2970,
    longitude: 103.7760,
    startTime: new Date(Date.now() - 1800000), // 30 min ago
    isActive: true,
    presentCount: 18,
    distance: 45,
  },
  {
    id: 'sess-003',
    title: 'Web Development Workshop',
    lecturerId: 'lec-003',
    lecturerName: 'Dr. Emily Wong',
    type: 'online',
    allowedLateness: 5,
    startTime: new Date(),
    isActive: true,
    presentCount: 56,
    distance: 0,
  },
];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [nearbySessions, setNearbySessions] = useState<NearbySession[]>(mockNearbySessions);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [presentCount, setPresentCount] = useState(0);

  const createSession = useCallback((title: string, type: SessionType, allowedLateness: number): Session => {
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      title,
      lecturerId: 'lec-001',
      lecturerName: 'Dr. Sarah Johnson',
      type,
      allowedLateness,
      latitude: type === 'face-to-face' ? 1.2966 : undefined,
      longitude: type === 'face-to-face' ? 103.7764 : undefined,
      qrCode: type === 'online' ? `attendance://${Date.now()}-${Math.random().toString(36).substring(7)}` : undefined,
      startTime: new Date(),
      isActive: true,
      presentCount: 0,
    };
    setActiveSession(newSession);
    setPresentCount(0);
    return newSession;
  }, []);

  const endSession = useCallback(() => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        isActive: false,
        endTime: new Date(),
      });
    }
    setActiveSession(null);
    setPresentCount(0);
  }, [activeSession]);

  const submitAttendance = useCallback((sessionId: string, studentId: string, studentName: string): AttendanceRecord => {
    const session = nearbySessions.find(s => s.id === sessionId) || activeSession;
    const now = new Date();
    
    let status: AttendanceStatus = 'present';
    if (session) {
      const minutesLate = (now.getTime() - session.startTime.getTime()) / 60000;
      if (minutesLate > session.allowedLateness) {
        status = 'late';
      }
    }

    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      sessionId,
      studentId,
      studentName,
      timestamp: now,
      status,
      distance: session ? (session as NearbySession).distance : undefined,
    };

    setAttendanceRecords(prev => [...prev, record]);
    setPresentCount(prev => prev + 1);
    
    // Update session present count
    if (activeSession && activeSession.id === sessionId) {
      setActiveSession(prev => prev ? { ...prev, presentCount: prev.presentCount + 1 } : null);
    }
    
    setNearbySessions(prev => 
      prev.map(s => s.id === sessionId ? { ...s, presentCount: s.presentCount + 1 } : s)
    );

    return record;
  }, [activeSession, nearbySessions]);

  const refreshNearbySessions = useCallback(() => {
    // Simulate GPS refresh - in real app, would use actual geolocation
    setNearbySessions([...mockNearbySessions]);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        nearbySessions,
        attendanceRecords,
        createSession,
        endSession,
        submitAttendance,
        refreshNearbySessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
