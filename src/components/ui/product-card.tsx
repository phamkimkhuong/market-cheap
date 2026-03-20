'use client';

import { ShoppingCart, Heart, Star, CheckCircle } from 'lucide-react';
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
 * Professional eCommerce Product Card.
 * Design inspired by TGDĐ/BHX with rounded corners, clear pricing, and trust signals.
 */
export const ProductCard = ({ product }: ProductCardProps) => {
    const { user } = useAuth();
    const { addToast } = useUIStore();
    const { addItem } = useCartStore();
    const syncCartItem = useSyncCartItem();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            addToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "info");
            return;
        }

        // Optimistic Update
        addItem(product, 1);
        addToast(`Đã thêm ${product.name} vào giỏ`, "success");

        try {
            await syncCartItem.mutateAsync({
                userId: user.$id,
                productId: product.$id,
                quantity: 1,
                shop_id: product.shop_id,
            });
        } catch (err) {
            console.error('Failed to sync cart:', err);
        }
    };

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(product.price);

    const productImage = product.images?.[0] || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop`;

    return (
        <div className="group glass-card border-none hover:translate-y-[-8px] transition-all duration-500 overflow-hidden relative">
            {/* Trust Badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-brand text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-glow">
                    FREESHIP
                </div>
                {product.stock < 10 && (
                    <div className="bg-[#ff3b30] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                        Sắp hết hàng
                    </div>
                )}
            </div>

            {/* Like Button */}
            <button className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-white transition-all shadow-premium">
                <Heart size={16} strokeWidth={2.5} />
            </button>

            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-brand-soft/50">
                <Image 
                    src={productImage} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            </div>

            {/* Product Details */}
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                     <span className="flex items-center gap-0.5 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[11px] font-black text-text-main">4.9</span>
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-[11px] font-bold text-text-light">Đã bán 1.2k+</span>
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-main leading-tight line-clamp-2 min-h-[40px] group-hover:text-brand transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                        <CheckCircle size={10} className="text-success" />
                        <span className="text-[10px] font-bold text-success uppercase">Chính hãng</span>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2 pt-2">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text-light line-through opacity-60">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.2)}
                        </span>
                        <span className="text-[17px] font-black text-brand tracking-tighter leading-none">
                            {formattedPrice}
                        </span>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        className="w-11 h-11 bg-brand text-white rounded-[18px] flex items-center justify-center shadow-glow hover:bg-brand-hover hover:scale-110 active:scale-95 transition-all"
                        title="Thêm vào giỏ"
                    >
                        <ShoppingCart size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};
