"use client";

import { MapPin, X, Navigation, Store, Tag, FileText, User, ChevronRight, Loader2 } from "lucide-react";
import { BsShop } from "react-icons/bs";
import { MdOutlineBugReport } from "react-icons/md";
import { Product } from "../data/mockProducts";
import { useState } from "react";
import { MdCompareArrows } from "react-icons/md";
import MapIframe from "./MapIframe";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);   // mobile map modal
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) { toast.error("Please provide a reason."); return; }
    if (!session) { toast.error("You must be logged in to report a product."); return; }
    setLoading(true);
    try {
      const promise = fetch("/api/submit_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, reason, name: session.user?.name }),
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
      setReason("");
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReported = !!product.reportStatus;
  const isDone = product.reportStatus === "done";

  const mapSrc = `https://www.google.com/maps?saddr=15.448659,120.940740&daddr=${product.plat},${product.plong}&z=18&output=embed`;


  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden group transition-all duration-200 flex flex-col h-full
        ${isDone ? "opacity-70 border-red-200" : ""}
        ${isReported && !isDone ? "border-red-200" : ""}
        ${!isReported ? "border-slate-200 hover:shadow-lg hover:-translate-y-0.5" : ""}
      `}
    >
      {/* IMAGE SECTION */}
      <div className="relative bg-gray-50 h-52 flex items-center justify-center overflow-hidden">
        {isReported && (
          <button
            onClick={() => setShowReason((prev) => !prev)}
            className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-lg z-10 cursor-pointer hover:bg-red-200 transition"
          >
            Reported
          </button>
        )}
        {showReason && isReported && (
          <div className="absolute top-12 left-3 bg-white border border-gray-200 shadow-md text-xs text-gray-700 p-3 rounded-lg z-20 max-w-[220px] space-y-1">
            <div className="font-semibold text-red-600">Status: {product.reportStatus}</div>
            <div className="text-gray-600">
              Reported by: <span className="font-medium text-gray-800">{product.who_reported ?? "Unknown user"}</span>
            </div>
            <div className="text-gray-600">
              Reason: <span className="text-gray-800">{product.reportReason?.trim() || "No reason provided."}</span>
            </div>
          </div>
        )}

        {/* Report modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              disabled={isReported}
              className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-transform z-10
                ${isReported ? "opacity-40 cursor-not-allowed" : "hover:scale-110 cursor-pointer"}`}
            >
              <MdOutlineBugReport className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <div className="px-1 pt-1">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Report this product</h2>
              <p className="text-xs text-gray-400 mb-3">Let us know what&apos;ss wrong with this listing.</p>
            </div>
            <Textarea
              placeholder="Enter your reason for reporting..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={loading} variant="ghost" onClick={() => setReason("")}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={loading}>
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

      {/* CARD CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-base font-bold text-gray-900 mb-2">₱{product.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mb-2">
          <img src={product.userImage} className="w-6 h-6 rounded-full" alt="" />
          <span className="text-xs text-gray-600">{product.user}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <BsShop className="w-3.5 h-3.5" />{product.storeName}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5" />{product.location}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>

        <div className="mt-auto flex gap-2">

          {/* ── VIEW MODAL ── */}
          <Dialog open={viewOpen} onOpenChange={(v) => { setViewOpen(v); if (!v) { setMapLoaded(false); setMapOpen(false); } }}>
            <DialogTrigger asChild>
              <button className="flex-1 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                View
              </button>
            </DialogTrigger>

            {/* 
              Desktop: max-w-4xl side-by-side layout
              Mobile: full-screen, map hidden behind button
            */}
            <DialogContent className="
              p-0 gap-0 overflow-hidden border-0
              w-screen h-[100dvh] max-w-none rounded-none
              sm:w-[95vw] sm:h-auto sm:max-w-4xl sm:rounded-2xl sm:max-h-[90vh]
            ">
              <div className="pt-4 px-4 bg-white border-b border-slate-300">
                <DialogHeader className="flex flex-col gap-0">
                  <DialogTitle>Product Information</DialogTitle>
                  <DialogDescription>
                    Detailed Information about the product.
                  </DialogDescription>
                </DialogHeader>
              </div>


              {/* ══ DESKTOP LAYOUT (sm and up) ══ */}
              <div className="hidden sm:flex flex-col h-full max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img src={product.userImage} alt={product.user} className="w-10 h-10 rounded-full border-2 border-white shadow" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{product.user} · {product.storeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₱{product.price.toLocaleString()}</p>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    {/* <DialogClose asChild>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </DialogClose> */}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">

                  {/* Left — product details */}
                  <div className="w-[320px] shrink-0 flex flex-col overflow-y-auto border-r border-gray-100">

                    {/* Product image */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-48 shrink-0">
                      <img src={product.image} alt={product.name} className="max-h-40 max-w-full object-contain p-4" />
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-4 flex-1">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{product.description || "No description provided."}</p>
                      </div>

                      <div className="space-y-2.5">
                        <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Contributor" value={product.user} />
                        <InfoRow icon={<BsShop className="w-3.5 h-3.5" />} label="Store" value={product.storeName} />
                        <InfoRow icon={<Tag className="w-3.5 h-3.5" />} label="Category" value={product.category.toUpperCase().replace('_', ' ')} />
                        <InfoRow icon={<MapPin className="w-3.5 h-3.5 text-blue-500" />} label="Location" value={product.location} accent />
                      </div>

                      {isReported && (
                        <div className="rounded-xl bg-red-50 border border-red-100 p-3 space-y-1">
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Reported</p>
                          <p className="text-xs text-gray-600">
                            By <span className="font-medium text-gray-800">{product.who_reported ?? "Unknown"}</span>
                          </p>
                          {product.reportReason && (
                            <p className="text-xs text-gray-500 italic">{`"${product.reportReason}"`}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — map */}
                  <div className="flex-1 flex flex-col">
                    {/* Map legend bar */}
                    <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 shrink-0">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100 inline-block" />
                        Your location
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100 inline-block" />
                        {product.location}
                      </span>
                      <span className="flex items-center gap-1.5 ml-auto">
                        <Navigation className="w-3 h-3" />
                        Driving route
                      </span>
                    </div>
                    <div className="flex-1 min-h-[380px]">
                      <MapIframe
                        mapLoaded={mapLoaded}
                        onLoad={() => setMapLoaded(true)}
                        src={mapSrc}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ══ MOBILE LAYOUT (below sm) ══ */}
              <div className="flex sm:hidden flex-col h-full overflow-y-auto">

                {/* Mobile header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={product.userImage} alt={product.user} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{product.user}</p>
                    </div>
                  </div>

                </div>

                {/* Product image */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-52 shrink-0">
                  <img src={product.image} alt={product.name} className="max-h-44 max-w-full object-contain p-4" />
                </div>

                {/* Price + category */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-xl font-bold text-gray-900">₱{product.price.toLocaleString()}</p>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="px-4 py-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Description</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{product.description || "No description provided."}</p>
                  </div>

                  <div className="space-y-2.5">
                    <InfoRow icon={<User className="w-3.5 h-3.5" />} label="Contributor" value={product.user} />
                    <InfoRow icon={<BsShop className="w-3.5 h-3.5" />} label="Store" value={product.storeName} />
                    <InfoRow icon={<Tag className="w-3.5 h-3.5" />} label="Category" value={product.category.toUpperCase().replace('_', ' ')} />
                    <InfoRow icon={<MapPin className="w-3.5 h-3.5 text-blue-500" />} label="Location" value={product.location} accent />
                  </div>

                  {isReported && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3 space-y-1">
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Reported</p>
                      <p className="text-xs text-gray-600">
                        By <span className="font-medium text-gray-800">{product.who_reported ?? "Unknown"}</span>
                      </p>
                      {product.reportReason && (
                        <p className="text-xs text-gray-500 italic">{`"${product.reportReason}"`}</p>
                      )}
                    </div>
                  )}

                  {/* View Map button — opens full-screen map modal on mobile */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMapOpen(true)}
                      className="w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        View on Map
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                    <button
                      onClick={() => setMapOpen(true)}
                      className="w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        <MdCompareArrows className="w-4 h-4" />
                        Compare
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  </div>

                </div>
              </div>

            </DialogContent>
          </Dialog>

          {/* ── MOBILE MAP MODAL (full-screen) ── */}
          <Dialog open={mapOpen} onOpenChange={(v) => { setMapOpen(v); if (!v) setMapLoaded(false); }}>
            <DialogContent className="p-0 gap-0 w-screen h-[100dvh] max-w-none rounded-none border-0 sm:hidden">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
                  <div className="pr-10">
                    <p className="text-xs font-bold text-gray-900">Route to {product.storeName}</p>
                    <p className="text-[10px] text-gray-400">{product.location}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />You
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Store
                    </span>
                  </div>
                </div>
                {/* Full-screen map */}
                <div className="flex-1">
                  <MapIframe
                    mapLoaded={mapLoaded}
                    onLoad={() => setMapLoaded(true)}
                    src={mapSrc}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* COMPARE */}
          <button
            disabled={isDone}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition
              ${isDone ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}

// Small reusable row for product detail fields
function InfoRow({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-0.5 shrink-0 ${accent ? "text-blue-500" : "text-gray-400"}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className={`text-xs font-medium truncate ${accent ? "text-blue-600" : "text-gray-700"}`}>{value}</p>
      </div>
    </div>
  );
}