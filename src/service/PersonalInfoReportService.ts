// service/PersonalInfoReportService.ts

import adminInstance from "../api/adminInstance";
import { PersonalInfoParams, PersonalInfoResponse } from "@/types/PersonalInfoReport/PersonalInfoReport";

export const getPersonalInfoReport = async (
    params: PersonalInfoParams
): Promise<PersonalInfoResponse> => {
    try {
        const query: Record<string, any> = {
            page: params.page,
            size: params.size,
            // Backend param name is capitalized: CostId
            ...(params.costId && { CostId: params.costId }),
        };

        const { data } = await adminInstance.get("/personal-info", { params: query });
        return data;
    } catch (err) {
        throw new Error(`Error fetching Personal Info Report: ${err}`);
    }
};
