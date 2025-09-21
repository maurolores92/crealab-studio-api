export class HttpException extends Error {
  statusCode!: number;
  frontMessage!: string;
  constructor(message: string, statusCode = 500, frontMessage = '') {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.frontMessage = frontMessage;
  }
}
