import PortalLayout from "@/components/layout/PortalLayout";
import StudentPortal from "@/components/student/StudentPortal";

export default function StudentPage() {
  return (
    <PortalLayout requiredRole="student">
      <StudentPortal />
    </PortalLayout>
  );
}
