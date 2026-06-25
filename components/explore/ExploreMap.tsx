"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Plan } from "@/types";

/* ─── Category colors for markers ─── */
const CAT_COLORS: Record<string, string> = {
  "cat-1": "#E8610A",
  "cat-2": "#7C3AED",
  "cat-3": "#059669",
  "cat-4": "#DC2626",
  "cat-5": "#2563EB",
  "cat-6": "#DB2777",
  "cat-7": "#D97706",
  "cat-8": "#0891B2",
};

/* ─── Custom marker icon builder ─── */
function createMarkerIcon(plan: Plan): L.DivIcon {
  const color = CAT_COLORS[plan.categorie_id] ?? "#E8610A";
  const hasImage = !!plan.image_url;

  const html = hasImage
    ? `<div style="
        width: 44px; height: 44px; border-radius: 50%; border: 3px solid ${color};
        overflow: hidden; background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        cursor: pointer;
      ">
        <img src="${plan.image_url}" style="width:100%;height:100%;object-fit:cover;" alt="" />
      </div>
      <div style="
        width: 12px; height: 12px; background: ${color}; border-radius: 50%;
        position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      "></div>`
    : `<div style="
        width: 40px; height: 40px; border-radius: 50%; background: ${color};
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 12px rgba(0,0,0,0.25); cursor: pointer;
        color: white; font-weight: 700; font-size: 14px;
      ">
        ${plan.titre.charAt(0).toUpperCase()}
      </div>
      <div style="
        width: 12px; height: 12px; background: ${color}; border-radius: 50%;
        position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      "></div>`;

  return L.divIcon({
    html,
    className: "planoka-marker",
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -52],
  });
}

/* ─── User location marker ─── */
function createUserIcon(): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width: 16px; height: 16px; border-radius: 50%; background: #3B82F6;
      border: 3px solid white; box-shadow: 0 0 0 3px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.2);
    "></div>`,
    className: "user-location-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

/* ─── FlyTo helper component ─── */
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

/* ─── Invalidate size on mount ─── */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

/* ─── Main ExploreMap Component ─── */
interface ExploreMapProps {
  plans: Plan[];
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
  userPosition: [number, number] | null;
  flyTo: [number, number] | null;
}

export function ExploreMap({
  plans,
  selectedPlan,
  onSelectPlan,
  userPosition,
  flyTo,
}: ExploreMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  /* Memoize plan markers */
  const markers = useMemo(
    () =>
      plans
        .filter((p) => p.latitude && p.longitude)
        .map((plan) => ({
          plan,
          position: [plan.latitude!, plan.longitude!] as [number, number],
          icon: createMarkerIcon(plan),
        })),
    [plans]
  );

  const userIcon = useMemo(() => createUserIcon(), []);

  return (
    <MapContainer
      center={[5.95, 10.15]}
      zoom={7}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      ref={mapRef}
      style={{ background: "#1a1a2e" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <MapResizer />
      <FlyToLocation position={flyTo} />

      {/* Plan markers */}
      {markers.map(({ plan, position, icon }) => (
        <Marker
          key={plan.id}
          position={position}
          icon={icon}
          eventHandlers={{
            click: () => onSelectPlan(plan),
          }}
        />
      ))}

      {/* User position */}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon} />
      )}
    </MapContainer>
  );
}
