'use client'

import { signOut, useSession } from 'next-auth/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { IoIosArrowDown } from 'react-icons/io'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

                {/* LOGO */}
                <div className="font-bold text-lg tracking-tight text-gray-900">
                    MyApp
                </div>

                {/* PROFILE */}
                {session && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 transition-all duration-200 focus:outline-none">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={session.user?.image || ''} />
                                    <AvatarFallback className="bg-gray-200 text-gray-600">
                                        {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                                    </AvatarFallback>
                                </Avatar>

                                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                    {session.user?.name?.split(' ')[0]}
                                </span>

                                <IoIosArrowDown className="text-gray-500 text-base" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-48 bg-white border shadow-md  p-1"
                        >
                            <DropdownMenuLabel className="text-gray-700">
                                {session.user?.name}
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className=" focus:bg-black/10 cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

            </div>
        </nav>
    )
}