export type UserRole = 'student' | 'lecturer';

export type SessionType = 'face-to-face' | 'online';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  department?: string;
}

export interface Session {
  id: string;
  title: string;
  lecturerId: string;
  lecturerName: string;
  type: SessionType;
  allowedLateness: number; // in minutes
  latitude?: number;
  longitude?: number;
  qrCode?: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  presentCount: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  status: AttendanceStatus;
  distance?: number; // in meters
}

export interface NearbySession extends Session {
  distance: number; // in meters
}
