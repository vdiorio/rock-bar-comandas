import {getReasonPhrase} from 'http-status-codes';

export default class HttpException extends Error {
  statusCode: number;
  message: string;

  constructor(
    statusCode: number,
    message: string = getReasonPhrase(statusCode),
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
