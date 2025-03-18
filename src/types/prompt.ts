
export interface Prompt {
  id: string;
  name: string;
  content: string;
  description: string;
  type: string;
  module: string;
  company_id?: string; // Changed to optional with the ? operator
}
