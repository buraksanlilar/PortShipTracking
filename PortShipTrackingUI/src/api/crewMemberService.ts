import api from "./api";
import type { CrewMember } from "../types/crewMember";

const crewMemberService = {
  getCrewMembers: async () => {
    try {
      const response = await api.get<CrewMember[]>("/CrewMembers");
      return response.data;
    } catch (error) {
      console.error("Error fetching CrewMembers:", error);
      throw error;
    }
  },
  getCrewMemberById: async (crewId: number) => {
    try {
      const response = await api.get<CrewMember>(`/CrewMembers/${crewId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching CrewMember by ID:", error);
      throw error;
    }
  },
  addCrewMember: async (newCrewMember: CrewMember) => {
    try {
      const response = await api.post<CrewMember>("/CrewMembers", newCrewMember);
      return response.data;
    } catch (error) {
      console.error("Error adding CrewMembers:", error);
      throw error;
    }
  },

  updateCrewMember: async (_crewId: number, updatedCrewMember: CrewMember) => {
    try {
      const response = await api.put<CrewMember>(`/CrewMembers/${updatedCrewMember.crewId}`, updatedCrewMember);
      return response.data;
    } catch (error) {
      console.error("Error updating CrewMember:", error);
      throw error;
    }
  },

  deleteCrewMember: async (crewId: number) => {
    try {
      await api.delete(`/CrewMembers/${crewId}`);
    } catch (error) {
      console.error("Error deleting CrewMember:", error);
      throw error;
    }
  },

  searchPagedCrewMembers: async (page: number, pageSize: number, filters: Partial<CrewMember>) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      if (filters.crewId !== undefined) params.append("crewId", filters.crewId.toString());
      if (filters.firstName) params.append("firstName", filters.firstName);
      if (filters.lastName) params.append("lastName", filters.lastName);
      if (filters.email) params.append("email", filters.email);
      if (filters.phoneNumber) params.append("phoneNumber", filters.phoneNumber);
      if (filters.role) params.append("role", filters.role);

      const response = await api.get(`/CrewMembers/searchPaged?${params.toString()}`);
      return response.data; // { items: CrewMember[], totalCount: number }
    } catch (error) {
      console.error("Error searching paged Ships:", error);
      throw error;
    }
  }
};

export default crewMemberService;
