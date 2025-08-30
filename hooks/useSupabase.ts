import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Tables = Database['public']['Tables'];

// Generic hook for CRUD operations
export function useSupabaseTable<T extends keyof Tables>(
  tableName: T,
  profileId?: string
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(tableName).select('*');
      
      if (profileId && tableName !== 'profiles') {
        query = query.eq('profile_id', profileId);
      }
      
      const { data: result, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create
  const create = async (item: Tables[T]['Insert']) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      setData(prev => [result, ...prev]);
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Update
  const update = async (id: string, updates: Tables[T]['Update']) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setData(prev => prev.map(item => item.id === id ? result : item));
      return { data: result, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Delete
  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setData(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    if (profileId || tableName === 'profiles') {
      fetchData();
    }
  }, [tableName, profileId]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchData
  };
}

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// Profile hook
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Tables['profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('admin_user_id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Tables['profiles']['Update']) => {
    if (!profile) return { data: null, error: 'No profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      return { data: null, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
}