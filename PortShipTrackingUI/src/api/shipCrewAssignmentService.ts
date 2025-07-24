import api from "./api";
import type { ShipCrewAssignment } from "../types/shipCrewAssignment";

const ShipCrewAssignmentService = {
  // Tüm ziyaretleri getir (opsiyonel)
  getShipCrewAssignments: async (): Promise<ShipCrewAssignment[]> => {
    const response = await api.get("/ShipCrewAssignments");
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
  
    const response = await api.get("/ShipCrewAssignments/searchPaged", { params });
    return response.data;
  },
  
  

  // Tek ziyaret getir
  getShipCrewAssignmentById: async (id: number): Promise<ShipCrewAssignment> => {
    const response = await api.get(`/ShipCrewAssignments/${id}`);
    return response.data;
  },

  addShipCrewAssignment: async (dto: Omit<ShipCrewAssignment, "assignmentId">): Promise<void> => {
    await api.post("/ShipCrewAssignments", {
      ...dto
    });
  },
  

  updateShipCrewAssignment: async (id: number, dto: Omit<ShipCrewAssignment, "assignmentId">): Promise<void> => {
    await api.put(`/ShipCrewAssignments/${id}`, {
      ...dto,
    });
  },
  
  // Sil
  deleteShipCrewAssignment: async (id: number): Promise<void> => {
    await api.delete(`/ShipCrewAssignments/${id}`);
  },
};

export default ShipCrewAssignmentService;
