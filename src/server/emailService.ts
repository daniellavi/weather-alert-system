
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || '';
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        console.info('Sending email:', { to, subject, text });
        const msg = {
            to,
            from: FROM_EMAIL,
            subject,
            text,
        };
        const res = await sgMail.send(msg);
        console.info('Email sent successfully:', res);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
