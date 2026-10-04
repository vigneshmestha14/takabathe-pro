// Supabase Edge Function: create-payment-order
// Real Razorpay / Indian Payment Gateway order creation contract

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { orderId, amount, gateway, customerName, customerPhone } = await req.json();

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_placeholder";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (gateway === "razorpay" && razorpayKeySecret) {
      // Call Razorpay API: POST https://api.razorpay.com/v1/orders
      const authHeader = "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const razorRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Amount in paise
          currency: "INR",
          receipt: orderId,
          notes: {
            customer_name: customerName,
            customer_phone: customerPhone,
          },
        }),
      });

      const razorData = await razorRes.json();
      return new Response(
        JSON.stringify({
          gatewayOrderId: razorData.id,
          keyId: razorpayKeyId,
          amount: razorData.amount,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback response for dev / testing
    return new Response(
      JSON.stringify({
        gatewayOrderId: `rzp_order_${orderId}`,
        keyId: razorpayKeyId,
        amount: Math.round(amount * 100),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
