import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CustomerAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  streetBuilding: string;
  areaLandmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export type SavedAddress = CustomerAddress;

export const addressService = {
  /**
   * Validate Indian Pincode (6 Digits)
   */
  validateIndianPincode(pincode: string): boolean {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode.trim());
  },

  validateIndianPinCode(pincode: string): boolean {
    return this.validateIndianPincode(pincode);
  },

  /**
   * Fetch All Saved Addresses for Logged-In Customer
   */
  async getSavedAddresses(userId: string): Promise<CustomerAddress[]> {
    if (!isSupabaseConfigured) {
      return [
        {
          id: 'addr-1',
          userId,
          fullName: 'Vignesh Mestha',
          phone: '+91 98765 43210',
          houseFlat: 'Flat 402, SeaBreeze Heights',
          streetBuilding: 'Beach Road',
          areaLandmark: 'Near Malpe Harbor Gate',
          city: 'Udupi',
          state: 'Karnataka',
          pincode: '576108',
          addressType: 'home',
          isDefault: true
        }
      ];
    }

    try {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (!data) return [];

      return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        fullName: item.full_name,
        phone: item.phone,
        houseFlat: item.house_flat,
        streetBuilding: item.street_building,
        areaLandmark: item.area_landmark,
        city: item.city,
        state: item.state,
        pincode: item.pincode,
        addressType: item.address_type,
        isDefault: item.is_default
      }));
    } catch (err) {
      return [];
    }
  },

  /**
   * Save New Customer Address
   */
  async addAddress(addr: Omit<CustomerAddress, 'id'>): Promise<{ success: boolean; address?: CustomerAddress; error?: string }> {
    if (!this.validateIndianPincode(addr.pincode)) {
      return { success: false, error: 'Invalid 6-digit Indian PIN Code' };
    }

    if (!isSupabaseConfigured) {
      const newAddr: CustomerAddress = {
        ...addr,
        id: `addr-${Date.now()}`
      };
      return { success: true, address: newAddr };
    }

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: addr.userId,
          full_name: addr.fullName,
          phone: addr.phone,
          house_flat: addr.houseFlat,
          street_building: addr.streetBuilding,
          area_landmark: addr.areaLandmark,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          address_type: addr.addressType,
          is_default: addr.isDefault
        })
        .select()
        .single();

      if (error || !data) return { success: false, error: error?.message || 'Failed to save address' };

      return {
        success: true,
        address: {
          id: data.id,
          userId: data.user_id,
          fullName: data.full_name,
          phone: data.phone,
          houseFlat: data.house_flat,
          streetBuilding: data.street_building,
          areaLandmark: data.area_landmark,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          addressType: data.address_type,
          isDefault: data.is_default
        }
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Address save failure' };
    }
  }
};
