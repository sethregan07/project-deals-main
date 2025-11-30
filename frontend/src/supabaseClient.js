import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vowsyhnhbbhtzzrhfllp.supabase.co';
const supabaseKey = 'sb_publishable_1MqQvInXORC2GwBDCdyXYg_qJPSCChx';

export const supabase = createClient(supabaseUrl, supabaseKey);
