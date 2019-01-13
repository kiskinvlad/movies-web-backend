"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
class Mailer {
    constructor() {
    }
    static setupMailer() {
        let mailConfig;
        if (process.env.NODE_ENV === 'production') {
            mailConfig = {
                host: 'smtp.gmail.com',
                port: 465,
                tls: true,
                auth: {
                    user: '',
                    pass: '' // Here your gmail password
                }
            };
        }
        else {
            // all emails are catched by ethereal.email
            mailConfig = {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'bzrgfytxuc33fkvf@ethereal.email',
                    pass: 'hCmaNvcKvuRSCgVJ2c'
                }
            };
        }
        Mailer.transporter = nodemailer_1.createTransport(mailConfig);
    }
}
exports.default = Mailer;
