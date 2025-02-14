import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise();

const db = pgp(process.env.DATABASE_URL);

interface CodeInterface {
    code: string;
}

export async function get2FACode(): Promise<CodeInterface> {
    const query = `
        SELECT code
        FROM public."TwoFactorCode"
        ORDER BY id DESC
        LIMIT 1;
    `;

    return await db.oneOrNone(query);
}