import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Quote, LaborRole, Material, Equipment, Client } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  jobs: Job[];
  quotes: Quote[];
  laborRoles: LaborRole[];
  materials: Material[];
  equipment: Equipment[];
  clients: Client[];
  addJob: (job: Partial<Job>) => void;
  addQuote: (quote: Partial<Quote>) => void;
  addLaborRole: (role: Partial<LaborRole>) => void;
  addMaterial: (material: Partial<Material>) => void;
  addEquipment: (equipment: Partial<Equipment>) => void;
  addClient: (client: Partial<Client>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  initializeCompanyData: (data: import('../types').OnboardingData) => void;
  loadData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { company } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [laborRoles, setLaborRoles] = useState<LaborRole[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const loadData = () => {
    if (!company) return;

    const companyJobs = JSON.parse(localStorage.getItem(`jie_jobs_${company.id}`) || '[]');
    const companyQuotes = JSON.parse(localStorage.getItem(`jie_quotes_${company.id}`) || '[]');
    const companyLaborRoles = JSON.parse(localStorage.getItem(`jie_labor_roles_${company.id}`) || '[]');
    const companyMaterials = JSON.parse(localStorage.getItem(`jie_materials_${company.id}`) || '[]');
    const companyEquipment = JSON.parse(localStorage.getItem(`jie_equipment_${company.id}`) || '[]');
    const companyClients = JSON.parse(localStorage.getItem(`jie_clients_${company.id}`) || '[]');

    setJobs(companyJobs);
    setQuotes(companyQuotes);
    setLaborRoles(companyLaborRoles);
    setMaterials(companyMaterials);
    setEquipment(companyEquipment);
    setClients(companyClients);
  };

  useEffect(() => {
    loadData();
  }, [company]);

  // Clear any existing dummy data on first load
  useEffect(() => {
    if (company) {
      // Remove any quotes with dummy IDs
      const cleanQuotes = quotes.filter(quote => !quote.id.includes('123233'));
      if (cleanQuotes.length !== quotes.length) {
        setQuotes(cleanQuotes);
        localStorage.setItem(`jie_quotes_${company.id}`, JSON.stringify(cleanQuotes));
      }
    }
  }, [company, quotes]);
  const addJob = (jobData: Partial<Job>) => {
    if (!company) return;
    
    const newJob: Job = {
      id: `job_${Date.now()}`,
      companyId: company.id,
      dateCompleted: new Date().toISOString(),
      margin: 0,
      isRedFlag: false,
      equipmentUsed: [],
      materialsUsed: [],
      actualCosts: {
        labor: 0,
        material: 0,
        equipment: 0,
        subcontractor: 0
      },
      ...jobData
    } as Job;

    // Calculate margin and red flag
    const totalCosts = Object.values(newJob.actualCosts).reduce((sum, cost) => sum + cost, 0);
    newJob.margin = newJob.totalRevenue > 0 ? ((newJob.totalRevenue - totalCosts) / newJob.totalRevenue) * 100 : 0;
    newJob.isRedFlag = newJob.margin < 10;

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem(`jie_jobs_${company.id}`, JSON.stringify(updatedJobs));
  };

  const addQuote = (quoteData: Partial<Quote>) => {
    if (!company) return;
    
    const newQuote: Quote = {
      id: `quote_${Date.now()}`,
      companyId: company.id,
      dateCreated: new Date().toISOString(),
      status: 'Draft',
      laborCosts: 0,
      materialCosts: 0,
      equipmentCosts: 0,
      totalCosts: 0,
      quotedPrice: 0,
      margin: 0,
      isMarginAlert: false,
      ...quoteData
    } as Quote;

    // Calculate margin and alert
    newQuote.margin = newQuote.quotedPrice > 0 ? ((newQuote.quotedPrice - newQuote.totalCosts) / newQuote.quotedPrice) * 100 : 0;
    newQuote.isMarginAlert = newQuote.margin < 10;

    const updatedQuotes = [...quotes, newQuote];
    setQuotes(updatedQuotes);
    localStorage.setItem(`jie_quotes_${company.id}`, JSON.stringify(updatedQuotes));
  };

  const addLaborRole = (roleData: Partial<LaborRole>) => {
    if (!company) return;
    
    const newRole: LaborRole = {
      id: `role_${Date.now()}`,
      companyId: company.id,
      ...roleData
    } as LaborRole;

    const updatedRoles = [...laborRoles, newRole];
    setLaborRoles(updatedRoles);
    localStorage.setItem(`jie_labor_roles_${company.id}`, JSON.stringify(updatedRoles));
  };

  const addMaterial = (materialData: Partial<Material>) => {
    if (!company) return;
    
    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      companyId: company.id,
      ...materialData
    } as Material;

    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    localStorage.setItem(`jie_materials_${company.id}`, JSON.stringify(updatedMaterials));
  };

  const addEquipment = (equipmentData: Partial<Equipment>) => {
    if (!company) return;
    
    const newEquipment: Equipment = {
      id: `equipment_${Date.now()}`,
      companyId: company.id,
      ...equipmentData
    } as Equipment;

    const updatedEquipment = [...equipment, newEquipment];
    setEquipment(updatedEquipment);
    localStorage.setItem(`jie_equipment_${company.id}`, JSON.stringify(updatedEquipment));
  };

  const addClient = (clientData: Partial<Client>) => {
    if (!company) return;
    
    const newClient: Client = {
      id: `client_${Date.now()}`,
      companyId: company.id,
      ...clientData
    } as Client;

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem(`jie_clients_${company.id}`, JSON.stringify(updatedClients));
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, ...jobData } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem(`jie_jobs_${company?.id}`, JSON.stringify(updatedJobs));
  };

  const updateQuote = (id: string, quoteData: Partial<Quote>) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === id ? { ...quote, ...quoteData } : quote
    );
    setQuotes(updatedQuotes);
    localStorage.setItem(`jie_quotes_${company?.id}`, JSON.stringify(updatedQuotes));
  };

  const initializeCompanyData = (data: import('../types').OnboardingData) => {
    if (!company) return;

    // Initialize sample clients first if we're importing sample jobs
    if (data.importedJobs && data.importedJobs.length > 0) {
      const sampleClients = [
        { id: 'sample_client_1', name: 'Downtown Development Corp', email: 'contact@downtown.com', companyId: company.id },
        { id: 'sample_client_2', name: 'Industrial Solutions Ltd', email: 'info@industrial.com', companyId: company.id },
        { id: 'sample_client_3', name: 'Port Authority', email: 'contracts@port.gov', companyId: company.id }
      ];
      setClients(sampleClients);
      localStorage.setItem(`jie_clients_${company.id}`, JSON.stringify(sampleClients));
    }
    // Initialize labor roles
    if (data.laborRoles) {
      const roles = data.laborRoles.map((role: Partial<import('../types').LaborRole>) => ({
        id: `role_${Date.now()}_${Math.random()}`,
        companyId: company.id,
        name: role.name ?? '',
        hourlyRate: role.hourlyRate ?? 0
      }));
      setLaborRoles(roles);
      localStorage.setItem(`jie_labor_roles_${company.id}`, JSON.stringify(roles));
    }

    // Initialize materials
    if (data.materials) {
      const mats = data.materials.map((material: Partial<import('../types').Material>) => ({
        id: `material_${Date.now()}_${Math.random()}`,
        companyId: company.id,
        name: material.name ?? '',
        unit: material.unit ?? '',
        costPerUnit: material.costPerUnit ?? 0,
        code: material.code ?? ''
      }));
      setMaterials(mats);
      localStorage.setItem(`jie_materials_${company.id}`, JSON.stringify(mats));
    }

    // Initialize equipment
    if (data.equipment) {
      const equips = data.equipment.map((equipment: Partial<import('../types').Equipment>) => ({
        id: `equipment_${Date.now()}_${Math.random()}`,
        companyId: company.id,
        name: equipment.name ?? '',
        dailyRate: equipment.dailyRate ?? 0,
        usageFrequency: equipment.usageFrequency ?? 'Low'
      }));
      setEquipment(equips);
      localStorage.setItem(`jie_equipment_${company.id}`, JSON.stringify(equips));
    }

    // Initialize jobs if imported
    if (data.importedJobs) {
      const importedJobs = data.importedJobs.map((job: Partial<import('../types').Job>) => {
        const totalCosts = job.actualCosts ? Object.values(job.actualCosts).reduce((sum, cost) => sum + Number(cost), 0) : 0;
        const margin = job.totalRevenue && job.totalRevenue > 0 ? ((job.totalRevenue - totalCosts) / job.totalRevenue) * 100 : 0;
        return {
          id: `job_${Date.now()}_${Math.random()}`,
          title: job.title ?? '',
          jobType: job.jobType ?? 'Construction',
          location: job.location ?? '',
          clientId: job.clientId ?? '',
          crew: job.crew ?? '',
          equipmentUsed: job.equipmentUsed ?? [],
          materialsUsed: job.materialsUsed ?? [],
          totalRevenue: job.totalRevenue ?? 0,
          actualCosts: job.actualCosts ?? { labor: 0, material: 0, equipment: 0, subcontractor: 0 },
          notes: job.notes,
          dateCompleted: job.dateCompleted || new Date().toISOString(),
          companyId: company.id,
          margin,
          isRedFlag: margin < 10
        };
      });
      setJobs(importedJobs);
      localStorage.setItem(`jie_jobs_${company.id}`, JSON.stringify(importedJobs));
    }
  };

  return (
    <DataContext.Provider 
      value={{ 
        jobs,
        quotes,
        laborRoles,
        materials,
        equipment,
        clients,
        addJob,
        addQuote,
        addLaborRole,
        addMaterial,
        addEquipment,
        addClient,
        updateJob,
        updateQuote,
        initializeCompanyData,
        loadData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};