import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  createdAt: string;
}

export const authService = {
  /**
   * Request 6-digit OTP SMS to Indian Mobile Number (+91)
   */
  async sendPhoneOtp(phoneDigits: string): Promise<{ success: boolean; error?: string }> {
    const formattedPhone = phoneDigits.startsWith('+') ? phoneDigits : `+91${phoneDigits.replace(/\D/g, '')}`;
    
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Operating in dev mode.');
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true
        }
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  },

  /**
   * Verify 6-digit OTP Token sent to Mobile Phone
   */
  async verifyPhoneOtp(phoneDigits: string, token: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const formattedPhone = phoneDigits.startsWith('+') ? phoneDigits : `+91${phoneDigits.replace(/\D/g, '')}`;

    if (!isSupabaseConfigured) {
      // Local dev mode fallback
      const mockUser: UserProfile = {
        id: 'usr-dev-1',
        phone: formattedPhone,
        full_name: 'Vignesh Mestha',
        email: 'vignesh@takabathe.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      return { success: true, user: mockUser };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: token.trim(),
        type: 'sms'
      });

      if (error) return { success: false, error: error.message };

      if (data.session && data.user) {
        // Fetch or create profile
        const profile = await this.getOrCreateProfile(data.user.id, formattedPhone, data.user.email);
        return { success: true, user: profile };
      }

      return { success: false, error: 'Failed to establish session' };
    } catch (err: any) {
      return { success: false, error: err.message || 'OTP verification failed' };
    }
  },

  /**
   * Optional Email Fallback Authentication
   */
  async sendEmailMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) return { success: true };
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  /**
   * Fetch current active session user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      return {
        id: 'usr-dev-1',
        phone: '+919876543210',
        full_name: 'Vignesh Mestha',
        email: 'vignesh@takabathe.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return null;

      return await this.getOrCreateProfile(
        session.user.id,
        session.user.phone || '',
        session.user.email
      );
    } catch (err) {
      return null;
    }
  },

  /**
   * Fetch profile & role from Database tables
   */
  async getOrCreateProfile(userId: string, phone: string, email?: string): Promise<UserProfile> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const role = roleData?.role || 'customer';

    if (profile) {
      return {
        id: profile.id,
        phone: profile.phone || phone,
        full_name: profile.full_name || 'Customer',
        email: profile.email || email,
        role: role as any,
        createdAt: profile.created_at
      };
    }

    // Insert new profile
    const newProfile = {
      id: userId,
      phone,
      email: email || null,
      full_name: 'Customer'
    };

    await supabase.from('profiles').upsert(newProfile);
    await supabase.from('user_roles').upsert({ user_id: userId, role: 'customer' });

    return {
      id: userId,
      phone,
      full_name: 'Customer',
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  }
};
