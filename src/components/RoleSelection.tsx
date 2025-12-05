import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Sparkles, Navigation, QrCode, Radio } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-indigo-600 to-purple-600 px-6 pt-12 pb-24 text-white z-0">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl border border-white/30 overflow-hidden"
          >
            <motion.img
              src="/logo.png"
              alt="Smart Attendance Logo"
              className="w-full h-full object-contain p-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
          >
            Smart Attendance
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white/90 text-base md:text-lg font-medium mb-2"
          >
            Effortless attendance tracking for modern education
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/80 text-sm">Powered by AI & GPS Technology</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        </motion.div>

        {/* Select your role - positioned in the middle of gradient overlap */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ transform: 'translateY(50%)' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white font-bold text-lg bg-white/20 backdrop-blur-xl py-3 px-6 rounded-xl shadow-lg border border-white/30 relative z-20"
          >
            Select your role to continue
          </motion.p>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="flex-1 px-6 -mt-16 relative z-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md mx-auto space-y-5 pt-28"
        >
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 border-2 hover:border-primary/50 transition-all duration-300 group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl"
              onClick={() => handleRoleSelect('student')}
            >
              <div className="flex items-center gap-5">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <GraduationCap className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Student</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Submit attendance & view records
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

          {/* Lecturer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 cursor-pointer hover:shadow-2xl hover:shadow-accent/20 border-2 hover:border-accent/50 transition-all duration-300 group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl"
              onClick={() => handleRoleSelect('lecturer')}
            >
              <div className="flex items-center gap-5">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-accent/30 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Lecturer</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Create sessions & manage attendance
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
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-md mx-auto mt-6"
        >
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <Navigation className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">GPS Tracking</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                  <QrCode className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">QR Codes</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md">
                  <Radio className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Real-time</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
