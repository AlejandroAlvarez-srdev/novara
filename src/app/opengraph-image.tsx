import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Novara Grupo Constructor — Construimos lo que imaginas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const image = await readFile(join(process.cwd(), "brand/og-architecture.jpg"));
  const logo = await readFile(join(process.cwd(), "brand/og-logo.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#1e221a", color: "#f5f3ec", position: "relative" }}>
      <img src={`data:image/jpeg;base64,${image.toString("base64")}`} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(20,27,22,.94), rgba(20,27,22,.22))", display: "flex" }} />
      <div style={{ display: "flex", flexDirection: "column", padding: "55px 65px", justifyContent: "space-between" }}>
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="Novara" width={270} height={70} />
        <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 69, lineHeight: 1.05, fontFamily: "serif" }}>Construimos</div><div style={{ fontSize: 69, lineHeight: 1.1, fontFamily: "serif", color: "#ded6b9" }}>lo que imaginas.</div></div>
        <div style={{ fontSize: 16, letterSpacing: 3 }}>DISEÑO · PLANIFICACIÓN · CONSTRUCCIÓN</div>
      </div>
    </div>, size,
  );
}
