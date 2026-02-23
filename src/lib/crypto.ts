import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGO = 'aes-256-gcm';

function getSecret(): Buffer {
    const secret = process.env.PROVIDER_KEY_ENCRYPTION_SECRET;
    if (!secret) {
        throw new Error('PROVIDER_KEY_ENCRYPTION_SECRET env var is not set');
    }
    // Use first 32 bytes of hex-decoded secret (256 bits)
    return Buffer.from(secret, 'hex').subarray(0, 32);
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: iv:ciphertext:authTag (all hex).
 */
export function encryptProviderKey(plaintext: string): string {
    const key = getSecret();
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGO, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypt a provider key string previously encrypted with encryptProviderKey.
 * Expects input format: iv:ciphertext:authTag (all hex).
 */
export function decryptProviderKey(encryptedStr: string): string {
    // Support legacy plaintext keys (no colons = not encrypted)
    if (!encryptedStr.includes(':')) {
        return encryptedStr;
    }

    const key = getSecret();
    const [ivHex, ciphertext, authTagHex] = encryptedStr.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
