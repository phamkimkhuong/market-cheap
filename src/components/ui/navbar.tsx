'use client';

import { Search, ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/api/use-auth';
import { useUIStore } from '@/store/use-ui-store';
import { useCartStore } from '@/store/use-cart-store';
import { useState, useEffect } from 'react';

/**
 * Premium Navbar component for Marketplace.
 */
export const Navbar = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar, addToast } = useUIStore();
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
            fixed top-0 left-0 right-0 z-[50]
            transition-all duration-500
            ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-premium border-b border-border py-3' : 'bg-transparent py-5'}
        `}>
            <div className="container mx-auto px-4 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-brand/20 group-hover:scale-110 transition-transform">
                        <ShoppingCart size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl font-bold text-text-main tracking-tight hidden sm:block">
                        V-MARKET
                    </span>
                </Link>

                {/* Search Bar (Centered on desktop) */}
                <div className="flex-1 max-w-lg hidden md:block relative group">
                    <input 
                        type="text" 
                        placeholder="Search products, brands..." 
                        className="w-full bg-[#f3f3f5]/50 border-none rounded-2xl px-12 py-3 focus:bg-white focus:ring-2 focus:ring-brand/10 transition-all outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-brand transition-colors" size={18} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* User Profile */}
                    {user ? (
                        <div className="flex items-center gap-3 pr-4 border-r border-border hidden sm:flex">
                            <div className="text-right">
                                <p className="text-xs text-text-muted">Hello,</p>
                                <p className="text-sm font-semibold text-text-main truncate max-w-[100px]">{user.name}</p>
                            </div>
                            <div className="w-10 h-10 bg-[#f3f3f5] rounded-full flex items-center justify-center text-text-muted overflow-hidden">
                                <User size={20} />
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="btn-outline hidden sm:flex py-2 px-4 text-sm rounded-lg">
                            Login
                        </Link>
                    )}

                    {/* Cart Icon */}
                    <button 
                        onClick={() => toggleSidebar()} 
                        className="p-3 bg-[#f3f3f5] hover:bg-brand/5 text-text-main hover:text-brand rounded-xl relative transition-all group active:scale-95"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu */}
                    <button className="md:hidden p-3 bg-[#f3f3f5] rounded-xl">
                        <Menu size={22} />
                    </button>
                    
                    {user && (
                        <button 
                            onClick={() => logout()}
                            className="p-3 text-text-muted hover:text-red-500 rounded-xl hidden sm:block"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
