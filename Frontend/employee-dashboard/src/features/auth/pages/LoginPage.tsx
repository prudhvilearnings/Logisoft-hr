import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaUsers, FaShieldAlt } from 'react-icons/fa';
import useAuthStore from '../../../store/authStore';
import { authService } from '../../../services/authService';
import type { UserRole } from '../../../types/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employee', 'lead', 'manager']),
  rememberMe: z.boolean(),
});

type LoginFormFields = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, setLoading, setError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('employee');

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'employee@logisoft.com',
      password: 'password',
      role: 'employee',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormFields) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.email, data.password, data.role);
      login(response.user, response.token, response.refreshToken, data.rememberMe);
      navigate(from, { replace: true });
    } catch (e: any) {
      setError(e.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Automatically synchronizes Form Role and Preset Credentials when changing tabs
   */
  const handleTabChange = (role: UserRole) => {
    setActiveRoleTab(role);
    setValue('role', role);
    setError(null);

    const credentials: Record<UserRole, string> = {
      employee: 'employee@logisoft.com',
      lead: 'lead@logisoft.com',
      manager: 'manager@logisoft.com',
    };
    setValue('email', credentials[role]);
    setValue('password', 'password');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-900 overflow-hidden font-sans px-4 py-12">
      {/* Dynamic Colored Blobs in background for glowing look */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-primary/20 blur-[120px] animate-pulse duration-3000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[150px] animate-pulse duration-3000 delay-1000"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Glassmorphic Container Card */}
      <div className="w-full max-w-lg bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl z-10 flex flex-col items-center">
        
        {/* Company Identity Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-heading font-extrabold text-2xl">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl text-white tracking-tight">Logisoft HRMS</span>
            <span className="text-[10px] text-primary font-semibold tracking-widest uppercase">Enterprise Portal</span>
          </div>
        </div>

        <div className="text-center mt-3 mb-8">
          <h2 className="text-2xl font-bold text-white font-heading tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-xs mt-1">
            Choose a quick role preset or sign in with your enterprise credentials.
          </p>
        </div>

        {/* Tabbed Role presets selector (Stripe/Linear inspired) */}
        <div className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded-2xl grid grid-cols-3 gap-1 mb-8">
          {(['employee', 'lead', 'manager'] as const).map((r) => {
            const isActive = activeRoleTab === r;
            const Icon = r === 'manager' ? FaShieldAlt : r === 'lead' ? FaUsers : FaUser;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleTabChange(r)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="capitalize">{r === 'lead' ? 'Team Lead' : r}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900 rounded-2xl text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Hidden Form Field linking role */}
          <input type="hidden" {...register('role')} />

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FaEnvelope className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition duration-150 outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Demo info: To reset demo login credentials, please contact HR administrator.');
                  }}
                  className="text-xs text-primary hover:underline font-medium transition"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FaLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary transition duration-150 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 bg-slate-900 border-slate-800 text-primary focus:ring-primary rounded cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-400 cursor-pointer select-none">
              Keep me signed in on this computer
            </label>
          </div>

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-secondary to-primary hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 transition duration-150 ease-in-out cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Access Workspace</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-slate-600 text-[10px] text-center w-full border-t border-slate-900 pt-6">
          Authorized staff only. IP addresses are logged for security audits.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
