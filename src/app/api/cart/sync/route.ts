import { NextRequest, NextResponse } from 'next/server';
import { cartRepository } from '@/services/repositories/cart-repository';
import { SyncCartRequestSchema } from '@/types/api';
import { parseOrThrow } from '@/services/repositories/validation';
import { getRequiredHeader } from '@/services/repositories/config';
import { ApiRouteError } from '@/types/errors';
import { getErrorMessage } from '@/utils/error';
import { getServerAuthUser } from '@/services/api/server-auth';

const processedRequestIds = new Set<string>();

export async function POST(request: NextRequest) {
    try {
        const idempotencyKey = getRequiredHeader(request.headers.get('x-idempotency-key'), 'x-idempotency-key');
        if (processedRequestIds.has(idempotencyKey)) {
            return NextResponse.json(
                { ok: true, duplicated: true, idempotencyKey },
                { status: 200 }
            );
        }

        const body = await request.json();
        const payload = parseOrThrow(SyncCartRequestSchema, body, 'api.cart.sync.request');
        const sessionUser = await getServerAuthUser();

        const data = await cartRepository.upsertItem({
            userId: sessionUser.$id,
            productId: payload.productId,
            quantity: payload.quantity,
            shopId: payload.shopId,
        });

        processedRequestIds.add(idempotencyKey);
        return NextResponse.json({ ok: true, data, idempotencyKey }, { status: 200 });
    } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        const status = err.status ?? 500;
        return NextResponse.json(
            {
                ok: false,
                error: new ApiRouteError(getErrorMessage(error), status).message,
            },
            { status }
        );
    }
}
