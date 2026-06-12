import PortalLayout from "@/components/layout/PortalLayout";
import TeacherPortal from "@/components/teacher/TeacherPortal";

export default function TeacherPage() {
  return (
    <PortalLayout requiredRole="teacher">
      <TeacherPortal />
    </PortalLayout>
  );
}
