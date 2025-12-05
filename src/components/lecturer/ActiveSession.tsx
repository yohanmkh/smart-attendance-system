import { useState, useEffect } from 'react';
import { ArrowLeft, Users, StopCircle, MapPin, Monitor, Copy, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function ActiveSession() {
  const navigate = useNavigate();
  const { activeSession, endSession, attendanceRecords } = useSession();
  const [elapsed, setElapsed] = useState(0);
  const [qrKey, setQrKey] = useState(Date.now());

  useEffect(() => {
    if (!activeSession) {
      navigate('/lecturer');
      return;
    }

    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    endSession();
    toast.success('Session ended successfully');
    navigate('/lecturer');
  };

  const handleRegenerateQR = () => {
    setQrKey(Date.now());
    toast.success('QR code regenerated');
  };

  const sessionAttendance = attendanceRecords.filter(
    (r) => r.sessionId === activeSession?.id
  );

  if (!activeSession) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-8 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/lecturer')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndSession}
            className="bg-background text-foreground"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-primary-foreground/70 mb-2">
            {activeSession.type === 'online' ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span className="text-sm uppercase tracking-wide">
              {activeSession.type === 'online' ? 'Online Session' : 'Face-to-Face'}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{activeSession.title}</h1>
          
          <div className="text-4xl font-bold tabular-nums">
            {formatTime(elapsed)}
          </div>
          <p className="text-primary-foreground/70 text-sm mt-1">Session Duration</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* QR Code for Online Sessions */}
        {activeSession.type === 'online' && (
          <Card className="p-6 border-2 border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Students scan this QR code to submit attendance
              </p>
              <div className="bg-card p-4 border-2 border-border inline-block">
                <QRCodeSVG
                  key={qrKey}
                  value={`${activeSession.qrCode}-${qrKey}`}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="flex gap-3 justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(activeSession.qrCode || '');
                    toast.success('Code copied to clipboard');
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateQR}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Radar placeholder for Face-to-Face */}
        {activeSession.type === 'face-to-face' && (
          <Card className="p-6 border-2 border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Broadcasting location for nearby students
              </p>
              <div className="relative w-48 h-48 mx-auto border-2 border-border rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-primary flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
                {/* Simple concentric circles */}
                <div className="absolute inset-4 border border-border rounded-full" />
                <div className="absolute inset-8 border border-border rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Students within range can now submit attendance
              </p>
            </div>
          </Card>
        )}

        {/* Present Count */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                <Users className="w-7 h-7 text-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Students Present</p>
                <p className="text-3xl font-bold text-foreground">{sessionAttendance.length}</p>
              </div>
            </div>
            <div className="w-3 h-3 bg-foreground rounded-full" />
          </div>
        </Card>

        {/* Recent Submissions */}
        {sessionAttendance.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Recent Submissions</h3>
            <div className="space-y-3">
              {sessionAttendance.slice(-5).reverse().map((record) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
