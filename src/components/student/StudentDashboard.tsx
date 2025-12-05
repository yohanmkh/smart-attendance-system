import { useState, useEffect } from 'react';
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

  const activeSessions = nearbySessions.filter(s => s.isActive);
  const faceToFaceSessions = activeSessions.filter(s => s.type === 'face-to-face');
  const onlineSessions = activeSessions.filter(s => s.type === 'online');

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

        {/* GPS Status */}
        <div className="bg-primary-foreground/20 border border-primary-foreground/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-primary-foreground" />
              <div>
                <p className="font-medium text-primary-foreground">
                  {isScanning ? 'Scanning for sessions...' : `${activeSessions.length} active session${activeSessions.length !== 1 ? 's' : ''} found`}
                </p>
                <p className="text-primary-foreground/80 text-xs">GPS Location Active</p>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {isScanning ? (
          <div className="space-y-4">
            <div className="space-y-2 mb-6">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 border-2 border-border">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12" />
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
          </div>
        ) : (
          <>
            {/* Face-to-Face Sessions */}
            {faceToFaceSessions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Nearby Sessions
                </h3>
                <div className="space-y-3">
                  {faceToFaceSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-5 cursor-pointer hover:bg-muted border-2 border-border"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-muted-foreground text-sm">{session.lecturerName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-foreground font-medium">
                              {session.distance}m away
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {session.presentCount} present
                            </span>
                          </div>
                        </div>
                        <span className="text-foreground text-xl">→</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Online Sessions */}
            {onlineSessions.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Online Sessions
                </h3>
                <div className="space-y-3">
                  {onlineSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-5 cursor-pointer hover:bg-muted border-2 border-border"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{session.title}</h4>
                          <p className="text-muted-foreground text-sm">{session.lecturerName}</p>
                          <span className="text-xs text-muted-foreground">
                            {session.presentCount} present
                          </span>
                        </div>
                        <span className="text-foreground text-xl">→</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto border-2 border-border flex items-center justify-center mb-4">
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
