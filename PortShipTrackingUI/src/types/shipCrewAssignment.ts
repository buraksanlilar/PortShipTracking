export interface ShipCrewAssignment { 
    AssignmentId: number; // Unique identifier for the assignment
    ShipId: number; // Foreign key to Ship
    CrewId: number; // Foreign key to Crew
    AssignmentDate: string; // Date of the assignment
}