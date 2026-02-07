
import { supabase } from './client';

export const blogApi = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('blog')
            .select('*')

        if (error) throw error
        return data
    },

    getById: async (id) => {
        const { data, error } = await supabase
            .from('blog')
            .select('*')
            .eq('id', id)
            .single();

    if (error) throw error
    return data
  },
};
