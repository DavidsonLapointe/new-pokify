import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    console.log('Recebendo solicitação para criar produto Stripe:', JSON.stringify(req.body, null, 2));
    
    const { name, description, amount, interval, apiKey } = req.body;

    if (!name || !amount || !interval || !apiKey) {
      console.log('Parâmetros ausentes:', { name, amount, interval, apiKey: apiKey ? 'presente' : 'ausente' });
      return res.status(400).json({ 
        success: false, 
        message: 'Parâmetros obrigatórios ausentes',
        missing: {
          name: !name,
          amount: !amount,
          interval: !interval,
          apiKey: !apiKey
        }
      });
    }

    // Inicializar o Stripe com a chave API fornecida
    const stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16', // Use a versão mais recente disponível
    });

    // 1. Criar o produto
    console.log('Criando produto Stripe:', { name, description });
    const product = await stripe.products.create({
      name,
      description: description || name,
    });
    console.log('Produto criado com sucesso:', product.id);

    // 2. Criar o preço associado ao produto
    console.log('Criando preço para o produto:', { 
      productId: product.id, 
      amount, 
      interval 
    });
    
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount, // Valor em centavos
      currency: 'brl',
      recurring: {
        interval: interval as 'month' | 'year',
      },
    });
    console.log('Preço criado com sucesso:', price.id);

    console.log('Operação concluída com sucesso');
    return res.status(200).json({
      success: true,
      productId: product.id,
      priceId: price.id,
    });
  } catch (error) {
    console.error('Erro ao criar produto no Stripe:', error);
    
    let errorMessage = 'Erro ao processar solicitação';
    let errorDetails = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    } else if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message;
      errorDetails = {
        type: error.type,
        code: error.code,
        param: error.param,
        detail: error.detail
      };
    }
    
    console.error('Detalhes do erro:', errorDetails);
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: errorDetails
    });
  }
} 