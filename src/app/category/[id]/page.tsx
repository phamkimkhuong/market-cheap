'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/ui/product-card';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
    const params = useParams<{ id: string }>();
    const categoryId = params?.id || '';

    const { data, isLoading } = useGetProducts(categoryId ? [`equal("category_id","${categoryId}")`] : []);
    const products = data?.documents || [];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="fluid-title font-display font-black tracking-tighter italic uppercase">
                        DANH MỤC #{categoryId}
                    </h1>
                    <p className="text-sm text-text-muted font-semibold">
                        Hiển thị sản phẩm theo danh mục đã chọn.
                    </p>
                </div>
                <Link href="/" className="btn-outline h-10 px-4 text-sm">
                    <ArrowLeft size={16} />
                    Trang chủ
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-bg-main rounded-[var(--radius-pro-xl)] aspect-[3/4] animate-pulse" />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="glass-panel p-6 text-sm font-semibold text-text-muted">
                    Chưa có sản phẩm trong danh mục này.
                </div>
            )}
        </div>
    );
}
