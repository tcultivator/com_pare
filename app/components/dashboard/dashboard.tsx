'use client'

import Image from 'next/image'
import { PiMapPinLine } from "react-icons/pi";
import { Heart, MapPin } from "lucide-react";
import Link from 'next/link';
import { MdOutlineBugReport } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { useState } from 'react';
const products = [
    {
        id: 1,
        name: "A4 Bond Paper (500 sheets)",
        price: 180,
        image: "/productImage/a4bondpaper.jpg",

        user: "Campus Print Hub",
        userImage: "/users/shop1.jpg",
        storeName: "Campus Print Hub",

        location: "Near Gate 2",
        category: "School Supplies",
        description:
            "Cheapest bond paper near campus. Good quality, ginagamit namin for thesis printing.",

        reportStatus: null,
        who_reported: null,
        reportReason: null,
    },

    {
        id: 2,
        name: "Black & White Printing (per page)",
        price: 3,
        image: "/productImage/xerox.webp",

        user: "Print Express",
        userImage: "/users/shop2.jpg",
        storeName: "Print Express",

        location: "Across Library",
        category: "Printing Service",
        description:
            "₱3 per page lang, mabilis din kahit marami. Walang pila most of the time.",

        reportStatus: "pending",
        who_reported: "user123",
        reportReason: "Possible overpricing reported by student",
    },

    {
        id: 3,
        name: "Colored Pens Set (12 pcs)",
        price: 120,
        image: "/productImage/colorpen.webp",

        user: "Student Supplies Store",
        userImage: "/users/shop3.jpg",
        storeName: "Student Supplies Store",

        location: "Main Street",
        category: "School Supplies",
        description:
            "Sulit for note-taking. Hindi agad nauubos yung ink.",

        reportStatus: null,
        who_reported: null,
        reportReason: null,
    },

    {
        id: 4,
        name: "Thesis Printing & Binding",
        price: 250,
        image: "/productImage/printing.jpeg",

        user: "QuickPrint Shop",
        userImage: "/users/shop4.jpg",
        storeName: "QuickPrint Shop",

        location: "Near Dorm Area",
        category: "Printing Service",
        description:
            "Mura compared sa iba. Pwede rush printing, tapos maayos yung binding.",

        reportStatus: null,
        who_reported: null,
        reportReason: null,
    },
];

export default function Dashboard() {
    const [showReason, setShowReason] = useState(false);
    return (
        <div className="bg-gray-100 min-h-screen">

            {/* HERO */}
            <div className="max-w-7xl mx-auto px-3 pt-3 md:px-6 md:pt-6">
                <div className="bg-[#c9e8f2] rounded-2xl p-8 flex items-center justify-between overflow-hidden">

                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 leading-tight">
                            Shop Smarter, Spend Less <br /> Compare. Save.
                        </h1>

                        <Link href="/productList/all" className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition">
                            Browse
                        </Link>
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
            <div className="max-w-7xl mx-auto px-3 mt-3 md:px-6 md:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-1  md:pb-10">
                {products.map((product) => (

                    <div
                        key={product.id}
                        className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-200 flex flex-col h-full ${product.reportStatus == 'done'
                            ? "opacity-70 border-red-200"
                            : "hover:shadow-lg hover:-translate-y-0.5"
                            } ${product.reportStatus?
                             " border-red-200":'border-slate-200'}`}
                    >
                        {/* Image */}
                        <div className="relative bg-gray-50 h-52 flex items-center justify-center">

                            {/* Reported badge (CLICKABLE) */}
                            {product.reportStatus && (
                                <button
                                    onClick={() => setShowReason((prev) => !prev)}
                                    className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-lg z-10 cursor-pointer hover:bg-red-200 transition"
                                >
                                    Reported
                                </button>
                            )}

                            {/* Reason popup */}
                            {showReason && product.reportStatus && (
                                <div className="absolute top-12 left-3 bg-white border border-gray-200 shadow-md text-xs text-gray-700 p-3 rounded-lg z-20 max-w-[220px] space-y-1">

                                    {/* Status */}
                                    <div className="font-semibold text-red-600">
                                        Status: {product.reportStatus}
                                    </div>

                                    {/* Who reported */}
                                    <div className="text-gray-600">
                                        Reported by:{" "}
                                        <span className="font-medium text-gray-800">
                                            {product.who_reported ?? "Unknown user"}
                                        </span>
                                    </div>

                                    {/* Reason */}
                                    <div className="text-gray-600">
                                        Reason:{" "}
                                        <span className="text-gray-800">
                                            {product.reportReason?.trim()
                                                ? product.reportReason
                                                : "No reason provided."}
                                        </span>
                                    </div>

                                </div>
                            )}

                            {/* Report button (DISABLED when reported) */}
                            <button
                                onClick={() => {
                                    console.log("Report product:", product.id);
                                }}
                                disabled={!!product.reportStatus}
                                className={`absolute top-3  right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-transform z-10 ${product.reportStatus
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:scale-110 cursor-pointer"
                                    }`}
                                title="Report item"
                            >
                                <MdOutlineBugReport />
                            </button>

                            <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content wrapper */}
                        <div className="p-4 flex flex-col flex-1">

                            {/* Product name */}
                            <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
                                {product.name}
                            </h3>

                            {/* Price */}
                            <p className="text-base font-bold text-gray-900 mb-2">
                                ₱{product.price.toLocaleString()}
                            </p>

                            {/* Seller */}
                            <div className="flex items-center gap-2 mb-2">
                                <img
                                    src={product.userImage}
                                    alt={product.user}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs text-gray-600">{product.user}</span>
                            </div>

                            {/* Store */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <BsShop className="w-3.5 h-3.5" />
                                {product.storeName}
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                {product.location}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                {product.description}
                            </p>

                            {/* Buttons (UNCHANGED LOGIC) */}
                            <div className="mt-auto flex gap-2">

                                <button
                                    disabled={product.reportStatus == 'done'}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${product.reportStatus == 'done'
                                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                                        }`}
                                >
                                    View
                                </button>

                                {/* Compare Button */}
                                <button
                                    disabled={product.reportStatus == 'done'}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${product.reportStatus == 'done'
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                        }`}
                                >
                                    Compare
                                </button>

                            </div>

                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}