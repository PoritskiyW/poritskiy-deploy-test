import nodemailer from 'nodemailer';
import { nodemailerConfig } from '../configs/nodemailer.config';


export class EmailController {
  private trasporter: nodemailer.Transporter

  constructor() {
    this.setTransporter();
  }

  private setTransporter() {
    try {
      const config = Object.assign(nodemailerConfig, { auth: { user: 'reilly.windler89@ethereal.email', pass: 'kfPG6vqNjMKFwvEsxq' }});
      this.trasporter = nodemailer.createTransport(config);
    } catch (err) {
      console.error(err);
    }
  }

  public async sendEmail(password: string, email: string) {

    try {
      const info = await this.trasporter.sendMail({
        from: '"Химчистка" <cleaner@email.com>',
        to: email,
        subject: 'Восстановление пароля',
        text: `Ваш новый пароль ${password}`
      })
      // temporary
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
      console.error(err);
    }
  }
}
