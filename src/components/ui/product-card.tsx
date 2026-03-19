'use client';

import { ShoppingCart, Heart, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';
import { type Product } from '@/types/models';
import { useCartStore } from '@/store/use-cart-store';
import { useUIStore } from '@/store/use-ui-store';
import { useAuth } from '@/hooks/api/use-auth';
import { useSyncCartItem } from '@/hooks/api/use-cart';

interface ProductCardProps {
    product: Product;
}

/**
 * Premium Product Card component.
 */
export const ProductCard = ({ product }: ProductCardProps) => {
    const { user } = useAuth();
    const { addToast } = useUIStore();
    const { addItem } = useCartStore();
    const syncCartItem = useSyncCartItem();

    const handleAddToCart = async () => {
        if (!user) {
            addToast("Please login to add to cart!", "info");
            return;
        }

        // Add to local state for high speed UI
        addItem(product, 1);
        addToast(`Added ${product.name} to cart`, "success");

        // Background sync with database
        try {
            await syncCartItem.mutateAsync({
                userId: user.$id,
                productId: product.$id,
                quantity: 1,
                shop_id: product.shop_id,
            });
        } catch (err) {
            console.error('Failed to sync cart:', err);
            // Optional: rollback or update toast if sync fails
        }
    };

    // Format price in VND (assuming integer is in VNĐ)
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(product.price);

    // Get the first image or a placeholder
    const productImage = product.images?.[0] || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop`;

    return (
        <div className="group bg-white rounded-2xl border border-border/50 hover:border-brand/20 transition-all duration-500 hover:shadow-glow overflow-hidden">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-[#f3f3f5]/30">
                <Image 
                    src={productImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Floating Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-10 h-10 bg-white rounded-xl shadow-premium flex items-center justify-center text-text-muted hover:text-red-500 transition-colors">
                        <Heart size={18} />
                    </button>
                </div>

                {/* Badge (Optional) */}
                {product.stock < 5 && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-brand text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        Low Stock
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted/60">
                        {product.shop_id.substring(0, 8)}...
                    </span>
                    <div className="flex items-center text-yellow-400 gap-1 scale-90">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs text-text-muted font-medium">4.8</span>
                    </div>
                </div>

                <h3 className="text-text-main font-bold truncate group-hover:text-brand transition-colors">
                    {product.name}
                </h3>
                
                <p className="text-xs text-text-muted mt-1 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between gap-4 mt-auto">
                    <div>
                        <span className="text-lg font-display font-black text-brand tracking-tight">
                            {formattedPrice}
                        </span>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        className="p-3 bg-brand text-white rounded-xl shadow-brand/10 hover:shadow-brand/25 hover:bg-brand-hover active:scale-90 transition-all"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
