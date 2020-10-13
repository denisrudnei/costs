import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import express from 'express';

const transport = nodemailer.createTransport(new SMTPTransport({
  host: process.env.MAIL_HOST!,
  port: parseInt(process.env.MAIL_PORT!, 10),
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASSWORD!,
  },
}));

export class EmailService {
  public static async SendResetEmail(email: string, token: string, req: express.Request) {
    await transport.sendMail({
      to: email,
      from: process.env.MAIL_USER!,
      subject: 'Password reset',
      html: `<p>Click <a href="${req.protocol}://${req.hostname}/auth/token/${token}">here</a> to reset you password</p>`,
    });
  }
}
