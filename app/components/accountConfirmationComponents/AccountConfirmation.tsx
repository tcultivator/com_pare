"use client"
import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react"

const AccountConfirmationComponent = ({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const params = use(searchParams)
    const token = params.token

    useEffect(() => {
        setTimeout(() => {
            if (token) {
                const confirmAccountCreation = async () => {
                    try {
                        const confirmAccount = await fetch('api/auth/signup/confirm', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({ token })
                        })

                        const result = await confirmAccount.json()

                        if (result.status === 200) {
                            setLoading(false)
                        } else {
                            setLoading(false)
                            setError(true)
                        }
                    } catch {
                        setLoading(false)
                        setError(true)
                    }
                }

                confirmAccountCreation()
            } else {
                setLoading(false)
                setError(true)
            }
        }, 800)
    }, [token])

    return (
        <div className="min-h-[100dvh] bg-white sm:bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white sm:rounded-3xl sm:border border-gray-200 p-8 text-center">

                {loading ? (
                    <>
                        <div className="flex justify-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>

                        <h2 className="mt-6 text-base font-semibold text-gray-900">
                            Setting up your account
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Please wait…
                        </p>
                    </>
                ) : error ? (
                    <>
                        <div className="flex justify-center">
                            <div className="bg-red-50 p-3 rounded-full">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-base font-semibold text-gray-900 mt-5">
                            Link Expired
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            This confirmation link is no longer valid.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 block w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium active:scale-[0.98] transition"
                        >
                            Sign In
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <div className="bg-green-50 p-3 rounded-full">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <h1 className="text-base font-semibold text-gray-900 mt-5">
                            Account Ready
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            You can now sign in.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 block w-full py-2.5 rounded-xl bg-black text-white text-sm font-medium active:scale-[0.98] transition"
                        >
                            Continue
                        </Link>
                    </>
                )}

            </div>
        </div>
    )
}

export default AccountConfirmationComponent