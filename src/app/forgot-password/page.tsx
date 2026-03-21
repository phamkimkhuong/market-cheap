'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="max-w-md mx-auto py-10">
            <div className="glass-panel p-6 space-y-4">
                <h1 className="fluid-title font-display font-black tracking-tighter italic uppercase">
                    QUÊN MẬT KHẨU
                </h1>
                <p className="text-sm text-text-muted font-semibold leading-relaxed">
                    Tính năng đặt lại mật khẩu sẽ được bật ở phiên bản tiếp theo.
                </p>
                <Link href="/login" className="btn-primary h-11 px-5 w-fit !shadow-none">
                    Quay lại đăng nhập
                </Link>
            </div>
        </div>
    );
}
