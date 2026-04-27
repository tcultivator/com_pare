'use client'

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import { useState } from 'react'
import type { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ Fix marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MapSelectorProps = {
    onSelect?: (lat: number, lng: number) => void
}

// ✅ Default location
const DEFAULT_POSITION: [number, number] = [15.4479725, 120.9394791]
const DEFAULT_ZOOM = 18 // ⚠️ 55 is too high, max is ~18–20

function LocationMarker({ onSelect }: MapSelectorProps) {
    const [position, setPosition] = useState<[number, number] | null>(null)

    useMapEvents({
        click(e: LeafletMouseEvent) {
            const { lat, lng } = e.latlng
            setPosition([lat, lng])

            if (onSelect) {
                onSelect(lat, lng)
            }
        },
    })

    return position ? <Marker position={position} /> : null
}

// ✅ Reset button component
function ResetButton() {
    const map = useMap()

    const handleReset = () => {
        map.setView(DEFAULT_POSITION, DEFAULT_ZOOM)
    }

    return (
        <button
            onClick={handleReset}
            className="absolute top-3 right-3 z-[1000] bg-white px-3 py-1 rounded shadow text-sm hover:bg-gray-100"
        >
            Reset View
        </button>
    )
}

export default function MapSelector({ onSelect }: MapSelectorProps) {
    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={DEFAULT_POSITION}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom
                className="w-full h-full rounded-lg"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <LocationMarker onSelect={onSelect} />
                <ResetButton />
            </MapContainer>
        </div>
    )
}