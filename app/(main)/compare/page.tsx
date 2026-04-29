'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, TrendingDown, TrendingUp, Minus, MapPin,
  Store, Tag, Star, AlertCircle, Loader2, ShoppingBasket,
  Navigation, User, X,
} from 'lucide-react'
import { BsShop } from 'react-icons/bs'
import { MdCompareArrows } from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog'

// ── types ──────────────────────────────────────────────────────────────────

export type Product = {
  id: number
  name: string
  price: number
  image: string
  user: string
  userImage: string
  location: string
  storeName: string
  category: string
  description: string
  who_reported: string
  reportStatus: string
  reportReason: string
  plat: string
  plong: string
}

// ── helpers ────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(n)
}

function priceDiffLabel(base: number, compare: number) {
  const diff = compare - base
  const pct = ((Math.abs(diff) / base) * 100).toFixed(1)
  if (diff === 0) return { label: 'Same price', icon: Minus, color: 'text-zinc-400' }
  if (diff < 0)   return { label: `${pct}% cheaper`, icon: TrendingDown, color: 'text-emerald-500' }
  return           { label: `${pct}% pricier`,  icon: TrendingUp,   color: 'text-rose-500'    }
}

// ── InfoRow (reused from ProductCard) ──────────────────────────────────────

function InfoRow({
  icon, label, value, accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-0.5 shrink-0 ${accent ? 'text-blue-500' : 'text-gray-400'}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className={`text-xs font-medium truncate ${accent ? 'text-blue-600' : 'text-gray-700'}`}>{value}</p>
      </div>
    </div>
  )
}

// ── MapIframe ──────────────────────────────────────────────────────────────

function MapIframe({
  src,
  mapLoaded,
  onLoad,
}: {
  src: string
  mapLoaded: boolean
  onLoad: () => void
}) {
  return (
    <div className="relative w-full h-full min-h-[300px]">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full border-0"
        onLoad={onLoad}
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

// ── ViewModal — full detail + map modal for a result card ──────────────────

function ViewModal({
  product,
  basePrice,
  open,
  onOpenChange,
  onCompare,
}: {
  product: Product
  basePrice: number
  open: boolean
  onOpenChange: (v: boolean) => void
  onCompare: (p: Product) => void
}) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mobileMapOpen, setMobileMapOpen] = useState(false)

  const mapSrc = `https://www.google.com/maps?saddr=15.448659,120.940740&daddr=${product.plat},${product.plong}&z=18&output=embed`
  const isReported = !!product.reportStatus
  const isDone = product.reportStatus === 'done'
  const { label, icon: DiffIcon, color } = priceDiffLabel(basePrice, product.price)

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setMapLoaded(false); setMobileMapOpen(false) } }}>
        <DialogContent className="
          p-0 gap-0 overflow-hidden border-0
          w-screen h-[100dvh] max-w-none rounded-none
          sm:w-[95vw] sm:h-auto sm:max-w-4xl sm:rounded-2xl sm:max-h-[90vh]
        ">
          <div className="pt-4 px-4 bg-white border-b border-slate-200">
            <DialogHeader>
              <DialogTitle>Product Information</DialogTitle>
              <DialogDescription>Detailed information about this product.</DialogDescription>
            </DialogHeader>
          </div>

          {/* ══ DESKTOP ══ */}
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
                  <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                  <span className={`flex items-center justify-end gap-1 text-[11px] font-bold ${color}`}>
                    <DiffIcon size={12} />{label}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left */}
              <div className="w-[320px] shrink-0 flex flex-col overflow-y-auto border-r border-gray-100">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-48 shrink-0">
                  <img src={product.image} alt={product.name} className="max-h-40 max-w-full object-contain p-4" />
                </div>
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{product.description || 'No description provided.'}</p>
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
                      <p className="text-xs text-gray-600">By <span className="font-medium text-gray-800">{product.who_reported ?? 'Unknown'}</span></p>
                      {product.reportReason && <p className="text-xs text-gray-500 italic">{`"${product.reportReason}"`}</p>}
                    </div>
                  )}
                  {/* Compare button inside modal */}
                  <button
                    onClick={() => { onOpenChange(false); onCompare(product) }}
                    disabled={isDone}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition
                      ${isDone ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                  >
                    <MdCompareArrows className="w-4 h-4" />
                    Compare This Instead
                  </button>
                </div>
              </div>

              {/* Right — map */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100 inline-block" />Your location
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100 inline-block" />{product.location}
                  </span>
                  <span className="flex items-center gap-1.5 ml-auto">
                    <Navigation className="w-3 h-3" />Driving route
                  </span>
                </div>
                <div className="flex-1 min-h-[380px]">
                  <MapIframe src={mapSrc} mapLoaded={mapLoaded} onLoad={() => setMapLoaded(true)} />
                </div>
              </div>
            </div>
          </div>

          {/* ══ MOBILE ══ */}
          <div className="flex sm:hidden flex-col h-full overflow-y-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
              <img src={product.userImage} alt={product.user} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{product.user}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-52 shrink-0">
              <img src={product.image} alt={product.name} className="max-h-44 max-w-full object-contain p-4" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
              <span className={`flex items-center gap-1 text-xs font-bold ${color}`}>
                <DiffIcon size={13} />{label}
              </span>
            </div>

            <div className="px-4 py-4 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Description</p>
                <p className="text-xs text-gray-600 leading-relaxed">{product.description || 'No description provided.'}</p>
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
                  <p className="text-xs text-gray-600">By <span className="font-medium text-gray-800">{product.who_reported ?? 'Unknown'}</span></p>
                  {product.reportReason && <p className="text-xs text-gray-500 italic">{`"${product.reportReason}"`}</p>}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileMapOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition active:scale-95"
                >
                  <Navigation className="w-4 h-4" /> View on Map
                </button>
                <button
                  onClick={() => { onOpenChange(false); onCompare(product) }}
                  disabled={isDone}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition active:scale-95
                    ${isDone ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <MdCompareArrows className="w-4 h-4" /> Compare
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile map full-screen */}
      <Dialog open={mobileMapOpen} onOpenChange={(v) => { setMobileMapOpen(v); if (!v) setMapLoaded(false) }}>
        <DialogContent className="p-0 gap-0 w-screen h-[100dvh] max-w-none rounded-none border-0 sm:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
              <div>
                <p className="text-xs font-bold text-gray-900">Route to {product.storeName}</p>
                <p className="text-[10px] text-gray-400">{product.location}</p>
              </div>
              <div className="ml-auto flex items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />You</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Store</span>
              </div>
            </div>
            <div className="flex-1">
              <MapIframe src={mapSrc} mapLoaded={mapLoaded} onLoad={() => setMapLoaded(true)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── SourceCard ─────────────────────────────────────────────────────────────

function SourceCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl bg-blue-600 text-white overflow-hidden shadow-xl shadow-blue-200">
      <div className="relative h-48 w-full">
        <Image
          src={product.image || 'https://www.mentainstruments.com/wp-content/uploads/2022/09/Getimage.png'}
          alt={product.name}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-700/80 to-transparent" />
        <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase bg-white/20 backdrop-blur px-2.5 py-1 rounded-full border border-white/30">
          Comparing
        </span>
      </div>
      <div className="px-5 py-4 space-y-2">
        <h2 className="font-extrabold text-lg leading-snug">{product.name}</h2>
        <p className="text-3xl font-black tracking-tight">{formatPrice(product.price)}</p>
        <div className="flex flex-wrap gap-3 pt-1 text-white/70 text-xs">
          <span className="flex items-center gap-1.5"><Store size={11} /> {product.storeName}</span>
          <span className="flex items-center gap-1.5"><MapPin size={11} /> {product.location}</span>
          <span className="flex items-center gap-1.5"><Tag size={11} /> {product.category}</span>
        </div>
      </div>
    </div>
  )
}

// ── CompareCard ────────────────────────────────────────────────────────────

function CompareCard({
  product,
  basePrice,
  rank,
  onView,
  onCompare,
}: {
  product: Product
  basePrice: number
  rank: number
  onView: () => void
  onCompare: () => void
}) {
  const { label, icon: Icon, color } = priceDiffLabel(basePrice, product.price)
  const isCheaper = product.price < basePrice
  const isSame    = product.price === basePrice
  const isDone    = product.reportStatus === 'done'

  return (
    <div className={`relative rounded-2xl border bg-white overflow-hidden shadow-sm transition hover:shadow-md hover:-translate-y-0.5
      ${isCheaper ? 'border-emerald-200' : isSame ? 'border-zinc-200' : 'border-rose-100'}`}
    >
      {/* rank */}
      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-zinc-200 shadow flex items-center justify-center text-[11px] font-black text-zinc-500">
        #{rank}
      </div>

      {/* cheapest badge */}
      {isCheaper && rank === 1 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
          <Star size={9} fill="white" /> Cheapest
        </div>
      )}

      {/* image */}
      <div className="relative h-36 w-full bg-zinc-100">
        <Image
          src={product.image || 'https://www.mentainstruments.com/wp-content/uploads/2022/09/Getimage.png'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* content */}
      <div className="px-4 py-4 space-y-2.5">
        <h3 className="font-bold text-zinc-800 text-sm leading-snug line-clamp-2">{product.name}</h3>

        <div className="flex items-end justify-between">
          <span className="text-2xl font-black text-zinc-900 tracking-tight">{formatPrice(product.price)}</span>
          <span className={`flex items-center gap-1 text-[11px] font-bold ${color}`}>
            <Icon size={13} />{label}
          </span>
        </div>

        {/* diff bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isCheaper ? 'bg-emerald-400' : isSame ? 'bg-zinc-300' : 'bg-rose-400'}`}
            style={{ width: `${Math.min(100, (Math.min(basePrice, product.price) / Math.max(basePrice, product.price)) * 100)}%` }}
          />
        </div>

        <div className="flex flex-col gap-1 text-zinc-400 text-xs">
          <span className="flex items-center gap-1.5"><Store size={11} className="shrink-0" /><span className="truncate">{product.storeName}</span></span>
          <span className="flex items-center gap-1.5"><MapPin size={11} className="shrink-0" /><span className="truncate">{product.location}</span></span>
        </div>

        {product.description && (
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed border-t border-zinc-100 pt-2">
            {product.description}
          </p>
        )}

        {/* ── action buttons ── */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onView}
            className="flex-1 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            View
          </button>
          <button
            onClick={onCompare}
            disabled={isDone}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition
              ${isDone ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  )
}

// ── EmptyState ─────────────────────────────────────────────────────────────

function EmptyState({ keywords }: { keywords: string[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBasket size={48} className="text-zinc-200 mb-4" />
      <h3 className="font-bold text-zinc-700 text-lg">No similar products found</h3>
      <p className="text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
        We searched for products matching{' '}
        <span className="font-semibold text-blue-500">{keywords.map((k) => `"${k}"`).join(', ')}</span>{' '}
        but nothing came up yet.
      </p>
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────

function CompareContent() {
  const params     = useSearchParams()
  const router     = useRouter()

  const id          = params.get('id')
  const name        = params.get('name')
  const price       = Number(params.get('price') ?? 0)
  const image       = params.get('image') ?? ''
  const category    = params.get('category') ?? ''
  const storeName   = params.get('storeName') ?? ''
  const location    = params.get('location') ?? ''
  const description = params.get('description') ?? ''
  const plat        = params.get('plat') ?? ''
  const plong       = params.get('plong') ?? ''

  const sourceProduct: Product = {
    id: Number(id), name: name ?? '', price, image, category,
    storeName, location, description, user: '', userImage: '',
    who_reported: '', reportStatus: '', reportReason: '', plat, plong,
  }

  const [results,  setResults]  = useState<Product[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)

  // view modal state
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [viewOpen,    setViewOpen]    = useState(false)

  useEffect(() => {
    if (!name || !category) return
    const fetchComparisons = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`/api/compare?id=${id}&name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`)
        if (!res.ok) throw new Error()
        const json = await res.json()
        setResults(json.data ?? [])
        setKeywords(json.keywords ?? [])
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchComparisons()
  }, [id, name, category])

  // Navigate to a new compare using a result card as the source
  const handleCompareProduct = (product: Product) => {
    const p = new URLSearchParams({
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
    })
    router.push(`/compare?${p.toString()}`)
  }

  const sorted   = [...results].sort((a, b) => a.price - b.price)
  const cheapest = sorted[0]?.price
  const savings  = cheapest !== undefined ? price - cheapest : 0

  return (
    <div className="min-h-[100dvh] bg-[#f7f7f9] font-[system-ui]">

      {/* top nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Price Comparison</p>
            <h1 className="font-extrabold text-zinc-800 text-sm truncate">{name}</h1>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <Tag size={11} /> {category}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10 space-y-6">

        {/* keyword chips */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest self-center">Matched on:</span>
            {keywords.map((kw) => (
              <span key={kw} className="text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">{kw}</span>
            ))}
          </div>
        )}

        {/* savings banner */}
        {!loading && savings > 0 && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <TrendingDown size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-extrabold text-emerald-700 text-sm">You could save {formatPrice(savings)}!</p>
              <p className="text-emerald-600 text-xs mt-0.5">
                The cheapest similar product is {formatPrice(cheapest ?? 0)} at {sorted[0]?.storeName}.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* source product */}
          <div className="lg:sticky lg:top-24">
            <SourceCard product={sourceProduct} />
            {!loading && results.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'Found',   value: results.length },
                  { label: 'Lowest',  value: formatPrice(Math.min(...results.map((r) => r.price))) },
                  { label: 'Highest', value: formatPrice(Math.max(...results.map((r) => r.price))) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-white border border-zinc-200 px-3 py-3 text-center shadow-sm">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
                    <p className="font-extrabold text-zinc-800 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* results */}
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
                <p className="text-sm text-zinc-400 font-medium">Finding similar products…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <AlertCircle size={36} className="text-rose-300" />
                <p className="font-bold text-zinc-700">Something went wrong</p>
                <p className="text-zinc-400 text-sm">Couldn&apos;t load comparison data.</p>
              </div>
            ) : sorted.length === 0 ? (
              <EmptyState keywords={keywords} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map((product, idx) => (
                  <CompareCard
                    key={product.id}
                    product={product}
                    basePrice={price}
                    rank={idx + 1}
                    onView={() => { setViewProduct(product); setViewOpen(true) }}
                    onCompare={() => handleCompareProduct(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View modal — rendered once, controlled by viewProduct state */}
      {viewProduct && (
        <ViewModal
          product={viewProduct}
          basePrice={price}
          open={viewOpen}
          onOpenChange={(v) => { setViewOpen(v); if (!v) setViewProduct(null) }}
          onCompare={handleCompareProduct}
        />
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}
