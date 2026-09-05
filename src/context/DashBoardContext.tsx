"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { dashBoardContent } from "@/service/DashBoardService";

type DashboardFilters = {
  fromDate: string;
  toDate: string;
  branchIds?: string[]; // multiple selected branch IDs (COMPANYID values)
};

type CompanyDetails = {
  COMPANYID?: string;
  COMPANYNAME?: string;
  [key: string]: any;
};

type BranchData = {
  branchId: string;
  branchName: string;
  materialSummary: any[];
  schemePayment: any[];
  paymentSummary: any[];
  estimationSummary: any[];
  cancelledBills: any[];
  companyDetails: CompanyDetails;
};

type DashBoardContextType = {
  filters: DashboardFilters;
  branchesData: BranchData[];
  loading: boolean;
  error: string | null;
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
  refresh: () => void;
};

const DashBoardContext = createContext<DashBoardContextType | undefined>(
  undefined
);

export const useDashBoardContext = () => {
  const context = useContext(DashBoardContext);
  if (!context)
    throw new Error(
      "useDashBoardContext must be used within a DashBoardProvider"
    );
  return context;
};

export const DashBoardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<DashboardFilters>({
    fromDate: "",
    toDate: "",
    branchIds: [], // empty = all branches
  });

  const [branchesData, setBranchesData] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!filters.fromDate || !filters.toDate) return;

    try {
      setLoading(true);
      setError(null);
      const res = await dashBoardContent(filters);

      // API returns { success, data: [{ schemeDB, resultSets, transDB, adminDB }], fromDate, toDate }
      // resultSets order: [0] material summary, [1] scheme/chit payment,
      // [2] payment mode summary, [3] estimation status summary, [4] company details
      const rawBranches: any[] = Array.isArray(res?.data) ? res.data : [];

      const allBranches: BranchData[] = rawBranches.map((branch: any, index: number) => {
        const resultSets = branch.resultSets || [];
        const companyDetails: CompanyDetails = resultSets[4]?.[0] || {};

        return {
          branchId: companyDetails.COMPANYID || branch.transDB || String(index),
          branchName: companyDetails.COMPANYNAME || branch.transDB || `Branch ${index + 1}`,
          materialSummary: resultSets[0] || [],
          schemePayment: resultSets[1] || [],
          paymentSummary: resultSets[2] || [],
          estimationSummary: resultSets[3] || [],
          cancelledBills: resultSets[5] || [],
          companyDetails,
        };
      });

      // Filter based on selected branch IDs
      const filteredBranches =
        filters.branchIds && filters.branchIds.length > 0
          ? allBranches.filter((b) => filters.branchIds?.includes(b.branchId))
          : allBranches; // if none selected, show all

      setBranchesData(filteredBranches);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const value = useMemo(
    () => ({
      filters,
      branchesData,
      loading,
      error,
      setFilters,
      refresh: fetchDashboard,
    }),
    [filters, branchesData, loading, error]
  );

  return (
    <DashBoardContext.Provider value={value}>
      {children}
    </DashBoardContext.Provider>
  );
};
