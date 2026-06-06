import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Genel uygulama/favicon ikonu — kızıl zemin üzerine beyaz hilal
export default function Icon() {
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
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 100,
            width: 312,
            height: 312,
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 176,
            top: 126,
            width: 262,
            height: 262,
            borderRadius: "50%",
            background: "#e30a17",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
