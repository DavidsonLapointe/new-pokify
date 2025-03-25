export interface AnalysisPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  active: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewPackageForm {
  name: string;
  credits: string;
  price: string;
}
