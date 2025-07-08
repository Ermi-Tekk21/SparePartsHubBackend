import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.MAILTRAP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  async sendRegistrationEmail(email: string, token: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"SparePartsHub" <${process.env.SENDER_EMAIL || "no-reply@sparepartshub.com"}>`,
      to: email,
      subject: "Complete Your Registration",
      html: `
        <h1 style="color: #333;">Welcome to SparePartsHub</h1>
        <p><code style="font-size: 13px;">Your registration token (expires soon):</p>
        <p><code style="background-color: #f4f4f4; padding: 5px 10px; font-size: 16px; font-family: monospace; display: inline-block;">${token}</code></p>
      `,
    });
  }
}