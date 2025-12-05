import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, MapPin, Monitor, RefreshCw, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const { nearbySessions, refreshNearbySessions } = useSession();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate initial GPS scan
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsScanning(true);
    refreshNearbySessions();
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    setIsScanning(false);
    toast.success('Sessions refreshed');
  };

  const handleSelectSession = (sessionId: string) => {
    navigate(`/student/session/${sessionId}`);
  };

  // Hick's Law: Only show active, relevant sessions to reduce cognitive load
  const activeSessions = nearbySessions.filter(s => s.isActive);
  const faceToFaceSessions = activeSessions.filter(s => s.type === 'face-to-face');
  const onlineSessions = activeSessions.filter(s => s.type === 'online');

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

        {/* GPS Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Navigation className="w-5 h-5 text-white" />
                {isScanning && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {isScanning ? 'Scanning for sessions...' : `${activeSessions.length} active session${activeSessions.length !== 1 ? 's' : ''} found`}
                </p>
                <p className="text-white/80 text-xs">GPS Location Active</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 -mt-2">
        {isScanning ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Skeleton Loading State - Visibility of System Status */}
            <div className="space-y-2 mb-6">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Scanning for nearby sessions...</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Face-to-Face Sessions */}
            {faceToFaceSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Nearby Sessions
                </h3>
                <div className="space-y-3">
                  {faceToFaceSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="p-5 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 border-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                        onClick={() => handleSelectSession(session.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                          </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-muted-foreground text-sm">{session.lecturerName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-success font-medium">
                              {session.distance}m away
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {session.presentCount} present
                            </span>
                          </div>
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
                  ))}
                </div>
              </motion.div>
            )}

            {/* Online Sessions */}
            {onlineSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-accent" />
                  Online Sessions
                </h3>
                <div className="space-y-3">
                  {onlineSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="p-5 cursor-pointer hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/50 transition-all duration-300 border-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                        onClick={() => handleSelectSession(session.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <Monitor className="w-7 h-7 text-white" strokeWidth={2.5} />
                          </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-muted-foreground text-sm">{session.lecturerName}</p>
                          <span className="text-xs text-muted-foreground">
                            {session.presentCount} present
                          </span>
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
                  ))}
                </div>
              </motion.div>
            )}

            {activeSessions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">No Active Sessions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  No active sessions are available nearby right now.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="mt-2"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
