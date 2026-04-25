"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { use } from 'react'
import Link from 'next/link';
const AccountConfirmationComponent = ({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) => {
    const [loading, setLoading] = useState(true)
    const params = use(searchParams)
    const [error, setError] = useState(false)
    const token = params.token
    useEffect(() => {
        setTimeout(() => {

            if (token) {
                const confirmAccountCreation = async () => {
                    const confirmAccount = await fetch('api/auth/signup/confirm', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({ token: token })

                    })
                    const result = await confirmAccount.json()
                    if (result.status == 200) {
                        setLoading(false)
                    } else {
                        setLoading(false)
                        setError(true)

                    }
                }
                confirmAccountCreation()
            } else {
                setLoading(false)
                setError(true)

            }
        }, 1000);


    }, [])
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 w-screen h-screen flex flex-col justify-center items-center z-50 text-white">
            {loading ? (
                <>
                    <PulseLoader size={15} color="#ffffff" />
                    <p className="mt-4 text-lg">Creating your account, please wait...</p>
                </>
            ) : error ? (
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">❌ Invalid or Expired Token</h1>
                    <p className="mb-2">The link you used is no longer valid or has expired.</p>
                    <Link
                        href="/login"
                        className="inline-block mt-3 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                    >
                        Return to Sign In
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">🎉 Account Created Successfully!</h1>
                    <p className="mb-2">You can now sign in with your credentials.</p>
                    <Link
                        href="/login"
                        className="inline-block mt-3 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                    >
                        Go to Sign In
                    </Link>
                </div>
            )}
        </div>

    )
}

export default AccountConfirmationComponent