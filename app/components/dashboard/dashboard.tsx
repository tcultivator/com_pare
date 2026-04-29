'use client'

import Image from 'next/image'
import { MapPin } from "lucide-react";
import Link from 'next/link';
import { MdOutlineBugReport } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/(main)/productList/data/mockProducts';
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showReasonId, setShowReasonId] = useState<number | null>(null);

  // Report state — one modal shared, tracks which product is being reported
  const [reportProductId, setReportProductId] = useState<number | null>(null);
  const [reportOpen, setReportOpen]           = useState(false);
  const [reason, setReason]                   = useState('');
  const [reportLoading, setReportLoading]     = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res  = await fetch('/api/recommended');
        const json = await res.json();
        if (json.success) setProducts(json.data);
      } catch (err) {
        console.error('Failed to fetch recommended products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  const handleCompare = (product: Product) => {
    const params = new URLSearchParams({
      id:          String(product.id),
      name:        product.name,
      price:       String(product.price),
      image:       product.image,
      category:    product.category,
      storeName:   product.storeName,
      location:    product.location,
      description: product.description ?? '',
      plat:        product.plat ?? '',
      plong:       product.plong ?? '',
    });
    router.push(`/compare?${params.toString()}`);
  };

  const openReportModal = (productId: number) => {
    setReportProductId(productId);
    setReason('');
    setReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reason.trim()) { toast.error('Please provide a reason.'); return; }
    if (!session)        { toast.error('You must be logged in to report a product.'); return; }
    if (!reportProductId) return;

    setReportLoading(true);
    try {
      const promise = fetch('/api/submit_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: reportProductId,
          reason,
          name: session.user?.name,
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed');
        return data;
      });

      toast.promise(promise, {
        loading: 'Submitting report...',
        success: 'Report submitted successfully!',
        error:   (err) => err.message,
      });

      await promise;
      setReason('');
      setReportOpen(false);
      setReportProductId(null);

      // Optimistically mark as reported in local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === reportProductId
            ? { ...p, reportStatus: 'pending', who_reported: session.user?.name ?? 'You', reportReason: reason }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-3 pt-3 md:px-6 md:pt-6">
        <div className="bg-[#c9e8f2] rounded-2xl p-8 flex items-center justify-between overflow-hidden">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 leading-tight">
              Shop Smarter, Spend Less <br /> Compare. Save.
            </h1>
            <Link
              href="/productList/all"
              className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition"
            >
              Browse
            </Link>
          </div>
          <div className="hidden md:block mr-0 sm:mr-20 lg:mr-30">
            <Image src="/imagetest.png" alt="hero" width={250} height={250} className="object-contain" />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recommended For You!</h2>
        <Link href="/productList/all" className="text-xs font-semibold text-blue-600 hover:underline">
          See all →
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-3 mt-3 md:px-6 md:mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-1 md:pb-10">

        {/* Loading skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
            <div className="bg-gray-200 h-52 w-full" />
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="mt-auto flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
                <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}

        {/* Actual products */}
        {!loading && products.map((product) => {
          const isReported = !!product.reportStatus;
          const isDone     = product.reportStatus === 'done';

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border overflow-hidden group transition-all duration-200 flex flex-col h-full
                ${isDone              ? 'opacity-70 border-red-200' : ''}
                ${isReported && !isDone ? 'border-red-200' : ''}
                ${!isReported         ? 'border-slate-200 hover:shadow-lg hover:-translate-y-0.5' : ''}
              `}
            >
              {/* Image section */}
              <div className="relative bg-gray-50 h-52 flex items-center justify-center overflow-hidden">

                {/* Reported badge */}
                {isReported && (
                  <button
                    onClick={() => setShowReasonId(showReasonId === product.id ? null : product.id)}
                    className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-lg z-10 cursor-pointer hover:bg-red-200 transition"
                  >
                    Reported
                  </button>
                )}

                {/* Reason popup */}
                {showReasonId === product.id && isReported && (
                  <div className="absolute top-12 left-3 bg-white border border-gray-200 shadow-md text-xs text-gray-700 p-3 rounded-lg z-20 max-w-[220px] space-y-1">
                    <div className="font-semibold text-red-600">Status: {product.reportStatus}</div>
                    <div className="text-gray-600">
                      Reported by: <span className="font-medium text-gray-800">{product.who_reported ?? 'Unknown user'}</span>
                    </div>
                    <div className="text-gray-600">
                      Reason: <span className="text-gray-800">{product.reportReason?.trim() || 'No reason provided.'}</span>
                    </div>
                  </div>
                )}

                {/* Report button — opens shared modal */}
                <button
                  onClick={() => openReportModal(product.id)}
                  disabled={isReported}
                  className={`absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-transform z-10
                    ${isReported ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`}
                  title="Report item"
                >
                  <MdOutlineBugReport className="w-4 h-4" />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-base font-bold text-gray-900 mb-2">₱{product.price.toLocaleString()}</p>

                <div className="flex items-center gap-2 mb-2">
                  <img src={product.userImage} alt={product.user} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs text-gray-600">{product.user}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <BsShop className="w-3.5 h-3.5" />{product.storeName}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5" />{product.location}
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>

                {/* Action buttons */}
                <div className="mt-auto flex gap-2">
                  <button
                    disabled={isDone}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors
                      ${isDone ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleCompare(product)}
                    disabled={isDone}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors
                      ${isDone ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-400 text-sm font-medium">No products found.</p>
            <Link href="/productList/all" className="mt-3 text-xs text-blue-600 font-semibold hover:underline">
              Browse all products →
            </Link>
          </div>
        )}

      </div>

      {/* ── SHARED REPORT MODAL ── */}
      <Dialog open={reportOpen} onOpenChange={(v) => { setReportOpen(v); if (!v) { setReason(''); setReportProductId(null); } }}>
        <DialogContent className="sm:max-w-md">
          <div className="px-1 pt-1">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Report this product</h2>
            <p className="text-xs text-gray-400 mb-3">Let us know what&apos;s wrong with this listing.</p>
          </div>
          <Textarea
            placeholder="Enter your reason for reporting..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={reportLoading} variant="ghost" onClick={() => setReason('')}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmitReport} disabled={reportLoading}>
              {reportLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
