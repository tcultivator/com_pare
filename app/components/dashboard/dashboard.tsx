'use client'

import Image from 'next/image'
import { PiMapPinLine } from "react-icons/pi";

const products = [
    {
        id: 1,
        name: 'A4 Bond Paper (500 sheets)',
        price: 180,
        image: '/productImage/a4bondpaper.jpg',
        user: 'Campus Print Hub',
        userImage: '/users/shop1.jpg',
        location: 'Near Gate 2',
        category: 'School Supplies',
        description: 'Cheapest bond paper near campus. Good quality, ginagamit namin for thesis printing.'
    },
    {
        id: 2,
        name: 'Black & White Printing (per page)',
        price: 3,
        image: '/productImage/xerox.webp',
        user: 'Print Express',
        userImage: '/users/shop2.jpg',
        location: 'Across Library',
        category: 'Printing Service',
        description: '₱3 per page lang, mabilis din kahit marami. Walang pila most of the time.'
    },
    {
        id: 3,
        name: 'Colored Pens Set (12 pcs)',
        price: 120,
        image: '/productImage/colorpen.webp',
        user: 'Student Supplies Store',
        userImage: '/users/shop3.jpg',
        location: 'Main Street',
        category: 'School Supplies',
        description: 'Sulit for note-taking. Hindi agad nauubos yung ink.'
    },
    {
        id: 4,
        name: 'Thesis Printing & Binding',
        price: 250,
        image: '/productImage/printing.jpeg',
        user: 'QuickPrint Shop',
        userImage: '/users/shop4.jpg',
        location: 'Near Dorm Area',
        category: 'Printing Service',
        description: 'Mura compared sa iba. Pwede rush printing, tapos maayos yung binding.'
    }
]

export default function Dashboard() {
    return (
        <div className="bg-gray-100 min-h-screen">

            {/* HERO */}
            <div className="max-w-7xl mx-auto px-3 pt-3 md:px-6 md:pt-6">
                <div className="bg-[#e8dfd6] rounded-2xl p-8 flex items-center justify-between overflow-hidden">

                    <div>
                        <h1 className="text-3xl font-bold text-green-900 leading-tight">
                            Shop Smarter, Spend Less <br /> Compare. Save.
                        </h1>

                        <button className="mt-4 bg-green-900 text-white px-5 py-2 rounded-full text-sm hover:bg-green-800 transition">
                            Browse
                        </button>
                    </div>

                    <div className="hidden md:block mr-0 sm:mr-20 lg:mr-30">
                        <Image
                            src="/imagetest.png"
                            alt="hero"
                            width={250}
                            height={250}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* FILTERS
            <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {['Category', 'Price', 'Distance', 'All Filters'].map((f) => (
                        <button
                            key={f}
                            className="px-4 py-1.5 bg-white border rounded-full text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <button className="px-4 py-1.5 bg-white border rounded-full text-sm text-gray-700 hover:bg-gray-100 transition">
                    Sort by
                </button>
            </div> */}

            {/* TITLE */}
            <div className="max-w-7xl mx-auto px-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-900">
                    Recommended For You!
                </h2>
            </div>

            {/* PRODUCT GRID */}
            <div className="max-w-7xl mx-auto px-3 mt-3 md:px-6 md:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2  md:pb-10">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl p-4 hover:shadow-md transition"
                    >
                        {/* IMAGE */}
                        <div className="relative h-40 bg-gray-50 rounded-lg mb-3">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* NAME */}
                        <h3 className="text-sm font-semibold text-gray-800">
                            {product.name}
                        </h3>

                        {/* PRICE */}
                        <p className="text-sm font-bold mt-1">
                            ₱{product.price.toLocaleString()}
                        </p>
                        {/* description */}
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                        </p>

                        {/* USER */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                <Image
                                    src={product.userImage}
                                    alt={product.user}
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                {product.user}
                            </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 text-xs bg-black cursor-pointer text-white py-1.5 rounded-md hover:bg-black/90 transition">
                                View
                            </button>

                            <button className="flex-1 text-xs border cursor-pointer py-1.5 rounded-md hover:bg-gray-100 transition">
                                Compare
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}