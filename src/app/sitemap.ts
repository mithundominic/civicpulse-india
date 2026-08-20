// Dynamic sitemap — includes every entity detail page so search engines can
// discover the full directory, not just the static routes.
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/database/server-client";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://civicpulse.example.in";
const STATIC_ROUTES = [
  "", "/parties", "/politicians", "/states", "/constituencies", "/elections",
  "/parliament/lok-sabha", "/parliament/rajya-sabha", "/government", "/government/union",
  "/compare/politicians", "/search", "/about", "/methodology", "/sources", "/privacy", "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const [{ data: parties }, { data: politicians }, { data: states }, { data: constituencies }, { data: elections }] =
    await Promise.all([
      supabase.from("political_parties").select("slug"),
      supabase.from("persons").select("slug"),
      supabase.from("states").select("slug"),
      supabase.from("constituencies").select("slug"),
      supabase.from("elections").select("slug"),
    ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
  }));

  parties?.forEach((p) => entries.push({ url: `${BASE_URL}/parties/${p.slug}`, changeFrequency: "weekly" }));
  politicians?.forEach((p) => entries.push({ url: `${BASE_URL}/politicians/${p.slug}`, changeFrequency: "weekly" }));
  states?.forEach((s) => entries.push({ url: `${BASE_URL}/states/${s.slug}`, changeFrequency: "monthly" }));
  constituencies?.forEach((c) => entries.push({ url: `${BASE_URL}/constituencies/${c.slug}`, changeFrequency: "monthly" }));
  elections?.forEach((e) => entries.push({ url: `${BASE_URL}/elections/${e.slug}`, changeFrequency: "monthly" }));

  return entries;
}
