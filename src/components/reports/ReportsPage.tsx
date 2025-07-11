import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ReportsPage: React.FC = () => {
  const { jobs, quotes, clients } = useData();
  const { company } = useAuth();
  const [dateRange, setDateRange] = useState('last30');
  const [reportType, setReportType] = useState('profitability');

  const generateProfitabilityReport = () => {
    const clientProfitability = clients.filter(client => {
      return jobs.some(job => job.clientId === client.id);
    }).map(client => {
      const clientJobs = jobs.filter(job => job.clientId === client.id);
      const totalRevenue = clientJobs.reduce((sum, job) => sum + job.totalRevenue, 0);
      const totalCosts = clientJobs.reduce((sum, job) => {
        return sum + Object.values(job.actualCosts).reduce((acc, cost) => acc + cost, 0);
      }, 0);
      const profit = totalRevenue - totalCosts;
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      return {
        client: client.name,
        jobCount: clientJobs.length,
        totalRevenue,
        totalCosts,
        profit,
        margin
      };
    });

    return clientProfitability.sort((a, b) => b.margin - a.margin);
  };

  const generateJobTypeReport = () => {
    const jobTypes = ['Marine', 'Construction', 'Logistics'];
    
    return jobTypes.map(type => {
      const typeJobs = jobs.filter(job => job.jobType === type);
      const totalRevenue = typeJobs.reduce((sum, job) => sum + job.totalRevenue, 0);
      const totalCosts = typeJobs.reduce((sum, job) => {
        return sum + Object.values(job.actualCosts).reduce((acc, cost) => acc + cost, 0);
      }, 0);
      const profit = totalRevenue - totalCosts;
      const avgMargin = typeJobs.length > 0 ? typeJobs.reduce((sum, job) => sum + job.margin, 0) / typeJobs.length : 0;

      return {
        type,
        jobCount: typeJobs.length,
        totalRevenue,
        totalCosts,
        profit,
        avgMargin
      };
    }).filter(item => item.jobCount > 0);
  };

  const generateMarginAnalysis = () => {
    const marginRanges = [
      { range: '< 0%', min: -Infinity, max: 0 },
      { range: '0-10%', min: 0, max: 10 },
      { range: '10-20%', min: 10, max: 20 },
      { range: '20-30%', min: 20, max: 30 },
      { range: '> 30%', min: 30, max: Infinity }
    ];

    return marginRanges.map(range => ({
      range: range.range,
      count: jobs.filter(job => job.margin >= range.min && job.margin < range.max).length
    })).filter(item => item.count > 0);
  };

  const exportReport = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvData = data.map(item => headers.map(header => item[header]));
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const renderReport = () => {
    switch (reportType) {
      case 'profitability':
        const profitabilityData = generateProfitabilityReport();
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Client Profitability Analysis</h3>
              <button
                onClick={() => exportReport(profitabilityData, 'client_profitability')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jobs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profitabilityData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.jobCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company?.currency} {item.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company?.currency} {item.totalCosts.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={item.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {company?.currency} {item.profit.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${item.margin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'jobtype':
        const jobTypeData = generateJobTypeReport();
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Job Type Performance</h3>
              <button
                onClick={() => exportReport(jobTypeData, 'job_type_performance')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue by Job Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${company?.currency} ${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="totalRevenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Average Margin by Job Type</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Avg Margin']} />
                    <Bar dataKey="avgMargin" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jobs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Costs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobTypeData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.jobCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company?.currency} {item.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company?.currency} {item.totalCosts.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={item.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {company?.currency} {item.profit.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${item.avgMargin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.avgMargin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'margin':
        const marginData = generateMarginAnalysis();
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Margin Distribution Analysis</h3>
              <button
                onClick={() => exportReport(marginData, 'margin_analysis')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Jobs by Margin Range</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Jobs']} />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profitable Jobs</p>
                    <p className="text-2xl font-bold text-green-600">
                      {jobs.filter(job => job.margin >= 10).length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Margin Jobs</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {jobs.filter(job => job.margin >= 0 && job.margin < 10).length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Loss-Making Jobs</p>
                    <p className="text-2xl font-bold text-red-600">
                      {jobs.filter(job => job.margin < 0).length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="profitability">Client Profitability</option>
            <option value="jobtype">Job Type Performance</option>
            <option value="margin">Margin Analysis</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="last180">Last 6 Months</option>
            <option value="last365">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {renderReport()}
    </div>
  );
};

export default ReportsPage;