import { RoleGate } from "@/components/layout/RoleGate";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate role="MENTOR">{children}</RoleGate>;
}
