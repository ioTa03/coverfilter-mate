
import { useState, useMemo } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import PDFReport from './PDFReport';

interface ResultsGridProps {
  products: Product[];
  onBack: () => void;
}

type SortOption = 'nominalWidth' | 'company' | 'movementType';

const ResultsGrid = ({ products, onBack }: ResultsGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('nominalWidth');
  const [showPDFReport, setShowPDFReport] = useState(false);
  
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.company.toLowerCase().includes(term) ||
      product.compatibleMovementTypes.some(type => type.toLowerCase().includes(term)) ||
      product.suitableLocations.some(loc => loc.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);
  
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'nominalWidth':
        return sorted.sort((a, b) => a.nominalJointWidth - b.nominalJointWidth);
      case 'company':
        return sorted.sort((a, b) => a.company.localeCompare(b.company));
      case 'movementType':
        return sorted.sort((a, b) => {
          const typeA = a.compatibleMovementTypes[0] || '';
          const typeB = b.compatibleMovementTypes[0] || '';
          return typeA.localeCompare(typeB);
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="animate-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium mb-1">Search Results</h2>
            <p className="text-muted-foreground">
              Found {filteredProducts.length} matching products from our database
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={onBack}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Modify Filters
            </Button>
            
            <Button
              onClick={() => setShowPDFReport(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Generate PDF Report
            </Button>
          </div>
        </div>
        
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <Input
                placeholder="Search by name, company, or feature..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex-shrink-0 w-full md:w-64">
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nominalWidth">Sort by Width</SelectItem>
                  <SelectItem value="company">Sort by Company</SelectItem>
                  <SelectItem value="movementType">Sort by Movement Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3 className="text-xl font-medium mb-2">No matching products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={onBack}>Modify Filters</Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  allProducts={products} 
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {showPDFReport && (
        <PDFReport 
          products={filteredProducts} 
          onClose={() => setShowPDFReport(false)} 
        />
      )}
    </div>
  );
};

export default ResultsGrid;
