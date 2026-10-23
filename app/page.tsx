"use client";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AboutMe from "./components/AboutMe";
import KiroAI from "./components/KiroAI";
import {
  ContactSection,
  ExperienceSection,
  HeroSection,
  LinksSection,
  SelectedWorkSection,
  SiteFooter,
  SiteHeader,
  SkillsSection,
  TechnicalDomainsSection,
} from "./components/PortfolioSections";
import { portfolioData } from "./data/portfolio";

function PortfolioPage() {
  const { theme, toggleTheme } = useTheme();
  const profile = portfolioData.profile || {};
  const links = portfolioData.links || [];
  const github = links.find((link) => link.platform === "github");

  return (
    <main className="mx-auto w-[min(1080px,calc(100%-48px))] py-5 sm:py-7 max-[760px]:w-[min(100%-28px,600px)] max-[760px]:pt-3">
      <SiteHeader theme={theme} toggleTheme={toggleTheme} />
      <HeroSection profile={profile} photoUrl={profile.photo || "/nofoto.svg"} />
      <AboutMe
        profile={profile}
        education={portfolioData.education || []}
        about={portfolioData.aboutMe || {}}
      />
      <SelectedWorkSection
        projects={portfolioData.projects || []}
        github={github}
      />
      <div className="mt-9 grid grid-cols-1 items-stretch gap-7 md:grid-cols-2">
        <ExperienceSection experiences={portfolioData.experience || []} />
        <SkillsSection skills={portfolioData.skills || []} />
      </div>
      <TechnicalDomainsSection domains={portfolioData.technicalDomains || []} />
      <KiroAI />
      <LinksSection links={links} />
      <ContactSection profile={profile} />
      <SiteFooter name={profile.fullName} />
    </main>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <PortfolioPage />
    </ThemeProvider>
  );
}
