// src/components/ui/FilterForm.tsx
import { useState, useMemo } from 'react';
import { FilterCriteria, MovementType, Location, LoadingType, JointPlacement, SpecialRequirement, BuildingType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FilterStep from './FilterStep';
import { toast } from '@/components/ui/use-toast';

const emptyFilterCriteria: FilterCriteria = {
  nominalJointWidth: null,
  minJointWidth: null,
  maxJointWidth: null,
  skipWidth: false, // New default
  movementTypes: [],
  locations: [],
  maxLoadings: [],
  jointPlacements: [],
  specialRequirements: [],
  buildingTypes: [],
  aesthetics: null,
};

interface FilterFormProps {
  onFilterSubmit: (criteria: FilterCriteria) => void;
}

const FilterForm = ({ onFilterSubmit }: FilterFormProps) => {
  const [criteria, setCriteria] = useState<FilterCriteria>(emptyFilterCriteria);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Reduced from 5 to 4

  const completedSteps = useMemo(() => {
    const completed = new Set<number>();

    // Step 1: Joint Width
    if (!criteria.skipWidth && (criteria.nominalJointWidth !== null || 
        criteria.minJointWidth !== null || 
        criteria.maxJointWidth !== null)) {
      completed.add(1);
    }

    // Step 2: Movement Type and Location
    if (criteria.movementTypes.length > 0 || criteria.locations.length > 0) {
      completed.add(2);
    }

    // Step 3: Maximum Loading and Joint Placement (shifted from 4)
    if (criteria.maxLoadings.length > 0 || criteria.jointPlacements.length > 0 || criteria.specialRequirements.length > 0|| criteria.aesthetics !== null) {
      completed.add(3);
    }

    // Step 4: Building Type (shifted from 5)
    if (criteria.buildingTypes.length > 0) {
      completed.add(4);
    }

    return completed;
  }, [criteria]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const hasFilters = Object.values(criteria).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== false; // Exclude skipWidth false
    });

    if (!hasFilters) {
      toast({
        title: "No filters applied",
        description: "Please specify at least one filter criterion",
        variant: "destructive",
      });
      return;
    }

    onFilterSubmit(criteria);
  };

  const updateCriteria = (update: Partial<FilterCriteria>) => {
    setCriteria(prev => ({ ...prev, ...update }));
  };

  const handleToggleCheckbox = <T extends string>(
    array: T[],
    item: T,
    updateFn: (items: T[]) => void
  ) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFn(newArray);
  };

  const handleNumberInput = (
    value: string,
    field: 'nominalJointWidth' | 'minJointWidth' | 'maxJointWidth'
  ) => {
    const numberValue = value === '' ? null : Number(value);
    updateCriteria({ [field]: numberValue } as Partial<FilterCriteria>);
  };

  const getClearMessage = () => {
    return `Clear ${
      currentStep === 1 ? "Joint Width" :
      currentStep === 2 ? "Movement & Location" :
      currentStep === 3 ? "Loading & Placement" :
      "Building Type"
    } Filters`;
  };

  const clearCurrentStep = () => {
    switch (currentStep) {
      case 1:
        updateCriteria({
          nominalJointWidth: null,
          minJointWidth: null,
          maxJointWidth: null,
          skipWidth: false,
        });
        break;
      case 2:
        updateCriteria({
          movementTypes: [],
          locations: [],
        });
        break;
      case 3:
        updateCriteria({
          maxLoadings: [],
          jointPlacements: [],
          specialRequirements: [],
          aesthetics: null,
        });
        break;
      case 4:
        updateCriteria({
          buildingTypes: [],
        });
        break;
    }

    toast({
      title: "Filters cleared",
      description: `${getClearMessage().replace('Clear ', '')} have been reset.`,
    });
  };

  const getCompletionPercentage = () => {
    return Math.round((completedSteps.size / totalSteps) * 100);
  };

  const clearAllFilters = () => {
    setCriteria(emptyFilterCriteria);
    setCurrentStep(1);
    toast({
      title: "All filters cleared",
      description: "All filter criteria have been reset to default values.",
    });
  };

  const movementTypes: MovementType[] = ['Thermal', 'Settlement', 'Seismic'];
  const locations: Location[] = ['Podium', 'Roof Top', 'Parking', 'Landscape', 'Interior', 'Exterior'];
  const loadingTypes: LoadingType[] = ['Pedestrian', 'SUV', 'Light Duty Truck', 'Fire Tender', 'Heavy Duty Truck'];
  const jointPlacements: JointPlacement[] = ['Floor', 'Wall', 'Ceiling', 'Roof'];
  const specialRequirements: SpecialRequirement[] = ['Fire Protection', 'Waterproofing'];
  const buildingTypes: BuildingType[] = ['Commercial', 'Residential', 'Industrial', 'Hospitality', 'Healthcare', 'Stadium', 'Metro', 'Airport', 'Mixed Use', 'Parking'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium mb-2">Find Your Ideal Expansion Joint Cover</h2>
        <p className="text-muted-foreground">Complete the questionnaire to filter products that match your specifications</p>
      </div>

      <div className="mb-6 glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Completion: {getCompletionPercentage()}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear All Filters
          </Button>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${
                  completedSteps.has(i + 1)
                    ? "bg-primary text-white"
                    : i + 1 === currentStep
                    ? "bg-secondary border border-primary text-primary"
                    : "bg-secondary text-foreground"
                }`}
                onClick={() => setCurrentStep(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Joint Width */}
        <FilterStep
          title="Joint Width"
          description="Specify the width parameters for your expansion joint (in mm)"
          isActive={currentStep === 1}
          isCompleted={completedSteps.has(1)}
          stepNumber={1}
        >
          <div className="space-y-4 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipWidth"
                checked={criteria.skipWidth}
                onCheckedChange={(checked) => updateCriteria({ skipWidth: !!checked })}
              />
              <Label htmlFor="skipWidth" className="cursor-pointer">
                Skip Width Filtering
              </Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nominalJointWidth">Nominal Joint Width (mm)</Label>
                <Input
                  id="nominalJointWidth"
                  type="number"
                  value={criteria.nominalJointWidth !== null ? criteria.nominalJointWidth : ''}
                  onChange={(e) => handleNumberInput(e.target.value, 'nominalJointWidth')}
                  placeholder="e.g., 100"
                  className="mt-1"
                  disabled={criteria.skipWidth}
                />
              </div>
              <div>
                <Label htmlFor="minJointWidth">Minimum Joint Width (mm)</Label>
                <Input
                  id="minJointWidth"
                  type="number"
                  value={criteria.minJointWidth !== null ? criteria.minJointWidth : ''}
                  onChange={(e) => handleNumberInput(e.target.value, 'minJointWidth')}
                  placeholder="e.g., 80"
                  className="mt-1"
                  disabled={criteria.skipWidth}
                />
              </div>
              <div>
                <Label htmlFor="maxJointWidth">Maximum Joint Width (mm)</Label>
                <Input
                  id="maxJointWidth"
                  type="number"
                  value={criteria.maxJointWidth !== null ? criteria.maxJointWidth : ''}
                  onChange={(e) => handleNumberInput(e.target.value, 'maxJointWidth')}
                  placeholder="e.g., 120"
                  className="mt-1"
                  disabled={criteria.skipWidth}
                />
              </div>
            </div>
          </div>
        </FilterStep>

        {/* Step 2: Movement Type and Location */}
        <FilterStep
          title="Movement & Location"
          description="Select compatible movement types and installation locations"
          isActive={currentStep === 2}
          isCompleted={completedSteps.has(2)}
          stepNumber={2}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-base font-medium mb-2 block">Expected Movement Type</Label>
              <div className="grid grid-cols-1 gap-2">
                {movementTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`movement-${type}`}
                      checked={criteria.movementTypes.includes(type)}
                      onCheckedChange={() =>
                        handleToggleCheckbox(
                          criteria.movementTypes,
                          type,
                          (types) => updateCriteria({ movementTypes: types })
                        )
                      }
                    />
                    <Label htmlFor={`movement-${type}`} className="cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-medium mb-2 block">Installation Location</Label>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={criteria.locations.includes(location)}
                      onCheckedChange={() =>
                        handleToggleCheckbox(
                          criteria.locations,
                          location,
                          (locs) => updateCriteria({ locations: locs })
                        )
                      }
                    />
                    <Label htmlFor={`location-${location}`} className="cursor-pointer">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FilterStep>

        {/* Step 3: Maximum Loading and Joint Placement */}
        <FilterStep
          title="Loading & Placement"
          description="Specify loading requirements and joint placement"
          isActive={currentStep === 3}
          isCompleted={completedSteps.has(3)}
          stepNumber={3}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <Label className="text-base font-medium mb-2 block">Maximum Loading</Label>
              <div className="grid grid-cols-1 gap-2">
                {loadingTypes.map((loading) => (
                  <div key={loading} className="flex items-center space-x-2">
                    <Checkbox
                      id={`loading-${loading}`}
                      checked={criteria.maxLoadings.includes(loading)}
                      onCheckedChange={() =>
                        handleToggleCheckbox(
                          criteria.maxLoadings,
                          loading,
                          (loads) => updateCriteria({ maxLoadings: loads })
                        )
                      }
                    />
                    <Label htmlFor={`loading-${loading}`} className="cursor-pointer">
                      {loading}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-medium mb-2 block">Joint Placement</Label>
              <div className="grid grid-cols-2 gap-2">
                {jointPlacements.map((placement) => (
                  <div key={placement} className="flex items-center space-x-2">
                    <Checkbox
                      id={`placement-${placement}`}
                      checked={criteria.jointPlacements.includes(placement)}
                      onCheckedChange={() =>
                        handleToggleCheckbox(
                          criteria.jointPlacements,
                          placement,
                          (places) => updateCriteria({ jointPlacements: places })
                        )
                      }
                    />
                    <Label htmlFor={`placement-${placement}`} className="cursor-pointer">
                      {placement}
                    </Label>
                  </div>
                ))}
              </div>
              <Label className="text-base font-medium mt-4 mb-2 block">Special Requirements</Label>
              <div className="grid grid-cols-1 gap-2">
                {specialRequirements.map((req) => (
                  <div key={req} className="flex items-center space-x-2">
                    <Checkbox
                      id={`requirement-${req}`}
                      checked={criteria.specialRequirements.includes(req)}
                      onCheckedChange={() =>
                        handleToggleCheckbox(
                          criteria.specialRequirements,
                          req,
                          (reqs) => updateCriteria({ specialRequirements: reqs })
                        )
                      }
                    />
                    <Label htmlFor={`requirement-${req}`} className="cursor-pointer">
                      {req}
                    </Label>
                  </div>
                ))}
              </div>
                              {/* Add this after the specialRequirements div */}
              
            </div>
            <Label className="text-base font-medium mt-4 mb-2 block">Aesthetics</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aesthetics-yes"
                    checked={criteria.aesthetics === true}
                    onCheckedChange={() => updateCriteria({ aesthetics: criteria.aesthetics === true ? null : true })}
                  />
                  <Label htmlFor="aesthetics-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aesthetics-no"
                    checked={criteria.aesthetics === false}
                    onCheckedChange={() => updateCriteria({ aesthetics: criteria.aesthetics === false ? null : false })}
                  />
                  <Label htmlFor="aesthetics-no" className="cursor-pointer">No</Label>
                </div>
              </div>

          </div>
        </FilterStep>

        {/* Step 4: Building Type */}
        <FilterStep
          title="Building Type"
          description="Select applicable building types"
          isActive={currentStep === 4}
          isCompleted={completedSteps.has(4)}
          stepNumber={4}
        >
          <div className="mb-4">
            <Label className="text-base font-medium mb-2 block">Building Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {buildingTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`building-${type}`}
                    checked={criteria.buildingTypes.includes(type)}
                    onCheckedChange={() =>
                      handleToggleCheckbox(
                        criteria.buildingTypes,
                        type,
                        (types) => updateCriteria({ buildingTypes: types })
                      )
                    }
                  />
                  <Label htmlFor={`building-${type}`} className="cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </FilterStep>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4"
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={clearCurrentStep}
            className="px-4"
          >
            {getClearMessage()}
          </Button>
        </div>

        <Button
          onClick={handleNext}
          className="btn-primary"
        >
          {currentStep < totalSteps ? "Next" : "Search Products"}
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;