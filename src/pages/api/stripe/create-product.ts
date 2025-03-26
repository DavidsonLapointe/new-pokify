import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { name, description, amount, interval } = req.body;

    // Usa a chave secreta do Stripe a partir das variáveis de ambiente
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16', // Atualizar para a versão mais recente da API
    });

    // Criar produto
    const product = await stripe.products.create({
      name,
      description,
    });

    // Criar preço para o produto
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'brl',
      recurring: { interval },
    });

    // Retornar os IDs do produto e preço criados
    return res.status(200).json({
      success: true,
      productId: product.id,
      priceId: price.id,
    });
  } catch (error) {
    console.error('Erro ao criar produto/preço no Stripe:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro desconhecido ao criar produto no Stripe',
    });
  }
} 