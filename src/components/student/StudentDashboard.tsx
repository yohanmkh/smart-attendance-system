import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, MapPin, Monitor, RefreshCw, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  const faceToFaceSessions = nearbySessions.filter(s => s.type === 'face-to-face');
  const onlineSessions = nearbySessions.filter(s => s.type === 'online');

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-hero px-6 pt-6 pb-8 text-primary-foreground">
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
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* GPS Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/10 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Navigation className="w-5 h-5" />
                {isScanning && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isScanning ? 'Scanning for sessions...' : `${nearbySessions.length} sessions found`}
                </p>
                <p className="text-primary-foreground/70 text-xs">GPS Location Active</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-primary-foreground hover:bg-primary-foreground/10"
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
            className="flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Scanning for nearby sessions...</p>
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
                    <Card
                      key={session.id}
                      className="p-4 cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-primary-foreground" />
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
                          className="text-primary text-xl"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </Card>
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
                    <Card
                      key={session.id}
                      className="p-4 cursor-pointer hover:shadow-xl hover:border-accent/30 transition-all duration-300"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-muted-foreground text-sm">{session.lecturerName}</p>
                          <span className="text-xs text-muted-foreground">
                            {session.presentCount} present
                          </span>
                        </div>
                        <motion.div
                          className="text-accent text-xl"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {nearbySessions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">No Sessions Found</h3>
                <p className="text-muted-foreground text-sm">
                  Pull down to refresh or check back later
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
