'use client';

import { useAuth } from '@/hooks/api/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome, Apple, AlertCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getErrorMessage } from '@/utils/error';

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải dài ít nhất 8 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, loginWithGoogle, isLoggingIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.get('oauth') === 'failed') {
            setAuthError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        }
    }, [searchParams]);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setAuthError(null);
            await login(data);
            router.push('/'); // Chuyển về trang chủ khi thành công
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('password')) {
                setAuthError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
                return;
            }
            setAuthError('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Form */}
            <div className="text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest bg-brand-soft/50 px-3 py-1 rounded-full border border-brand/10">
                    <Sparkles size={14} />
                    CHÀO MỪNG TRỞ LẠI
                </div>
                <h2 className="text-4xl font-display font-black text-text-main leading-tight tracking-tighter italic">ĐĂNG NHẬP</h2>
                <p className="text-text-muted font-bold">Hãy nhập thông tin để tiếp tục mua sắm.</p>
            </div>

            {/* Main Login Card */}
            <div className="glass-panel p-1 border-white/40 shadow-glow relative overflow-hidden group">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Auth Error Display */}
                    {authError && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold animate-in zoom-in-95 duration-300">
                            <AlertCircle size={18} />
                            {authError}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                             <label className="text-xs font-black text-text-main uppercase ml-2 opacity-60">Địa chỉ Email</label>
                             <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    {...register('email')}
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`input-field pl-12 h-14 bg-white/50 backdrop-blur-sm transition-all ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                />
                             </div>
                             {errors.email && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.email.message}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center ml-2">
                                <label className="text-xs font-black text-text-main uppercase opacity-60">Mật khẩu</label>
                                <Link href="/forgot-password" title="Chưa hỗ trợ" className="text-[10px] font-black text-brand hover:underline uppercase">Quên mật khẩu?</Link>
                             </div>
                             <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`input-field pl-12 pr-12 h-14 bg-white/50 backdrop-blur-sm transition-all ${errors.password ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                             </div>
                             {errors.password && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.password.message}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={isLoggingIn}
                        className="btn-primary w-full h-16 text-lg !shadow-none hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {isLoggingIn ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Đăng Nhập Ngay
                                <LogIn size={20} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>

                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Social Auth & Link Section */}
            <div className="space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border opacity-50" />
                    </div>
                    <div className="relative flex justify-center text-xs font-black uppercase tracking-tighter">
                        <span className="bg-bg-main px-4 text-text-muted">Hoặc đăng nhập bằng</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <button
                        type="button"
                        onClick={() => {
                            setAuthError(null);
                            loginWithGoogle();
                        }}
                        className="btn-outline h-14 border-brand/10 bg-white/50 hover:bg-white hover:border-brand/40"
                     >
                        <Chrome size={20} />
                        Google
                     </button>
                     <button type="button" className="btn-outline h-14 border-brand/10 bg-white/50 hover:bg-white hover:border-brand/40">
                        <Apple size={20} />
                        Apple ID
                     </button>
                </div>

                <div className="text-center pt-4">
                    <p className="text-text-muted font-bold text-sm">
                        Bạn chưa có tài khoản?{' '}
                        <Link href="/register" className="text-brand font-black hover:underline uppercase tracking-tighter">Đăng ký thành viên ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
