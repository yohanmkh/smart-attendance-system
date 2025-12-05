import { MapPin, Monitor, LogOut, User, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';

export function LecturerDashboard() {
  const { user, logout } = useAuth();
  const { attendanceRecords } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const todaySessions = 3;
  const totalAttendance = attendanceRecords.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-8 text-primary-foreground">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-primary-foreground/30 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm">Welcome back</p>
              <h2 className="font-bold text-lg">{user?.name}</h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-foreground/20 border border-primary-foreground/30 p-5">
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{todaySessions} Sessions</p>
          </div>
          <div className="bg-primary-foreground/20 border border-primary-foreground/30 p-5">
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Attendance</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{totalAttendance} Total</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <h3 className="font-bold text-lg mb-4 text-foreground">Create New Session</h3>
        
        <div className="space-y-4">
          {/* Face-to-Face Session */}
          <Card
            className="p-6 cursor-pointer hover:bg-muted border-2 border-border"
            onClick={() => navigate('/lecturer/create-session?type=face-to-face')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                <MapPin className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">Face-to-Face Session</h4>
                <p className="text-muted-foreground text-sm">
                  GPS-based attendance tracking
                </p>
              </div>
              <span className="text-foreground text-xl">→</span>
            </div>
          </Card>

          {/* Online Session */}
          <Card
            className="p-6 cursor-pointer hover:bg-muted border-2 border-border"
            onClick={() => navigate('/lecturer/create-session?type=online')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                <Monitor className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">Online Session</h4>
                <p className="text-muted-foreground text-sm">
                  QR code-based verification
                </p>
              </div>
              <span className="text-foreground text-xl">→</span>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-foreground">Recent Activity</h3>
          
          {attendanceRecords.length === 0 ? (
            <Card className="p-6 text-center border-2 border-border">
              <p className="text-muted-foreground">No recent attendance records</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a session to start tracking
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {attendanceRecords.slice(-5).reverse().map((record) => (
                <Card key={record.id} className="p-4 border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{record.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 border border-border text-xs font-medium">
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
