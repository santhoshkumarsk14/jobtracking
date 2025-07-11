import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AuthForms from './components/auth/AuthForms';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import JobsPage from './components/jobs/JobsPage';
import QuotesPage from './components/quotes/QuotesPage';
import ReportsPage from './components/reports/ReportsPage';
import AdminPanel from './components/admin/AdminPanel';

const AppContent: React.FC = () => {
  const { user, company, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForms />;
  }

  if (!company?.isOnboarded) {
    return <OnboardingWizard />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobs':
        return <JobsPage />;
      case 'quotes':
        return <QuotesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'admin':
        return user.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;