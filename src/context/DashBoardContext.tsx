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

export type MaterialGroupBy = "metal" | "category";

type DashboardFilters = {
  fromDate: string;
  toDate: string;
  branchIds?: number[]; // multiple selected branch IDs
  type: MaterialGroupBy
};

type BranchData = {
  branchId: number;
  branchName: string;
  materialSummary: any[];
  schemePayment: any[];
  paymentSummary: any[];
  estimationSummary: any[];
  cancelledBills: any[];
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
    type :"metal",
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

      // Map raw data
      const allBranches: BranchData[] =
        res.branches?.map((branch: any) => ({
          branchId: branch.branchId,
          branchName: branch.branchName,
          materialSummary: branch.resultSets?.[0] || [],
          schemePayment: branch.resultSets?.[1] || [],
          paymentSummary: branch.resultSets?.[2] || [],
          estimationSummary: branch.resultSets?.[3] || [],
          cancelledBills: branch.resultSets?.[4] || [],
        })) || [];

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
      refresh: fetchDashboard
    }),
    [filters, branchesData, loading, error]
  );

  return (
    <DashBoardContext.Provider value={value}>
      {children}
    </DashBoardContext.Provider>
  );
};
