import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY!,
});

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    const sentFrom = new Sender("MS_XGP5Vw@test-51ndgwv5vwdlzqx8.mlsender.net", "Com_Pare Team");

    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(html);

    return await mailerSend.email.send(emailParams);
}