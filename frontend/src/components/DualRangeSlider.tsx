import React, { useCallback, useEffect, useState, useRef } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (values: [number, number]) => void;
  step?: number;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 100,
}) => {
  const [minVal, setMinVal] = useState<number>(value[0]);
  const [maxVal, setMaxVal] = useState<number>(value[1]);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external props change
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => {
      if (max <= min) return 0;
      return Math.round(((val - min) / (max - min)) * 100);
    },
    [min, max]
  );

  // Adjust active track position and width
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${Math.max(0, maxPercent - minPercent)}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (rangeRef.current) {
      rangeRef.current.style.width = `${Math.max(0, maxPercent - minPercent)}%`;
    }
  }, [maxVal, getPercent]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(val);
    minValRef.current = val;
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(val);
    maxValRef.current = val;
    onChange([minVal, val]);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Values Display */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-400 font-medium">Min Price</span>
          <span className="px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] rounded-md font-bold text-[#007BA7] text-xs sm:text-sm tabular-nums">
            ₹{Math.round(minVal).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-[1px] w-4 bg-[#2A2A2A] self-end mb-3" />
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-gray-400 font-medium">Max Price</span>
          <span className="px-2.5 py-1 bg-[#141414] border border-[#2A2A2A] rounded-md font-bold text-[#FF2E63] text-xs sm:text-sm tabular-nums">
            ₹{Math.round(maxVal).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative w-full h-8 flex items-center">
        {/* Background Grey Track */}
        <div className="absolute w-full h-2 bg-[#222222] rounded-full" />

        {/* Selected Highlight Track (Cerulean to Neon Rose gradient) */}
        <div
          ref={rangeRef}
          className="absolute h-2 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2E63] shadow-[0_0_8px_rgba(0,123,167,0.5)]"
        />

        {/* Min Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="range-slider-thumb z-30"
          aria-label="Minimum price boundary"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="range-slider-thumb z-40"
          aria-label="Maximum price boundary"
        />
      </div>

      {/* Range limits hint */}
      <div className="flex justify-between text-[11px] text-gray-500 font-mono">
        <span>₹{Math.round(min).toLocaleString('en-IN')}</span>
        <span>₹{Math.round(max).toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};
