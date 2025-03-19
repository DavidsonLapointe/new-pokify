
export const filterDataBySeller = (data: any[], seller: string) => {
  if (seller === "all" || !seller) {
    return data;
  }
  
  // For data that has seller-specific fields
  if (data.length > 0 && data[0][seller] !== undefined) {
    return data.map(item => ({
      ...item,
      value: item[seller]
    }));
  }
  
  // For data that should be filtered by seller
  return data.filter(item => 
    (item.seller === seller) || 
    (!item.seller) // Include items without seller field
  );
};
