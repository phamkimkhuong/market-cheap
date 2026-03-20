'use client';

import { Search, ShoppingCart, User, LogOut, Menu, Bell, Heart } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/api/use-auth';
import { useUIStore } from '@/store/use-ui-store';
import { useCartStore } from '@/store/use-cart-store';
import { useState, useEffect } from 'react';

/**
 * Professional Marketplace Navbar.
 * Features: Sticky Glassmorphism, Intelligent Search, and Profile dropdown logic.
 */
export const Navbar = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useUIStore();
    const { getTotalItems } = useCartStore();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = getTotalItems();

    return (
        <nav className={`
            fixed top-0 left-0 right-0 z-[100]
            transition-all duration-500 ease-out
            ${scrolled ? 'glass-panel py-2 shadow-sm' : 'bg-transparent py-4'}
        `}>
            <div className="section-container flex items-center justify-between gap-4 md:gap-10">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-white shadow-glow group-hover:rotate-6 transition-all duration-300">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col -space-y-1 hidden sm:block">
                        <span className="font-display text-lg font-black text-text-main tracking-tighter uppercase">
                            V-Market
                        </span>
                        <span className="text-[10px] font-bold text-brand uppercase tracking-widest opacity-80">
                            Premium Shop
                        </span>
                    </div>
                </Link>

                {/* Search Bar (The heart of E-commerce) */}
                <div className="flex-1 max-w-2xl relative group hidden sm:block">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60 z-10">
                        <Search size={18} strokeWidth={2.5} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
                        className="w-full bg-white/50 border-2 border-transparent rounded-[var(--radius-pro-xl)] pl-12 pr-4 py-2.5 focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all outline-none text-sm font-medium placeholder:text-text-muted/50"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:block">
                        <span className="text-[10px] font-bold bg-brand/10 text-brand px-2 py-1 rounded-lg">
                            ENTER
                        </span>
                    </div>
                </div>

                {/* Utility Actions */}
                <div className="flex items-center gap-1.5 md:gap-3">
                    {/* User Profile */}
                    {user ? (
                        <div className="flex items-center gap-3 pr-2 md:pr-4 border-r border-border/60">
                            <div className="text-right hidden lg:block">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Chào bạn,</p>
                                <p className="text-sm font-bold text-text-main truncate max-w-[80px] leading-tight">{user.name.split(' ')[0]}</p>
                            </div>
                            <button className="w-10 h-10 bg-brand-soft rounded-2xl flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all">
                                <User size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden sm:flex btn-primary py-2 px-6 text-sm rounded-xl">
                            Đăng nhập
                        </Link>
                    )}

                    {/* Cart Tooltip */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <button className="btn-ghost hidden md:flex">
                            <Heart size={20} strokeWidth={2} />
                        </button>
                        <button className="btn-ghost hidden md:flex">
                            <Bell size={20} strokeWidth={2} />
                        </button>
                        
                        <button 
                            onClick={() => toggleSidebar()} 
                            className="p-3 bg-brand text-white hover:bg-brand-hover rounded-2xl relative transition-all shadow-glow active:scale-90"
                        >
                            <ShoppingCart size={22} strokeWidth={2.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-text-main text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <button className="sm:hidden btn-ghost">
                        <Menu size={22} />
                    </button>
                    
                    {user && (
                        <button 
                            onClick={() => logout()}
                            className="p-2.5 text-text-muted hover:text-red-500 transition-colors hidden lg:block"
                            title="Đăng xuất"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
