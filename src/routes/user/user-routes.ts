
import { Router, Request, Response, NextFunction } from 'express';

import mongoose from "mongoose";
import { IUserModel } from '../../interfaces/IUserModel';
import { UserSchema, TokenSchema } from '../../schemas/mongo/index';

import { secretJwt } from '../../constants/index';
import { sign } from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import { Mailer } from "../../config";

class UserRoutes {

  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeMongoRouter();
  }

 /**
   * Mongo router
   */
  private initializeMongoRouter(): void {
    /**
     * Create User mongo model
     */
    const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
    const Token: mongoose.Model<any> = mongoose.model<any>("Token", TokenSchema);
    /**
     * Update user
     */
    this.router.patch('/update', async (req: Request, res: Response) => {
      const email = req.body.email;
      const body = req.body;
      try {
        res.status(200).json(await User.updateOne(
          {email: email},
          body,
        ));
      } catch (e) {
        res.status(500).json({message: e.message, name: e.name})
      }
    });
    /**
     * Get all users
     */
    this.router.get('/all', async (req: Request, res: Response) => {
      try {
        res.status(200).json(await User.find({}));
      } catch (e) {
        res.status(500).json({message: e.message, name: e.name})
      }
    });
    /**
     * Create new user
     */
    this.router.post('/registration', async (req: Request, res: Response) => {
      try {
        const email = req.body.registrationModel.email;
        const password = req.body.registrationModel.password;
        const BCRYPT_SALT_ROUNDS = 12;
        const exist = await User.findOne({email})
        if(!exist) {
          try {
            req.body.registrationModel.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
          } catch(e) {
            e.name = "SOMETHING_WRONG"
            res.status(500).json({message: e.message, name: e.name})
          }
          const user = await User.create(req.body.registrationModel);
          const token = new Token(
            { 
              _userId: user._id,
              token: crypto.randomBytes(16).toString('hex') 
            }
          );
          token.save().then(() => {
            var mailOptions = { 
              from: 'Favorite movies <kiskinvlad@gmail.com>',
              to: `Recipient <${email}>`,
              subject: 'Account Verification Token',
              text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 
              'localhost:4200' + '\/auth' + '\/confirmation?token=' + token.token + '&email=' + email + '.\n' 
            };
            Mailer.transporter.sendMail(mailOptions, (err) => {
              if (err) { return res.status(500).json({ msg: err.message });}
              res.status(200).json('A verification email has been sent to ' + email + '.');
            })
          }).catch((err) => {
            res.status(500).json({ msg: err.message });
          });
        } else {
          const e = { status: 409, message: 'User with this email already exist', name: "USER_EMAIL_EXIST" }
          res.status(e.status).json({message: e.message, name: e.name})
        }
      } catch (e) {
        if(e.message.includes('email cannot be null')) {
          e.name = "EMAIL_IS_NULL"
          res.status(500).json({message: e.message, name: e.name})
        } else {
          e.name = "SOMETHING_WRONG"
          res.status(500).json({message: e.message, name: e.name})
        }
      }
    });
    /**
     * Resend email
     */
    this.router.post('/send', async (req: Request, res: Response) => {
      try {
        const email = req.body.email;
        const user = await User.findOne({email});
        if(!user) {
          const e = { status: 409, message: 'User email not exist', name: "EMAIL_IS_NULL" }
          res.status(e.status).json({message: e.message, name: e.name})
        }
        const token = new Token(
          { 
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex') 
          }
        );
        token.save().then(() => {
          var mailOptions = { 
            from: 'Favorite movies <kiskinvlad@gmail.com>',
            to: `Recipient <${email}>`,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' 
            + 'localhost:4200' + '\/auth' + '\/confirmation?token=' + token.token + '&email=' + email + '.\n' 
          };
          Mailer.transporter.sendMail(mailOptions, (err) => {
            if (err) { return res.status(500).json({ msg: err.message }); }
            res.status(200).json('A verification email has been sent to ' + email + '.');
          })
        });
      } catch(e) {
        e.name = "SOMETHING_WRONG"
        res.status(500).json({message: e.message, name: e.name})
      }
    });
    /**
     * Confirm user registration
     */
    this.router.post('/confirmation', async (req: Request, res: Response) => {
      const token = req.body.token;
      const email = req.body.email;

      Token.findOne({ token: token }, (err, token) => {
        if (!token) return res.status(400).json(
          { 
            name: 'TOKEN_NOT_VERIFIED',
            message: 'We were unable to find a valid token. Your token may have expired.' 
          }
        );
        User.findOne({ _id: token._userId, email: email }, (err, user) => {
            if (!user) return res.status(400).json({ name: 'USER_TOKEN_NOT_FOUND', message: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).json({ name: 'ALREADY_VERIFIED', message: 'This user has already been verified.' });

            user.isVerified = true;
            
            user.save((err) => {
              if (err) { return res.status(500).json({ message: err.message }); }
              res.status(200).json({name: 'ACCOUNT_VERIFIED', message: "Registration success. Please log in."});
            });
        });
      });
    })
    /**
     * Auth user
     */
    this.router.post('/login', async (req: Request, res: Response) => {
      try {
        const email = req.body.loginModel.email;
        const password = req.body.loginModel.password;
        const user = await User.findOne({'email': email})
        let compared = false;
        try {
          compared = await bcrypt.compare(password, user.password);
        } catch(e) {
          e = { status: 409, message: 'Wrong email or/and password', name: "USER_NOT_EXIST" }
          res.status(e.status).json({message: e.message, name: e.name})
        }
        if(!user || !compared) {
          const e = { status: 409, message: 'Wrong email or/and password', name: "USER_NOT_EXIST" }
          res.status(e.status).json({message: e.message, name: e.name})
        } else if(user && !user.isVerified) {
          const e = { status: 409, message: 'User not verfified, please check email', name: "USER_NOT_VERIFIED" }
          res.status(e.status).json({message: e.message, name: e.name})
        } else {
          const token = sign({ sub: user.id }, secretJwt);
          const jwtUserModel = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image || null,
            token: token
          }
          res.status(201).json(jwtUserModel);
        }
      } catch (e) {
        if(e.message.includes('email cannot be null')) {
          e.name = "EMAIL_IS_NULL"
          res.status(500).json({message: e.message, name: e.name})
        } else {
          e.name = "SOMETHING_WRONG"
          res.status(500).json({message: e.message, name: e.name})
        }
      }
    });
     /**
     * Send not found for other not existing routes
     */
    this.router.post('/getUser', async (req: Request, res: Response) => {
      const email = req.body.email;
      try {
        const user = await User.findOne({email});
        res.status(201).json(user);
      } catch(e) {
        console.log(e)
        e = { status: 409, message: 'User email not exist', name: "USER_NOT_EXIST" }
        res.status(e.status).json({message: e.message, name: e.name})
      }
    })
    /**
     * Reset password
     */
    this.router.post('/reset', async (req: Request, res: Response) => {
      const email = req.body.email;
      try {
        const user = await User.findOne({email});
        if (user) {
          if (!user.isVerified) return res.status(400).json({ name: 'USER_NOT_VERIFIED', message: 'User not verified' });
          const token = new Token(
            { 
              _userId: user._id,
              token: crypto.randomBytes(16).toString('hex') 
            }
          );
          token.save().then(() => {
            var mailOptions = { 
              from: 'Favorite movies <kiskinvlad@gmail.com>',
              to: `Recipient <${email}>`,
              subject: 'Reset Verification Token',
              text: 'Hello,\n\n' + 'Please verify your email by clicking the link: \nhttp:\/\/' + 
                'localhost:4200' + '\/auth' + '\/resetConfirmation?token=' + token.token + '&email=' + email + '.\n' 
            };
            Mailer.transporter.sendMail(mailOptions, (err) => {
              if (err) { return res.status(500).json({ msg: err.message });}
              res.status(200).json('A verification email has been sent to ' + email + '.');
            })
          }).catch((err) => {
            res.status(500).json({ msg: err.message });
          });
        } else {
          const e = { status: 409, message: 'User email not exist', name: "USER_NOT_EXIST" }
          res.status(e.status).json({message: e.message, name: e.name})
        }
      } catch(e) {
        res.status(500).json({message: e.message, name: e.name})
      }
    })
    /**
     * Reset password confirmation
     */
    this.router.post('/resetConfirmation', async (req: Request, res: Response) => {
      const token = req.body.token;
      const email = req.body.email;
      const password = req.body.password;
      const BCRYPT_SALT_ROUNDS = 12;

      Token.findOne({ token: token }, (err, token) => {
        if (!token) return res.status(400).json(
          { 
            name: 'TOKEN_NOT_VERIFIED',
            message: 'We were unable to find a valid token. Your token may have expired.' 
          }
        );

        if (!password) return res.status(400).json({
          name: 'PASSWORD_NOT_EXIST',
          message: 'Password field not exist' 
        })

        User.findOne({ _id: token._userId, email: email }, (err, user) => {
          if (!user) return res.status(400).json({ name: 'USER_TOKEN_NOT_FOUND', message: 'We were unable to find a user for this token.' });
          try {
            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then((password) => {
              user.password = password;
              user.save((err, user) => {
                if (err) { return res.status(500).json({ message: err.message }); }
                res.status(200).json({name: 'PASSWORD_CHANGED', message: "Password change success. Please log in."});
              });
            });
          } catch(e) {
            e.name = "SOMETHING_WRONG"
            res.status(500).json({message: e.message, name: e.name})
          }
        });
      });
    })
    /**
     * Send not found for other not existing routes
     */
    this.router.get('/*', async (req: Request, res: Response, next: NextFunction) => {
      const e = {status: 404, message: 'Not Found'}
      res.status(e.status).json({message: e.message});
      next();
    })
  }
  
}

export default new UserRoutes().router;
