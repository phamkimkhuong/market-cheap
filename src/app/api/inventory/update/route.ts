import { NextRequest, NextResponse } from 'next/server';
import { checkoutRepository } from '@/services/repositories/checkout-repository';
import { UpdateInventoryRequestSchema } from '@/types/api';
import { parseOrThrow } from '@/services/repositories/validation';
import { getRequiredHeader } from '@/services/repositories/config';
import { getErrorMessage } from '@/utils/error';

const processedRequestIds = new Set<string>();

export async function POST(request: NextRequest) {
    try {
        const idempotencyKey = getRequiredHeader(request.headers.get('x-idempotency-key'), 'x-idempotency-key');
        if (processedRequestIds.has(idempotencyKey)) {
            return NextResponse.json({ ok: true, duplicated: true, idempotencyKey }, { status: 200 });
        }

        const payload = parseOrThrow(
            UpdateInventoryRequestSchema,
            await request.json(),
            'api.inventory.update.request'
        );

        const result = await checkoutRepository.decreaseInventory(payload.productId, payload.delta);
        processedRequestIds.add(idempotencyKey);

        return NextResponse.json({ ok: true, data: result, idempotencyKey }, { status: 200 });
    } catch (error: unknown) {
        const err = error as { message?: string; status?: number };
        return NextResponse.json(
            { ok: false, error: getErrorMessage(error) || 'Update inventory failed' },
            { status: err.status || 500 }
        );
    }
}
