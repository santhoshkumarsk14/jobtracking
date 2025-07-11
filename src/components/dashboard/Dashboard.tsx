import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Dashboard: React.FC = () => {
  const { jobs, quotes } = useData();
  const { company } = useAuth();

  const dashboardData = useMemo(() => {
    // Calculate total revenue and costs
    const totalRevenue = jobs.reduce((sum, job) => sum + job.totalRevenue, 0);
    const totalCosts = jobs.reduce((sum, job) => {
      const jobCosts = Object.values(job.actualCosts).reduce((acc, cost) => acc + cost, 0);
      return sum + jobCosts;
    }, 0);
    
    const totalProfit = totalRevenue - totalCosts;
    const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    // Red flag jobs (margin < 10%)
    const redFlagJobs = jobs.filter(job => job.margin < 10);
    
    // Monthly revenue data for chart
    const monthlyData = jobs.filter(job => job.dateCompleted).reduce((acc, job) => {
      const date = new Date(job.dateCompleted);
      const monthKey = format(date, 'MMM yyyy');
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, revenue: 0, costs: 0, profit: 0 };
      }
      
      const jobCosts = Object.values(job.actualCosts).reduce((sum, cost) => sum + cost, 0);
      acc[monthKey].revenue += job.totalRevenue;
      acc[monthKey].costs += jobCosts;
      acc[monthKey].profit += job.totalRevenue - jobCosts;
      
      return acc;
    }, {} as Record<string, any>);
    
    const monthlyChartData = Object.values(monthlyData).slice(-6);
    
    // Job type distribution
    const jobTypeData = jobs.reduce((acc, job) => {
      acc[job.jobType] = (acc[job.jobType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const pieData = Object.entries(jobTypeData).map(([type, count]) => ({
      name: type,
      value: count
    }));
    
    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      averageMargin,
      redFlagJobs,
      monthlyChartData,
      pieData,
      totalJobs: jobs.length,
      totalQuotes: quotes.length
    };
  }, [jobs, quotes]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Last 6 months</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {company?.currency} {dashboardData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                {company?.currency} {dashboardData.totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {dashboardData.averageMargin.toFixed(1)}% average margin
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalJobs}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {dashboardData.totalQuotes} quotes pending
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Red Flag Jobs</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.redFlagJobs.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600">
              {dashboardData.totalJobs > 0 ? ((dashboardData.redFlagJobs.length / dashboardData.totalJobs) * 100).toFixed(1) : 0}% of total jobs
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${company?.currency} ${Number(value).toLocaleString()}`,
                  name === 'revenue' ? 'Revenue' : name === 'costs' ? 'Costs' : 'Profit'
                ]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="costs" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.jobType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company?.currency} {job.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${job.margin >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                      {job.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.isRedFlag ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Red Flag
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Profitable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;