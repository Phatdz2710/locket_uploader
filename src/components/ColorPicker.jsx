import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';

// Convert hex8 (with format #RRGGBBAA) to rgba object
const hex8ToRgba = (hex) => {
  // Ensure input is a string and has correct format #RRGGBBAA
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 9) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;
    
    // Validate values
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
      return { r: 0, g: 0, b: 0, a: 1 };
    }
    
    return { 
      r: Math.min(255, Math.max(0, r)), 
      g: Math.min(255, Math.max(0, g)), 
      b: Math.min(255, Math.max(0, b)), 
      a: Math.min(1, Math.max(0, a))
    };
  } catch (error) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
};

// Convert rgba object to hex8 (with format #RRGGBBAA)
const rgbaToHex8 = ({ r, g, b, a }) => {
  // Ensure values are valid numbers
  const red = Math.min(255, Math.max(0, Math.round(r || 0)));
  const green = Math.min(255, Math.max(0, Math.round(g || 0)));
  const blue = Math.min(255, Math.max(0, Math.round(b || 0)));
  const alpha = Math.min(1, Math.max(0, a ?? 1));
  
  // Convert to hex with proper padding
  const toHex = (c) => c.toString(16).padStart(2, '0');
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}${alphaHex}`.toUpperCase();
};

const ColorPicker = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Ensure color is always a valid hex8 format
  const safeColor = (color && typeof color === 'string' && color.startsWith('#') && color.length === 9) 
    ? color 
    : '#000000FF';
  
  // Parse hex8 input to rgba object for SketchPicker
  const rgbaColor = hex8ToRgba(safeColor);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const handleColorChange = (updated) => {
    if (updated && updated.rgb) {
      const hex8 = rgbaToHex8(updated.rgb);
      onChange(hex8);
    }
  };

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <div
        className="h-7 w-10 rounded-md cursor-pointer border border-white/20"
        style={{ backgroundColor: safeColor }}
        onClick={() => setShowPicker(!showPicker)}
      />

      {showPicker && (
        <div className="absolute z-50 bottom-10 -left-10">
          <SketchPicker
            color={rgbaColor}
            onChange={handleColorChange}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;