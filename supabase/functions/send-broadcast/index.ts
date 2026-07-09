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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization")!;
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
    if (userErr || userData.user?.email !== "embiem590@gmail.com") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, audiences } = await req.json();

    const { data: broadcast, error: broadcastErr } = await supabase
      .from("broadcasts").insert({ message }).select().single();
    if (broadcastErr || !broadcast) {
      return new Response(JSON.stringify({ error: broadcastErr?.message || "Broadcast insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("broadcast_audiences").insert(
      audiences.map((a: string) => ({ broadcast_id: broadcast.id, audience: a }))
    );

    const { data: recipients } = await supabase
      .from("subscribers").select("phone").in("audience", audiences).eq("opted_in", true);

const atRes = await fetch("https://api.sandbox.africastalking.com/version1/messaging", {
        method: "POST",
      headers: {
        apiKey: Deno.env.get("AT_API_KEY")!,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        username: Deno.env.get("AT_USERNAME")!,
        to: recipients.map((r) => r.phone).join(","),
        message,
      }),
    });

    const atText = await atRes.text();
    console.log("AT raw response:", atText);

    return new Response(JSON.stringify({ ok: true, sent: recipients.length, atResponse: atText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log("FUNCTION ERROR:", err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ error: "Internal error", detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});