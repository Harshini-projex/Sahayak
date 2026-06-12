import PortalLayout from "@/components/layout/PortalLayout";
import ParentPortal from "@/components/parent/ParentPortal";

export default function ParentPage() {
  return (
    <PortalLayout requiredRole="parent">
      <ParentPortal />
    </PortalLayout>
  );
}
