import React, { createContext, useContext, useEffect } from "react";
import { getCompanyDetails } from "@/service/companyDetails";

interface CompanyDetails {
    companyName: string;
    companyAddress: string;
    companyContact: string;
    companyEmail: string;
    companyGST: string;
    LOGO: string;
    BASEURL : string;
}

interface CompanyDetailsContextProps {
    companyDetails: CompanyDetails | null;
    setCompanyDetails: (details: CompanyDetails | null) => void;
}

const CompanyDetailsContext = createContext<CompanyDetailsContextProps | undefined>(undefined);

export const CompanyDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [companyDetails, setCompanyDetails] = React.useState<CompanyDetails | null>(null);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const details = await getCompanyDetails();
                setCompanyDetails(details?.[0] ?? null);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };

        fetchCompanyDetails();
    }, []);

    return (
        <CompanyDetailsContext.Provider value={{ companyDetails, setCompanyDetails }}>
            {children}
        </CompanyDetailsContext.Provider>
    );
};

export const useCompanyDetails = (): CompanyDetailsContextProps => {
    const context = useContext(CompanyDetailsContext);

    if (!context) {
        throw new Error("useCompanyDetails must be used inside CompanyDetailsProvider");
    }

    return context;
};
