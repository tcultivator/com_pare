
import React from 'react';
import { Suspense } from 'react'
import AccountConfirmationComponent from '../components/accountConfirmationComponents/AccountConfirmation';
const AccountConfirmation = ({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) => {
    return (
        <Suspense fallback={<>waiting...</>}>
            <AccountConfirmationComponent searchParams={searchParams} />
        </Suspense>

    )
}

export default AccountConfirmation