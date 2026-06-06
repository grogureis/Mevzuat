import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iPhone "Ana Ekrana Ekle" ikonu — kızıl zemin üzerine beyaz hilal
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#e30a17",
        }}
      >
        {/* Ay (beyaz daire) */}
        <div
          style={{
            position: "absolute",
            left: 35,
            top: 35,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
        {/* Hilali oluşturan kesim (zemin rengiyle) */}
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 44,
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "#e30a17",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
