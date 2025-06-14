
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface StressLevelSliderProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const StressLevelSlider = ({ value, onChange }: StressLevelSliderProps) => {
  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        Stress Level: <span className={`font-bold ${getStressColor(value[0])}`}>{value[0]}/10</span>
      </Label>
      <div className="mt-2">
        <Slider
          value={value}
          onValueChange={onChange}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Very Low</span>
        <span>Moderate</span>
        <span>Very High</span>
      </div>
    </div>
  );
};

export default StressLevelSlider;
