
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FilterStepProps {
  title: string;
  description: string;
  children: ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
}

const FilterStep = ({
  title,
  description,
  children,
  isActive,
  isCompleted,
  stepNumber
}: FilterStepProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 mb-4 transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-80 scale-[0.98]"
      )}
    >
      <div className="flex items-center mb-4">
        <div 
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors duration-300",
            isCompleted ? "bg-primary text-white" : "bg-secondary text-foreground"
          )}
        >
          {isCompleted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            stepNumber
          )}
        </div>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      
      <div className={cn(
        "transition-all duration-500 overflow-hidden",
        isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};

export default FilterStep;
