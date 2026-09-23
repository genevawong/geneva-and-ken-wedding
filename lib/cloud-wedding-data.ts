import { supabase } from '@/lib/supabase';
import { type WeddingData, defaultWeddingData } from '@/lib/wedding-data';

export async function loadCloudWeddingData(): Promise<WeddingData> {
  if (!supabase) return defaultWeddingData;

  const { data, error } = await supabase
    .from('wedding_settings')
    .select('data')
    .eq('id', 'main')
    .maybeSingle();

  if (error || !data?.data) return defaultWeddingData;
  return { ...defaultWeddingData, ...data.data } as WeddingData;
}

export async function saveCloudWeddingData(data: WeddingData) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('wedding_settings')
    .upsert({ id: 'main', data }, { onConflict: 'id' });

  if (error) throw error;
}
