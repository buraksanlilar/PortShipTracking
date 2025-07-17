export interface Cargo { 
    CargoId: number;
    ShipId: number; // Foreign key to Ship
    Description: string; // Description of the cargo
    WeightTon: number;
    CargoType: string; // Type of cargo (e.g., container, bulk, liquid)

}