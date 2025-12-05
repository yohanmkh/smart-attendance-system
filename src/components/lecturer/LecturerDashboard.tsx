import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-indigo-600 to-purple-600 px-6 pt-6 pb-8 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-foreground/70 text-sm">Welcome back</p>
              <h2 className="font-bold text-lg">{user?.name}</h2>
            </div>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <p className="text-3xl font-bold text-white">{todaySessions} Sessions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Attendance</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalAttendance} Total</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-lg mb-4 text-foreground">Create New Session</h3>
          
          <div className="space-y-4">
            {/* Face-to-Face Session */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 group border-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                onClick={() => navigate('/lecturer/create-session?type=face-to-face')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
                    <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">Face-to-Face Session</h4>
                  <p className="text-muted-foreground text-sm">
                    GPS-based attendance tracking
                  </p>
                </div>
                <motion.div
                  className="text-primary text-2xl font-bold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  →
                </motion.div>
              </div>
            </Card>
            </motion.div>

            {/* Online Session */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/50 transition-all duration-300 group border-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                onClick={() => navigate('/lecturer/create-session?type=online')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-accent/30 transition-all">
                    <Monitor className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">Online Session</h4>
                  <p className="text-muted-foreground text-sm">
                    QR code-based verification
                  </p>
                </div>
                <motion.div
                  className="text-accent text-2xl font-bold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  →
                </motion.div>
              </div>
            </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="font-bold text-lg mb-4 text-foreground">Recent Activity</h3>
          
          {attendanceRecords.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No recent attendance records</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create a session to start tracking
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {attendanceRecords.slice(-5).reverse().map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{record.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'present'
                          ? 'bg-success/10 text-success'
                          : record.status === 'late'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
