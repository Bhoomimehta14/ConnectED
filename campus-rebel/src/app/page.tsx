'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [sapId, setSapId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: '👨‍🎓', description: 'Join clubs & communities' },
    { id: 'club_head', label: 'Club Head', icon: '👥', description: 'Manage your club' },
    { id: 'faculty', label: 'Faculty', icon: '👨‍🏫', description: 'Guide & mentor' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sapId || !selectedRole) return;

    setIsLoading(true);
    
    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      const userData = {
        sapId,
        role: selectedRole,
        timestamp: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      console.log('Login successful:', userData);
      setIsLoading(false);
      
      // Show success message
      alert(`Welcome ${selectedRole}! You would be redirected to the dashboard.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-gray to-brand-dark">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3B82F611_1px,transparent_1px),linear-gradient(to_bottom,#7C3AED11_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-3xl animate-glow" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gradient rounded-full blur-xl opacity-50 animate-glow" />
              <div className="relative bg-brand-gradient p-3 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-gradient">CampusRebel</span>
          </h1>
          <p className="text-white/60 text-sm">Connect. Collaborate. Create.</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 animate-[slideUp_0.6s_ease-out]">
          <h2 className="text-2xl font-semibold mb-6">Welcome Back!</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* SAP ID Input */}
            <div>
              <label htmlFor="sapId" className="block text-sm font-medium text-white/80 mb-2">
                SAP ID
              </label>
              <input
                id="sapId"
                type="text"
                value={sapId}
                onChange={(e) => setSapId(e.target.value)}
                placeholder="70522400089"
                maxLength={11}
                className="glass-input"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                  >
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <div className="text-sm font-medium">{role.label}</div>
                    <div className="text-xs text-white/60 mt-1">{role.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!sapId || !selectedRole || isLoading}
              className="brand-button w-full relative"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-shimmer" />
                </>
              )}
            </button>
          </form>

          {/* OAuth Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/5 px-2 text-white/40">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.451 5.906c-.432.814-1.053 1.515-1.81 2.056.008.176.013.352.013.531 0 5.422-4.127 11.675-11.675 11.675-2.317 0-4.474-.678-6.29-1.84.322.038.649.057.98.057 1.922 0 3.692-.656 5.096-1.757-1.796-.033-3.311-1.219-3.833-2.849.25.048.507.073.771.073.374 0 .737-.05 1.081-.144-1.877-.377-3.291-2.035-3.291-4.023v-.052c.553.307 1.186.491 1.858.512-1.101-.736-1.825-1.992-1.825-3.415 0-.752.202-1.457.554-2.063 2.024 2.482 5.047 4.116 8.457 4.287-.07-.3-.106-.614-.106-.935 0-2.266 1.837-4.103 4.103-4.103 1.18 0 2.247.498 2.995 1.296.935-.184 1.813-.526 2.606-.997-.307.958-.957 1.762-1.804 2.27.83-.099 1.621-.32 2.357-.647z"/>
                </svg>
                <span className="text-sm">Microsoft</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}