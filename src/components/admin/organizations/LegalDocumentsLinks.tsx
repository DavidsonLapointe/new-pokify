
import React from "react";
import { Link } from "@/components/ui/link";

interface LegalLinkProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export const TermsLink = ({ onClick }: LegalLinkProps) => (
  <Link
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    href="#"
    className="text-[#6E59A5] underline hover:text-[#523f87] transition-colors"
  >
    Termos de Uso
  </Link>
);

export const PrivacyPolicyLink = ({ onClick }: LegalLinkProps) => (
  <Link
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    href="#"
    className="text-[#6E59A5] underline hover:text-[#523f87] transition-colors"
  >
    Política de Privacidade
  </Link>
);
