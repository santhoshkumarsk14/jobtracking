import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X, AlertTriangle, Lightbulb, DollarSign } from 'lucide-react';

interface QuoteFormProps {
  onClose: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onClose }) => {
  const { addQuote, jobs, laborRoles, materials, equipment } = useData();
  const { company } = useAuth();
  const [formData, setFormData] = useState({
    clientName: '',
    jobType: 'Construction' as 'Marine' | 'Construction' | 'Logistics',
    description: '',
    laborCosts: 0,
    materialCosts: 0,
    equipmentCosts: 0,
    overheadMarkup: company?.defaultOverheadMarkup || 15,
    customMarkup: 0
  });

  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  const [showSimilarJobs, setShowSimilarJobs] = useState(false);

  const totalCosts = formData.laborCosts + formData.materialCosts + formData.equipmentCosts;
  const markupAmount = (totalCosts * formData.overheadMarkup) / 100;
  const quotedPrice = totalCosts + markupAmount + formData.customMarkup;
  const margin = quotedPrice > 0 ? ((quotedPrice - totalCosts) / quotedPrice) * 100 : 0;
  const isMarginAlert = margin < 10;

  useEffect(() => {
    // Find similar jobs based on job type and description keywords
    if (formData.jobType && formData.description) {
      const keywords = formData.description.toLowerCase().split(' ').filter(word => word.length > 3);
      const similar = jobs.filter(job => {
        const matchesType = job.jobType === formData.jobType;
        const matchesDescription = keywords.some(keyword => 
          job.title.toLowerCase().includes(keyword) || 
          job.notes?.toLowerCase().includes(keyword)
        );
        return matchesType && matchesDescription;
      }).slice(0, 3);
      
      setSimilarJobs(similar);
      setShowSimilarJobs(similar.length > 0);
    }
  }, [formData.jobType, formData.description, jobs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quoteData = {
      ...formData,
      totalCosts,
      quotedPrice,
      margin,
      isMarginAlert
    };

    addQuote(quoteData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applySimilarJobCosts = (job: any) => {
    setFormData(prev => ({
      ...prev,
      laborCosts: job.actualCosts.labor,
      materialCosts: job.actualCosts.material,
      equipmentCosts: job.actualCosts.equipment
    }));
    setShowSimilarJobs(false);
  };

  const getQuickEstimate = () => {
    // Quick estimate based on job type averages
    const typeJobs = jobs.filter(job => job.jobType === formData.jobType);
    if (typeJobs.length > 0) {
      const avgLabor = typeJobs.reduce((sum, job) => sum + job.actualCosts.labor, 0) / typeJobs.length;
      const avgMaterial = typeJobs.reduce((sum, job) => sum + job.actualCosts.material, 0) / typeJobs.length;
      const avgEquipment = typeJobs.reduce((sum, job) => sum + job.actualCosts.equipment, 0) / typeJobs.length;
      
      setFormData(prev => ({
        ...prev,
        laborCosts: Math.round(avgLabor),
        materialCosts: Math.round(avgMaterial),
        equipmentCosts: Math.round(avgEquipment)
      }));
    } else {
      // If no past jobs, use some reasonable defaults based on job type
      let defaultLabor = 5000;
      let defaultMaterial = 3000;
      let defaultEquipment = 2000;
      
      switch (formData.jobType) {
        case 'Marine':
          defaultLabor = 8000;
          defaultMaterial = 5000;
          defaultEquipment = 4000;
          break;
        case 'Construction':
          defaultLabor = 6000;
          defaultMaterial = 4000;
          defaultEquipment = 3000;
          break;
        case 'Logistics':
          defaultLabor = 4000;
          defaultMaterial = 2000;
          defaultEquipment = 1500;
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        laborCosts: defaultLabor,
        materialCosts: defaultMaterial,
        equipmentCosts: defaultEquipment
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Quote</h2>
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
                Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter client name"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the job requirements..."
            />
          </div>

          {/* Similar Jobs Suggestions */}
          {showSimilarJobs && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">Similar Jobs Found</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Based on your job type and description, here are similar jobs you can use as reference:
                  </p>
                  <div className="space-y-2">
                    {similarJobs.map((job) => (
                      <div key={job.id} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{job.title}</h5>
                          <span className="text-sm text-gray-500">
                            {job.margin.toFixed(1)}% margin
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Labor: {company?.currency}{job.actualCosts.labor.toLocaleString()} • 
                          Material: {company?.currency}{job.actualCosts.material.toLocaleString()} • 
                          Equipment: {company?.currency}{job.actualCosts.equipment.toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => applySimilarJobCosts(job)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Use these costs as estimate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Estimate */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={getQuickEstimate}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {jobs.length > 0 ? 'Get Quick Estimate from Past Jobs' : 'Use Default Estimates'}
            </button>
          </div>

          {/* Cost Inputs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Estimates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labor Cost
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.laborCosts}
                  onChange={(e) => handleInputChange('laborCosts', Number(e.target.value))}
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
                  value={formData.materialCosts}
                  onChange={(e) => handleInputChange('materialCosts', Number(e.target.value))}
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
                  value={formData.equipmentCosts}
                  onChange={(e) => handleInputChange('equipmentCosts', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Markup and Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overhead Markup (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overheadMarkup}
                  onChange={(e) => handleInputChange('overheadMarkup', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Markup
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.customMarkup}
                  onChange={(e) => handleInputChange('customMarkup', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Quote Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Costs:</span>
                <span className="font-medium">{company?.currency} {totalCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overhead ({formData.overheadMarkup}%):</span>
                <span className="font-medium">{company?.currency} {markupAmount.toLocaleString()}</span>
              </div>
              {formData.customMarkup > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Markup:</span>
                  <span className="font-medium">{company?.currency} {formData.customMarkup.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Quoted Price:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {company?.currency} {quotedPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Margin:</span>
                  <span className={`font-medium ${margin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                    {margin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Margin Alert */}
            {isMarginAlert && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700 font-medium">Low Margin Warning</span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  This quote has a margin of {margin.toFixed(1)}%, which is below the recommended 10% threshold.
                  Consider increasing the quoted price or reducing costs.
                </p>
              </div>
            )}
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
              Create Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;