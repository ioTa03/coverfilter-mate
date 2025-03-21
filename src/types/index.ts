// src/types/index.ts
export type MovementType = 'Thermal' | 'Settlement' | 'Seismic';
export type Location = 'Podium' | 'Roof Top' | 'Parking' | 'Landscape' | 'Interior' | 'Exterior';
export type LoadingType = 'Pedestrian' | 'SUV' | 'Light Duty Truck' | 'Fire Tender' | 'Heavy Duty Truck';
export type JointPlacement = 'Floor' | 'Wall' | 'Ceiling' | 'Roof';
export type SpecialRequirement = 'Fire Protection' | 'Waterproofing';
export type BuildingType = 'Commercial' | 'Residential' | 'Industrial' | 'Hospitality' | 'Healthcare' | 'Stadium' | 'Metro' | 'Airport' | 'Mixed Use' | 'Parking';

// Removed ProjectType since it's no longer needed
// export type ProjectType = 'New Construction' | 'Retrofit';

export interface FilterCriteria {
  nominalJointWidth: number | null;       // User input in mm
  minJointWidth: number | null;           // User input in mm for min difference
  maxJointWidth: number | null;           // User input in mm for max difference
  skipWidth: boolean;                     // New: Skip width filtering
  movementTypes: MovementType[];
  locations: Location[];
  maxLoadings: LoadingType[];
  jointPlacements: JointPlacement[];
  specialRequirements: SpecialRequirement[];
  buildingTypes: BuildingType[];
  aesthetics: boolean | null;
}

export interface Product {
  id: string;
  name: string;
  company: string;
  nominalJointWidth: number;              // For display, will use user input for filtering
  minJointWidth: number;                  // Maps to min_nominal_width
  maxJointWidth: number;                  // Maps to max_nominal_width
  compatibleMovementTypes: MovementType[];
  suitableLocations: Location[];
  maxLoadingCapacity: LoadingType[];
  suitableJointPlacements: JointPlacement[];
  specialFeatures: SpecialRequirement[];
  suitableBuildingTypes: BuildingType[];
  imageUrl?: string;
  description?: string;
  technicalDetails?: string;
  alternativeProducts?: string[];
}