export abstract class BasicException extends Error {
  statusCode!: number;
  action!: string;
  frontMessage!: string;
  constructor(message: string, statusCode = 500, frontMessage = '') {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.frontMessage = frontMessage;
  }
}
