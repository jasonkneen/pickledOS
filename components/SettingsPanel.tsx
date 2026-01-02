
import React from 'react';
import { X, Sliders } from 'lucide-react';

export interface VisualSettings {
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  // Post Processing
  bloomIntensity: number;
  bloomRadius: number;
  bloomThreshold: number;
  // Color Correction
  contrast: number;
  brightness: number;
  saturation: number;
  // Material
  glassOpacity: number;
  glassRoughness: number;
  glassTransmission: number;
  glassThickness: number;
  // Scene
  particleOpacity: number;
  connectionOpacity: number;
}

export const DEFAULT_SETTINGS: VisualSettings = {
  // LIGHTING
  ambientLightIntensity: 0.10,
  directionalLightIntensity: 0.05,
  
  // COLOR & BLOOM
  bloomIntensity: 0.30,
  bloomRadius: 0.10,
  bloomThreshold: 2.00,

  contrast: 0.00,    
  brightness: 0.00,
  saturation: 0.50,

  // GLASS MATERIAL
  glassOpacity: 0.75,
  glassRoughness: 0.25,
  glassTransmission: 0.86,
  glassThickness: 0.60,

  // SCENE
  particleOpacity: 0.10,
  connectionOpacity: 0.10,
};

interface SettingsPanelProps {
  settings: VisualSettings;
  onUpdate: (newSettings: VisualSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose }) => {
  const handleChange = (key: keyof VisualSettings, value: number) => {
    onUpdate({ ...settings, [key]: value });
  };

  const Slider = ({ label, value, min, max, step, settingKey }: { label: string, value: number, min: number, max: number, step: number, settingKey: keyof VisualSettings }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(settingKey, parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );

  return (
    <div className="w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col h-full max-h-[80vh]">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-2 font-semibold text-gray-800">
          <Sliders size={18} />
          <span>Visual Settings</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors text-gray-500">
          <X size={18} />
        </button>
      </div>
      
      <div className="p-5 overflow-y-auto flex-1 scrollbar-hide">
        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lighting</h3>
          <Slider label="Ambient Intensity" settingKey="ambientLightIntensity" value={settings.ambientLightIntensity} min={0} max={2} step={0.05} />
          <Slider label="Directional Intensity" settingKey="directionalLightIntensity" value={settings.directionalLightIntensity} min={0} max={3} step={0.05} />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Color & Bloom</h3>
          <Slider label="Bloom Intensity" settingKey="bloomIntensity" value={settings.bloomIntensity} min={0} max={3} step={0.1} />
          <Slider label="Bloom Radius" settingKey="bloomRadius" value={settings.bloomRadius} min={0} max={1.5} step={0.1} />
          <Slider label="Bloom Threshold" settingKey="bloomThreshold" value={settings.bloomThreshold} min={0} max={2} step={0.1} />
          <div className="h-px bg-gray-100 my-4"></div>
          <Slider label="Contrast" settingKey="contrast" value={settings.contrast} min={-1} max={1} step={0.05} />
          <Slider label="Brightness" settingKey="brightness" value={settings.brightness} min={-1} max={1} step={0.05} />
          <Slider label="Saturation" settingKey="saturation" value={settings.saturation} min={-1} max={1} step={0.05} />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Glass Material</h3>
          <Slider label="Opacity" settingKey="glassOpacity" value={settings.glassOpacity} min={0} max={1} step={0.05} />
          <Slider label="Roughness" settingKey="glassRoughness" value={settings.glassRoughness} min={0} max={1} step={0.05} />
          <Slider label="Transmission" settingKey="glassTransmission" value={settings.glassTransmission} min={0} max={1} step={0.01} />
          <Slider label="Thickness" settingKey="glassThickness" value={settings.glassThickness} min={0} max={3} step={0.1} />
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Scene</h3>
          <Slider label="Particle Opacity" settingKey="particleOpacity" value={settings.particleOpacity} min={0} max={1} step={0.05} />
          <Slider label="Connection Opacity" settingKey="connectionOpacity" value={settings.connectionOpacity} min={0} max={1} step={0.05} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
            onClick={() => onUpdate(DEFAULT_SETTINGS)}
            className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg hover:bg-white"
        >
            Reset to Default
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
