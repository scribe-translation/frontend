export function normalizeSessionCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export function isValidSessionCodeFormat(code: string): boolean {
  return /^[A-Z0-9]{3,8}$/.test(code);
}

export function isSessionCodeAuthError(message: string): boolean {
  return /session code|no active session found/i.test(message);
}

export function getSessionCodeErrorMessage(
  apiError?: string,
  fallback = 'Session code not found. Check the code with your speaker and try again.'
): string {
  if (!apiError) return fallback;
  if (isSessionCodeAuthError(apiError)) {
    return apiError;
  }
  return apiError;
}
