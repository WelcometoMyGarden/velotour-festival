import type { APIRoute } from "astro";
import { getReviewPageOf, reviewStaticPaths } from "../../../lib/backend/shared";

export const GET: APIRoute = ({ params }) => {
  return new Response(JSON.stringify(getReviewPageOf(params)));
};

export async function getStaticPaths() {
  return reviewStaticPaths;
}
