
export async function updateCreditBalance(
  supabase: any,
  organizationId: string,
  creditsToDebit: number
) {
  const { data, error } = await supabase
    .from('credit_balances')
    .update({
      used_credits: supabase.raw(`used_credits + ${creditsToDebit}`)
    })
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrganizationLLMConfig(
  supabase: any,
  organizationId: string
) {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      integrated_llm,
      integrated_crm
    `)
    .eq('id', organizationId)
    .single();

  if (error) throw error;
  return data;
}
