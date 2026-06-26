"use client";

/**
 * Composant de Carte d'Exploration (ExploreMap.tsx)
 * 
 * Ce composant affiche une carte interactive en utilisant Leaflet (via react-leaflet).
 * Il positionne des marqueurs personnalisés pour chaque bon plan géolocalisé
 * et adapte le fond de carte selon le thème (clair ou sombre) de l'utilisateur.
 */

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Plan } from "@/types";

/* ─── Couleurs des catégories pour les marqueurs ─── */
// Assigne une couleur unique à chaque ID de catégorie pour différencier visuellement les points sur la carte
const CAT_COLORS: Record<string, string> = {
  "cat-1": "#E8610A", // Restauration
  "cat-2": "#7C3AED", // Loisirs
  "cat-3": "#059669", // Sorties
  "cat-4": "#DC2626", // Shopping
  "cat-5": "#2563EB", // Services
  "cat-6": "#DB2777", // Santé
  "cat-7": "#D97706", // Education
  "cat-8": "#0891B2", // Sport
};

/**
 * Création d'une icône de marqueur personnalisée.
 * Si le plan a une image, on l'affiche dans un cercle, sinon on affiche la première lettre de son titre.
 */
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
    iconAnchor: [22, 52],   // Point d'ancrage (pointe du marqueur)
    popupAnchor: [0, -52],  // Position du popup par rapport à l'icône
  });
}

/**
 * Création du marqueur représentant la position de l'utilisateur (un simple point bleu).
 */
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

/**
 * Composant invisible (Helper) pour animer le déplacement de la carte.
 * Dès que la prop `position` change, la carte "vole" vers ces nouvelles coordonnées.
 */
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

/**
 * Composant invisible (Helper) pour forcer le redimensionnement de la carte.
 * Utile pour corriger un bug Leaflet où la carte s'affiche mal si le conteneur change de taille.
 */
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

interface ExploreMapProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  userPosition: [number, number] | null;
  flyTo: [number, number] | null;
}

export function ExploreMap({
  plans,
  onSelectPlan,
  userPosition,
  flyTo,
}: ExploreMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  // Récupération du thème actif pour choisir le fond de carte (tiles)
  const { resolvedTheme } = useTheme();

  /**
   * Mémorisation (useMemo) des marqueurs.
   * On évite de recréer les icônes HTML complexes à chaque rendu du composant.
   * Ne recalcule que si le tableau `plans` change.
   */
  const markers = useMemo(
    () =>
      plans
        // Ne garde que les plans ayant des coordonnées GPS valides
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
      center={[5.95, 10.15]} // Centre par défaut (Cameroun)
      zoom={7}               // Zoom par défaut
      className="h-full w-full"
      zoomControl={false}    // On désactive les contrôles par défaut
      attributionControl={false}
      ref={mapRef}
      style={{ background: resolvedTheme === "dark" ? "#1a1a2e" : "#f1f5f9" }}
    >
      {/* 
        Couche des tuiles (fond de carte).
        On bascule dynamiquement entre une carte sombre et claire.
      */}
      <TileLayer
        url={
          resolvedTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <MapResizer />
      <FlyToLocation position={flyTo} />

      {/* Rendu des marqueurs pour les bons plans */}
      {markers.map(({ plan, position, icon }) => (
        <Marker
          key={plan.id}
          position={position}
          icon={icon}
          eventHandlers={{
            click: () => onSelectPlan(plan), // Ouvre la popup/bottom sheet au clic
          }}
        />
      ))}

      {/* Rendu de la position de l'utilisateur s'il a accepté la géolocalisation */}
      {userPosition && (
        <Marker position={userPosition} icon={userIcon} />
      )}
    </MapContainer>
  );
}
