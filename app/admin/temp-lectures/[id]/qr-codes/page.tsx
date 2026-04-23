"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Download } from "lucide-react";
import CreateQrCode from "@/components/admin/temp-lectures/CreateQrCode";
import QRCode from "react-qr-code";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx"; // Import xlsx
import { Button } from "@/components/ui/button";
import { GetQrCodes, DeleteQrCode } from "@/services/admin/lecture-qrcodes";

import React, { use } from "react";

type Props = {
  params: Promise<{
    id: string; // Course ID for the quiz
  }>;
};

function AdminQrCodes({ params }: Props) {
  const { id } = use(params);
  const { data: qrCodes, isLoading, error, refetch } = useQuery({
    queryKey: ["lecture-qr-codes", id],
    queryFn: () => GetQrCodes(id),
  });

  const queryClient = useQueryClient();

  // useMutation hook for deleting multiple QR codes
  const mutation = useMutation({
    mutationFn: (ids: string[]) => DeleteQrCode(ids), // Accept array of ids
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-qr-codes"] });
      toast({
        title: "تم مسح جميع الرموز بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "حدث خطأ ما",
        variant: "destructive",
      });
    },
  });

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

  const exportToExcel = () => {
    if (qrCodes) {
      const worksheetData = qrCodes.map((mcq) => ({
        ID: mcq.id,
        Code: mcq.code,
        Availability: mcq.isUsed ? "Used" : "Not Used",
        "Number Used": mcq.num_used,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "QR Codes");

      // Download the Excel file
      XLSX.writeFile(workbook, `QR_Codes_${id}.xlsx`);
    }
  };

  // Function to delete all QR codes
  const deleteAllQrCodes = () => {
    if (qrCodes && qrCodes.length > 0) {  // Ensure qrCodes is defined and not empty
      const ids = qrCodes.map((qr) => qr.id); // Collect all QR code ids
      mutation.mutate(ids); // Trigger delete mutation for all IDs
    } else {
      toast({
        title: "No QR codes to delete",
        variant: "destructive",
      });
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
      <CreateQrCode lectureId={id} />
    <div className="flex gap-4">
    <Button
        onClick={exportToExcel}
        variant="secondary"
        size="sm"
        className="text-white mb-7"
      >
        تحميل الأكواد
        <Download className="ms-2 h-4 w-4" />
      </Button>

      <Button
        onClick={deleteAllQrCodes}
        variant="destructive"
        size="sm"
        className="text-white mb-7"
      >
        حذف جميع الأكواد
      </Button>

    </div>
      <div className="grid grid-cols-3 gap-6">
        {qrCodes &&
          qrCodes.map((mcq, index) => (
            <div
              key={mcq.id}
              className="flex border border-black/15 rounded-lg flex-col justify-between items-center py-4 relative"
            >
              <h1 className="text-center">QR {index + 1}</h1>
              <span className="font-bold mb-4 mt-2">QR Code: {mcq.code}</span>
              <span
                className={`font-bold mb-4 mt-2 ${
                  mcq.isUsed ? "text-red-700" : " text-green-600"
                }`}
              >
                Availability: {mcq.isUsed ? "Used" : "Not Used"}
              </span>
              <QRCode
                id={`qr-code-${mcq.code}`}
                size={200}
                value={`https://www.7sty.com/courses/${id}?code=${mcq.code}` || "00000"}
                level="H"
              />
              <h1 className="text-center text-primary mt-3 font-bold">متبقي {mcq.num_used} استخدامات</h1>

              <button
                className="bg-secondary !text-base !font-bold !h-11 my-4 w-48 text-white hover:bg-indigo-900 transition-all duration-300"
                onClick={() => downloadQR(mcq.code, `QR-${mcq.code}`)}
              >
                Download QR Code
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 duration-300 transition-all hover:bg-red-900"
                onClick={() => mutation.mutate([mcq.id])} // Trigger delete mutation with the ID
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
