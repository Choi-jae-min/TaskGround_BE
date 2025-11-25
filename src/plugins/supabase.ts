import fp from "fastify-plugin";    // ⬅️ 이거 빠져있음!!
import { createClient } from "@supabase/supabase-js";

const supabasePlugin = fp(async (fastify) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Supabase env not set");
    }

    const client = createClient(url, key);

    fastify.decorate("supabase", client);
});

export default supabasePlugin;
