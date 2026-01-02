
import React from 'react';
import { X, Sliders } from 'lucide-react';

export interface VisualSettings {
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  bloomIntensity: number;
  bloomRadius: number;
  bloomThreshold: number;
  glassOpacity: number;
  glassRoughness: number;
  glassTransmission: number;
  glassThickness: number;
  particleOpacity: number;
  connectionOpacity: number;
}

export const DEFAULT_SETTINGS: VisualSettings = {
  ambientLightIntensity: 0.8,
  directionalLightIntensity: 1.5,
  bloomIntensity: 1.5,
  bloomRadius: 0.4,
  bloomThreshold: 1.1,
  glassOpacity: 0.3,
  glassRoughness: 0.05,
  glassTransmission: 0.98,
  glassThickness: 0.5,
  particleOpacity: 0.5,
  connectionOpacity: 0.2,
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
    <div className="w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col h-full max-h-[70vh]">
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
          <Slider label="Ambient Intensity" settingKey="ambientLightIntensity" value={settings.ambientLightIntensity} min={0} max={3} step={0.1} />
          <Slider label="Directional Intensity" settingKey="directionalLightIntensity" value={settings.directionalLightIntensity} min={0} max={5} step={0.1} />
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Post Processing</h3>
          <Slider label="Bloom Intensity" settingKey="bloomIntensity" value={settings.bloomIntensity} min={0} max={4} step={0.1} />
          <Slider label="Bloom Radius" settingKey="bloomRadius" value={settings.bloomRadius} min={0} max={1.5} step={0.1} />
          <Slider label="Bloom Threshold" settingKey="bloomThreshold" value={settings.bloomThreshold} min={0} max={2} step={0.1} />
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
          <Slider label="Particle Opacity" settingKey="particleOpacity" value={settings.particleOpacity} min={0} max={1} step={0.1} />
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
