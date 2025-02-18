
export interface AnalysisPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  active: boolean;
}

export interface NewPackageForm {
  name: string;
  credits: string;
  price: string;
}
