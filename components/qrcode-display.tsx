"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeDisplay({ url }: { url: string }) {
  return (
    <div className="inline-block rounded-2xl border p-3">
      <QRCodeCanvas value={url} size={160} />
    </div>
  );
}


