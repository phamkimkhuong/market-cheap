import { Client, Users, ID, AppwriteException } from 'node-appwrite';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeBody = (rawBody) => {
    if (!rawBody || typeof rawBody !== 'object') {
        return { email: '', password: '', name: '' };
    }
    const body = rawBody;
    return {
        email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
        password: typeof body.password === 'string' ? body.password : '',
        name: typeof body.name === 'string' ? body.name.trim() : '',
    };
};

const validateInput = ({ email, password, name }) => {
    if (!name || name.length < 2) {
        return { ok: false, status: 422, code: 'INVALID_NAME', message: 'Tên không hợp lệ.' };
    }
    if (!EMAIL_REGEX.test(email)) {
        return { ok: false, status: 422, code: 'INVALID_EMAIL', message: 'Email không hợp lệ.' };
    }
    if (!password || password.length < 8) {
        return { ok: false, status: 422, code: 'INVALID_PASSWORD', message: 'Mật khẩu phải từ 8 ký tự.' };
    }
    return null;
};

export default async ({ req, res, log, error }) => {
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!projectId || !endpoint || !apiKey) {
        error('Missing APPWRITE_PROJECT_ID, APPWRITE_ENDPOINT, or APPWRITE_API_KEY');
        return res.json(
            { ok: false, code: 'CONFIG_ERROR', message: 'Function chưa được cấu hình biến môi trường.' },
            500
        );
    }

    const input = normalizeBody(req.bodyJson);
    const validationError = validateInput(input);
    if (validationError) {
        return res.json(validationError, validationError.status);
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const users = new Users(client);

    try {
        const createdUser = await users.create(ID.unique(), input.email, undefined, input.password, input.name);
        log(`Created user ${createdUser.$id}`);
        return res.json({ ok: true, userId: createdUser.$id }, 201);
    } catch (err) {
        if (err instanceof AppwriteException) {
            const loweredType = (err.type || '').toLowerCase();
            const loweredMessage = (err.message || '').toLowerCase();
            const isEmailExists =
                err.code === 409 ||
                loweredType.includes('already_exists') ||
                loweredType.includes('email_exists') ||
                loweredMessage.includes('already exists') ||
                loweredMessage.includes('already been used');

            if (isEmailExists) {
                return res.json(
                    { ok: false, code: 'EMAIL_EXISTS', message: 'Email đã tồn tại. Vui lòng dùng email khác.' },
                    409
                );
            }

            error(`AppwriteException ${err.code} ${err.type}: ${err.message}`);
            return res.json(
                { ok: false, code: 'REGISTER_FAILED', message: 'Không thể đăng ký lúc này. Vui lòng thử lại.' },
                err.code || 400
            );
        }

        error(`Unexpected error: ${String(err)}`);
        return res.json(
            { ok: false, code: 'UNKNOWN_ERROR', message: 'Lỗi không xác định khi đăng ký.' },
            500
        );
    }
};
