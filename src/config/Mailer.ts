import { createTransport, Transporter } from 'nodemailer';
abstract class Mailer {

    static transporter: Transporter;

    constructor() {
    }

    public static setupMailer(): void {
        let mailConfig;
        if (process.env.NODE_ENV === 'production' ) {
            mailConfig = {
                host: 'smtp.gmail.com',
                port: 465,
                tls: true,
                auth: {
                    user: '', // Here your gmail
                    pass: '' // Here your gmail password
                }
            };
        } else {
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
        Mailer.transporter = createTransport(mailConfig);
    }
}

export default Mailer;