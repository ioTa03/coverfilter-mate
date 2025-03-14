
export type MovementType = 'Thermal' | 'Settlement' | 'Seismic';
export type Location = 'Podium' | 'Roof Top' | 'Parking' | 'Landscape' | 'Interior' | 'Exterior';
export type ProjectType = 'New Construction' | 'Retrofit';
export type LoadingType = 'Pedestrian' | 'SUV' | 'Light Duty Truck' | 'Fire Tender' | 'Heavy Duty Truck';
export type JointPlacement = 'Floor' | 'Wall' | 'Ceiling' | 'Roof';
export type SpecialRequirement = 'Fire Protection' | 'Waterproofing';
export type BuildingType = 'Commercial' | 'Residential' | 'Industrial' | 'Hospitality' | 'Healthcare' | 'Stadium' | 'Metro' | 'Airport' | 'Mixed Use';

export interface FilterCriteria {
  nominalJointWidth: number | null;
  minJointWidth: number | null;
  maxJointWidth: number | null;
  movementTypes: MovementType[];
  locations: Location[];
  projectType: ProjectType | null;
  maxLoadings: LoadingType[];
  jointPlacements: JointPlacement[];
  specialRequirements: SpecialRequirement[];
  buildingTypes: BuildingType[];
}

export interface Product {
  id: string;
  name: string;
  company: string;
  nominalJointWidth: number;
  minJointWidth: number;
  maxJointWidth: number;
  compatibleMovementTypes: MovementType[];
  suitableLocations: Location[];
  suitableProjectTypes: ProjectType[];
  maxLoadingCapacity: LoadingType[];
  suitableJointPlacements: JointPlacement[];
  specialFeatures: SpecialRequirement[];
  suitableBuildingTypes: BuildingType[];
  imageUrl?: string;
  description?: string;
  technicalDetails?: string;
  alternativeProducts?: string[];
}
