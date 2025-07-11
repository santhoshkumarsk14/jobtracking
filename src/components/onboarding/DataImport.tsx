import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface DataImportProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const DataImport: React.FC<DataImportProps> = ({ data, updateData, onNext, onBack }) => {
  const [importMethod, setImportMethod] = useState<'manual' | 'csv' | 'skip'>('skip');
  const [csvData, setCsvData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleJobs = [
    {
      title: 'Office Building Foundation',
      jobType: 'Construction',
      location: 'Downtown District',
      totalRevenue: 85000,
      actualCosts: { labor: 35000, material: 25000, equipment: 15000, subcontractor: 5000 },
      notes: 'Completed on time with good profit margin',
      equipmentUsed: ['Excavator', 'Concrete Mixer'],
      materialsUsed: ['Concrete', 'Steel Rebar'],
      crew: 'Team Alpha',
      clientId: 'sample_client_1'
    },
    {
      title: 'Warehouse Renovation',
      jobType: 'Construction',
      location: 'Industrial Park',
      totalRevenue: 120000,
      actualCosts: { labor: 45000, material: 40000, equipment: 20000, subcontractor: 10000 },
      notes: 'Material costs higher than expected',
      equipmentUsed: ['Crane', 'Forklift'],
      materialsUsed: ['Steel Beams', 'Insulation'],
      crew: 'Team Beta',
      clientId: 'sample_client_2'
    },
    {
      title: 'Marine Equipment Installation',
      jobType: 'Marine',
      location: 'Port Authority',
      totalRevenue: 65000,
      actualCosts: { labor: 20000, material: 15000, equipment: 25000, subcontractor: 3000 },
      notes: 'Excellent margin, client satisfied',
      equipmentUsed: ['Marine Crane', 'Diving Equipment'],
      materialsUsed: ['Marine Grade Steel', 'Waterproof Coating'],
      crew: 'Marine Team',
      clientId: 'sample_client_3'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      let importedJobs = [];
      
      if (importMethod === 'manual') {
        importedJobs = sampleJobs;
      } else if (importMethod === 'csv' && csvData) {
        // In a real app, this would parse CSV data
        importedJobs = sampleJobs;
      }
      
      updateData({ importedJobs });
      setIsProcessing(false);
      onNext();
    }, 2000);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <Upload className="h-12 w-12 text-orange-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Import Past Jobs</h2>
        <p className="text-gray-600">Add historical data to get better insights from day one</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Import Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose Import Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="skip"
                checked={importMethod === 'skip'}
                onChange={(e) => setImportMethod(e.target.value as 'skip')}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Skip for now</div>
                <div className="text-sm text-gray-600">
                  Start fresh and add jobs as you complete them
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="manual"
                checked={importMethod === 'manual'}
                onChange={(e) => setImportMethod(e.target.value as 'manual')}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Use sample data</div>
                <div className="text-sm text-gray-600">
                  We'll add some sample jobs to help you explore the system
                </div>
              </div>
            </label>

            <label className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="csv"
                checked={importMethod === 'csv'}
                onChange={(e) => setImportMethod(e.target.value as 'csv')}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Upload CSV file</div>
                <div className="text-sm text-gray-600">
                  Import your existing job data from a CSV file
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* CSV Upload Section */}
        {importMethod === 'csv' && (
          <div className="border rounded-md p-6 bg-gray-50">
            <h4 className="font-medium mb-4">Upload CSV File</h4>
            <div className="mb-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Expected CSV columns:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Job Title, Job Type, Location, Total Revenue</li>
                <li>Labor Cost, Material Cost, Equipment Cost, Subcontractor Cost</li>
                <li>Notes (optional)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        {importMethod === 'manual' && (
          <div className="border rounded-md p-6 bg-gray-50">
            <h4 className="font-medium mb-4">Sample Jobs Preview</h4>
            <div className="space-y-3">
              {sampleJobs.map((job, index) => (
                <div key={index} className="bg-white p-4 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{job.title}</h5>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Location: {job.location}</p>
                    <p>Revenue: ${job.totalRevenue.toLocaleString()}</p>
                    <p>Total Costs: ${Object.values(job.actualCosts).reduce((a, b) => a + b, 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            disabled={isProcessing}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Setup
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataImport;