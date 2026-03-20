'use client';

import { Sparkles, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

/**
 * Shared layout for Auth pages (Login/Register).
 * Features a split-screen design on desktop.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex overflow-hidden">
            {/* Left Side: Brand Experience (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative hero-gradient overflow-hidden flex-col justify-between p-16 text-white">
                <div className="dots-pattern absolute inset-0 opacity-20" />
                
                {/* Header Logo */}
                <Link href="/" className="relative z-10 flex items-center gap-2 group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand shadow-glow group-hover:scale-110 transition-transform">
                        <ShoppingBag size={24} strokeWidth={3} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter italic uppercase">V-MARKET</span>
                </Link>

                {/* Central Illustration / Message */}
                <div className="relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                        <Sparkles size={14} />
                        Sàn TMĐT Thế Hệ Mới
                    </div>
                    
                    <h1 className="text-7xl font-display font-black leading-[0.9] tracking-tighter italic">
                        TRẢI NGHIỆM <br />
                        <span className="text-text-main opacity-90 not-italic">MUA SẮM SIÊU TỐC.</span>
                    </h1>
                    
                    <p className="text-white/70 font-medium text-lg max-w-md leading-relaxed">
                        Tham gia cộng đồng mua sắm hiện đại nhất Việt Nam. Hàng triệu sản phẩm, giao hàng nhanh 2h.
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-3xl border border-white/5">
                            <ShieldCheck size={24} className="text-white" />
                            <span className="text-xs font-bold leading-tight">Bảo mật tuyệt đối bởi Appwrite SSL</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-3xl border border-white/5">
                            <Zap size={24} className="text-white" />
                            <span className="text-xs font-bold leading-tight">Giao hàng hỏa tốc trong 60 phút</span>
                        </div>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="relative z-10 text-white/40 text-xs font-bold uppercase tracking-widest">
                    © 2026 V-Marketplace AI Design
                </div>
                
                {/* Decorative Blobs */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-text-main/20 rounded-full blur-[100px]" />
            </div>

            {/* Right Side: Form Content */}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-bg-main relative flex items-center justify-center p-6 sm:p-12">
                 <div className="absolute top-10 left-10 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-glow">
                            <ShoppingBag size={20} />
                        </div>
                    </Link>
                 </div>

                 <div className="w-full max-w-md">
                    {children}
                 </div>
            </div>
        </div>
    );
}
