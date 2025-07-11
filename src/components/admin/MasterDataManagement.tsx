import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Package, Plus, Edit, Trash2, DollarSign, Wrench, Users, Building } from 'lucide-react';

const MasterDataManagement: React.FC = () => {
  const { 
    laborRoles, 
    materials, 
    equipment, 
    clients,
    addLaborRole, 
    addMaterial, 
    addEquipment, 
    addClient 
  } = useData();
  
  const [activeTab, setActiveTab] = useState('labor');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const tabs = [
    { id: 'labor', label: 'Labor Roles', icon: Users, data: laborRoles },
    { id: 'materials', label: 'Materials', icon: Package, data: materials },
    { id: 'equipment', label: 'Equipment', icon: Wrench, data: equipment },
    { id: 'clients', label: 'Clients', icon: Building, data: clients },
  ];

  const handleAddItem = () => {
    switch (activeTab) {
      case 'labor':
        addLaborRole(formData);
        break;
      case 'materials':
        addMaterial(formData);
        break;
      case 'equipment':
        addEquipment(formData);
        break;
      case 'clients':
        addClient(formData);
        break;
    }
    setFormData({});
    setShowForm(false);
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'labor':
        return [
          { key: 'name', label: 'Role Name', type: 'text', required: true },
          { key: 'hourlyRate', label: 'Hourly Rate', type: 'number', required: true },
        ];
      case 'materials':
        return [
          { key: 'name', label: 'Material Name', type: 'text', required: true },
          { key: 'unit', label: 'Unit', type: 'text', required: true },
          { key: 'costPerUnit', label: 'Cost per Unit', type: 'number', required: true },
          { key: 'code', label: 'Material Code', type: 'text', required: true },
        ];
      case 'equipment':
        return [
          { key: 'name', label: 'Equipment Name', type: 'text', required: true },
          { key: 'dailyRate', label: 'Daily Rate', type: 'number', required: true },
          { key: 'usageFrequency', label: 'Usage Frequency', type: 'select', options: ['High', 'Medium', 'Low'], required: true },
        ];
      case 'clients':
        return [
          { key: 'name', label: 'Client Name', type: 'text', required: true },
          { key: 'email', label: 'Email', type: 'email', required: false },
          { key: 'phone', label: 'Phone', type: 'tel', required: false },
        ];
      default:
        return [];
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'labor':
        return ['Role Name', 'Hourly Rate'];
      case 'materials':
        return ['Material Name', 'Unit', 'Cost per Unit', 'Code'];
      case 'equipment':
        return ['Equipment Name', 'Daily Rate', 'Usage Frequency'];
      case 'clients':
        return ['Client Name', 'Email', 'Phone'];
      default:
        return [];
    }
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'labor':
        return [item.name, `$${item.hourlyRate}/hr`];
      case 'materials':
        return [item.name, item.unit, `$${item.costPerUnit}`, item.code];
      case 'equipment':
        return [item.name, `$${item.dailyRate}/day`, item.usageFrequency];
      case 'clients':
        return [item.name, item.email || '-', item.phone || '-'];
      default:
        return [];
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Master Data Management</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {currentTab?.label.slice(0, -1)}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.data.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentTab?.label} ({currentTab?.data.length || 0})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {renderTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTab?.data.map((item: any, index: number) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {renderTableRow(item).map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentTab?.data.length === 0 && (
          <div className="text-center py-12">
            <currentTab.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {currentTab.label.toLowerCase()} added yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first {currentTab.label.toLowerCase().slice(0, -1)}.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {currentTab.label.slice(0, -1)}
            </button>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add {currentTab?.label.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="space-y-4">
              {getFormFields().map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add {currentTab?.label.slice(0, -1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDataManagement;