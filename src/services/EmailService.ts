import * as nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (process.env.NODE_ENV !== "test") {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      this.transporter = {} as nodemailer.Transporter; // Mock transporter in test mode
    }
  }

  async sendRegistrationEmail(email: string, token: string): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      return Promise.resolve(); // Mock email sending in test mode
    }
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Complete Your Registration",
      text: `Use this token to complete registration: ${token}`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}