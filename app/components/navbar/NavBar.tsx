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
            } catch {
                console.error("Failed to fetch categories")
            }
        }
        fetchCategories()
    }, [])

    const [searchInput, setSearchInput] = useState('')
    const [sheetOpen, setSheetOpen] = useState(false);
    return (
        <nav className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">

                {/* LEFT */}
                <div className="flex items-center md:gap-6">

                    {/* MOBILE MENU */}
                    <div className="md:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    onClick={() => setSheetOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <Menu className="w-6 h-6 text-gray-700" />
                                </button>
                            </SheetTrigger>

                            <SheetContent side="left" className="p-4 space-y-4 bg-white">
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <div className="font-semibold text-lg text-gray-900">Menu</div>

                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                                            />
                                            {searchInput != '' && (
                                                <Link
                                                    href={`/productList/all?search=${encodeURIComponent(searchInput)}`}
                                                    onClick={() => setSheetOpen(false)}
                                                    className="px-4 py-2 gap-2 flex items-center justify-center text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                                                >
                                                    <span>Submit</span>
                                                    <RiSearch2Line />
                                                </Link>
                                            )}

                                            <div className="space-y-2">
                                                <div className="font-medium text-gray-700">Category</div>
                                                <div className="text-sm space-y-1 pl-2">
                                                    {categories.map((cat,index) => (
                                                        <Link
                                                            key={index}
                                                            href={`/productList/all?categories=${cat.category_name}`}
                                                            onClick={() => setSheetOpen(false)}
                                                            className="block hover:bg-gray-50 rounded-lg px-2 py-1 cursor-pointer text-gray-600"
                                                        >
                                                            {cat.category_name.toUpperCase().replace('_', ' ')}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Link href="/">
                        <Image src={logo} alt="Compare Logo1" width={120} height={120} className='hidden md:block' />
                    </Link>
                    <Link href="/">
                        <Image src={logo1} alt="Compare Logo2" width={40} height={40} className='block md:hidden' />
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center">
                        <NavigationMenu className="relative">
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900">
                                        Category
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="p-2 space-y-1 min-w-[180px] bg-white border border-gray-100 rounded-xl shadow-sm">
                                        {categories.map((cat,index) => (
                                            <NavigationMenuLink
                                                key={index}
                                                href={`/productList/all?categories=${cat.category_name}`}
                                                className="block px-3 py-1 cursor-pointer hover:bg-gray-50 rounded-lg text-gray-600"
                                            >
                                                {cat.category_name.toUpperCase().replace('_', ' ')}
                                            </NavigationMenuLink>
                                        ))}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* SEARCH */}
                    <div className="hidden md:flex flex-1 justify-start ml-[-20px] gap-1 ">
                        <div className='relative flex flex-1 justify-center'>
                            <div className="w-full max-w-md">
                                <input
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            <button type='button' className='absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700 p-1'>
                                <RiSearch2Line />
                            </button>

                        </div>
                        {searchInput != '' && (
                            <Link href={`/productList/all?search=${encodeURIComponent(searchInput)}`} className='px-4 py-2 flex items-center justify-center text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'>
                                <span>Submit</span>
                                <RiSearch2Line />
                            </Link>
                        )}

                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">

                    {session ? (
                        <div className='flex items-center gap-2'>
                            <Link
                                href="/contribute"
                                className='px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'
                            >
                                Contribute
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={session.user?.image || ''} />
                                            <AvatarFallback>
                                                {session.user?.name?.[0]?.toUpperCase() ?? '?'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="hidden md:block text-sm font-medium text-gray-700">
                                            {session.user?.name?.split(' ')[0]}
                                        </span>

                                        <IoIosArrowDown className="text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 shadow-md rounded-xl">
                                    <DropdownMenuLabel className="text-gray-700">
                                        {session.user?.name}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="cursor-pointer hover:bg-gray-50"
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className='px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-700'
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/signup"
                                className='px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition'
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}