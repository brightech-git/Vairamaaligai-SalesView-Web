import adminInstance from "@/api/adminInstance";


const baseUrlMast = "/master";
const baseUrlReport = "/stock";

// 📁 ReportService.ts
export const getAllReports = async (params: {
    itemName?: string;
    subItemName?: string;
    metal?: string;
    size?: string;
    costId?: string;
    range?: string;
    page?: number;
    pageSize?: number;
}) => {
    const response = await adminInstance.get(`${baseUrlReport}/filter`, {
        params,
    });

    return response.data;
};




export type MetalMaster = {
   METALID:string;
    METALNAME: string;
};

export type ITEMMASTER = {
    ITEMID : number;
    ITEMNAME:string;
}

export type SUBITEMMASTER = {
    SUBITEMID:number;
    SUBITEMNAME:string;
};

export type SizeMaster = {
    SIZEID : number;
    SIZENAME:string ;
}

export type RangeMaster = {
    CAPTION:string;
}

export type CostIds = {
    COSTID : number;
    COSTNAME:string;
}

// ================= METAL =================
export const getMetals = async (): Promise<MetalMaster[]> => {
    const res = await adminInstance.get(`${baseUrlMast}/metal`);
    return res.data;
};

// ================= ITEM =================
export const getItems = async (): Promise<ITEMMASTER[]> => {
    const res = await adminInstance.get(`${baseUrlMast}/item`);
    return res.data;
};

// ================= SUB ITEM =================
export const getSubItems = async (itemId?: number): Promise<SUBITEMMASTER[]> => {
    const res = await adminInstance.get(`${baseUrlMast}/subitem`, {
        params: { itemId },
    });
    return res.data;
};

// ================= SIZE =================
export const getSizes = async (itemId?: number): Promise<SizeMaster[]> => {
    const res = await adminInstance.get(`${baseUrlMast}/size`, {
        params: { itemId },
    });
    return res.data
};

// ================= RANGE =================
export const getRanges = async (params: {
    itemId?: number;
    subItemId?: number;
    page?: number;
    pageSize?: number;
}): Promise<RangeMaster[]> => {
    const res = await adminInstance.get(`${baseUrlMast}/range/captions`, {
        params,
    });

    return res.data
};

export const getCostIds = async():Promise<CostIds[]> =>{
    const res = await adminInstance.get(`${baseUrlMast}/cost-centres`);
    return res.data;
}