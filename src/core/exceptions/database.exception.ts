import { BasicException } from './basic.exception';

export class DatabaseException extends BasicException {
  action!: string;
  constructor(
    message: string,
    action: string,
    statusCode = 500,
    frontMessage = '',
  ) {
    super(message, statusCode, frontMessage);
    this.action = `DatabaseError - ${action}`;
  }
}
