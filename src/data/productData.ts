
import { Product } from '../types';

// This is sample data. In a production environment, this would be fetched from a database
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'FlexJoint 100',
    company: 'JointTech',
    nominalJointWidth: 100,
    minJointWidth: 80,
    maxJointWidth: 120,
    compatibleMovementTypes: ['Thermal', 'Settlement'],
    suitableLocations: ['Interior', 'Exterior'],
    suitableProjectTypes: ['New Construction', 'Retrofit'],
    maxLoadingCapacity: ['Pedestrian', 'SUV'],
    suitableJointPlacements: ['Floor', 'Wall'],
    specialFeatures: ['Waterproofing'],
    suitableBuildingTypes: ['Commercial', 'Residential'],
    description: 'A versatile expansion joint cover suitable for moderate movement applications in commercial and residential settings.',
    technicalDetails: 'Made with high-grade aluminum and EPDM rubber for durability and water resistance.'
  },
  {
    id: '2',
    name: 'SeismicGuard 200',
    company: 'SeismicSolutions',
    nominalJointWidth: 200,
    minJointWidth: 150,
    maxJointWidth: 250,
    compatibleMovementTypes: ['Seismic', 'Thermal', 'Settlement'],
    suitableLocations: ['Interior', 'Exterior', 'Podium'],
    suitableProjectTypes: ['New Construction'],
    maxLoadingCapacity: ['Pedestrian', 'SUV', 'Light Duty Truck'],
    suitableJointPlacements: ['Floor', 'Wall', 'Ceiling'],
    specialFeatures: ['Fire Protection', 'Waterproofing'],
    suitableBuildingTypes: ['Commercial', 'Healthcare', 'Mixed Use'],
    description: 'High-performance seismic expansion joint cover designed for buildings requiring significant movement accommodation.',
    technicalDetails: 'Engineered with a multi-directional movement design, fire barrier integration, and waterproofing membrane.'
  },
  {
    id: '3',
    name: 'IndustrialJoint 300',
    company: 'IndustrialCovers Inc.',
    nominalJointWidth: 150,
    minJointWidth: 120,
    maxJointWidth: 180,
    compatibleMovementTypes: ['Thermal', 'Settlement'],
    suitableLocations: ['Interior', 'Parking'],
    suitableProjectTypes: ['New Construction', 'Retrofit'],
    maxLoadingCapacity: ['Pedestrian', 'SUV', 'Light Duty Truck', 'Fire Tender', 'Heavy Duty Truck'],
    suitableJointPlacements: ['Floor'],
    specialFeatures: [],
    suitableBuildingTypes: ['Industrial', 'Commercial', 'Parking'],
    description: 'Heavy-duty expansion joint cover designed for industrial environments with high traffic loads.',
    technicalDetails: 'Constructed with reinforced steel plates and high-density rubber inserts for maximum durability.'
  },
  {
    id: '4',
    name: 'RoofFlex 120',
    company: 'RoofingSystems',
    nominalJointWidth: 120,
    minJointWidth: 100,
    maxJointWidth: 140,
    compatibleMovementTypes: ['Thermal'],
    suitableLocations: ['Roof Top', 'Exterior'],
    suitableProjectTypes: ['New Construction', 'Retrofit'],
    maxLoadingCapacity: ['Pedestrian'],
    suitableJointPlacements: ['Roof'],
    specialFeatures: ['Waterproofing'],
    suitableBuildingTypes: ['Commercial', 'Residential', 'Industrial'],
    description: 'Specialized expansion joint cover for roof applications, providing excellent waterproofing capabilities.',
    technicalDetails: 'Features TPO/EPDM compatibility and UV-resistant materials for extended longevity.'
  },
  {
    id: '5',
    name: 'ArcJoint 150',
    company: 'Architectural Joints Co.',
    nominalJointWidth: 150,
    minJointWidth: 130,
    maxJointWidth: 170,
    compatibleMovementTypes: ['Thermal', 'Settlement'],
    suitableLocations: ['Interior', 'Exterior'],
    suitableProjectTypes: ['New Construction', 'Retrofit'],
    maxLoadingCapacity: ['Pedestrian'],
    suitableJointPlacements: ['Wall', 'Ceiling'],
    specialFeatures: ['Fire Protection'],
    suitableBuildingTypes: ['Hospitality', 'Healthcare', 'Commercial'],
    description: 'Aesthetic expansion joint cover for visible areas, combining function with elegant design.',
    technicalDetails: 'Available in multiple finishes and custom colors to match architectural requirements.'
  },
  // More products would be added here in a real-world scenario
];

// In a real application, this would be a database call
export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleProducts;
};
