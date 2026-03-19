'use client';

import { useGetProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/ui/product-card';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Modern Marketplace Landing Page.
 */
export default function Home() {
    const { data: productsData, isLoading, isError } = useGetProducts();

    const products = productsData?.documents || [];

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-brand/5 border border-brand/10 p-8 sm:p-20">
                <div className="relative z-10 max-w-2xl space-y-8">
                    <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <Sparkles size={14} />
                        2025 Marketplace Edition
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-display font-black text-text-main leading-[1.05]">
                        The Future of <br />
                        <span className="text-brand">Shopping is Orange.</span>
                    </h1>
                    <p className="text-xl text-text-muted max-w-lg leading-relaxed">
                        Experience a vibrant marketplace where quality meets speed. From local artisans to global brands, everything in one click.
                    </p>
                    <div className="flex flex-wrap items-center gap-5 pt-4">
                        <button className="btn-primary shadow-glow h-14 px-10">
                            Shop Collections
                            <ArrowRight size={20} />
                        </button>
                        <button className="btn-outline h-14 px-10">
                            Our Story
                        </button>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-[35rem] h-[35rem] bg-brand/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-brand-light rounded-full border border-brand/5 flex items-center justify-center p-12">
                     <div className="w-full h-full bg-brand/10 rounded-full blur-2xl" />
                </div>
            </section>

            {/* Featured Section */}
            <section className="space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-text-main">Featured Products</h2>
                        <p className="text-text-muted mt-2 text-sm">Hand-picked items for your unique style</p>
                    </div>
                    <button className="text-brand font-bold text-sm flex items-center gap-2 hover:underline">
                        View all <ArrowRight size={16} />
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 space-y-4 border border-border/50">
                                <div className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {!isLoading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {products.map((product) => (
                            <ProductCard key={product.$id} product={product} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && products.length === 0 && (
                    <div className="py-20 flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-[#f3f3f5] rounded-full flex items-center justify-center text-text-muted">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-text-main">No products found</h3>
                        <p className="text-text-muted max-w-xs">
                            We couldn&apos;t find any products in our database. Be the first to add one!
                        </p>
                    </div>
                )}
            </section>

            {/* Newsletter / CTA */}
            <section className="bg-text-main rounded-[2rem] p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="space-y-4 z-10 text-center sm:text-left">
                    <h2 className="text-3xl font-display font-bold">Stay in the Loop</h2>
                    <p className="text-white/60 text-sm max-w-sm">
                        Get notified about exclusive drops, restocks, and limited-time collaborations.
                    </p>
                </div>
                <div className="flex w-full sm:w-auto gap-2 z-10">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:bg-white/20 transition-all flex-1 sm:w-64"
                    />
                    <button className="bg-white text-text-main px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-all">
                        Join
                    </button>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
            </section>
        </div>
    );
}
