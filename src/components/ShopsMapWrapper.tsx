"use client";

import dynamic from "next/dynamic";

const ShopsMap = dynamic(() => import("@/components/ShopsMap"), { ssr: false });

export default function ShopsMapWrapper() {
  return <ShopsMap />;
}
