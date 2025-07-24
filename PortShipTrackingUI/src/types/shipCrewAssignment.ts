export interface ShipCrewAssignment { 
    assignmentId: number; // Unique identifier for the assignment
    shipId: number; // Foreign key to Ship
    crewId: number; // Foreign key to Crew
    assignmentDate: string; // Date of the assignment datetime format on db
}