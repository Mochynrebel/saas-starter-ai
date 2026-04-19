import { redirect } from "next/navigation";
import { Locale } from "@/lib/i18n";

export default async function HomePageRedirect({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  redirect(`/${lang}/ai`);
}
