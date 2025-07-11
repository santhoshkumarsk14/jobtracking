import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { Building2, Upload } from 'lucide-react';

interface CompanySetupProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ data, updateData, onNext }) => {
  const [formData, setFormData] = useState({
    name: data.company.name || '',
    industry: data.company.industry || 'Construction',
    size: data.company.size || '1-10',
    country: data.company.country || '',
    currency: data.company.currency || 'USD',
    defaultOverheadMarkup: data.company.defaultOverheadMarkup || 15
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ company: formData });
    onNext();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
        <p className="text-gray-600">Tell us about your company</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter company name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              required
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Marine">Marine</option>
              <option value="Construction">Construction</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size *
            </label>
            <select
              required
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="50+">50+ employees</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              required
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select country</option>
              <option value="Singapore">Singapore</option>
              <option value="Malaysia">Malaysia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              required
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="SGD">SGD (S$)</option>
              <option value="MYR">MYR (RM)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Overhead Markup (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.defaultOverheadMarkup}
            onChange={(e) => handleInputChange('defaultOverheadMarkup', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="15"
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be applied to all quotes by default (you can adjust per quote)
          </p>
        </div>

        <div className="flex justify-end pt-6">
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

export default CompanySetup;