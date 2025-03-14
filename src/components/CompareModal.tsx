
import { useMemo } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { findAlternativeProducts } from '@/lib/filterLogic';

interface CompareModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
}

const CompareModal = ({
  product,
  allProducts,
  onClose
}: CompareModalProps) => {
  const alternativeProducts = useMemo(() => 
    findAlternativeProducts(product, allProducts),
    [product, allProducts]
  );
  
  const renderComparisonRow = (
    label: string,
    getValue: (p: Product) => React.ReactNode,
    highlight = false
  ) => (
    <tr className={highlight ? 'bg-muted/50' : ''}>
      <td className="px-4 py-2 font-medium text-sm border-r border-border">{label}</td>
      <td className="px-4 py-2 text-sm border-r border-border">{getValue(product)}</td>
      {alternativeProducts.map((alt, i) => (
        <td key={i} className="px-4 py-2 text-sm border-r border-border">{getValue(alt)}</td>
      ))}
    </tr>
  );
  
  const getSpecialFeatures = (p: Product) => 
    p.specialFeatures.length > 0 ? p.specialFeatures.join(", ") : "None";
  
  const getMovementTypes = (p: Product) => p.compatibleMovementTypes.join(", ");
  
  const getLocationSuitability = (p: Product) => p.suitableLocations.join(", ");
  
  const getLoadingCapacity = (p: Product) => 
    p.maxLoadingCapacity.length > 0 ? p.maxLoadingCapacity.join(", ") : "N/A";
  
  const generatePDFReport = () => {
    // In a real application, this would generate a PDF with comparison data
    console.log("Generating PDF report for comparison");
    // Mock PDF generation notification
    const timer = setTimeout(() => {
      onClose();
    }, 1500);
    return () => clearTimeout(timer);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Product Comparison</DialogTitle>
          <DialogDescription>
            Comparing {product.name} with similar alternatives
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium text-sm border-r border-border">Product Details</th>
                <th className="px-4 py-2 text-left font-medium text-sm border-r border-border">
                  {product.name} <span className="font-normal">({product.company})</span>
                </th>
                {alternativeProducts.map((alt, i) => (
                  <th key={i} className="px-4 py-2 text-left font-medium text-sm border-r border-border">
                    {alt.name} <span className="font-normal">({alt.company})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderComparisonRow("Nominal Width", p => `${p.nominalJointWidth} mm`, true)}
              {renderComparisonRow("Width Range", p => `${p.minJointWidth} - ${p.maxJointWidth} mm`)}
              {renderComparisonRow("Movement Types", getMovementTypes, true)}
              {renderComparisonRow("Max Loading", getLoadingCapacity)}
              {renderComparisonRow("Location Suitability", getLocationSuitability, true)}
              {renderComparisonRow("Joint Placement", p => p.suitableJointPlacements.join(", "))}
              {renderComparisonRow("Special Features", getSpecialFeatures, true)}
              {renderComparisonRow("Description", p => p.description || "N/A")}
            </tbody>
          </table>
        </div>
        
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generatePDFReport}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Generate PDF Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;
