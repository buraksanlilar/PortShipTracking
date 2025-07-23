import api from "./api";
import type { Cargo } from "../types/cargo";
import type { AxiosError } from "axios";

interface CreateCargoDto {
  shipId: number;
  description: string;
  weightTon: number;
  cargoType: string;
}

interface UpdateCargoDto {
  shipId: number;
  description: string;
  weightTon: number;
  cargoType: string;
}

const BASE_URL = "/Cargos";

const cargoService = {
  getCargoList: async () => {
    try {
      const response = await api.get<Cargo[]>(BASE_URL);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching Cargo list:", (error as AxiosError).response?.data || error.message);
      } else {
        console.error("Error fetching Cargo list:", error);
      }
      throw error;
    }
  },

  addCargo: async (newCargo: Cargo) => {
    const dto: CreateCargoDto = {
      shipId: newCargo.shipId,
      description: newCargo.description,
      weightTon: newCargo.weightTon,
      cargoType: newCargo.cargoType,
    };

    try {
      const response = await api.post<Cargo>(BASE_URL, dto);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error adding Cargo:", (error as AxiosError).response?.data || error.message);
      } else {
        console.error("Error adding Cargo:", error);
      }
      throw error;
    }
  },

  updateCargo: async (cargoId: number, updatedCargo: Cargo) => {
    const dto: UpdateCargoDto = {
      shipId: updatedCargo.shipId,
      description: updatedCargo.description,
      weightTon: updatedCargo.weightTon,
      cargoType: updatedCargo.cargoType,
    };

    try {
      const response = await api.put<Cargo>(`${BASE_URL}/${cargoId}`, dto);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          console.error("Error updating Cargo:", (error as AxiosError).response?.data || error.message);
        } else {
          console.error("Error updating Cargo:", error);
        }
      } else {
        console.error("Error updating Cargo:", error);
      }
      throw error;
    }
  },

  deleteCargo: async (cargoId: number) => {
    try {
      await api.delete(`${BASE_URL}/${cargoId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          console.error("Error deleting Cargo:", error.message);
        } else {
          console.error("Error deleting Cargo:", error);
        }
      } else {
        console.error("Error deleting Cargo:", error);
      }
      throw error;
    }
  },
  searchPagedCargo: async (page: number, pageSize: number, filters: Partial<Cargo>) => {
    try {
      const body = {
        ...filters,
        page,
        pageSize,
      };
  
      const response = await api.post(`${BASE_URL}/searchPaged`, body);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error searching paged Cargo:", (error as AxiosError).response?.data || error.message);
      } else {
        console.error("Error searching paged Cargo:", error);
      }
      throw error;
    }
  }
  
};

export default cargoService;
