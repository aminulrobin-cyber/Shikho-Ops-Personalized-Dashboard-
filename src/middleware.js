export { default } from "next-auth/middleware";

// Protect the dashboard route at the edge — no cold start, instant redirect
export const config = {
  matcher: ["/"],
};
