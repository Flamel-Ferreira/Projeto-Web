/**
 * Hash de senha com Web Crypto (SHA-256 + salt aleatório por usuário).
 * Formato persistido: sha256$<saltHex>$<digestHex>
 */

export class CryptoError extends Error {
  constructor(message, code = 'crypto_unavailable') {
    super(message);
    this.name = 'CryptoError';
    this.code = code;
  }
}

const encoder = new TextEncoder();

function getCrypto() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) return globalThis.crypto;
  return null;
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function randomBytes(length) {
  const bytes = new Uint8Array(length);
  const cryptoObject = getCrypto();

  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
    return bytes;
  }

  for (let index = 0; index < length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

export function generateSalt(byteLength = 16) {
  return toHex(randomBytes(byteLength).buffer);
}

export async function sha256Hex(text) {
  const cryptoObject = getCrypto();
  if (!cryptoObject?.subtle) {
    throw new CryptoError(
      'Criptografia segura indisponível. Abra o app em localhost ou HTTPS.',
    );
  }

  const digest = await cryptoObject.subtle.digest('SHA-256', encoder.encode(text));
  return toHex(digest);
}

/** Gera o hash no formato final persistido. */
export async function hashPassword(password, salt = generateSalt()) {
  const digest = await sha256Hex(`${salt}:${password}`);
  return `sha256$${salt}$${digest}`;
}

/** Compara a senha com o hash persistido, em tempo constante. */
export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') return false;

  const [algorithm, salt, expected] = storedHash.split('$');
  if (algorithm !== 'sha256' || !salt || !expected) return false;

  const digest = await sha256Hex(`${salt}:${password}`);
  if (digest.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < digest.length; index += 1) {
    difference |= digest.charCodeAt(index) ^ expected.charCodeAt(index);
  }

  return difference === 0;
}

export function isPasswordHash(value) {
  return typeof value === 'string' && /^sha256\$[a-f0-9]{32}\$[a-f0-9]{64}$/.test(value);
}
