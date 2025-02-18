
export const filterDataBySeller = (data: any[], sellerId: string) => {
  if (sellerId === "all") return data;
  const multiplier = parseInt(sellerId) * 0.5;
  return data.map(item => ({
    ...item,
    novos: Math.floor(item.novos * multiplier),
    count: item.count ? Math.floor(item.count * multiplier) : undefined,
    "Preço muito alto": item["Preço muito alto"] ? Math.floor(item["Preço muito alto"] * multiplier) : undefined,
    "Não tenho orçamento": item["Não tenho orçamento"] ? Math.floor(item["Não tenho orçamento"] * multiplier) : undefined,
    "Preciso consultar": item["Preciso consultar"] ? Math.floor(item["Preciso consultar"] * multiplier) : undefined,
  }));
};
