import ParentAddSonForm from "@/components/parent/sons/form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "اضافة ابن جديد - ولي امر",
  description: "اضافة ابن جديد - ولي امر في موقع صنعة",
};

type Props = {};

function ParentAddSon({}: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-7">اضافة ابن جديد</h1>
      <ParentAddSonForm />
    </>
  );
}

export default ParentAddSon;
