import { useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { authService } from '../lib/supabase';

// ElyAnalyzer Logo Component - Frontend'teki güzel papatya logosu
const ElyAnalyzerLogo = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Glow */}
    <circle cx="32" cy="32" r="30" fill="url(#outerGlow)" opacity="0.2"/>
    
    {/* Daisy Petals */}
    {/* Top petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(0 32 32)"/>
    {/* Top-right petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(45 32 32)"/>
    {/* Right petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(90 32 32)"/>
    {/* Bottom-right petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(135 32 32)"/>
    {/* Bottom petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(180 32 32)"/>
    {/* Bottom-left petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(225 32 32)"/>
    {/* Left petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(270 32 32)"/>
    {/* Top-left petal */}
    <ellipse cx="32" cy="18" rx="4" ry="12" fill="url(#petalGradient)" transform="rotate(315 32 32)"/>
    
    {/* Center of daisy */}
    <circle cx="32" cy="32" r="8" fill="url(#centerGradient)" stroke="#f59e0b" strokeWidth="1"/>
    
    {/* Inner center details */}
    <circle cx="32" cy="32" r="6" fill="url(#innerCenter)" opacity="0.8"/>
    
    {/* Small sparkles around flower */}
    <circle cx="22" cy="22" r="1" fill="#fbbf24" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="42" cy="22" r="0.8" fill="#f59e0b" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="42" cy="42" r="1.2" fill="#fbbf24" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="22" cy="42" r="0.9" fill="#f59e0b" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    
    {/* Gradients */}
    <defs>
      {/* Petal gradient - white to soft pink */}
      <linearGradient id="petalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ffffff", stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#fdf2f8", stopOpacity:0.9}} />
        <stop offset="100%" style={{stopColor:"#f9a8d4", stopOpacity:0.8}} />
      </linearGradient>
      
      {/* Center gradient - yellow/orange */}
      <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{stopColor:"#fbbf24", stopOpacity:1}} />
        <stop offset="70%" style={{stopColor:"#f59e0b", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#d97706", stopOpacity:1}} />
      </radialGradient>
      
      {/* Inner center */}
      <radialGradient id="innerCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{stopColor:"#fef3c7", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#f59e0b", stopOpacity:0.8}} />
      </radialGradient>
      
      {/* Outer glow */}
      <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{stopColor:"#fbbf24", stopOpacity:0.3}} />
        <stop offset="100%" style={{stopColor:"#f9a8d4", stopOpacity:0.1}} />
      </radialGradient>
    </defs>
  </svg>
);

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function Login({ onLogin, isLoading, error }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (email && password) {
        await onLogin(email, password);
    }
  };

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    
    try {
      const { error } = await authService.signInWithGitHub();
      
      if (error && !error.message?.includes('Please complete authentication')) {
        console.error('GitHub OAuth error:', error);
        // Error mesajını göster ama "browser'da tamamla" mesajını hata olarak gösterme
      }
      // OAuth başarılı olursa browser açılacak
    } catch (error) {
      console.error('GitHub login error:', error);
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    margin: 0,
    padding: 0
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    borderRadius: '16px',
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#94a3b8',
    textAlign: 'center',
    margin: 0,
    fontSize: '16px'
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle: React.CSSProperties = {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px 12px 40px',
    borderRadius: '8px',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    color: '#f1f5f9',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    width: '20px',
    height: '20px',
    color: '#94a3b8',
    pointerEvents: 'none'
  };

  const eyeIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    width: '20px',
    height: '20px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'color 0.2s'
  };

  const errorStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: '14px',
    margin: 0
  };

  const rememberRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#cbd5e1'
  };

  const forgotLinkStyle: React.CSSProperties = {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 24px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: 'scale(1)',
    boxShadow: '0 4px 15px 0 rgba(59, 130, 246, 0.3)',
    outline: 'none'
  };

  const dividerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const dividerLineStyle: React.CSSProperties = {
    flex: 1,
    height: '1px',
    background: 'rgba(71, 85, 105, 0.5)'
  };

  const dividerTextStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '14px'
  };

  const socialButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: 'scale(1)',
    outline: 'none',
    width: '100%'
  };

  const signupTextStyle: React.CSSProperties = {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: '14px'
  };

  const signupLinkStyle: React.CSSProperties = {
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
          {/* Logo */}
        <ElyAnalyzerLogo />
        
        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to your ElyAnalyzer account</p>
          </div>

          {/* Error Message */}
          {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            width: '100%',
            textAlign: 'center'
          }}>
            <span style={{ color: '#f87171', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
            {/* Email Field */}
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
                Email Address
              </label>
            <div style={inputContainerStyle}>
              <EnvelopeIcon style={iconStyle} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? '#f87171' : 'rgba(71, 85, 105, 0.5)'
                }}
                  placeholder="Enter your email"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#f87171' : 'rgba(71, 85, 105, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
                />
              </div>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Password Field */}
          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
                Password
              </label>
            <div style={inputContainerStyle}>
              <LockClosedIcon style={iconStyle} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                style={{
                  ...inputStyle,
                  paddingRight: '40px',
                  borderColor: errors.password ? '#f87171' : 'rgba(71, 85, 105, 0.5)'
                }}
                  placeholder="Enter your password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#f87171' : 'rgba(71, 85, 105, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                style={eyeIconStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
          <div style={rememberRowStyle}>
            <label style={checkboxContainerStyle}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                  />
                  Remember me
                </label>
            <a
              href="#"
              style={forgotLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#93c5fd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#60a5fa';
              }}
                >
                  Forgot password?
            </a>
              </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
            style={{
              ...buttonStyle,
              opacity: (isLoading || !email || !password) ? 0.5 : 1,
              cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && email && password) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && email && password) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
            >
              {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></div>
                Signing in...
                </div>
              ) : (
              'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
        <div style={dividerStyle}>
          <div style={dividerLineStyle} />
          <span style={dividerTextStyle}>Or continue with</span>
          <div style={dividerLineStyle} />
        </div>

        {/* GitHub Login Button */}
        <button 
          type="button" 
          onClick={handleGitHubLogin}
          disabled={isGitHubLoading}
          style={{
            ...socialButtonStyle,
            opacity: isGitHubLoading ? 0.5 : 1,
            cursor: isGitHubLoading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isGitHubLoading) {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGitHubLoading) {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isGitHubLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }}></div>
              Loading...
            </div>
          ) : (
            <>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
              Continue with GitHub
            </>
          )}
        </button>

        {/* Sign Up Link */}
        <div style={signupTextStyle}>
          Don't have an account?{' '}
          <a
            href="#"
            style={signupLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#93c5fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#60a5fa';
            }}
          >
            Sign up
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}