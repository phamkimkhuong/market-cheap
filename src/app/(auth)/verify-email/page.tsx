'use client';

import { useAuth } from '@/hooks/api/use-auth';
import { getErrorMessage } from '@/utils/error';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, MailCheck, RefreshCcw } from 'lucide-react';
import { Suspense, useEffect, useMemo, useState } from 'react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, confirmVerification, sendVerificationEmail, isConfirmingVerification, isSendingVerificationEmail } =
        useAuth();

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');
    const initialStatus = searchParams.get('status');

    const hasVerifyToken = useMemo(() => Boolean(userId && secret), [userId, secret]);

    useEffect(() => {
        if (initialStatus === 'sent') {
            setStatusMessage('Chúng tôi đã gửi email xác thực. Vui lòng kiểm tra hộp thư của bạn.');
        }
    }, [initialStatus]);

    useEffect(() => {
        const runVerify = async () => {
            if (!hasVerifyToken || !userId || !secret) return;
            try {
                setErrorMessage(null);
                await confirmVerification({ userId, secret });
                setStatusMessage('Xác thực email thành công. Bạn có thể tiếp tục mua sắm.');
                router.replace('/verify-email?status=verified');
            } catch (error: unknown) {
                setErrorMessage(getErrorMessage(error));
            }
        };
        runVerify();
    }, [confirmVerification, hasVerifyToken, router, secret, userId]);

    const handleResend = async () => {
        try {
            setErrorMessage(null);
            const origin = window.location.origin;
            await sendVerificationEmail(`${origin}/verify-email`);
            setStatusMessage('Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.');
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-soft/70 text-brand flex items-center justify-center">
                    <MailCheck size={26} />
                </div>
                <h1 className="fluid-title font-display font-black text-text-main tracking-tighter italic uppercase">
                    XÁC THỰC EMAIL
                </h1>
                <p className="text-text-muted font-semibold text-sm">
                    Vui lòng xác thực email để mở khóa đầy đủ tính năng tài khoản.
                </p>
            </div>

            {statusMessage && (
                <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 text-sm font-bold">
                    <CheckCircle2 size={18} />
                    {statusMessage}
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-bold">
                    <AlertCircle size={18} />
                    {errorMessage}
                </div>
            )}

            <div className="glass-panel p-6 sm:p-8 space-y-4">
                <p className="text-sm text-text-muted font-medium leading-relaxed">
                    {user?.email
                        ? `Tài khoản hiện tại: ${user.email}`
                        : 'Bạn cần đăng nhập để gửi lại email xác thực cho tài khoản.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        disabled={!user || isSendingVerificationEmail}
                        onClick={handleResend}
                        className="btn-outline h-12 px-6 border-brand/20 bg-white/60 disabled:opacity-50"
                    >
                        <RefreshCcw size={16} />
                        {isSendingVerificationEmail ? 'Đang gửi...' : 'Gửi lại email xác thực'}
                    </button>

                    <Link href="/login" className="btn-primary h-12 px-6 !shadow-none">
                        Quay lại đăng nhập
                    </Link>
                </div>

                {isConfirmingVerification && (
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wide">
                        Đang xác thực token...
                    </p>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-[240px]" />}>
            <VerifyEmailContent />
        </Suspense>
    );
}
