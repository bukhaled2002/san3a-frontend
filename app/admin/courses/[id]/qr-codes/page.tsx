"use client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { GetQrCodes } from "@/services/qrcodes";
import CreateQrCode from "@/components/admin/courses/CreateQrCode";
import QRCode from "react-qr-code";

type Props = {
  params: {
    id: string; // Course ID for the quiz
  };
};

function AdminQrCodes({ params }: Props) {
  const {
    data: qrCodes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-qr-codes", params.id],
    queryFn: () => GetQrCodes(params.id),
  });
  console.log('quizs', qrCodes)
  const downloadQR = (qrCode: string, name: string) => {
    const svgElement = document.getElementById(`qr-code-${qrCode}`);
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");

          const downloadLink = document.createElement("a");
          downloadLink.download = `QRCode-${name}.png`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      } else {
        console.error("Failed to get drawing context for the canvas");
      }
    } else {
      console.error("SVG element not found for QR code");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>حدث خطأ في جلب البيانات.</p>
      </div>
    );

  return (
    <div>
      <CreateQrCode courseId={params.id} />
      <div className="grid grid-cols-3 gap-6">
        {qrCodes && qrCodes.map((mcq, index) => (
          <div key={mcq.id} className="flex border border-black/15 rounded-lg flex-col justify-between items-center py-4  relative">
            <h1 className="text-center">QR {index + 1}</h1>
            <span className="font-bold mb-4 mt-2">QR Code: {mcq.code}</span>
            <QRCode
              id={`qr-code-${mcq.code}`}
              size={200}
              value={`/courses/${params.id}?qr=${mcq.code}` || "00000"}
              level="H"
            />

            <button
              className="before:!bg-primary hover:text-white !text-base !font-bold !h-11 my-4 w-48 !border-primary !border-2 text-primary"
              onClick={() => downloadQR(mcq.code, `QR-${mcq.code}`)}
            >
              Download QR Code
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 duration-300 transition-all hover:bg-red-900"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminQrCodes;
