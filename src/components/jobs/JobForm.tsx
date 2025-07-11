import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Plus, Trash2, Upload } from 'lucide-react';

interface JobFormProps {
  onClose: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onClose }) => {
  const { addJob, addClient, clients, equipment, materials } = useData();
  const [formData, setFormData] = useState({
    title: '',
    jobType: 'Construction' as 'Marine' | 'Construction' | 'Logistics',
    location: '',
    clientId: '',
    newClientName: '',
    crew: '',
    equipmentUsed: [] as string[],
    materialsUsed: [] as string[],
    totalRevenue: 0,
    actualCosts: {
      labor: 0,
      material: 0,
      equipment: 0,
      subcontractor: 0
    },
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let clientId = formData.clientId;
    
    // Add new client if needed
    if (!clientId && formData.newClientName) {
      const newClient = {
        name: formData.newClientName
      };
      addClient(newClient);
      // In a real app, we'd get the ID back from the addClient function
      clientId = `client_${Date.now()}`;
    }

    const jobData = {
      ...formData,
      clientId,
      equipmentUsed: formData.equipmentUsed.filter(e => e),
      materialsUsed: formData.materialsUsed.filter(m => m),
      dateCompleted: new Date().toISOString()
    };

    addJob(jobData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCostChange = (costType: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      actualCosts: {
        ...prev.actualCosts,
        [costType]: value
      }
    }));
  };

  const addEquipmentField = () => {
    setFormData(prev => ({
      ...prev,
      equipmentUsed: [...prev.equipmentUsed, '']
    }));
  };

  const updateEquipment = (index: number, value: string) => {
    const updated = [...formData.equipmentUsed];
    updated[index] = value;
    setFormData(prev => ({ ...prev, equipmentUsed: updated }));
  };

  const removeEquipment = (index: number) => {
    const updated = formData.equipmentUsed.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, equipmentUsed: updated }));
  };

  const addMaterialField = () => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: [...prev.materialsUsed, '']
    }));
  };

  const updateMaterial = (index: number, value: string) => {
    const updated = [...formData.materialsUsed];
    updated[index] = value;
    setFormData(prev => ({ ...prev, materialsUsed: updated }));
  };

  const removeMaterial = (index: number) => {
    const updated = formData.materialsUsed.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, materialsUsed: updated }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Marine">Marine</option>
                <option value="Construction">Construction</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <div className="space-y-2">
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select existing client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or enter new client name"
                  value={formData.newClientName}
                  onChange={(e) => handleInputChange('newClientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crew/Team
              </label>
              <input
                type="text"
                value={formData.crew}
                onChange={(e) => handleInputChange('crew', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter crew or team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Revenue *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.totalRevenue}
                onChange={(e) => handleInputChange('totalRevenue', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Equipment Used */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Equipment Used
              </label>
              <button
                type="button"
                onClick={addEquipmentField}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </button>
            </div>
            <div className="space-y-2">
              {formData.equipmentUsed.map((equip, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <select
                    value={equip}
                    onChange={(e) => updateEquipment(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select equipment</option>
                    {equipment.map(e => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
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

          {/* Materials Used */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Materials Used
              </label>
              <button
                type="button"
                onClick={addMaterialField}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </button>
            </div>
            <div className="space-y-2">
              {formData.materialsUsed.map((material, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <select
                    value={material}
                    onChange={(e) => updateMaterial(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select material</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
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

          {/* Actual Costs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actual Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actualCosts.labor}
                  onChange={(e) => handleCostChange('labor', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actualCosts.material}
                  onChange={(e) => handleCostChange('material', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actualCosts.equipment}
                  onChange={(e) => handleCostChange('equipment', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcontractor Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.actualCosts.subcontractor}
                  onChange={(e) => handleCostChange('subcontractor', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes about this job..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;