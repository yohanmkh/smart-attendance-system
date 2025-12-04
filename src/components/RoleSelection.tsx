import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-hero px-6 pt-16 pb-24 text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-card/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Smart Attendance</h1>
          <p className="text-primary-foreground/80 text-lg">
            Effortless attendance tracking for modern education
          </p>
        </motion.div>
      </div>

      {/* Role Selection Cards */}
      <div className="flex-1 px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto space-y-4"
        >
          <p className="text-center text-muted-foreground mb-6 font-medium">
            Select your role to continue
          </p>

          {/* Student Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
            onClick={() => handleRoleSelect('student')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">Student</h3>
                <p className="text-muted-foreground text-sm">
                  Submit attendance & view records
                </p>
              </div>
              <motion.div
                className="text-primary"
                whileHover={{ x: 5 }}
              >
                →
              </motion.div>
            </div>
          </Card>

          {/* Lecturer Card */}
          <Card
            className="p-6 cursor-pointer hover:shadow-xl hover:border-accent/30 transition-all duration-300 group"
            onClick={() => handleRoleSelect('lecturer')}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <BookOpen className="w-7 h-7 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">Lecturer</h3>
                <p className="text-muted-foreground text-sm">
                  Create sessions & manage attendance
                </p>
              </div>
              <motion.div
                className="text-accent"
                whileHover={{ x: 5 }}
              >
                →
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-md mx-auto mt-12 text-center"
        >
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              GPS Tracking
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              QR Codes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              Real-time
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
