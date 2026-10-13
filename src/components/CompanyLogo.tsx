"use client";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";
const fallbackLogo = "/images/logo/icon.png";

export default function CompanyLogo({size}:{size:string}) {
  const { companyDetails } = useCompanyDetails();
  const [src, setSrc] = useState(fallbackLogo);
  useEffect(() => {
    if (!companyDetails?.LOGO?.trim()) { setSrc(fallbackLogo); return; }
    try {
      const base = new URL("https://app.bmgjewellers.com").origin;
      setSrc(new URL(companyDetails.LOGO.trim(), `${base}/`).href);
    } catch { setSrc(fallbackLogo); }
  }, [companyDetails]);
  return <Box component="img" src={src} alt={`${companyDetails?.COMPANYNAME || "Vairamaaligai"} logo`} onError={() => setSrc(fallbackLogo)} sx={{ height: size,  objectFit: "contain", flexShrink: 0, borderRadius: 1, bgcolor: "#fff", p: .25 }} />;
}
