import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onBack }) => {
  const { jobs, clients } = useData();
  const { company } = useAuth();
  
  const job = jobs.find(j => j.id === jobId);
  const client = job ? clients.find(c => c.id === job.clientId) : null;

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700"
        >
          Go back to jobs list
        </button>
      </div>
    );
  }

  const totalCosts = Object.values(job.actualCosts).reduce((sum, cost) => sum + cost, 0);
  const profit = job.totalRevenue - totalCosts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
        <div className="flex items-center space-x-4">
          {job.isRedFlag ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Red Flag Job
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              Profitable
            </span>
          )}
        </div>
      </div>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(job.dateCompleted).toLocaleDateString()}
              </div>
              {job.crew && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job.crew}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {job.jobType}
            </span>
          </div>
        </div>

        {client && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Client</h3>
            <p className="text-gray-900">{client.name}</p>
            {client.email && (
              <p className="text-gray-600 text-sm">{client.email}</p>
            )}
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {company?.currency} {job.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Costs</p>
              <p className="text-2xl font-bold text-gray-900">
                {company?.currency} {totalCosts.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {company?.currency} {profit.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${profit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <TrendingUp className={`h-6 w-6 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Margin</p>
              <p className={`text-2xl font-bold ${job.margin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                {job.margin.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${job.margin >= 10 ? 'bg-green-100' : 'bg-red-100'}`}>
              {job.margin >= 10 ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Labor</span>
              <span className="font-medium">
                {company?.currency} {job.actualCosts.labor.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Materials</span>
              <span className="font-medium">
                {company?.currency} {job.actualCosts.material.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equipment</span>
              <span className="font-medium">
                {company?.currency} {job.actualCosts.equipment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subcontractor</span>
              <span className="font-medium">
                {company?.currency} {job.actualCosts.subcontractor.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Costs</span>
                <span>{company?.currency} {totalCosts.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources Used</h3>
          
          {job.equipmentUsed.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {job.equipmentUsed.map((equipment, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {equipment}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.materialsUsed.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Materials</h4>
              <div className="flex flex-wrap gap-2">
                {job.materialsUsed.map((material, index) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
              <p className="text-gray-600 text-sm">{job.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Profitability Analysis */}
      {job.isRedFlag && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Low Profitability Alert</h3>
              <p className="text-red-700 mb-4">
                This job has a margin of {job.margin.toFixed(1)}%, which is below the 10% threshold for profitable jobs.
              </p>
              <div className="space-y-2 text-sm text-red-600">
                <p><strong>Recommendations:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Review cost estimation accuracy for similar future jobs</li>
                  <li>Analyze if material costs were higher than expected</li>
                  <li>Consider if labor efficiency can be improved</li>
                  <li>Evaluate client pricing discussions for future projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;