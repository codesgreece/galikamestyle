import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForms } from "@/components/admin/SettingsForms";

export const metadata = { title: "Ρυθμίσεις" };

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="Ρυθμίσεις"
        description="Προφίλ admin και ασφάλεια λογαριασμού."
      />
      <SettingsForms
        user={{ name: session.user.name, email: session.user.email }}
      />
    </div>
  );
}
