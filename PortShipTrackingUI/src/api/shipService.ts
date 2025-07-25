import api from "./api";
import type { Ship } from "../types/ship";

const shipService = {
  getShips: async () => {
    try {
      const response = await api.get<Ship[]>("/Ships");
      return response.data;
    } catch (error) {
      console.error("Error fetching Ships:", error);
      throw error;
    }
  },
  getShipById: async (shipId: number) => {
    try {
      const response = await api.get<Ship>(`/Ships/${shipId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Ship by ID:", error);
      throw error;
    }
  },
  addShip: async (newShip: Ship) => {
    try {
      const response = await api.post<Ship>("/Ships", newShip);
      return response.data;
    } catch (error) {
      console.error("Error adding Ship:", error);
      throw error;
    }
  },

  updateShip: async (_shipId: number, updatedShip: Ship) => {
    try {
      const response = await api.put<Ship>(`/Ships/${updatedShip.shipId}`, updatedShip);
      return response.data;
    } catch (error) {
      console.error("Error updating Ship:", error);
      throw error;
    }
  },

  deleteShip: async (ShipId: number) => {
    try {
      await api.delete(`/Ships/${ShipId}`);
    } catch (error) {
      console.error("Error deleting Ship:", error);
      throw error;
    }
  },

  searchPagedShips: async (page: number, pageSize: number, filters: Partial<Ship>) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      if (filters.shipId !== undefined) params.append("shipId", filters.shipId.toString());
      if (filters.name) params.append("name", filters.name);
      if (filters.imo) params.append("imo", filters.imo);
      if (filters.type) params.append("type", filters.type);
      if (filters.flag) params.append("flag", filters.flag);
      if (filters.yearBuilt !== undefined) params.append("yearBuilt", filters.yearBuilt.toString());

      const response = await api.get(`/Ships/searchPaged?${params.toString()}`);
      return response.data; // { items: Ship[], totalCount: number }
    } catch (error) {
      console.error("Error searching paged Ships:", error);
      throw error;
    }
  }
};

export default shipService;
