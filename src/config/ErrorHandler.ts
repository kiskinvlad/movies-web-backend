import { logger } from "./index";
import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
abstract class ErrorHandler {

  static logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(err.stack);
    next(err);
  }

  static clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' });
    }
    else if (err.name === 'UnauthorizedError') {
      return res.status(500).json({ error: 'Invalid Token' });
    } else {
      next(err);
    }
  }

  static errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500).send({ message : err.message, name: err.name});
  }
  
}

export default ErrorHandler;