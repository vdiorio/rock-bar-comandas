import {IncomingHttpHeaders} from 'http';
import {Request} from 'express';

interface IcustomRequest extends Request {
  myAwesomeProperty?: number;
  headers: IncomingHttpHeaders & {
    userData?: any;
  };
}

export default IcustomRequest;
