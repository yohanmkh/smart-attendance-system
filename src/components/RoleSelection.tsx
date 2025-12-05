import { GraduationCap, BookOpen, Navigation, QrCode, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/attendance';
import { useNavigate } from 'react-router-dom';

export function RoleSelection() {
  const { setSelectedRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-24 text-primary-foreground">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-card border-2 border-border rounded-lg flex items-center justify-center mx-auto mb-4">
            <img
              src="/logo.png"
              alt="Smart Attendance Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Smart Attendance
          </h1>
          
          <p className="text-primary-foreground/80 text-base mb-2">
            Effortless attendance tracking for modern education
          </p>
        </div>

        {/* Role selection label */}
        <div className="absolute left-1/2 -translate-x-1/2 mt-6">
          <p className="text-center font-bold text-sm bg-card text-foreground py-2 px-4 border-2 border-border">
            Select your role to continue
          </p>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="flex-1 px-6 pt-16 pb-8">
        <div className="max-w-md mx-auto space-y-4">
          {/* Student Card */}
          <Card
            className="p-6 cursor-pointer hover:bg-muted border-2 border-border"
            onClick={() => handleRoleSelect('student')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">Student</h3>
                <p className="text-muted-foreground text-sm">
                  Submit attendance & view records
                </p>
              </div>
              <span className="text-foreground text-xl">→</span>
            </div>
          </Card>

          {/* Lecturer Card */}
          <Card
            className="p-6 cursor-pointer hover:bg-muted border-2 border-border"
            onClick={() => handleRoleSelect('lecturer')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">Lecturer</h3>
                <p className="text-muted-foreground text-sm">
                  Create sessions & manage attendance
                </p>
              </div>
              <span className="text-foreground text-xl">→</span>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-card border-2 border-border p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">GPS Tracking</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">QR Codes</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
                  <Radio className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
