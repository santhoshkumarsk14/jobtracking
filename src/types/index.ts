export interface User {
  id: string;
  email: string;
  role: 'admin' | 'estimator' | 'viewer';
  name: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  industry: 'Marine' | 'Construction' | 'Logistics';
  size: '1-10' | '11-50' | '50+';
  country: string;
  currency: string;
  logo?: string;
  isOnboarded: boolean;
  defaultOverheadMarkup: number;
}

export interface LaborRole {
  id: string;
  name: string;
  hourlyRate: number;
  companyId: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  code: string;
  companyId: string;
}

export interface Equipment {
  id: string;
  name: string;
  dailyRate: number;
  usageFrequency: 'High' | 'Medium' | 'Low';
  companyId: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyId: string;
}

export interface Job {
  id: string;
  title: string;
  jobType: 'Marine' | 'Construction' | 'Logistics';
  location: string;
  clientId: string;
  crew: string;
  equipmentUsed: string[];
  materialsUsed: string[];
  totalRevenue: number;
  actualCosts: {
    labor: number;
    material: number;
    equipment: number;
    subcontractor: number;
  };
  notes?: string;
  dateCompleted: string;
  companyId: string;
  margin: number;
  isRedFlag: boolean;
}

export interface Quote {
  id: string;
  clientName: string;
  jobType: 'Marine' | 'Construction' | 'Logistics';
  description: string;
  laborCosts: number;
  materialCosts: number;
  equipmentCosts: number;
  totalCosts: number;
  quotedPrice: number;
  margin: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  dateCreated: string;
  companyId: string;
  isMarginAlert: boolean;
}

export interface OnboardingData {
  company: Partial<Company>;
  laborRoles: Partial<LaborRole>[];
  materials: Partial<Material>[];
  equipment: Partial<Equipment>[];
  teamEmails: string[];
  importedJobs?: Partial<Job>[];
}