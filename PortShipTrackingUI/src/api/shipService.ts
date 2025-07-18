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
  getShipById: async (ShipId: number) => {
        try {
        const response = await api.get<Ship>(`/Ships/${ShipId}`);
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
};        


export default shipService;