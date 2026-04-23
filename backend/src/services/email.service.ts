import nodemailer from 'nodemailer'
import { env } from '../config/env'

// Create transporter once, reuse everywhere
const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
  tls: {
    rejectUnauthorized: false  // needed for dev — Gmail self-signed cert issue
  }
})

export const emailService = {

  async sendMagicLink(email: string, token: string, name?: string) {
    const magicUrl = `${env.frontendUrl}/auth/verify?token=${token}`

    await transporter.sendMail({
      from: env.smtp.from,
      to: email,
      subject: 'Your DevShowcase Login Link',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>Welcome to DevShowcase ${name ? `, ${name}` : ''}!</h2>
          <p>Click the button below to log in. 
             This link expires in <strong>15 minutes</strong>.</p>
          <a href="${magicUrl}"
             style="
               display: inline-block;
               background: #6366f1;
               color: white;
               padding: 12px 24px;
               border-radius: 8px;
               text-decoration: none;
               font-weight: bold;
               margin: 16px 0;
             ">
            Log in to DevShowcase
          </a>
          <p style="color: #888; font-size: 14px;">
            If you didn't request this, ignore this email.
          </p>
        </div>
      `
    })
  },

  async verifyConnection() {
    return transporter.verify()
  }
}