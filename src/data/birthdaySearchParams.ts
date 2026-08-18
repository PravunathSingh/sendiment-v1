import { createParser, parseAsInteger } from 'nuqs';
import { birthdayData } from './birthdayData';

function encodeUtf8Base64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeUtf8Base64Url(value: string): string | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad =
      padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes).trim();
    return decoded.length === 0 ? null : decoded;
  } catch {
    return null;
  }
}

const parseAsNonEmptyString = createParser({
  parse(query) {
    const trimmed = query.trim();
    return trimmed.length === 0 ? null : trimmed;
  },
  serialize(value) {
    return value;
  },
});

const parseAsEncodedMessage = createParser({
  parse: decodeUtf8Base64Url,
  serialize: encodeUtf8Base64Url,
});

/**
 * Shareable birthday params.
 * `message` is UTF-8 base64url so long greetings and punctuation stay URL-safe.
 *
 * Example: `?name=Ada&age=30&message=SGFwcHkgYmlydGhkYXkh`
 */
export const birthdaySearchParams = {
  name: parseAsNonEmptyString.withDefault(birthdayData.recipientName),
  age: parseAsInteger.withDefault(birthdayData.age),
  message: parseAsEncodedMessage.withDefault(birthdayData.message),
};

export function encodeBirthdayMessage(message: string): string {
  return encodeUtf8Base64Url(message);
}
