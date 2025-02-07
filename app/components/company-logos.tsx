const companyLogos = {
  Capra: { light: "/capra.webp", dark: "/capra-dark.webp" },
  Liflig: { light: "/liflig.webp", dark: "/liflig-dark.webp" },
  Fryde: { light: "/fryde.webp", dark: "/fryde-dark.webp" },
} as const;

interface CompanyLogoProps {
  company: string;
}

export const CompanyLogo = ({ company }: CompanyLogoProps) => {
  const trimmedCompany = company.trim();
  const logos = companyLogos[trimmedCompany as keyof typeof companyLogos];

  if (!logos) return <span>{company}</span>;

  return (
    <span>
      <img
        className="h-[20px] dark:hidden"
        alt={trimmedCompany}
        src={logos.light}
      />
      <img
        className="hidden h-[20px] dark:flex"
        alt={trimmedCompany}
        src={logos.dark}
      />
    </span>
  );
};
