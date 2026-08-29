import { RoleGate } from "@/components/layout/RoleGate";

export default function InternLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate role="INTERN">{children}</RoleGate>;
}
