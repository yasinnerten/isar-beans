"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface Shop {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  rewardThreshold: number;
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function ShopsMap() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/shops/map")
      .then((r) => r.json())
      .then(setShops)
      .catch(console.error);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[48.1374, 11.5755]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map((shop) =>
        shop.lat && shop.lng ? (
          <Marker key={shop.id} position={[shop.lat, shop.lng]}>
            <Popup>
              <div className="text-center">
                <strong className="text-amber-800">☕ {shop.name}</strong>
                {shop.address && <p className="text-sm text-gray-600 mt-1">{shop.address}</p>}
                {shop.description && <p className="text-sm mt-1">{shop.description}</p>}
                <p className="text-xs text-amber-700 mt-2 font-medium">
                  🫘 {shop.rewardThreshold} beans = free coffee
                </p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
