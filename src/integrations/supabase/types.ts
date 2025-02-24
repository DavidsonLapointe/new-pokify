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
      email_logs: {
        Row: {
          created_at: string
          id: number
          metadata: Json | null
          organization_id: string | null
          sent_to: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: never
          metadata?: Json | null
          organization_id?: string | null
          sent_to: string
          status: string
          type: string
        }
        Update: {
          created_at?: string
          id?: never
          metadata?: Json | null
          organization_id?: string | null
          sent_to?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_titles: {
        Row: {
          boleto_barcode: string | null
          boleto_url: string | null
          created_at: string
          due_date: string
          id: string
          organization_id: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          pix_expiration_date: string | null
          pix_qr_code: string | null
          reference_month: string | null
          status: Database["public"]["Enums"]["financial_title_status"]
          stripe_payment_intent_id: string | null
          type: Database["public"]["Enums"]["financial_title_type"]
          value: number
        }
        Insert: {
          boleto_barcode?: string | null
          boleto_url?: string | null
          created_at?: string
          due_date: string
          id?: string
          organization_id?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          pix_expiration_date?: string | null
          pix_qr_code?: string | null
          reference_month?: string | null
          status?: Database["public"]["Enums"]["financial_title_status"]
          stripe_payment_intent_id?: string | null
          type: Database["public"]["Enums"]["financial_title_type"]
          value: number
        }
        Update: {
          boleto_barcode?: string | null
          boleto_url?: string | null
          created_at?: string
          due_date?: string
          id?: string
          organization_id?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          pix_expiration_date?: string | null
          pix_qr_code?: string | null
          reference_month?: string | null
          status?: Database["public"]["Enums"]["financial_title_status"]
          stripe_payment_intent_id?: string | null
          type?: Database["public"]["Enums"]["financial_title_type"]
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "financial_titles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_email: string
          admin_name: string
          bairro: string | null
          cep: string | null
          cidade: string | null
          cnpj: string
          complemento: string | null
          contract_signed_at: string | null
          created_at: string | null
          email: string
          estado: string | null
          id: string
          integrated_crm: string | null
          integrated_llm: string | null
          logo: string | null
          logradouro: string | null
          name: string
          nome_fantasia: string | null
          numero: string | null
          pending_reason:
            | Database["public"]["Enums"]["organization_pending_reason"]
            | null
          phone: string | null
          plan: string
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          admin_email: string
          admin_name: string
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj: string
          complemento?: string | null
          contract_signed_at?: string | null
          created_at?: string | null
          email: string
          estado?: string | null
          id?: string
          integrated_crm?: string | null
          integrated_llm?: string | null
          logo?: string | null
          logradouro?: string | null
          name: string
          nome_fantasia?: string | null
          numero?: string | null
          pending_reason?:
            | Database["public"]["Enums"]["organization_pending_reason"]
            | null
          phone?: string | null
          plan: string
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          admin_email?: string
          admin_name?: string
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string
          complemento?: string | null
          contract_signed_at?: string | null
          created_at?: string | null
          email?: string
          estado?: string | null
          id?: string
          integrated_crm?: string | null
          integrated_llm?: string | null
          logo?: string | null
          logradouro?: string | null
          name?: string
          nome_fantasia?: string | null
          numero?: string | null
          pending_reason?:
            | Database["public"]["Enums"]["organization_pending_reason"]
            | null
          phone?: string | null
          plan?: string
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          last_access: string | null
          name: string
          organization_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          last_access?: string | null
          name: string
          organization_id?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_access?: string | null
          name?: string
          organization_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      financial_title_status: "pending" | "paid" | "overdue"
      financial_title_type: "pro_rata" | "mensalidade"
      organization_pending_reason:
        | "contract_signature"
        | "pro_rata_payment"
        | "null"
      payment_method: "pix" | "boleto"
      user_role: "leadly_employee" | "admin" | "seller"
      user_status: "active" | "inactive" | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
