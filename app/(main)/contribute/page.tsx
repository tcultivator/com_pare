'use client'
import { signOut, useSession } from 'next-auth/react'
import React, { useState, useCallback, useEffect } from 'react'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { Dropzone } from '@/app/components/upload/dropzone'
import { UploaderProvider, UploadFn } from '@/app/components/upload/uploader-provider'
import { ProgressCircle } from '@/app/components/upload/progress-circle'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/app/components/ui/select"
import {
  Dialog, DialogContent, DialogTrigger,
} from "@/app/components/ui/dialog"
import { useEdgeStore } from '@/lib/edgestore'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  MapPin, Package, DollarSign, FileText, CheckCircle2,
  Store, LayoutGrid, Map as MapIcon, X, ArrowRight, Sparkles, Camera,
} from 'lucide-react'
import { toast } from "sonner"

const MapSelector = dynamic(
  () => import('@/app/components/map/MapSelector'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-zinc-100 animate-pulse rounded-2xl flex items-center justify-center text-zinc-400 text-sm font-medium">
        Loading Map…
      </div>
    )
  }
)

const DEFAULT_IMAGE = 'https://www.mentainstruments.com/wp-content/uploads/2022/09/Getimage.png'

function FieldLabel({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/20 text-blue-600">
        <Icon size={13} strokeWidth={2.2} />
      </span>
      <Label className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">{text}</Label>
    </div>
  )
}

const inputCls =
  "h-11 rounded-xl border border-zinc-200 bg-white/70 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 " +
  "focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:border-blue-600 transition"

export default function ContributePage() {
  const { edgestore } = useEdgeStore()
  const { data: session } = useSession()

  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [categories, setCategories] = useState<{ category_name: string }[]>([])
  const [buttonLoading, setButtonLoading] = useState(false)
  const [uploadKey, setUploadKey] = useState(0)   // bump to remount dropzone

  const [addedProducts, setAddedProducts] = useState({
    product_name: '',
    product_image: DEFAULT_IMAGE,
    price: 0,
    category: '',
    description: '',
    store_name: '',
    location: '',
    lat: '15.4479725',
    long: '120.9394791',

  })

  const hasCustomImage = addedProducts.product_image !== DEFAULT_IMAGE

  // Fully resets the dropzone so a new file can be picked immediately
  const resetUpload = () => {
    setAddedProducts(p => ({ ...p, product_image: DEFAULT_IMAGE }))
    setProgress(0)
    setLoading(false)
    setUploadKey(k => k + 1)
  }

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

  const uploadFn: UploadFn = useCallback(
    async ({ file, onProgressChange, signal }) => {
      setLoading(true)
      const res = await edgestore.publicFiles.upload({
        file, signal,
        onProgressChange: (p) => setProgress(p),
      })
      setAddedProducts(prev => ({ ...prev, product_image: res.url }))
      setLoading(false)
      setProgress(0)
      return res
    },
    [edgestore],
  )

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!coords) {
      toast.error("Please pin the store location on the map.")
      return
    }

    if (!session) {
      toast.error("You must be logged in to contribute.")
      return
    }

    try {
      setButtonLoading(true)

      const promise = fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addedProducts, session }),
      })

      toast.promise(promise, {
        loading: "Publishing product...",
        success: "Product published 🎉",
        error: "Failed to publish product",
      })

      const res = await promise
      if (!res.ok) throw new Error()

      // Reset entire form
      setAddedProducts({
        product_name: '',
        product_image: DEFAULT_IMAGE,
        price: 0,
        category: '',
        description: '',
        store_name: '',
        location: '',
        lat: '15.4479725',
        long: '120.9394791',
      })
      setCoords(null)
      resetUpload()   // remounts dropzone so next upload works without refresh

    } catch (err) {
      console.error(err)
    } finally {
      setButtonLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f9] font-[system-ui] flex flex-col">

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-10">
        <div className="flex gap-6 items-start">

          {/* Desktop map sidebar */}
          <aside className="hidden lg:flex flex-col w-80 xl:w-[360px] shrink-0 sticky top-24 gap-4">
            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-sm h-[420px] relative">
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className="bg-white/90 backdrop-blur text-[10px] font-bold text-zinc-500 tracking-widest uppercase px-2.5 py-1 rounded-full border border-zinc-200 shadow-sm">
                  Pin store location
                </span>
              </div>
              <MapSelector onSelect={(lat, lng) => setCoords({ lat, lng })} />
            </div>
            {coords ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-700">Location pinned!</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
                <MapPin size={18} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 font-medium leading-snug">
                  Click the map to pin the exact store location.
                </p>
              </div>
            )}
          </aside>

          {/* Form card */}
          <main className="flex-1 min-w-0">
            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-zinc-800 text-base">New Product</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Fill in the details below to publish.</p>
                </div>
                <Package size={18} className="text-blue-500" />
              </div>

              <div className="px-6 py-6 space-y-7">

                {/* ── IMAGE UPLOAD SECTION ── */}
                <div className="space-y-3">

                  {/* Row: dropzone LEFT, suggestion chips RIGHT */}
                  <div className="flex gap-3 items-stretch">

                    {/* Dropzone — key forces full remount on reset */}
                    <div className="flex-1 min-w-0">
                      <UploaderProvider key={uploadKey} uploadFn={uploadFn} autoUpload>
                        <Dropzone
                          dropzoneOptions={{
                            maxFiles: 1,
                            maxSize: 1024 * 1024 * 4,
                            accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
                          }}
                          className="w-full min-h-[120px] rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-500 hover:bg-blue-100 transition-colors"
                        />
                      </UploaderProvider>
                    </div>


                  </div>

                  {/* Preview + progress bar — only when uploading or after image is set */}
                  {(loading || hasCustomImage) && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      {/* Thumbnail */}
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-white">
                        <Image src={addedProducts.product_image} alt="Preview" fill className="object-cover" />
                      </div>

                      {/* Name + bar */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-700 truncate mb-1.5">
                          {addedProducts.product_name || 'Uploaded image'}
                        </p>
                        <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: loading ? `${progress}%` : '100%' }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          {loading ? `${progress}%` : '100%'}
                        </p>
                      </div>

                      {/* X — clears image and resets dropzone for a fresh upload */}
                      {!loading && (
                        <button
                          type="button"
                          onClick={resetUpload}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition shrink-0"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Mobile map trigger */}
                  <div className="lg:hidden">
                    <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className={`w-full h-12 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition
                            ${coords
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                              : 'border-blue-500 bg-blue-500/20 text-blue-500 hover:bg-blue-500/25 hover:border-blue-700'
                            }`}
                        >
                          {coords ? <CheckCircle2 size={16} /> : <MapIcon size={16} />}
                          <span className="text-[11px] font-bold tracking-wide">
                            {coords ? 'Location Pinned' : 'Set Location'}
                          </span>
                          <span className="text-[10px] opacity-60">· Tap to open map</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="p-0 gap-0 max-w-full w-full h-[100dvh] border-none rounded-none overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(false)}
                          className="absolute top-4 left-4 z-[100] w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center border border-zinc-200"
                        >
                          <X size={16} className="text-zinc-700" />
                        </button>
                        <div className="absolute top-4 left-16 z-[100] bg-white px-3 py-1.5 rounded-full shadow-lg border border-zinc-200 text-xs font-bold text-zinc-700">
                          Tap to pin store location
                        </div>
                        <div className="w-full h-[100dvh]">
                          <MapSelector onSelect={(lat, lng) => {
                            setCoords({ lat, lng })
                            setTimeout(() => setIsMapOpen(false), 400)
                          }} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                </div>

                {/* ── FIELDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <FieldLabel icon={Package} text="Product Name" />
                    <Input
                      placeholder="e.g. Notebook, Coffee, etc."
                      value={addedProducts.product_name}
                      onChange={(e) => setAddedProducts(p => ({ ...p, product_name: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel icon={DollarSign} text="Price" />
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-semibold pointer-events-none">₱</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={addedProducts.price || ''}
                        onChange={(e) => setAddedProducts(p => ({ ...p, price: Number(e.target.value) }))}
                        className={`${inputCls} pl-8`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel icon={LayoutGrid} text="Category" />
                    <Select onValueChange={(v) => setAddedProducts(p => ({ ...p, category: v }))}>
                      <SelectTrigger className={`${inputCls} w-full`}>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-zinc-200 shadow-lg">
                        {categories.map((val, idx) => (
                          <SelectItem key={idx} value={val.category_name} className="text-sm">
                            {val.category_name.toUpperCase().replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <FieldLabel icon={Store} text="Store Name" />
                    <Input
                      placeholder="e.g. Juan Store"
                      value={addedProducts.store_name}
                      onChange={(e) => setAddedProducts(p => ({ ...p, store_name: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel icon={MapPin} text="Store Location" />
                    <Input
                      placeholder="e.g. near campus, downtown, etc."
                      value={addedProducts.location || ''}
                      onChange={(e) => setAddedProducts(p => ({ ...p, location: e.target.value }))}
                      className={inputCls}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel icon={FileText} text="Additional Details" />
                    <Textarea
                      value={addedProducts.description}
                      onChange={(e) => setAddedProducts(p => ({ ...p, description: e.target.value }))}
                      placeholder="Size, weight, availability, brand, or any extra notes…"
                      className={`${inputCls} min-h-[110px] resize-none pt-3`}
                    />
                  </div>
                </div>

                {/* ── SUBMIT ── */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={buttonLoading || !coords}
                    className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all
                      ${(!buttonLoading && coords)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-lg shadow-blue-200 hover:brightness-105 active:scale-[0.98]'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      }`}
                  >
                    {buttonLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      <>Publish Product <ArrowRight size={15} strokeWidth={2.5} /></>
                    )}
                  </button>

                  {!coords && !loading && (
                    <p className="text-center text-[11px] text-amber-500 font-semibold mt-3 flex items-center justify-center gap-1.5">
                      <MapPin size={11} /> Pin the store on the map first
                    </p>
                  )}
                </div>

              </div>
            </form>
          </main>

        </div>
      </div>
    </div>
  )
}