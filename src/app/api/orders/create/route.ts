import { NextRequest, NextResponse } from 'next/server';
import { checkoutRepository } from '@/services/repositories/checkout-repository';
import { CreateOrderRequestSchema } from '@/types/api';
import { parseOrThrow } from '@/services/repositories/validation';
import { getRequiredHeader } from '@/services/repositories/config';
import { getErrorMessage } from '@/utils/error';
import { getServerAuthUser } from '@/services/api/server-auth';

const processedRequestIds = new Set<string>();

export async function POST(request: NextRequest) {
    try {
        const idempotencyKey = getRequiredHeader(request.headers.get('x-idempotency-key'), 'x-idempotency-key');
        if (processedRequestIds.has(idempotencyKey)) {
            return NextResponse.json({ ok: true, duplicated: true, idempotencyKey }, { status: 200 });
        }

        const payload = parseOrThrow(
            CreateOrderRequestSchema,
            await request.json(),
            'api.orders.create.request'
        );
        const sessionUser = await getServerAuthUser();

        const result = await checkoutRepository.createOrder({
            userId: sessionUser.$id,
            address: payload.address,
            idempotencyKey,
            items: payload.items,
        });

        processedRequestIds.add(idempotencyKey);
        return NextResponse.json({ ok: true, data: result, idempotencyKey }, { status: 201 });
    } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        return NextResponse.json(
            { ok: false, error: getErrorMessage(error) || 'Create order failed' },
            { status: err.status || 500 }
        );
    }
}
