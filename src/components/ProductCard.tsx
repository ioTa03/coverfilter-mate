
import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import CompareModal from './CompareModal';

interface ProductCardProps {
  product: Product;
  allProducts: Product[];
}

const ProductCard = ({ product, allProducts }: ProductCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const placeholderImageUrl = "/placeholder.svg";
  
  const renderChip = (label: string) => (
    <span className="chip">{label}</span>
  );
  
  return (
    <>
      <Card className={`glass-card overflow-hidden transition-all duration-500 ${showDetails ? 'shadow-md' : ''}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <span className="text-muted-foreground text-sm">{product.company}</span>
            </div>
            <Badge variant="secondary" className="ml-2 uppercase text-xs">
              {product.compatibleMovementTypes[0] || "Standard"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-2">
          <div className="aspect-video mb-4 bg-muted rounded-md overflow-hidden">
            <img 
              src={product.imageUrl || placeholderImageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            <div>
              <div className="text-xs text-muted-foreground">Nominal Width</div>
              <div className="font-medium">{product.nominalJointWidth} mm</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Width Range</div>
              <div className="font-medium">{product.minJointWidth} - {product.maxJointWidth} mm</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Max Loading</div>
              <div className="font-medium">{product.maxLoadingCapacity[product.maxLoadingCapacity.length - 1] || "N/A"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Joint Placement</div>
              <div className="font-medium truncate">{product.suitableJointPlacements.join(", ")}</div>
            </div>
          </div>
          
          {showDetails && (
            <div className="animate-in space-y-3 py-2 border-t border-border">
              {product.description && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{product.description}</div>
                </div>
              )}
              
              <div>
                <div className="text-xs text-muted-foreground mb-1">Movement Types</div>
                <div className="flex flex-wrap">
                  {product.compatibleMovementTypes.map(type => renderChip(type))}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground mb-1">Suitable Locations</div>
                <div className="flex flex-wrap">
                  {product.suitableLocations.map(location => renderChip(location))}
                </div>
              </div>
              
              {product.specialFeatures.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Special Features</div>
                  <div className="flex flex-wrap">
                    {product.specialFeatures.map(feature => renderChip(feature))}
                  </div>
                </div>
              )}
              
              {product.technicalDetails && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Technical Details</div>
                  <div className="text-sm">{product.technicalDetails}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Show Less" : "Show More"}
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setShowCompareModal(true)}
                >
                  Compare Alternatives
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Find similar products from other manufacturers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
      
      {showCompareModal && (
        <CompareModal
          product={product}
          allProducts={allProducts}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
