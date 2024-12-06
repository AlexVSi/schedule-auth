declare namespace Express {
    export interface IRequest extends Request {
      cookies: { [key: string]: string };
    }
  }