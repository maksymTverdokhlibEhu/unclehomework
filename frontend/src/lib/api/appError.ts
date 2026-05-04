export class AppError extends Error {
  public status?: number;
  public data?: any;
  public originalError?: unknown;

  constructor(message: string, status?: number, data?: any, originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function isAppError(err: unknown): err is AppError {
  return (
    err instanceof AppError ||
    (err !== null && typeof err === 'object' && typeof (err as any).name === 'string' && (err as any).name === 'AppError')
  );
}
