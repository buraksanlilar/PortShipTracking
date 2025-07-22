import api from "./api";
import type { Port} from "../types/port";

const portService = {
    getPorts : async () => {
        try {
            const response = await api.get<Port[]>("/Ports");
            return response.data;
        } catch (error) {
            console.error("Error fetching Ports:", error);
            throw error;
        }
    },
    addPort: async (newPort: Port) => {
        try {
            const response = await api.post<Port>("/Ports", newPort);
            return response.data;
        } catch (error) {
            console.error("Error adding Port:", error);
            throw error;
        }
    },
    updatePort: async (_portId: number, updatedPort: Port) => {
        try {
            const response = await api.put<Port>(`/Ports/${updatedPort.portId}`, updatedPort);
            return response.data;
        } catch (error) {
            console.error("Error updating Port:", error);
            throw error;
        }
    },
    deletePort: async (portId: number) => {
        try {
            await api.delete(`/Ports/${portId}`);
        } catch (error) {
            console.error("Error deleting Port:", error);
            throw error;
        }
    },
    searchPagedPorts: async (page: number, pageSize: number, filters: Partial<Port>) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("pageSize", pageSize.toString());

            if (filters.portId !== undefined) params.append("portId", filters.portId.toString());
            if (filters.name) params.append("name", filters.name);
            if (filters.country) params.append("country", filters.country);
            if (filters.city) params.append("city", filters.city);

            const response = await api.get(`/Ports/searchPaged?${params.toString()}`);
            return response.data; // { items: Port[], totalCount: number }
        } catch (error) {
            console.error("Error searching paged Ports:", error);
            throw error;
        }
    }
};
export default portService;