"use client"
import Link from "next/link";
import { signIn } from "next-auth/react"
import { useState } from "react";
import { signupValidation } from "@/validation/signup/signupValidation";
import { alertClasses } from "@/utils/alertNotificationTypes";
import { RefreshCw } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [buttonLoading, setButtonLoading] = useState(false);

    const [alertNotif, setAlertNotif] = useState({ display: false, message: '', alertType: 'base' as 'success' | 'error' | 'base' | 'warning' });

    const signup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Signup with", { username, email, password, confirmPassword });
        setButtonLoading(true)
        const validation = signupValidation({ username, password, confirmPassword })
        if (validation) {
            setAlertNotif({ display: true, message: validation.message, alertType: validation.alertType })
            setButtonLoading(false)
            return
        } else {
            setAlertNotif({ display: false, message: '', alertType: 'base' })
            const submitForm = await fetch('/api/auth/signup/initial', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: email, username: username, password: password })
            })
            const result = await submitForm.json()
            switch (result.status) {
                case 409:
                    setAlertNotif({ display: true, message: 'Accounts already exists', alertType: 'warning' })
                    setTimeout(() => {
                        setAlertNotif({ display: false, message: '', alertType: 'base' })
                    }, 3000)
                    break;

                case 200:
                    setAlertNotif({ display: true, message: 'Confirmation link is sent to your email, please confirm your account', alertType: 'success' })
                    setTimeout(() => {
                        setAlertNotif({ display: false, message: '', alertType: 'base' })
                    }, 3000)
                    break;

                default:
                    setAlertNotif({ display: true, message: 'Something went wrong please try again', alertType: 'error' })
                    setTimeout(() => {
                        setAlertNotif({ display: false, message: '', alertType: 'base' })
                    }, 3000)
                    break;
            }

            setButtonLoading(false)
        }


    }

    const [showPassword, setShowPassword] = useState(false)
    const seePassword = () => {
        setShowPassword(!showPassword)
    }
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const seeConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white sm:bg-background px-4">
            <div className="w-full max-w-md bg-white sm:rounded-2xl sm:shadow-lg p-8">
                <h2 className="text-2xl text-black font-bold text-center mb-6">
                    Come join us!
                </h2>
                {alertNotif.display &&
                    <ul className={`${alertClasses[alertNotif.alertType]} whitespace-pre-line`}>
                        <li>
                            {alertNotif.message}
                        </li>
                    </ul>
                }

                <form className="space-y-4" onSubmit={signup}>
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium mb-1 text-slate-600">User Name <span className="text-red-400">*</span></label>
                        <input
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            type="text"
                            placeholder="Tomato Cultivator 3000"
                            className="w-full px-4 py-2 text-sm border border-black/30 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium mb-1 text-slate-600">Email <span className="text-red-400">*</span></label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            className="w-full px-4 py-2 text-sm border border-black/30 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            required
                        />

                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium mb-1 text-slate-600">Password <span className="text-red-400">*</span></label>
                        <div className="relative ">
                            <input
                                type={showPassword ? '' : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border text-sm border-black/30 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                required
                            />
                            <button type="button" onClick={seePassword} className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer right-2 p-1 text-gray-500">
                                {showPassword ? <LuEye /> : <LuEyeClosed />}
                            </button>

                        </div>

                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-medium mb-1 text-slate-600">
                            Confirm Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative ">
                            <input
                                type={showConfirmPassword ? '' : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border text-sm border-black/30 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                }}
                                required
                            />
                            <button type="button" onClick={seeConfirmPassword} className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer right-2 p-1 text-gray-500">
                                {showConfirmPassword ? <LuEye /> : <LuEyeClosed />}
                            </button>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={buttonLoading}
                        className="w-full bg-black font-light text-white py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        {buttonLoading && (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        )}
                        {buttonLoading ? "" : "SignUp"}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="px-3 text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Social buttons */}
                <div className="space-y-3">

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="
                            w-full
                            bg-white
                            border border-[#81acf0]
                            text-[#1f1f1f]
                            text-sm
                            py-2
                            rounded-lg
                            shadow-[0_2px_0px_#81acf0]
                            flex items-center justify-center gap-2
                            transition
                            active:translate-y-1
                            active:shadow-[0_2px_0px_#81acf0]
                            hover:bg-gray-50 cursor-pointer
                        "

                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-400 hover:underline cursor-pointer">
                        Sign in
                    </Link>

                </p>
            </div>
        </div>
    );
}