import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Monitor, Camera, Loader2, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BrowserMultiFormatReader } from '@zxing/browser';

export function SessionDetails() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { user } = useAuth();
  const { nearbySessions, submitAttendance } = useSession();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const session = nearbySessions.find(s => s.id === sessionId);

  useEffect(() => {
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current = null;
      }
    };
  }, []);

  const handleSubmitAttendance = async () => {
    if (!session || !user) return;

    if (session.type === 'online') {
      setShowScanner(true);
      startScanner();
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (session.distance && session.distance <= 50) {
      const record = submitAttendance(session.id, user.id, user.name);
      navigate('/student/success', { state: { record, session } });
    } else {
      toast.error('You are too far from the classroom');
      setIsSubmitting(false);
    }
  };

  const startScanner = async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;

      if (!selectedDeviceId) {
        setScannerError('No camera found');
        return;
      }

      if (videoRef.current) {
        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result) => {
            if (result) {
              handleQRScanned(result.getText());
            }
          }
        );
      }
    } catch (error) {
      setScannerError('Unable to access camera');
    }
  };

  const handleQRScanned = async (data: string) => {
    if (!session || !user) return;
    
    codeReaderRef.current = null;
    setShowScanner(false);
    setIsSubmitting(true);

    if (data.includes('attendance://')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const record = submitAttendance(session.id, user.id, user.name);
      navigate('/student/success', { state: { record, session } });
    } else {
      toast.error('Invalid QR code');
      setIsSubmitting(false);
    }
  };

  const closeScanner = () => {
    codeReaderRef.current = null;
    setShowScanner(false);
    setScannerError(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-20 text-primary-foreground">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/student')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/70 text-sm uppercase tracking-wide">
              {session.type === 'online' ? 'Online Session' : 'Face-to-Face'}
            </p>
            <h1 className="text-xl font-bold">{session.title}</h1>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-20 h-20 border-2 border-primary-foreground/30 flex items-center justify-center">
            {session.type === 'online' ? (
              <Monitor className="w-10 h-10" />
            ) : (
              <MapPin className="w-10 h-10" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-8">
        <Card className="p-6 border-2 border-border">
          {/* Lecturer Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="w-12 h-12 border-2 border-border flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">{session.lecturerName}</p>
              <p className="text-sm text-muted-foreground">Instructor</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started</span>
              <span className="font-medium text-foreground">
                {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Late after</span>
              <span className="font-medium text-foreground">{session.allowedLateness} minutes</span>
            </div>
            {session.type === 'face-to-face' && session.distance !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your distance</span>
                <span className="font-medium text-foreground">
                  {session.distance}m
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Present</span>
              <span className="font-medium text-foreground">{session.presentCount} students</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitAttendance}
            className="w-full mt-4"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : session.type === 'online' ? (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Scan QR Code
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Attendance
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-foreground/90 z-50 flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-background font-bold text-lg">Scan QR Code</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeScanner}
              className="text-background"
            >
              Cancel
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            {scannerError ? (
              <div className="text-center">
                <p className="text-background mb-4">{scannerError}</p>
                <Button onClick={startScanner}>Try Again</Button>
              </div>
            ) : (
              <div className="relative w-full max-w-sm aspect-square">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover border-2 border-background"
                />
                {/* Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-background" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 text-center">
            <p className="text-background/70 text-sm">
              Position the QR code within the frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
