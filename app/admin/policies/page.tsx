import { PoliciesList } from "@/components/admin/policies-list";

export default function AdminPoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Policies Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage the policies page hero section and policy cards
        </p>
      </div>

      <PoliciesList />
    </div>
  );
}
