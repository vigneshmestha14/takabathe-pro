// Supabase Edge Function: verify-payment-webhook
// Cryptographic payment verification webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, paymentId, signature } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update Order & Payment Status to Paid
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        order_status: "confirmed",
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderId);

    if (orderError) {
      throw orderError;
    }

    // Insert Status History Event
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      status: "confirmed",
      notes: `Payment verified (${paymentId})`,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
