
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface PDFReportProps {
  products: Product[];
  onClose: () => void;
}

const PDFReport = ({ products, onClose }: PDFReportProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    // In a real app, this would call a PDF generation service
    // For now, we'll just simulate the process with a delay
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "PDF Report Generated",
        description: `Report with ${products.length} products has been downloaded.`,
      });
      onClose();
    }, 2000);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate PDF Report</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            You're about to generate a PDF report for {products.length} expansion joint products.
          </p>
          
          <div className="glass-card p-4 mb-4">
            <h3 className="font-medium mb-2">Report Will Include:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Product specifications with dimensions</li>
              <li>Movement type compatibility</li>
              <li>Suitable locations and placements</li>
              <li>Special features and loading capacity</li>
              <li>Company contact information</li>
            </ul>
          </div>
          
          {products.length > 10 && (
            <div className="text-sm text-muted-foreground italic">
              Note: Your report contains {products.length} products, which may result in a large PDF file.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGeneratePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFReport;
