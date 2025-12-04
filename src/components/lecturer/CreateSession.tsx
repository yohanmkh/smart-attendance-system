import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Monitor, Clock, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/context/SessionContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SessionType } from '@/types/attendance';
import { toast } from 'sonner';

export function CreateSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createSession } = useSession();
  
  const sessionType = (searchParams.get('type') || 'face-to-face') as SessionType;
  const [title, setTitle] = useState('');
  const [allowedLateness, setAllowedLateness] = useState(10);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    if (sessionType === 'face-to-face') {
      requestLocationPermission();
    }
  }, [sessionType]);

  const requestLocationPermission = async () => {
    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });
      setLocationGranted(true);
      toast.success('Location access granted');
    } catch {
      toast.error('Location access denied. Please enable GPS.');
    }
    setIsGettingLocation(false);
  };

  const handleCreateSession = () => {
    if (!title.trim()) {
      toast.error('Please enter a class title');
      return;
    }

    if (sessionType === 'face-to-face' && !locationGranted) {
      toast.error('Location permission required for face-to-face sessions');
      return;
    }

    createSession(title, sessionType, allowedLateness);
    toast.success('Session created successfully!');
    navigate('/lecturer/active-session');
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className={`px-6 pt-6 pb-8 text-primary-foreground ${sessionType === 'online' ? 'bg-gradient-accent' : 'bg-gradient-hero'}`}>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/lecturer')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Create Session</h1>
            <p className="text-primary-foreground/80 text-sm">
              {sessionType === 'online' ? 'Online QR-based' : 'Face-to-face GPS-based'}
            </p>
          </div>
        </div>

        {/* Session Type Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 bg-card/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            {sessionType === 'online' ? (
              <Monitor className="w-10 h-10" />
            ) : (
              <MapPin className="w-10 h-10" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="px-6 py-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="space-y-6">
              {/* Class Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Class Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Allowed Lateness */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Allowed Lateness
                </Label>
                <div className="flex items-center gap-3">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setAllowedLateness(mins)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        allowedLateness === mins
                          ? 'bg-gradient-primary text-primary-foreground shadow-md'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS Status (Face-to-face only) */}
              {sessionType === 'face-to-face' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    GPS Location
                  </Label>
                  <div
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      locationGranted
                        ? 'border-success/30 bg-success/5'
                        : 'border-warning/30 bg-warning/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isGettingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            locationGranted ? 'bg-success' : 'bg-warning'
                          }`}
                        />
                      )}
                      <span className="text-sm font-medium">
                        {isGettingLocation
                          ? 'Getting location...'
                          : locationGranted
                          ? 'Location access granted'
                          : 'Location access required'}
                      </span>
                    </div>
                    {!locationGranted && !isGettingLocation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={requestLocationPermission}
                        className="mt-3"
                      >
                        Grant Access
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Create Button */}
              <Button
                onClick={handleCreateSession}
                className="w-full"
                size="lg"
                disabled={sessionType === 'face-to-face' && !locationGranted}
              >
                Start Session
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
