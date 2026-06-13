"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { divIcon, type LatLngTuple } from "leaflet";

const center: LatLngTuple = [-8.1, 112.6];
const kepanjen: LatLngTuple = [-8.1304, 112.5721];

const malangBoundary: LatLngTuple[] = [
  [-7.76, 112.26],
  [-7.78, 112.72],
  [-8.01, 112.95],
  [-8.31, 112.92],
  [-8.52, 112.66],
  [-8.56, 112.39],
  [-8.32, 112.18],
  [-8.0, 112.17],
];

const borderPoints = [
  {
    label: "Utara",
    value: "Kab. Pasuruan dan Kab. Mojokerto",
  },
  {
    label: "Timur",
    value: "Kab. Probolinggo dan Kab. Lumajang",
  },
  {
    label: "Barat",
    value: "Kab. Blitar dan Kab. Kediri",
  },
  {
    label: "Selatan",
    value: "Samudra Indonesia",
  },
];

function FitBounds() {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(malangBoundary, { padding: [24, 24] });
  }, [map]);

  return null;
}

export function KabupatenMalangMap() {
  const markerIcon = divIcon({
    className: "",
    html: `
      <div class="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-emerald-600 shadow-lg">
        <span class="h-3 w-3 rounded-full bg-white"></span>
      </div>
    `,
    iconAnchor: [20, 20],
    iconSize: [40, 40],
  });

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-gradient-to-r from-emerald-50 to-white px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
          Peta Geografi
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Peta ilustratif Kabupaten Malang dengan penekanan batas wilayah,
          lokasi pusat pemerintahan, dan orientasi letak geografis.
        </p>
      </div>

      <div className="h-[360px] sm:h-[420px]">
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <FitBounds />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon
            positions={malangBoundary}
            pathOptions={{
              color: "#047857",
              fillColor: "#10b981",
              fillOpacity: 0.18,
              weight: 3,
            }}
          >
            <Tooltip sticky direction="center" className="text-sm font-medium">
              Batas wilayah Kabupaten Malang
            </Tooltip>
          </Polygon>
          <Marker position={kepanjen} icon={markerIcon}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Pusat Pemerintahan
                </p>
                <p className="text-sm text-muted-foreground">Kepanjen</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="grid gap-3 border-t bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {borderPoints.map((item) => (
          <div key={item.label} className="rounded-xl border bg-background p-4">
            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
