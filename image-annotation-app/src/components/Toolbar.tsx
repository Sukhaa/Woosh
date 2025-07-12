import React, { useEffect, useState } from 'react';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import Crop75Icon from '@mui/icons-material/Crop75';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import UndoIcon from '@mui/icons-material/Undo';
import BackspaceIcon from '@mui/icons-material/Backspace';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ImageIcon from '@mui/icons-material/Image';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';

export type ToolType = 'pointer' | 'rectangle' | 'circle' | 'solid-circle';

interface ToolbarProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  color: string;
  onColorChange: (color: string) => void;
  connectorStyle: 'solid' | 'dashed' | 'dotted';
  onConnectorStyleChange: (style: 'solid' | 'dashed' | 'dotted') => void;
  connectorColor: string;
  onConnectorColorChange: (color: string) => void;
  connectorThickness: number;
  onConnectorThicknessChange: (thickness: number) => void;
  onUndo: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onClearImage: () => void;
  className?: string;
}

const tools: { type: ToolType; label: string; icon: React.ReactNode; shortcut: string; description: string }[] = [
  {
    type: 'pointer',
    label: 'Select & Move',
    icon: <NorthEastIcon fontSize="medium" />,
    shortcut: 'V',
    description: 'Select and move shapes and labels'
  },
  {
    type: 'rectangle',
    label: 'Rectangle',
    icon: <Crop75Icon fontSize="medium" />,
    shortcut: 'R',
    description: 'Draw rectangular annotations'
  },
  {
    type: 'circle',
    label: 'Circle',
    icon: <RadioButtonUncheckedIcon fontSize="medium" />,
    shortcut: 'C',
    description: 'Draw circular annotations'
  },
  {
    type: 'solid-circle',
    label: 'Dot',
    icon: <FiberManualRecordIcon fontSize="medium" />,
    shortcut: 'S',
    description: 'Draw solid circular dots'
  },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onSelectTool,
  color,
  onColorChange,
  connectorStyle,
  onConnectorStyleChange,
  connectorColor,
  onConnectorColorChange,
  connectorThickness,
  onConnectorThicknessChange,
  onUndo,
  onClearAll,
  onExport,
  onClearImage,
  className,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        onUndo();
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        onClearAll();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExport();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        onClearImage();
      } else if (e.key.toLowerCase() === 'v') {
        onSelectTool('pointer');
      } else if (e.key.toLowerCase() === 'r') {
        onSelectTool('rectangle');
      } else if (e.key.toLowerCase() === 'c') {
        onSelectTool('circle');
      } else if (e.key.toLowerCase() === 's') {
        onSelectTool('solid-circle');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTool, onUndo, onClearAll, onExport, onClearImage]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${className || ''}`}
      style={{ bottom: 32, top: 'auto', paddingBottom: 0 }}
    >
      <div
        className="flex items-center justify-between bg-white/80 backdrop-blur-2xl rounded-full px-10 py-5 mt-0 mb-0 pointer-events-auto shadow-2xl max-w-4xl min-w-[650px] mx-auto border-0"
        style={{ 
          boxShadow: '0 8px 32px 0 rgba(60,60,100,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.06)',
          background: 'linear-gradient(120deg, rgba(255,255,255,0.85) 0%, rgba(240,245,255,0.85) 100%)',
          border: 'none',
        }}
      >
        {/* Tools Section */}
        <div className="flex items-center space-x-12" aria-label="Drawing tools">
          {/* Shape Tools */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-6">
              {tools.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => onSelectTool(tool.type)}
                  className={`group relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 toolbar-button
                    ${selectedTool === tool.type 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-110 active-tool-indicator' 
                      : 'bg-white/80 text-gray-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-105'
                    }`}
                  title={`${tool.label} (${tool.shortcut}) - ${tool.description}`}
                  aria-label={`${tool.label} (${tool.shortcut})`}
                  tabIndex={0}
                >
                  <span className="sr-only">{tool.label}</span>
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {tool.icon}
                  </div>
                  {/* Active indicator */}
                  {selectedTool === tool.type && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full active-tool-indicator"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="flex flex-col items-center">
            <div className="relative group color-picker-wrapper">
              <label htmlFor="unified-color-picker" className="block">
                <div className="w-12 h-12 rounded-full bg-white/80 transition-all duration-200 cursor-pointer flex items-center justify-center group-hover:scale-105">
                  <PaletteIcon className="text-gray-600 group-hover:text-blue-600" />
                </div>
              </label>
              <input
                id="unified-color-picker"
                type="color"
                value={color}
                onChange={e => {
                  onColorChange(e.target.value);
                  onConnectorColorChange(e.target.value);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Choose color for shapes and connectors"
              />
              {/* Color preview */}
              <div 
                className="absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              ></div>
            </div>
          </div>

          {/* Connector Settings */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-12 h-12 rounded-full bg-white/80 transition-all duration-200 flex items-center justify-center group-hover:scale-105 toolbar-button"
                  title="Connector settings"
                >
                  <SettingsIcon className="text-gray-600 group-hover:text-blue-600" />
                </button>
                
                {/* Advanced Options Dropdown */}
                {showAdvancedOptions && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white/95 rounded-2xl shadow-lg border border-gray-200 p-6 min-w-[180px] max-w-[220px] toolbar-dropdown">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Style</label>
                        <select
                          value={connectorStyle}
                          onChange={e => onConnectorStyleChange(e.target.value as 'solid' | 'dashed' | 'dotted')}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Thickness: {connectorThickness}px</label>
                        <input
                          type="range"
                          min={1}
                          max={8}
                          value={connectorThickness}
                          onChange={e => onConnectorThicknessChange(Number(e.target.value))}
                          className="w-full slider"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Style Preview */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 rounded-full">
                <div className="flex items-center space-x-1">
                  <LinearScaleIcon fontSize="small" className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{connectorStyle}</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-400 rounded" style={{ 
                  borderTopStyle: connectorStyle === 'dashed' ? 'dashed' : connectorStyle === 'dotted' ? 'dotted' : 'solid',
                  borderTopWidth: connectorThickness
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center mx-8">
          <div className="h-16 w-1 rounded-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 opacity-60"></div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-10" aria-label="Actions">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={onUndo}
                className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:scale-110 toolbar-button"
                title="Undo last action (Ctrl+Z)"
                aria-label="Undo (Ctrl+Z)"
                tabIndex={0}
              >
                <UndoIcon className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Undo</span>
              </button>
              
              <button
                onClick={onClearAll}
                className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 hover:scale-110 toolbar-button"
                title="Clear all annotations (Ctrl+Shift+X)"
                aria-label="Clear All (Ctrl+Shift+X)"
                tabIndex={0}
              >
                <BackspaceIcon className="text-red-600 group-hover:text-red-700 transition-colors" />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Clear</span>
              </button>
              
              <button
                onClick={onClearImage}
                className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-white/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 hover:scale-110 toolbar-button"
                title="Clear current image (Ctrl+I)"
                aria-label="Clear Image (Ctrl+I)"
                tabIndex={0}
              >
                <ImageIcon className="text-orange-600 group-hover:text-orange-700 transition-colors" />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Image</span>
              </button>
              
              <button
                onClick={onExport}
                className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 hover:scale-110 toolbar-button"
                title="Export annotated image (Ctrl+E)"
                aria-label="Export (Ctrl+E)"
                tabIndex={0}
              >
                <FileDownloadIcon className="transition-transform group-hover:scale-110" />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Export</span>
              </button>
            </div>
          </div>
        </div>
       
        {/* Click outside to close advanced options */}
        {showAdvancedOptions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAdvancedOptions(false)}
          />
        )}
      </div>
    </div>
  );
}; 