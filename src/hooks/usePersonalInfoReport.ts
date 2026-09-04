import { useQuery } from "@tanstack/react-query";
import { PersonalInfoParams } from "@/types/PersonalInfoReport/PersonalInfoReport";
import { getPersonalInfoReport } from "@/service/PersonalInfoReportService";

export const usePersonalInfoReport = (params: PersonalInfoParams, enabled: boolean) => {
    return useQuery({
        queryKey: ["personal-info-report", params],
        queryFn: () => getPersonalInfoReport(params),
        enabled,
    });
};