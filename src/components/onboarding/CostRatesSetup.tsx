import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface CostRatesSetupProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const CostRatesSetup: React.FC<CostRatesSetupProps> = ({ data, updateData, onNext, onBack }) => {
  const [laborRoles, setLaborRoles] = useState(data.laborRoles.length > 0 ? data.laborRoles : [
    { name: 'Foreman', hourlyRate: 35 },
    { name: 'Skilled Worker', hourlyRate: 25 },
    { name: 'General Laborer', hourlyRate: 18 }
  ]);

  const [materials, setMaterials] = useState(data.materials.length > 0 ? data.materials : [
    { name: 'Concrete', unit: 'cubic meter', costPerUnit: 150, code: 'CON001' },
    { name: 'Steel Rebar', unit: 'kg', costPerUnit: 2.5, code: 'STL001' },
    { name: 'Cement', unit: 'bag', costPerUnit: 12, code: 'CEM001' }
  ]);

  const [equipment, setEquipment] = useState(data.equipment.length > 0 ? data.equipment : [
    { name: 'Excavator', dailyRate: 450, usageFrequency: 'High' },
    { name: 'Crane', dailyRate: 650, usageFrequency: 'Medium' },
    { name: 'Concrete Mixer', dailyRate: 180, usageFrequency: 'High' }
  ]);

  const addLaborRole = () => {
    setLaborRoles([...laborRoles, { name: '', hourlyRate: 0 }]);
  };

  const updateLaborRole = (index: number, field: string, value: string | number) => {
    const updated = [...laborRoles];
    updated[index] = { ...updated[index], [field]: value };
    setLaborRoles(updated);
  };

  const removeLaborRole = (index: number) => {
    setLaborRoles(laborRoles.filter((_, i) => i !== index));
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: '', unit: '', costPerUnit: 0, code: '' }]);
  };

  const updateMaterial = (index: number, field: string, value: string | number) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const addEquipment = () => {
    setEquipment([...equipment, { name: '', dailyRate: 0, usageFrequency: 'Medium' }]);
  };

  const updateEquipment = (index: number, field: string, value: string | number) => {
    const updated = [...equipment];
    updated[index] = { ...updated[index], [field]: value };
    setEquipment(updated);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ laborRoles, materials, equipment });
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Cost Rates Setup</h2>
        <p className="text-gray-600">Configure your default rates for accurate quoting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Labor Roles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Labor Roles</h3>
            <button
              type="button"
              onClick={addLaborRole}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </button>
          </div>
          <div className="space-y-3">
            {laborRoles.map((role, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Role name"
                  value={role.name}
                  onChange={(e) => updateLaborRole(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Hourly rate"
                  value={role.hourlyRate}
                  onChange={(e) => updateLaborRole(index, 'hourlyRate', Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeLaborRole(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Materials</h3>
            <button
              type="button"
              onClick={addMaterial}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </button>
          </div>
          <div className="space-y-3">
            {materials.map((material, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Material name"
                  value={material.name}
                  onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={material.unit}
                  onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Cost per unit"
                  value={material.costPerUnit}
                  onChange={(e) => updateMaterial(index, 'costPerUnit', Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Code"
                  value={material.code}
                  onChange={(e) => updateMaterial(index, 'code', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Equipment</h3>
            <button
              type="button"
              onClick={addEquipment}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </button>
          </div>
          <div className="space-y-3">
            {equipment.map((equip, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Equipment name"
                  value={equip.name}
                  onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Daily rate"
                  value={equip.dailyRate}
                  onChange={(e) => updateEquipment(index, 'dailyRate', Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={equip.usageFrequency}
                  onChange={(e) => updateEquipment(index, 'usageFrequency', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeEquipment(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default CostRatesSetup;