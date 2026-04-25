"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [showPassword, setShowPassword] = useState(false)

    const seePassword = () => {
        setShowPassword((prev) => !prev)
    }
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setButtonLoading(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false, // IMPORTANT: prevents auto redirect so we can handle errors
            })

            if (res?.error) {
                setError("Invalid email or password")

                setButtonLoading(false)
                return
            }
            setSuccess("Login successful! Redirecting...")

            // success → redirect manually
            window.location.href = "/"
        } catch (err) {
            setError("Something went wrong. Try again.")
            setTimeout(() => {
                setError("")
            }, 3000)
        } finally {
            setButtonLoading(false)
            setTimeout(() => {
                setError("")
            }, 3000)
        }
    }

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-white sm:bg-background px-4 py-6">
            <div className="w-full max-w-md bg-white sm:rounded-2xl sm:shadow-lg p-8 mt-[-50px] sm:mt-0">

                {/* HEADER */}
                <div className="text-center mb-6">
                    {/* LOGO PLACEHOLDER */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                            LOGO
                        </div>
                    </div>
                    <h1 className="text-3xl font-semibold">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Sign in to your account
                    </p>
                </div>

                {/* GOOGLE */}
                <button
                    tabIndex={-1}
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

                {/* DIVIDER */}
                <div className="flex items-center gap-3 my-6">
                    <div className="h-px bg-gray-700 flex-1"></div>
                    <span className="text-gray-500 text-xs tracking-wide">OR</span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                </div>

                {error && (
                    <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 text-center py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 text-center py-2 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* FORM */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <label className="block text-sm font-medium mb-1 text-slate-600">Email <span className="text-red-400">*</span></label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full px-4 py-2 border text-sm border-black/30 text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="block text-sm font-medium mb-1 text-slate-600">Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <input
                            type={showPassword ? '' : "password"}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-black/30 text-sm text-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button tabIndex={-1} type="button" onClick={seePassword} className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer right-2 p-1 text-gray-500">
                            {showPassword ? <LuEye /> : <LuEyeClosed />}
                        </button>
                    </div>

                    {/* BUTTON */}
                    <button
                        tabIndex={-1}
                        type="submit"
                        disabled={buttonLoading}
                        className="w-full mt-6 font-light bg-black text-sm text-white py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                        {buttonLoading && (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        )}

                        {buttonLoading ? "" : "SignIn"}
                    </button>
                </form>



                {/* FOOTER */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-blue-400 hover:underline cursor-pointer"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    )
}