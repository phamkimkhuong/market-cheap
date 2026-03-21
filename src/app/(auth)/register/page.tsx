'use client';

import { useAuth } from '@/hooks/api/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/utils/error';

// Validation Schema
const registerSchema = z.object({
    name: z.string().min(2, 'Họ tên quá ngắn'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải dài ít nhất 8 ký tự'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: authRegister, sendVerificationEmail, isRegistering } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [regError, setRegError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setRegError(null);
            await authRegister({
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
            });
            const origin = window.location.origin;
            await sendVerificationEmail(`${origin}/verify-email`);
            router.push('/verify-email?status=sent');
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            const normalizedMessage = message.toLowerCase();
            if (normalizedMessage.includes('already') || normalizedMessage.includes('exists')) {
                setRegError('Email đã tồn tại. Vui lòng dùng email khác.');
                return;
            }
            if (normalizedMessage.includes('password')) {
                setRegError('Mật khẩu chưa hợp lệ theo yêu cầu bảo mật.');
                return;
            }
            if (normalizedMessage.includes('email')) {
                setRegError('Email không hợp lệ hoặc chưa được chấp nhận.');
                return;
            }
            if (normalizedMessage.includes('platform')) {
                setRegError('Domain hiện tại chưa được khai báo trong Appwrite Platforms.');
                return;
            }
            setRegError('Đăng ký thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Form */}
            <div className="text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest bg-brand-soft/50 px-3 py-1 rounded-full border border-brand/10">
                    <Sparkles size={14} />
                    THÀNH VIÊN MỚI
                </div>
                <h2 className="fluid-title font-display font-black text-text-main tracking-tighter italic uppercase">ĐĂNG KÝ</h2>
                <p className="text-text-muted font-bold">Trở thành một phần của cộng đồng mua sắm hiện đại.</p>
            </div>

            {/* Main Register Card */}
            <div className="glass-panel p-1 border-white/40 shadow-glow relative overflow-hidden group">
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Error Display */}
                    {regError && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold animate-in zoom-in-95 duration-300">
                            <AlertCircle size={18} />
                            {regError}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-text-main uppercase ml-2 opacity-60">Họ và Tên</label>
                             <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                                    <User size={18} />
                                </div>
                                <input 
                                    {...register('name')}
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    className={`input-field pl-12 h-14 bg-white/50 backdrop-blur-sm transition-all text-sm ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                />
                             </div>
                             {errors.name && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.name.message}</p>}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-text-main uppercase ml-2 opacity-60">Địa chỉ Email</label>
                             <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    {...register('email')}
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`input-field pl-12 h-14 bg-white/50 backdrop-blur-sm transition-all text-sm ${errors.email ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                />
                             </div>
                             {errors.email && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.email.message}</p>}
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-text-main uppercase ml-2 opacity-60">Mật khẩu</label>
                                 <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`input-field pl-12 h-14 bg-white/50 backdrop-blur-sm transition-all text-sm ${errors.password ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                    />
                                 </div>
                                 {errors.password && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-text-main uppercase ml-2 opacity-60">Xác nhận</label>
                                 <div className="relative group">
                                    <input 
                                        {...register('confirmPassword')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`input-field px-6 h-14 bg-white/50 backdrop-blur-sm transition-all text-sm ${errors.confirmPassword ? 'border-red-400 ring-2 ring-red-100' : 'focus:ring-brand/10'}`}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-brand"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                 </div>
                                 {errors.confirmPassword && <p className="text-[10px] font-black text-red-500 ml-4 uppercase">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Trust Factor & Terms */}
                    <div className="flex items-start gap-3 p-4 bg-brand-soft/20 rounded-2xl border border-brand/5">
                        <ShieldCheck size={20} className="text-brand flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-text-muted leading-relaxed">
                            Bằng cách đăng ký, bạn đồng ý với <span className="text-brand">Điều khoản dịch vụ</span> & <span className="text-brand">Chính sách bảo mật</span> của chung tôi.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={isRegistering}
                        className="btn-primary w-full h-16 text-lg !shadow-none hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {isRegistering ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Tạo Tài Khoản Ngay
                                <UserPlus size={20} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Back link */}
            <div className="text-center pb-10">
                <p className="text-text-muted font-bold text-sm">
                    Bạn đã có tài khoản?{' '}
                    <Link href="/login" className="text-brand font-black hover:underline uppercase tracking-tighter">Đăng nhập ngay</Link>
                </p>
            </div>
        </div>
    );
}
