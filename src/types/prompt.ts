
export interface Prompt {
  id: string;
  name: string;
  content: string;
  description: string;
  type: string;
  module: string; // Changed to required
  company_id?: string;
}
