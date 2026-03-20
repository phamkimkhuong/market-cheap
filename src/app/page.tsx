'use client';

import { useGetProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/ui/product-card';
import { 
    ShoppingBag, 
    ArrowRight, 
    Sparkles, 
    Zap, 
    Smartphone, 
    Laptop, 
    Watch, 
    Headphones,
    Flame
} from 'lucide-react';
import Link from 'next/link';

import { Product } from '@/types/models';

/**
 * Professional eCommerce Landing Page.
 * Inspired by modern Vietnamese platforms (TGDĐ, BHX).
 */
export default function Home() {
    const { data: productsData, isLoading } = useGetProducts();
    const products: Product[] = productsData?.documents || [];

    const categories: { id: string; name: string; icon: any; color: string }[] = [
        { id: '1', name: 'Điện thoại', icon: Smartphone, color: 'bg-blue-500' },
        { id: '2', name: 'Laptop', icon: Laptop, color: 'bg-purple-500' },
        { id: '3', name: 'Đồng hồ', icon: Watch, color: 'bg-orange-500' },
        { id: '4', name: 'Phụ kiện', icon: Headphones, color: 'bg-green-500' },
    ];

    return (
        <div className="space-y-12 lg:space-y-20 pb-20">
            {/* Hero Section - Optimized Responsive */}
            <section className="relative min-h-[450px] lg:h-[550px] hero-gradient rounded-[var(--radius-pro-2xl)] overflow-hidden group">
                <div className="dots-pattern absolute inset-0 group-hover:scale-105 transition-transform duration-1000" />
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 space-y-6 lg:space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                        <Sparkles size={14} className="animate-pulse" />
                        Sàn TMĐT Thế Hệ Mới 2026
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[0.95] tracking-tighter italic">
                        GIÁ RẺ. <br />
                        <span className="text-text-main opacity-90 not-italic">GIAO NHANH.</span>
                    </h1>
                    
                    <p className="text-white/80 font-medium max-w-md text-base lg:text-lg leading-relaxed px-4">
                        Từ đồ gia dụng đến thiết bị số, chúng tôi mang cả thế giới đến cửa nhà bạn chỉ trong 60 phút.
                    </p>
                    
                    <div className="flex items-center gap-4 pt-2">
                        <button className="btn-primary !bg-white !text-brand !shadow-none h-14 lg:h-16 px-8 lg:px-12 text-base lg:text-lg hover:!scale-105">
                            Mua Sắm Ngay
                            <ArrowRight size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute top-1/2 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-text-main/20 rounded-full blur-[100px]" />
            </section>

            {/* Quick Categories - Optimized Grid */}
            <section className="section-container">
                <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 lg:gap-8">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/category/${cat.id}`} className="group flex flex-col items-center gap-2">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white shadow-card rounded-2xl lg:rounded-3xl flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:translate-y-[-4px]">
                                <cat.icon size={24} className="lg:size-[28px]" strokeWidth={2} />
                            </div>
                            <span className="text-[10px] lg:text-xs font-black text-text-main uppercase tracking-tighter opacity-80 group-hover:text-brand transition-colors text-center">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Daily Flash Sale - Redesigned for focus */}
            <section className="section-container">
                <div className="bg-white rounded-[var(--radius-pro-2xl)] p-6 lg:p-10 shadow-card relative overflow-hidden border border-brand/5">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                         <Flame size={180} />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
                        <div className="space-y-1">
                             <div className="flex items-center gap-2 text-brand">
                                <Zap size={20} fill="currentColor" />
                                <h2 className="text-2xl lg:text-3xl font-display font-black uppercase tracking-tighter italic">GIỜ VÀNG GIÁ SỐC</h2>
                             </div>
                             <p className="text-text-muted font-bold text-[11px] lg:text-xs uppercase tracking-wider">Kết thúc sau: <span className="text-brand tabular-nums">02:45:12</span></p>
                        </div>
                        <button className="btn-outline h-10 lg:h-12 px-6 lg:px-8 border-brand/10 bg-brand-soft/50 text-xs lg:text-sm uppercase font-black tracking-tighter">
                            Xem tất cả
                        </button>
                    </div>

                    {/* Products Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-bg-main rounded-[var(--radius-pro-xl)] aspect-[3/4] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product.$id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Main Product Feed */}
            <section className="section-container space-y-6 lg:space-y-10">
                <div className="flex items-end justify-between border-b-2 border-border/40 pb-3">
                    <div className="space-y-1">
                        <h2 className="text-xl lg:text-2xl font-display font-black text-text-main uppercase tracking-tighter">Sản Phẩm Đang Hot</h2>
                        <div className="h-1 w-16 bg-brand rounded-full" />
                    </div>
                </div>

                {!isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.$id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Professional Footer Banner - Compact */}
            <section className="section-container">
                 <div className="relative bg-text-main rounded-[var(--radius-pro-2xl)] p-8 lg:p-14 overflow-hidden">
                    <div className="dots-pattern absolute inset-0 opacity-10" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                        <div className="space-y-3">
                            <h2 className="text-3xl lg:text-4xl font-display font-black text-white italic tracking-tighter">TRỞ THÀNH NGƯỜI BÁN?</h2>
                            <p className="text-white/50 font-bold max-w-sm text-sm lg:text-base">Mở gian hàng ngay hôm nay để tiếp cận 10.000+ khách hàng mỗi ngày.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                             <button className="btn-primary px-8 h-12 lg:h-14 !shadow-none whitespace-nowrap text-sm lg:text-base">Đăng ký Ngay</button>
                             <button className="btn-outline !text-white border-white/10 hover:bg-white/5 h-12 lg:h-14 px-8 text-sm lg:text-base">Tìm hiểu thêm</button>
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    );
}
