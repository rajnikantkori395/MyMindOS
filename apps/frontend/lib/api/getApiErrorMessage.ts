/**
 * Human-readable message from RTK Query / fetch errors (avoids "[object Object]" in UI).
 */
export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (!error || typeof error !== 'object') {
    return 'Something went wrong. Please try again.';
  }

  const err = error as Record<string, unknown>;

  const data = err.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const msg = d.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.map(String).join(', ');
  }

  if (typeof err.message === 'string' && err.message) return err.message;

  return 'Something went wrong. Please try again.';
}
