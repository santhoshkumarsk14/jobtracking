import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OnboardingData } from '../../types';
import CompanySetup from './CompanySetup';
import CostRatesSetup from './CostRatesSetup';
import TeamInvite from './TeamInvite';
import DataImport from './DataImport';
import { CheckCircle, Circle } from 'lucide-react';

const OnboardingWizard: React.FC = () => {
  const { company, updateCompany } = useAuth();
  const { initializeCompanyData } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    company: {},
    laborRoles: [],
    materials: [],
    equipment: [],
    teamEmails: [],
    importedJobs: []
  });

  const steps = [
    { id: 1, title: 'Company Profile', component: CompanySetup },
    { id: 2, title: 'Cost Rates', component: CostRatesSetup },
    { id: 3, title: 'Team Setup', component: TeamInvite },
    { id: 4, title: 'Data Import', component: DataImport },
  ];

  const updateOnboardingData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    if (!company) return;

    // Update company with onboarding data
    const updatedCompany = {
      ...company,
      ...onboardingData.company,
      isOnboarded: true
    };

    updateCompany(updatedCompany);
    
    // Initialize company data in DataContext
    initializeCompanyData(onboardingData);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Job Intelligence Engine
          </h1>
          <p className="text-gray-600">
            Let's set up your company profile and get you started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ml-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <CurrentStepComponent
            data={onboardingData}
            updateData={updateOnboardingData}
            onNext={handleNext}
            onBack={handleBack}
            currentStep={currentStep}
            totalSteps={steps.length}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;