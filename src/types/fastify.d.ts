import "fastify";
// import type { Pool } from "pg";
import type { SupabaseClient } from "@supabase/supabase-js";

declare module "fastify" {
    interface FastifyInstance {
        // pg: Pool;
        supabase: SupabaseClient;
    }
}
