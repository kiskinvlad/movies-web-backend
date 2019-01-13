import { secretJwt } from '../constants/index';
import jwt from 'express-jwt';

abstract class Jwt {
  public static jwtHandler() {
    return jwt({secret: secretJwt}).unless({
        path: [
            '/api/auth/login',
            '/api/auth/registration',
            '/api/auth/confirmation',
            '/api/auth/send',
            '/api/auth/reset',
            '/api/auth/resetConfirmation'
        ]
    });
  }
}

export default Jwt;