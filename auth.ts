
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import db from "./lib/db";
// types of accounts
// the expected types of a value get from database
import { Accounts } from "./types/AccountType";
import bcrypt from "bcryptjs";
import { RandomString } from "./utils/randomStringGenerator/RandomString";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google,
        Credentials({
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
                    const accounts = rows as Accounts[];
                    if (!accounts.length) {
                        console.log('no account found')
                        return null;
                    }

                    const password = credentials?.password as string
                    const isPasswordCorrect = await bcrypt.compare(password, accounts[0].password)
                    if (!isPasswordCorrect) {
                        console.log('password is incorrect, this log is in auth')
                        return null;
                    }

                    return {
                        email: accounts[0].email,
                        name: accounts[0].username,
                        image: accounts[0].profile_image,
                    };
                } catch (err) {
                    console.log('throw error??')
                    throw new Error("SERVER_ERROR");
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            const { email, name, image } = user;
            if (!email) {
                return false
            }
            console.log("Provider used:", account?.provider);
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            const accounts = rows as Accounts[];
            if (account?.provider == 'google') {
                const randomPassword = RandomString()
                console.log(randomPassword)
                const hashedPassword = await bcrypt.hash(randomPassword, 10)
                if (accounts.length === 0) {
                    await db.query('INSERT INTO users (email,password,username,profile_image,role) VALUES (?,?,?,?,?)', [email, hashedPassword, name, image, 'client'])
                } else {
                    console.log('account already exists, skipping creation')
                }
            }

            return true

        },

    }
})