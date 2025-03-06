
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
  type: "contract" | "confirmation" | "payment";
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
      case "contract":
        emailContent = {
          subject: "Contrato de Adesão - Leadly",
          html: `
            <h1>Olá ${organization.admin_name},</h1>
            <p>Bem-vindo à Leadly! Estamos muito felizes em ter você conosco.</p>
            <p>Segue o link para acessar seu contrato de adesão:</p>
            <p><a href="${data.contractUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Acessar Contrato</a></p>
            <p>Para finalizar seu cadastro, você precisa:</p>
            <ol>
              <li>Assinar o contrato digitalmente através do link acima</li>
              <li>Completar seu cadastro no link que enviaremos em seguida</li>
              <li>Efetuar o pagamento pro rata que será enviado após a confirmação</li>
            </ol>
            <p>Se tiver alguma dúvida, não hesite em nos contatar.</p>
            <p>Atenciosamente,<br>Equipe Leadly</p>
          `,
        };
        break;

      case "confirmation":
        emailContent = {
          subject: "Complete seu cadastro - Leadly",
          html: `
            <h1>Olá ${organization.admin_name},</h1>
            <p>Para completar seu cadastro na Leadly, acesse o link abaixo:</p>
            <p><a href="${data.confirmationToken}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Completar Cadastro</a></p>
            <p>Neste link você poderá:</p>
            <ul>
              <li>Definir sua senha de acesso</li>
              <li>Completar os dados da empresa</li>
              <li>Configurar seu perfil</li>
            </ul>
            <p>O link expira em 24 horas.</p>
            <p>Atenciosamente,<br>Equipe Leadly</p>
          `,
        };
        break;

      case "payment":
        emailContent = {
          subject: "Pagamento Pro Rata - Leadly",
          html: `
            <h1>Olá ${organization.admin_name},</h1>
            <p>Para ativar sua conta na Leadly, precisamos processar o pagamento pro rata no valor de R$ ${data.proRataAmount?.toFixed(2)}.</p>
            <p>Acesse o link abaixo para efetuar o pagamento:</p>
            <p><a href="${data.paymentUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Realizar Pagamento</a></p>
            <p>Após a confirmação do pagamento, sua conta será ativada automaticamente.</p>
            <p>Atenciosamente,<br>Equipe Leadly</p>
          `,
        };
        break;

      default:
        throw new Error("Tipo de email inválido");
    }

    console.log(`Sending ${type} email to ${organization.admin_email}`);
    const emailResponse = await resend.emails.send({
      from: "Leadly <noreply@leadly.com.br>",
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
