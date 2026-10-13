"use client";
import { Box, Typography } from "@mui/material";
import { useAppContext } from "@/context/AppContext";
const MetalRates = ({ compact = false }: { compact?: boolean }) => {
 const { metalRates } = useAppContext();
 return <Box className="glass-surface" sx={{ display: "flex", flexShrink: 0, gap: 0, border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}>
  {([ ["Gold", metalRates.GOLDRATE, "#b58d47"], ["Silver", metalRates.SILVERRATE, "#94a3b8"] ] as const).map(([label, rate, color], index) => <Box key={label} sx={{ display: "flex", alignItems: "center", gap: .5, px: compact ? 1 : 1.5, py: .5, borderLeft: index ? "1px solid" : "none", borderColor: "divider" }}><Box sx={{ width: 5, height: 5, bgcolor: color, borderRadius: "50%" }} /><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="caption" fontWeight={700} sx={{ fontVariantNumeric: "tabular-nums" }}>{rate ? `₹${rate.toLocaleString("en-IN")}` : "—"}</Typography></Box>)}
 </Box>;
};
export default MetalRates;
