export interface ShipVisit {
    shipVisitId: number;
    shipId: number;
    portId: number;
    arrivalDate: string;
    departureDate: string | null; // Nullable if the ship is currently at the port
    purpose: string; // Purpose of the visit (e.g., loading, unloading, maintenance)
}