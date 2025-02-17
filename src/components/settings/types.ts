
export interface CustomField {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
}

export interface Stage {
  id: string;
  name: string;
}

export interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
}
