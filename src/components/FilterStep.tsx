// src/components/ui/FilterStep.tsx
import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FilterStepProps {
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
  children: ReactNode;
  onClick?: () => void; // New prop to handle click
}

const FilterStep = ({
  title,
  description,
  isActive,
  isCompleted,
  stepNumber,
  children,
  onClick, // Add to props
}: FilterStepProps) => {
  return (
    <div className="border-b border-border last:border-b-0">
      <div
        className={`flex items-center justify-between py-4 cursor-pointer transition-colors duration-200 ${
          isActive ? 'text-foreground' : 'text-muted-foreground'
        } hover:text-foreground`}
        onClick={onClick} // Make title/description clickable
      >
        <div className="flex items-center space-x-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              isCompleted
                ? 'bg-primary text-white'
                : isActive
                ? 'bg-secondary border border-primary text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {stepNumber}
          </span>
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {isActive ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </div>
      {isActive && <div className="pb-4">{children}</div>}
    </div>
  );
};

export default FilterStep;