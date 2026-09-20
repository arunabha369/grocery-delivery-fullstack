import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Order } from "../../types";
import { ScooterArt } from "../illustrations";

type LatLng = { lat: number; lng: number };

// Inline SVG markers (no external image hosts)
const riderIcon = L.divIcon({
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
    html: `<div style="position:relative;width:44px;height:44px">
        <span class="animate-ping" style="position:absolute;inset:4px;border-radius:9999px;background:rgb(249 115 22 / 0.35)"></span>
        <span style="position:absolute;inset:4px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:#f97316;border:3px solid #fff;box-shadow:0 6px 16px -4px rgb(0 0 0 / 0.35)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        </span>
    </div>`,
});

const destinationIcon = L.divIcon({
    className: "",
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
    html: `<svg width="36" height="46" viewBox="0 0 36 46" style="filter:drop-shadow(0 6px 8px rgb(0 0 0 / 0.25))">
        <path d="M18 2C9.2 2 2 9 2 17.6 2 29.5 18 44 18 44s16-14.5 16-26.4C34 9 26.8 2 18 2Z" fill="#1b3022" stroke="#fff" stroke-width="2.5"/>
        <path d="M11.5 17.5 18 12l6.5 5.5V25a1 1 0 0 1-1 1h-3.5v-4.5h-4V26h-3.5a1 1 0 0 1-1-1Z" fill="#fff"/>
    </svg>`,
});

/** Keeps both markers in view as the rider moves. */
function FitView({ rider, destination }: { rider: LatLng | null; destination: LatLng | null }) {
    const map = useMap();
    const rLat = rider?.lat;
    const rLng = rider?.lng;
    const dLat = destination?.lat;
    const dLng = destination?.lng;

    useEffect(() => {
        const points = [
            [rLat, rLng],
            [dLat, dLng],
        ].filter((p): p is [number, number] => p[0] != null && p[1] != null);
        if (points.length === 2) map.fitBounds(points, { padding: [48, 48], maxZoom: 16 });
        else if (points.length === 1) map.setView(points[0], 15);
    }, [map, rLat, rLng, dLat, dLng]);

    return null;
}

export default function LiveMap({ order, liveLocation }: { order: Order; liveLocation: LatLng | null }) {
    if (order.status === "Delivered" || order.status === "Cancelled") return null;

    const destination = order.shippingAddress.lat && order.shippingAddress.lng ? { lat: order.shippingAddress.lat, lng: order.shippingAddress.lng } : null;
    const rider = liveLocation && liveLocation.lat !== 0 ? liveLocation : null;
    const center = rider ?? destination;

    return (
        <section className="card overflow-hidden" aria-label="Live delivery map">
            <div className="flex items-center justify-between px-5 py-4">
                <h2 className="font-semibold text-app-green">Live tracking</h2>
                {rider ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
                    </span>
                ) : (
                    <span className="text-xs text-app-text-light">Waiting for rider location</span>
                )}
            </div>

            {/* `isolate` stops Leaflet's internal z-indexes from painting over the sticky navbar */}
            <div className="relative isolate h-72 sm:h-80">
                {center ? (
                    <MapContainer center={[center.lat, center.lng]} zoom={15} className="size-full" zoomControl={false} scrollWheelZoom={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                        {rider && (
                            <Marker position={[rider.lat, rider.lng]} icon={riderIcon}>
                                <Popup>Your delivery partner</Popup>
                            </Marker>
                        )}
                        {destination && (
                            <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
                                <Popup>Delivery address</Popup>
                            </Marker>
                        )}
                        <FitView rider={rider} destination={destination} />
                    </MapContainer>
                ) : (
                    <div className="flex-center size-full flex-col bg-app-cream px-6 text-center">
                        <ScooterArt className="h-auto w-48" />
                        <p className="mt-3 text-sm font-medium text-app-green">Waiting for your delivery partner's location…</p>
                        <p className="mt-1 text-xs text-app-text-light">The map will appear as soon as they start sharing it.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
