
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  organizationId: number;
  type: "onboarding" | "contract" | "confirmation" | "payment";
  data: {
    confirmationToken?: string;
    contractUrl?: string;
    paymentUrl?: string;
    proRataAmount?: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Email sending function started ===");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const { organizationId, type, data } = await req.json();
    console.log(`Request received for organization ${organizationId}, type: ${type}`);
    console.log("Email data:", data);

    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();

    if (orgError) {
      console.error("Error fetching organization:", orgError);
      throw new Error(`Erro ao buscar organização: ${orgError.message}`);
    }
    
    if (!organization) {
      console.error("Organization not found");
      throw new Error('Organização não encontrada');
    }

    console.log("Organization found:", {
      id: organization.id,
      name: organization.name,
      adminEmail: organization.admin_email
    });

    let emailContent;
    switch (type) {
      case "onboarding":
        emailContent = {
          subject: "Sua conta Leadly - Próximos passos",
          html: `
            <h1>Olá ${organization.admin_name},</h1>
            <p>Bem-vindo à Leadly! Estamos muito felizes em ter você conosco.</p>
            <p>Para completar seu cadastro e começar a utilizar a plataforma, siga os passos abaixo:</p>
            
            <div style="margin: 30px 0; padding: 20px; border: 1px solid #E5DEFF; border-radius: 8px; background-color: #F1F0FB;">
              <h2 style="color: #6E59A5; margin-top: 0;">1. Assinar o Contrato</h2>
              <p>Primeiro, você precisa assinar o contrato de adesão da Leadly:</p>
              <p><a href="${data.contractUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Acessar e Assinar Contrato</a></p>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; border: 1px solid #E5DEFF; border-radius: 8px; background-color: #F1F0FB;">
              <h2 style="color: #6E59A5; margin-top: 0;">2. Efetuar o Pagamento</h2>
              <p>Após assinar o contrato, você será direcionado para a página de pagamento, ou pode acessar diretamente através do link:</p>
              <p>Valor pro rata: <strong>R$ ${data.proRataAmount?.toFixed(2)}</strong></p>
              <p><a href="${data.paymentUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Realizar Pagamento</a></p>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; border: 1px solid #E5DEFF; border-radius: 8px; background-color: #F1F0FB;">
              <h2 style="color: #6E59A5; margin-top: 0;">3. Completar seu Cadastro</h2>
              <p>Por fim, complete seu cadastro, definindo sua senha e confirmando seus dados:</p>
              <p><a href="${data.confirmationToken}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Completar Cadastro</a></p>
            </div>
            
            <p>Você pode completar estes passos em momentos diferentes. Basta voltar a este email e clicar no link correspondente à etapa que deseja concluir.</p>
            
            <p>Sua conta só será ativada após a conclusão de todas as etapas acima.</p>
            
            <p>Se tiver alguma dúvida, não hesite em nos contatar pelo email <a href="mailto:suporte@leadly.com.br">suporte@leadly.com.br</a>.</p>
            
            <p>Atenciosamente,<br>Equipe Leadly</p>
          `,
        };
        break;

      case "contract":
      case "confirmation":
      case "payment":
        // Mantendo os emails individuais para compatibilidade, mas o foco principal é o email de onboarding único
        emailContent = {
          subject: type === "contract" ? "Contrato de Adesão - Leadly" : 
                   type === "confirmation" ? "Complete seu cadastro - Leadly" : 
                   "Pagamento Pro Rata - Leadly",
          html: type === "contract" ? 
            `
              <h1>Olá ${organization.admin_name},</h1>
              <p>Bem-vindo à Leadly! Estamos muito felizes em ter você conosco.</p>
              <p>Segue o link para acessar seu contrato de adesão:</p>
              <p><a href="${data.contractUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Acessar Contrato</a></p>
              <p>Se tiver alguma dúvida, não hesite em nos contatar.</p>
              <p>Atenciosamente,<br>Equipe Leadly</p>
            ` : 
            type === "confirmation" ?
            `
              <h1>Olá ${organization.admin_name},</h1>
              <p>Para completar seu cadastro na Leadly, acesse o link abaixo:</p>
              <p><a href="${data.confirmationToken}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Completar Cadastro</a></p>
              <p>Atenciosamente,<br>Equipe Leadly</p>
            ` :
            `
              <h1>Olá ${organization.admin_name},</h1>
              <p>Para ativar sua conta na Leadly, precisamos processar o pagamento pro rata no valor de R$ ${data.proRataAmount?.toFixed(2)}.</p>
              <p>Acesse o link abaixo para efetuar o pagamento:</p>
              <p><a href="${data.paymentUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Realizar Pagamento</a></p>
              <p>Atenciosamente,<br>Equipe Leadly</p>
            `
        };
        break;

      default:
        throw new Error("Tipo de email inválido");
    }

    console.log(`Sending ${type} email to ${organization.admin_email}`);
    
    // Using Resend's default domain until leadly.com.br domain is verified
    const emailResponse = await resend.emails.send({
      from: "Leadly <onboarding@resend.dev>",
      to: [organization.admin_email],
      ...emailContent,
    });

    console.log(`Email sent successfully:`, emailResponse);

    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        organization_id: organizationId,
        type: type,
        sent_to: organization.admin_email,
        status: 'sent',
        metadata: data
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-organization-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
