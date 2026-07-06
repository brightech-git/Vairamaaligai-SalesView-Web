"use client";
import adminInstance from "@/api/adminInstance";

export interface SchemeListItem {
    schemeId: number | string;
    schemeName: string;
}

export const fetchSchemeList = async (): Promise<SchemeListItem[]> => {
    const response = await adminInstance.get("scheme/list");
    const raw = Array.isArray(response.data) ? response.data : response.data?.data || [];
    return raw.map((item: any) => ({
        schemeId: item.schemeId ?? item.SCHEMEID ?? item.id ?? item.ID,
        schemeName: item.schemeName ?? item.SCHEMENAME ?? item.name ?? item.NAME,
    }));
};

export interface SchemeReportParams {
    fromDate: string;
    toDate: string;
    schemeId?: number | string;
}

export const fetchSchemeReport = async ({ fromDate, toDate, schemeId }: SchemeReportParams) => {
    // console.log("Fetching report with params:", { fromDate, toDate, schemeId });
    const response = await adminInstance.get("scheme-report/all", {
        params: {
            fromDate,
            toDate,
            ...(schemeId ? { schemeId } : {}),
        },
    });
    // console.log("REPORT API  Response:", response.data);
    return response.data;
};
