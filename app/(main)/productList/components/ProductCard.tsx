"use client";

import { MapPin } from "lucide-react";
import { BsShop } from "react-icons/bs";
import { MdOutlineBugReport } from "react-icons/md";
import { Product } from "../data/mockProducts";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

import { toast } from "sonner"
type ProductCardProps = {
  product: Product;
};
import { signOut, useSession } from 'next-auth/react'
export default function ProductCard({ product }: ProductCardProps) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");
  const { data: session } = useSession()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    if (!session) {
      toast.error("You must be logged in to report a product.");
      return;
    }

    setLoading(true);

    try {
      const promise = fetch("/api/submit_report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          reason,
          name: session.user?.name,
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        return data;
      });

      toast.promise(promise, {
        loading: "Submitting report...",
        success: "Report submitted successfully!",
        error: (err) => err.message,
      });

      await promise;

      // ✅ update UI

      setReason("");

      // ✅ AUTO CLOSE on success
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.error(err);

      // ❗ optional: also close on error
      // setOpen(false);
    }
  };
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-200 flex flex-col h-full ${product.reportStatus == 'done'
        ? "opacity-70 border-red-200"
        : "hover:shadow-lg hover:-translate-y-0.5"
        } ${product.reportStatus ?
          " border-red-200" : 'border-slate-200'}`}
    >
      {/* Image */}
      <div className="relative bg-gray-50 h-52 flex items-center justify-center">

        {/* Report badge (click to show reason) */}
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

        {/* Report button (DISABLED if reported) */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => setOpen(true)}
              disabled={!!product.reportStatus}
              className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-transform z-10 ${product.reportStatus
                ? "opacity-40 cursor-not-allowed"
                : "hover:scale-110 cursor-pointer"
                }`}
              title="Report item"
            >
              <MdOutlineBugReport />
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Report this product</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Textarea
                placeholder="Enter your reason for reporting..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={loading} className="cursor-pointer px-2 py-1" variant="ghost" onClick={() => setReason("")}>
                  Cancel
                </Button>
              </DialogClose>

              <Button className="cursor-pointer px-2 py-1" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

        {/* Buttons */}
        <div className="mt-auto flex gap-2">

          {/* View Button */}
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
  );
}