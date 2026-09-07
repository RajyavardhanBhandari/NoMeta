/**
 * Supabase database type definitions.
 * These tell the Supabase client what columns exist on each table,
 * eliminating the "never" type errors from untyped .from() queries.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: 'user' | 'admin';
          updated_at?: string;
        };
      };
      payment_orders: {
        Row: {
          id: string;
          user_id: string;
          razorpay_order_id: string;
          product_id: string;
          credits: number;
          amount_paise: number;
          currency: string;
          status: string;
          receipt: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          razorpay_order_id: string;
          product_id: string;
          credits: number;
          amount_paise: number;
          currency: string;
          status?: string;
          receipt?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          updated_at?: string;
        };
      };
      payment_events: {
        Row: {
          id: string;
          provider_event_id: string;
          event_type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_event_id: string;
          event_type: string;
          payload: Json;
          created_at?: string;
        };
        Update: {
          [_ in never]: never;
        }; {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          entitlement: string;
          format: string | null;
          file_size_bytes: number | null;
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: string;
          entitlement: string;
          format?: string | null;
          file_size_bytes?: number | null;
          reference_id?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_credit_balance: {
        Args: { p_user_id: string };
        Returns: number;
      };
      get_usage_summary: {
        Args: { p_user_id: string };
        Returns: {
          free_used_today: number;
          free_daily_limit: number;
          paid_credits: number;
          total_cleanings: number;
        };
      };
      complete_cleaning: {
        Args: {
          p_user_id: string;
          p_reference_id: string;
          p_mode: string;
          p_format: string | null;
          p_file_size_bytes: number | null;
        };
        Returns: Json;
      };
      grant_payment_credit: {
        Args: { p_order_id: string; p_payment_id: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
