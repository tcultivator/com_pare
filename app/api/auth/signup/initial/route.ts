import db from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { Accounts } from '@/types/AccountType'
import { RandomString } from '@/utils/randomStringGenerator/RandomString'
import { sendEmail } from '@/lib/sendEmail'
import bcrypt from "bcryptjs";
const buildURL = process.env.NEXTAUTH_URL;
export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const checkQuery = 'SELECT * FROM users WHERE email = ?'
        const insertQuery = 'INSERT INTO pending_signup_users (email,username,password,image,token,expired_at) VALUES (?,?,?,?,?,DATE_ADD(NOW(), INTERVAL 15 MINUTE))'
        //generated token
        const token = RandomString()
        //default image for signup users
        const defaultProfile = 'https://res.cloudinary.com/djjg39yja/image/upload/v1760539730/image_pyzrpr.jpg'

        const [rows] = await db.query(checkQuery, [body.email])
        const result = rows as Accounts[]
        if (result.length > 0) return NextResponse.json({ status: 409 })
        const hashedPassword = await bcrypt.hash(body.password, 10)
        await db.query(insertQuery, [body.email, body.username, hashedPassword, defaultProfile, token])
        const data = await sendEmail({
            to: body.email, subject: 'Confirm your account', html: `
            
           <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f2f2f2; padding: 40px 20px;">
                <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                    style="
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #e5e5e5;
                    "
                >
                    <!-- Header -->
                    <tr>
                    <td
                        style="
                        padding: 32px 40px;
                        text-align: center;
                        background-color: #000000;
                        "
                    >
                        <h1
                        style="
                            margin: 0 0 8px;
                            font-size: 22px;
                            color: #ffffff;
                            font-weight: 600;
                        "
                        >
                        Confirm Your Account
                        </h1>
                        <p style="margin: 0; font-size: 13px; color: #bbbbbb;">
                        This link expires in <strong>15 minutes</strong>
                        </p>
                    </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                    <td style="padding: 40px; text-align: center;">
                        <p
                        style="
                            font-size: 16px;
                            color: #111111;
                            line-height: 1.6;
                            margin-bottom: 32px;
                        "
                        >
                        Thank you for signing up.<br />
                        Please confirm your email address to complete your account setup.
                        </p>

                        <!-- CTA -->
                        <a
                        href="${buildURL}/accountConfirmation?token=${token}"
                        style="
                            display: inline-block;
                            padding: 14px 28px;
                            background-color: #000000;
                            color: #ffffff;
                            text-decoration: none;
                            font-size: 15px;
                            font-weight: 600;
                            border: 1px solid #000000;
                        "
                        >
                        Confirm My Account
                        </a>

                        <!-- Security Note -->
                        <p
                        style="
                            margin-top: 28px;
                            font-size: 13px;
                            color: #666666;
                            line-height: 1.5;
                        "
                        >
                        <strong>Security notice:</strong><br />
                        Do not share this email with anyone. This link is unique to your account
                        and grants access to personal information.
                        </p>
                    </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                    <td
                        style="
                        padding: 20px 40px;
                        background-color: #f2f2f2;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        "
                    >
                        If you did not request this account, you can safely ignore this email.
                    </td>
                    </tr>
                </table>
                </div>

            ` })
            console.log("RESEND RESPONSE:", data);

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 500 })
    }
}