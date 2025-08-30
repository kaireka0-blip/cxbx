import { useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabaseService';
import type { 
  Client, Project, Package, AddOn, TeamMember, Lead, Transaction, 
  Card, FinancialPocket, Asset, Contract, PromoCode, SOP, 
  ClientFeedback, SocialMediaPost, Notification, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry, Profile, User
} from '../types';

interface SupabaseData {
  clients: Client[];
  projects: Project[];
  packages: Package[];
  addOns: AddOn[];
  teamMembers: TeamMember[];
  leads: Lead[];
  transactions: Transaction[];
  cards: Card[];
  pockets: FinancialPocket[];
  assets: Asset[];
  contracts: Contract[];
  promoCodes: PromoCode[];
  sops: SOP[];
  clientFeedback: ClientFeedback[];
  socialMediaPosts: SocialMediaPost[];
  notifications: Notification[];
  teamProjectPayments: TeamProjectPayment[];
  teamPaymentRecords: TeamPaymentRecord[];
  rewardLedgerEntries: RewardLedgerEntry[];
}

export function useSupabaseData(profileId?: string) {
  const [data, setData] = useState<SupabaseData>({
    clients: [],
    projects: [],
    packages: [],
    addOns: [],
    teamMembers: [],
    leads: [],
    transactions: [],
    cards: [],
    pockets: [],
    assets: [],
    contracts: [],
    promoCodes: [],
    sops: [],
    clientFeedback: [],
    socialMediaPosts: [],
    notifications: [],
    teamProjectPayments: [],
    teamPaymentRecords: [],
    rewardLedgerEntries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await SupabaseService.getAllData(profileId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [profileId]);

  // CRUD operations that update local state
  const createClient = async (clientData: Omit<Client, 'id'>) => {
    if (!profileId) return { data: null, error: 'No profile ID' };
    
    const result = await SupabaseService.createClient(profileId, clientData);
    if (result.data) {
      setData(prev => ({ ...prev, clients: [result.data!, ...prev.clients] }));
    }
    return result;
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const result = await SupabaseService.updateClient(id, updates);
    if (result.data) {
      setData(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === id ? result.data! : c)
      }));
    }
    return result;
  };

  const deleteClient = async (id: string) => {
    const result = await SupabaseService.deleteClient(id);
    if (!result.error) {
      setData(prev => ({
        ...prev,
        clients: prev.clients.filter(c => c.id !== id)
      }));
    }
    return result;
  };

  const createProject = async (projectData: Omit<Project, 'id'>) => {
    if (!profileId) return { data: null, error: 'No profile ID' };
    
    const result = await SupabaseService.createProject(profileId, projectData);
    if (result.data) {
      setData(prev => ({ ...prev, projects: [result.data!, ...prev.projects] }));
    }
    return result;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const result = await SupabaseService.updateProject(id, updates);
    if (result.data) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? result.data! : p)
      }));
    }
    return result;
  };

  const deleteProject = async (id: string) => {
    const result = await SupabaseService.deleteProject(id);
    if (!result.error) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      }));
    }
    return result;
  };

  const createLead = async (leadData: Omit<Lead, 'id'>) => {
    if (!profileId) return { data: null, error: 'No profile ID' };
    
    const result = await SupabaseService.createLead(profileId, leadData);
    if (result.data) {
      setData(prev => ({ ...prev, leads: [result.data!, ...prev.leads] }));
    }
    return result;
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const result = await SupabaseService.updateLead(id, updates);
    if (result.data) {
      setData(prev => ({
        ...prev,
        leads: prev.leads.map(l => l.id === id ? result.data! : l)
      }));
    }
    return result;
  };

  const deleteLead = async (id: string) => {
    const result = await SupabaseService.deleteLead(id);
    if (!result.error) {
      setData(prev => ({
        ...prev,
        leads: prev.leads.filter(l => l.id !== id)
      }));
    }
    return result;
  };

  return {
    ...data,
    loading,
    error,
    refetch: fetchAllData,
    // CRUD operations
    createClient,
    updateClient,
    deleteClient,
    createProject,
    updateProject,
    deleteProject,
    createLead,
    updateLead,
    deleteLead
  };
}