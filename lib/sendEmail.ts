import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export type SendMailProps = {
    to: string;
    sub: string;
    message: string;
};


// sending email using send grid
export async function sendEmail({ to, sub, message }: SendMailProps) {
    try {
        const msg = {
            to,
            from: process.env.NODEMAILER_USER!,
            subject: sub,
            html: message,
        };

        const [response] = await sgMail.send(msg);

        console.log("Email sent:", response.statusCode);
    } catch (error) {
        console.error("Email send error:", error);
        throw error;
    }
}