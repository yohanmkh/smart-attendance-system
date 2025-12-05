import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function LoginScreen() {
  const { selectedRole, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      toast.success('Welcome back!');
      navigate(selectedRole === 'lecturer' ? '/lecturer' : '/student');
    } else {
      toast.error('Invalid credentials or role mismatch');
    }
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link sent to your email');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 pt-6 pb-24 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-primary-foreground hover:bg-primary-foreground/10"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="max-w-md mx-auto text-center mt-6">
          <div className="w-20 h-20 bg-card border-2 border-border flex items-center justify-center mx-auto mb-6">
            {selectedRole === 'lecturer' ? (
              <BookOpen className="w-10 h-10 text-foreground" />
            ) : (
              <GraduationCap className="w-10 h-10 text-foreground" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-3">
            {selectedRole === 'lecturer' ? 'Lecturer Login' : 'Student Login'}
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Sign in with your university credentials
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 -mt-16">
        <Card className="max-w-md mx-auto p-8 border-2 border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                University Email
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder={selectedRole === 'lecturer' ? 'lecturer@university.edu' : 'student@university.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 border-2 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 border-2 border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-foreground underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-base font-medium"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-muted border-2 border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-bold text-foreground">Demo:</span> Use{' '}
              <span className="font-medium">
                {selectedRole === 'lecturer' ? 'lecturer@university.edu' : 'student@university.edu'}
              </span>
              {' '}with any 6+ character password
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
