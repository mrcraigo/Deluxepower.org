// Auto-generated from Supabase schema — do not edit by hand.
// Regenerate with: npx supabase gen types typescript --project-id whncijpbobuvpdazkghs

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_materials: {
        Row: {
          booking_id: string
          created_at: string
          description: string
          id: string
          notes: string | null
          ordered_at: string | null
          quantity: number
          received_at: string | null
          supplier_id: string | null
          total_cost: number | null
          unit_cost: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          ordered_at?: string | null
          quantity?: number
          received_at?: string | null
          supplier_id?: string | null
          total_cost?: number | null
          unit_cost: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          ordered_at?: string | null
          quantity?: number
          received_at?: string | null
          supplier_id?: string | null
          total_cost?: number | null
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_materials_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_history: {
        Row: {
          booking_id: string
          changed_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_id: string
          changed_at?: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_id?: string
          changed_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_ref: string
          client_id: string | null
          completed_at: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          labour_balance: number
          materials_deposit: number
          notes: string | null
          quote_total: number
          scheduled_date: string
          scheduled_time: string
          service_id: string
          service_name: string
          status: Database["public"]["Enums"]["booking_status"]
          street_address: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          suburb: string
          updated_at: string
        }
        Insert: {
          booking_ref?: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          labour_balance: number
          materials_deposit: number
          notes?: string | null
          quote_total: number
          scheduled_date: string
          scheduled_time: string
          service_id: string
          service_name: string
          status?: Database["public"]["Enums"]["booking_status"]
          street_address: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          suburb: string
          updated_at?: string
        }
        Update: {
          booking_ref?: string
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          labour_balance?: number
          materials_deposit?: number
          notes?: string | null
          quote_total?: number
          scheduled_date?: string
          scheduled_time?: string
          service_id?: string
          service_name?: string
          status?: Database["public"]["Enums"]["booking_status"]
          street_address?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          suburb?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          street_address: string | null
          suburb: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          street_address?: string | null
          suburb?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          street_address?: string | null
          suburb?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          suburb: string | null
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          suburb?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          suburb?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          account_number: string | null
          category: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          is_preferred: boolean
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          account_number?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_preferred?: boolean
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          account_number?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_preferred?: boolean
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending_payment"
        | "confirmed"
        | "in_progress"
        | "awaiting_approval"
        | "completed"
        | "disputed"
        | "cancelled"
      contact_type:
        | "inspector"
        | "certifier"
        | "subcontractor"
        | "real_estate_agent"
        | "property_manager"
        | "builder"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
