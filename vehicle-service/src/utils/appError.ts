export class AppError<T = any> extends Error {
  public readonly statusCode: number;
  public readonly data?: T;

  constructor(message: string, statusCode: number, data?: T) {
    super(message);

    this.statusCode = statusCode;
    this.data = data;
    
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}