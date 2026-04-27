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

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/app/components/ui/navigation-menu"
import { RiSearch2Line } from "react-icons/ri";


import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet"
import { Menu } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { IoIosArrowDown } from 'react-icons/io'
import Link from 'next/link'
import Image from 'next/image'
import logo from "@/public/logo/logo-other.png"
import logo1 from "@/public/logo/logo1.png"
import { useState, useEffect } from 'react';
export default function Navbar() {
    const { data: session } = useSession()
    const [categories, setCategories] = useState<{ category_name: string }[]>([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                setCategories(data.data || [])
            } catch { console.error("Failed to fetch categories") }
        }
        fetchCategories()
    }, [])

    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">

                {/* LEFT: LOGO + DESKTOP NAV */}
                <div className="flex items-center md:gap-6">

                    {/* MOBILE MENU */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>

                            <SheetContent side="left" className="p-4 space-y-4">
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <div className="font-bold text-lg">Menu</div>

                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                className="w-full px-3 py-2 border rounded-md"
                                            />

                                            <div className="space-y-2">
                                                <div className="font-medium">Category</div>
                                                <div className="text-sm space-y-1 pl-2">
                                                    {categories.map((cat) => (
                                                        <div key={cat.category_name} className="hover:bg-gray-100 rounded px-2 py-1">
                                                            {cat.category_name}
                                                        </div>
                                                    ))}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </SheetContent>
                        </Sheet>
                    </div>

                    <Image src={logo} alt="Compare Logo1" width={120} height={120} className='hidden md:block' />
                    <Image src={logo1} alt="Compare Logo2" width={40} height={40} className='block md:hidden' />

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center">
                        <NavigationMenu className="relative">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Category</NavigationMenuTrigger>
                                    <NavigationMenuContent className="p-2 space-y-1 min-w-[180px]">
                                        {categories.map((cat) => (
                                            <NavigationMenuLink key={cat.category_name} className="block px-3 py-1 hover:bg-gray-100 rounded">
                                                {cat.category_name}
                                            </NavigationMenuLink>
                                        ))}
                                        
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    {/* CENTER: SEARCH (HIDDEN ON MOBILE) */}
                    <div className="hidden md:flex flex-1 justify-center ml-[-20px] relative">
                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
                            />
                        </div>
                        <button className='absolute top-1/2 transform -translate-y-1/2 right-3 bg-white cursor-pointer text-black/70 p-1'>
                            <RiSearch2Line />

                        </button>
                    </div>
                </div>



                {/* RIGHT: USER + MOBILE MENU */}
                <div className="flex items-center gap-2">



                    {/* USER (UNCHANGED) */}
                    {session ? (
                        <div className='flex items-center gap-2'>
                            <Link href="/contribute" className='px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer'>
                                Contribute
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={session.user?.image || ''} />
                                            <AvatarFallback>
                                                {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="hidden md:block text-sm font-medium">
                                            {session.user?.name?.split(' ')[0]}
                                        </span>

                                        <IoIosArrowDown />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-md">
                                    <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className='px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition'>Sign in</Link>
                            <Link href="/signup" className='px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition'>Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}