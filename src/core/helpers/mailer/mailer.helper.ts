import nodemailer, {
  Transporter,
  SendMailOptions,
  SentMessageInfo,
} from 'nodemailer';

import { mail } from '@src/core/configurations';
import { MailOptions } from './mailer.interface';

class MailHelper {
  private transporter: Transporter;
  constructor() {
    this.createTransporter();
  }
  private createTransporter = () => {
    this.transporter = nodemailer.createTransport({
      host: mail.host,
      port: 587,
      secure: false,
      requireTLS: mail.enableStartTTLSAuto,
      auth: {
        user: mail.username,
        pass: mail.password,
      },
      logger: false,
    });
  };
  public send = async (options: MailOptions): Promise<SentMessageInfo> => {
    const optionsMail: SendMailOptions = {
      from: `Fullbarcode <${mail.from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    return await this.transporter.sendMail(optionsMail);
  };
}

export const mailHelper = new MailHelper();
