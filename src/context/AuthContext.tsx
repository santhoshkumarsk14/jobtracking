import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company } from '../types';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, companyData: Partial<Company>) => Promise<boolean>;
  updateCompany: (company: Company) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('jie_user');
    const savedCompany = localStorage.getItem('jie_company');
    
    if (savedUser && savedCompany) {
      setUser(JSON.parse(savedUser));
      setCompany(JSON.parse(savedCompany));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('jie_users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);
      
      if (!foundUser) {
        setIsLoading(false);
        return false;
      }

      // Get company data
      const companies = JSON.parse(localStorage.getItem('jie_companies') || '[]');
      const foundCompany = companies.find((c: Company) => c.id === foundUser.companyId);

      setUser(foundUser);
      setCompany(foundCompany);
      
      localStorage.setItem('jie_user', JSON.stringify(foundUser));
      localStorage.setItem('jie_company', JSON.stringify(foundCompany));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: Partial<User>, companyData: Partial<Company>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const companyId = `company_${Date.now()}`;
      const userId = `user_${Date.now()}`;
      
      const newCompany: Company = {
        id: companyId,
        name: companyData.name || '',
        industry: companyData.industry || 'Construction',
        size: companyData.size || '1-10',
        country: companyData.country || '',
        currency: companyData.currency || 'USD',
        isOnboarded: false,
        defaultOverheadMarkup: 15,
        ...companyData
      };

      const newUser: User = {
        id: userId,
        email: userData.email || '',
        role: 'admin',
        name: userData.name || '',
        companyId,
        ...userData
      };

      // Save to localStorage
      const companies = JSON.parse(localStorage.getItem('jie_companies') || '[]');
      const users = JSON.parse(localStorage.getItem('jie_users') || '[]');
      
      companies.push(newCompany);
      users.push(newUser);
      
      localStorage.setItem('jie_companies', JSON.stringify(companies));
      localStorage.setItem('jie_users', JSON.stringify(users));
      localStorage.setItem('jie_user', JSON.stringify(newUser));
      localStorage.setItem('jie_company', JSON.stringify(newCompany));

      setUser(newUser);
      setCompany(newCompany);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const updateCompany = (updatedCompany: Company) => {
    setCompany(updatedCompany);
    localStorage.setItem('jie_company', JSON.stringify(updatedCompany));
    
    // Update in companies array
    const companies = JSON.parse(localStorage.getItem('jie_companies') || '[]');
    const updatedCompanies = companies.map((c: Company) => 
      c.id === updatedCompany.id ? updatedCompany : c
    );
    localStorage.setItem('jie_companies', JSON.stringify(updatedCompanies));
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('jie_user');
    localStorage.removeItem('jie_company');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        company, 
        login, 
        logout, 
        register, 
        updateCompany, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};