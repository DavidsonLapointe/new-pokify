import { AnalysisPackage, NewPackageForm } from "@/types/packages";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Dados mockados para pacotes de análise
const mockPackages: AnalysisPackage[] = [
  {
    id: uuidv4(),
    name: "Pacote Básico",
    credits: 100,
    price: 99.90,
    active: true,
    stripeProductId: "prod_mock_basic",
    stripePriceId: "price_mock_basic",
    createdAt: "2023-01-15T10:00:00.000Z",
    updatedAt: "2023-01-15T10:00:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Pacote Intermediário",
    credits: 300,
    price: 249.90,
    active: true,
    stripeProductId: "prod_mock_intermediate",
    stripePriceId: "price_mock_intermediate",
    createdAt: "2023-02-10T14:30:00.000Z",
    updatedAt: "2023-02-10T14:30:00.000Z"
  },
  {
    id: uuidv4(),
    name: "Pacote Avançado",
    credits: 1000,
    price: 699.90,
    active: true,
    stripeProductId: "prod_mock_advanced",
    stripePriceId: "price_mock_advanced",
    createdAt: "2023-03-05T09:15:00.000Z",
    updatedAt: "2023-03-05T09:15:00.000Z"
  }
];

// Cria uma cópia dos dados mockados para permitir modificações
let packages: AnalysisPackage[] = [...mockPackages];

// Busca todos os pacotes de análise
export async function fetchAnalysisPackages(): Promise<AnalysisPackage[]> {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return packages;
  } catch (error) {
    console.error('Erro ao buscar pacotes de análise:', error);
    toast.error('Não foi possível carregar os pacotes de análise.');
    return [];
  }
}

// Cria um novo pacote de análise
export async function createAnalysisPackage(packageData: NewPackageForm | Partial<AnalysisPackage>): Promise<AnalysisPackage | null> {
  try {
    toast.loading('Criando pacote...');
    
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Converte os valores para números se necessário
    const credits = typeof packageData.credits === 'string' 
      ? parseInt(packageData.credits) 
      : packageData.credits as number;
    
    const price = typeof packageData.price === 'string' 
      ? parseFloat(packageData.price) 
      : packageData.price as number;
    
    // Cria um novo pacote com os dados fornecidos
    const newPackage: AnalysisPackage = {
      id: uuidv4(),
      name: packageData.name as string,
      credits: credits,
      price: price,
      active: true,
      stripeProductId: `prod_mock_${Date.now()}`,
      stripePriceId: `price_mock_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Adiciona o novo pacote à lista
    packages.push(newPackage);
    
    toast.dismiss();
    toast.success('Pacote criado com sucesso!');
    
    return newPackage;
  } catch (error) {
    console.error('Erro ao criar pacote de análise:', error);
    toast.dismiss();
    toast.error(`Não foi possível criar o pacote de análise: ${error.message}`);
    return null;
  }
}

// Atualiza um pacote de análise existente
export async function updateAnalysisPackage(id: string, packageData: Partial<AnalysisPackage>): Promise<AnalysisPackage | null> {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.loading('Atualizando pacote...');
    
    // Encontra o pacote a ser atualizado
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index === -1) {
      throw new Error('Pacote não encontrado');
    }
    
    // Atualiza o pacote com os novos dados
    const updatedPackage: AnalysisPackage = {
      ...packages[index],
      ...packageData,
      updatedAt: new Date().toISOString()
    };
    
    // Substitui o pacote antigo pelo atualizado
    packages[index] = updatedPackage;
    
    toast.dismiss();
    toast.success('Pacote atualizado com sucesso!');
    
    return updatedPackage;
  } catch (error) {
    console.error(`Erro ao atualizar pacote de análise ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível atualizar o pacote de análise: ${error.message}`);
    return null;
  }
}

// Alterna o status ativo/inativo de um pacote
export async function togglePackageActive(id: string, active: boolean): Promise<boolean> {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 700));
    
    toast.loading(`${active ? 'Ativando' : 'Desativando'} pacote...`);
    
    // Encontra o pacote a ser atualizado
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index === -1) {
      throw new Error('Pacote não encontrado');
    }
    
    // Atualiza o status do pacote
    packages[index] = {
      ...packages[index],
      active,
      updatedAt: new Date().toISOString()
    };
    
    toast.dismiss();
    toast.success(`Pacote ${active ? 'ativado' : 'desativado'} com sucesso!`);
    
    return true;
  } catch (error) {
    console.error(`Erro ao ${active ? 'ativar' : 'desativar'} pacote ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível ${active ? 'ativar' : 'desativar'} o pacote: ${error.message}`);
    return false;
  }
}

// Alterna o status ativo/inativo de um pacote de análise
export async function toggleAnalysisPackageStatus(id: string): Promise<AnalysisPackage | null> {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = packages.findIndex(pkg => pkg.id === id);
    if (index === -1) {
      console.error(`Pacote de análise com ID ${id} não encontrado`);
      toast.error("Pacote de análise não encontrado");
      return null;
    }
    
    // Alterna o status
    const newStatus = !packages[index].active;
    
    // Atualiza o pacote
    const updatedPackage: AnalysisPackage = {
      ...packages[index],
      active: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    packages[index] = updatedPackage;
    console.log(`Status do pacote de análise ${id} alterado para ${newStatus ? 'ativo' : 'inativo'}`);
    return updatedPackage;
  } catch (error) {
    console.error(`Erro ao alterar status do pacote de análise ${id}:`, error);
    toast.error(`Não foi possível alterar o status do pacote de análise: ${error.message}`);
    return null;
  }
}

// Exclui um pacote de análise
export async function deleteAnalysisPackage(id: string): Promise<boolean> {
  try {
    // Simula um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast.loading('Excluindo pacote...');
    
    // Filtra a lista de pacotes para remover o pacote com o ID fornecido
    packages = packages.filter(pkg => pkg.id !== id);
    
    toast.dismiss();
    toast.success('Pacote excluído com sucesso!');
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir pacote de análise ${id}:`, error);
    toast.dismiss();
    toast.error(`Não foi possível excluir o pacote: ${error.message}`);
    return false;
  }
}
