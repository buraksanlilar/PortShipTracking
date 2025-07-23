import api from "./api";
import type { ShipVisit } from "../types/shipVisit";

const shipVisitService = {
  // Tüm ziyaretleri getir (opsiyonel)
  getShipVisits: async (): Promise<ShipVisit[]> => {
    const response = await api.get("/ShipVisits");
    return response.data;
  },

  searchPaged: async (
    page: number,
    pageSize: number,
    filters: Record<string, string | number | undefined>
  ) => {
    const params: Record<string, string | number> = {
      page,
      pageSize,
    };
  
    // Filtreleri sadece dolu olanları ekle
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== "") {
        params[key] = value;
      }
    }
  
    const response = await api.get("/ShipVisits/searchPaged", { params });
    return response.data;
  },
  
  

  // Tek ziyaret getir
  getShipVisitById: async (id: number): Promise<ShipVisit> => {
    const response = await api.get(`/ShipVisits/${id}`);
    return response.data;
  },

  addShipVisit: async (dto: Omit<ShipVisit, "shipVisitId">): Promise<void> => {
    await api.post("/ShipVisits", {
      ...dto,
      departureDate: dto.departureDate === "" ? null : dto.departureDate,
    });
  },
  

  updateShipVisit: async (id: number, dto: Omit<ShipVisit, "shipVisitId">): Promise<void> => {
    await api.put(`/ShipVisits/${id}`, {
      ...dto,
      departureDate: dto.departureDate === "" ? null : dto.departureDate,
    });
  },
  

  // Sil
  deleteShipVisit: async (id: number): Promise<void> => {
    await api.delete(`/ShipVisits/${id}`);
  },
};

export default shipVisitService;
