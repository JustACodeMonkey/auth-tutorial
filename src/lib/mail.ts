import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;
  resend.emails.send({
    from: 'Resend <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    html: `<p><a href="${confirmLink}">Verify your email address</a>.<p>`
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;
  resend.emails.send({
    from: 'Resend <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your email',
    html: `<p><a href="${resetLink}">Reset your password</a>.<p>`
  });
};
