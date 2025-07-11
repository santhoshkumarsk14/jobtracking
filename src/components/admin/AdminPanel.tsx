import React, { useState } from 'react';
import { Settings, Users, DollarSign, Package, Wrench, UserPlus } from 'lucide-react';
import CompanySettings from './CompanySettings';
import UserManagement from './UserManagement';
import MasterDataManagement from './MasterDataManagement';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company Settings', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'masterdata', label: 'Master Data', icon: Package },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanySettings />;
      case 'users':
        return <UserManagement />;
      case 'masterdata':
        return <MasterDataManagement />;
      default:
        return <CompanySettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;