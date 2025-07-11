import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { Users, Plus, Trash2, Mail } from 'lucide-react';

interface TeamInviteProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

const TeamInvite: React.FC<TeamInviteProps> = ({ data, updateData, onNext, onBack }) => {
  const [teamEmails, setTeamEmails] = useState<string[]>(data.teamEmails || ['']);

  const addEmailField = () => {
    setTeamEmails([...teamEmails, '']);
  };

  const updateEmail = (index: number, email: string) => {
    const updated = [...teamEmails];
    updated[index] = email;
    setTeamEmails(updated);
  };

  const removeEmail = (index: number) => {
    setTeamEmails(teamEmails.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = teamEmails.filter(email => email.trim() !== '');
    updateData({ teamEmails: validEmails });
    onNext();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Invite Your Team</h2>
        <p className="text-gray-600">Add team members to collaborate on jobs and quotes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Member Emails</h3>
            <button
              type="button"
              onClick={addEmailField}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Email
            </button>
          </div>
          
          <div className="space-y-3">
            {teamEmails.map((email, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="teammate@company.com"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {teamEmails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmail(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Default Roles</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Admin:</strong> Full access to all features and settings</li>
              <li>• <strong>Estimator:</strong> Can create quotes and jobs, view reports</li>
              <li>• <strong>Viewer:</strong> Can only view existing data</li>
            </ul>
            <p className="text-sm text-blue-700 mt-2">
              Team members will be invited as Estimators by default. You can change roles later in the Admin panel.
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skip Team Setup</h3>
          <p className="text-gray-600 text-sm">
            You can skip this step and invite team members later from the Admin panel. 
            This won't affect your ability to use the system.
          </p>
        </div>

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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamInvite;