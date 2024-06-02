// app/api/trpc/[trpc]/route.ts

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../../trpc-server/router";
import { NextRequest } from "next/server";
import { createTRPCContext } from "../../../../../trpc-server/context";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => await createContext(req),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
