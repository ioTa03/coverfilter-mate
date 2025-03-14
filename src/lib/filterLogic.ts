
import { FilterCriteria, Product } from '../types';

export const filterProducts = (products: Product[], criteria: FilterCriteria): Product[] => {
  return products.filter(product => {
    // Joint width criteria
    if (criteria.nominalJointWidth !== null && product.nominalJointWidth !== criteria.nominalJointWidth) {
      return false;
    }
    
    if (criteria.minJointWidth !== null && product.minJointWidth > criteria.minJointWidth) {
      return false;
    }
    
    if (criteria.maxJointWidth !== null && product.maxJointWidth < criteria.maxJointWidth) {
      return false;
    }
    
    // Check movement types
    if (criteria.movementTypes.length > 0 && 
        !criteria.movementTypes.every(type => product.compatibleMovementTypes.includes(type))) {
      return false;
    }
    
    // Check locations
    if (criteria.locations.length > 0 && 
        !criteria.locations.every(location => product.suitableLocations.includes(location))) {
      return false;
    }
    
    // Check project type
    if (criteria.projectType !== null && 
        !product.suitableProjectTypes.includes(criteria.projectType)) {
      return false;
    }
    
    // Check max loadings
    if (criteria.maxLoadings.length > 0 && 
        !criteria.maxLoadings.every(loading => product.maxLoadingCapacity.includes(loading))) {
      return false;
    }
    
    // Check joint placements
    if (criteria.jointPlacements.length > 0 && 
        !criteria.jointPlacements.every(placement => product.suitableJointPlacements.includes(placement))) {
      return false;
    }
    
    // Check special requirements
    if (criteria.specialRequirements.length > 0 && 
        !criteria.specialRequirements.every(req => product.specialFeatures.includes(req))) {
      return false;
    }
    
    // Check building types
    if (criteria.buildingTypes.length > 0 && 
        !criteria.buildingTypes.every(type => product.suitableBuildingTypes.includes(type))) {
      return false;
    }
    
    return true;
  });
};

export const findAlternativeProducts = (
  product: Product, 
  allProducts: Product[]
): Product[] => {
  // Exclude the current product
  const otherProducts = allProducts.filter(p => p.id !== product.id);
  
  // Define similarity score based on matching criteria
  return otherProducts
    .map(p => {
      let score = 0;
      
      // Joint width similarity (higher score for closer values)
      const nominalDiff = Math.abs(p.nominalJointWidth - product.nominalJointWidth);
      if (nominalDiff <= 20) score += 3;
      else if (nominalDiff <= 50) score += 2;
      else if (nominalDiff <= 100) score += 1;
      
      // Movement types match
      product.compatibleMovementTypes.forEach(type => {
        if (p.compatibleMovementTypes.includes(type)) score += 1;
      });
      
      // Location match
      product.suitableLocations.forEach(location => {
        if (p.suitableLocations.includes(location)) score += 1;
      });
      
      // Joint placement match
      product.suitableJointPlacements.forEach(placement => {
        if (p.suitableJointPlacements.includes(placement)) score += 1;
      });
      
      // Special features match
      product.specialFeatures.forEach(feature => {
        if (p.specialFeatures.includes(feature)) score += 2; // Higher weight for special features
      });
      
      return { product: p, score };
    })
    .filter(item => item.score > 3) // Only include products with reasonable similarity
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 3) // Get top 3 alternatives
    .map(item => item.product);
};
