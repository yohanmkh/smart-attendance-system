import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { AttendanceRecord, Session } from '@/types/attendance';

interface LocationState {
  record: AttendanceRecord;
  session: Session;
}

export function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state) {
    navigate('/student');
    return null;
  }

  const { record, session } = state;
  const isLate = record.status === 'late';

  return (
    <div className={`min-h-screen flex flex-col ${isLate ? 'bg-warning/5' : 'bg-success/5'}`}>
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
            isLate ? 'bg-gradient-accent shadow-lg' : 'bg-gradient-success shadow-success-glow'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle className="w-16 h-16 text-success-foreground" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLate ? 'Attendance Recorded' : 'Success!'}
          </h1>
          <p className="text-muted-foreground">
            Your attendance has been submitted
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="p-6">
            {/* Status Badge */}
            <div className="text-center mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  isLate
                    ? 'bg-warning/10 text-warning'
                    : 'bg-success/10 text-success'
                }`}
              >
                {isLate ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Late
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Present
                  </>
                )}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium text-foreground">{session.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Lecturer</span>
                <span className="font-medium text-foreground">{session.lecturerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {record.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {record.timestamp.toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6"
      >
        <Button
          onClick={() => navigate('/student')}
          variant="hero"
          className="w-full"
          size="lg"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
