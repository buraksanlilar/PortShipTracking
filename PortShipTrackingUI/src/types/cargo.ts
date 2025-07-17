export interface Cargo { 
    cargoId: number;
    shipId: number; // Foreign key to Ship
    description: string; // Description of the cargo
    weightTon: number;
    cargoType: string; // Type of cargo (e.g., container, bulk, liquid)

}