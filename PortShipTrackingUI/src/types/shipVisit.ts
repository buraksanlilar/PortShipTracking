export interface ShipVisit {
    ShipVisitId: number;
    ShipId: number;
    PortId: number;
    ArrivalDate: string;
    DepartureDate: string | null; // Nullable if the ship is currently at the port
    Purpose: string; // Purpose of the visit (e.g., loading, unloading, maintenance)
}