import { GraduationCap, Sparkles } from "lucide-react";
import { ABOUT_ICON_MAP, DEFAULT_ABOUT_ICONS } from "./AboutIcons";
import ScrollReveal from "./ScrollReveal";
import type { AboutItem, AboutListField, AboutMeData, Education, Profile } from "../types";

const labelClass =
  "px-3 pb-1 pt-4 text-sm font-extrabold text-[var(--paper)] sm:min-h-[60px] sm:py-4";
const valueClass =
  "border-b border-[var(--line)] px-3 pb-4 pt-1 text-[var(--muted)] sm:min-h-[60px] sm:py-4";
const chipTones = [
  "bg-[var(--lime)] text-[#11131b]",
  "bg-[var(--lavender)] text-[#11131b]",
  "bg-[#ffb2d9] text-[#11131b]",
  "bg-[#fffdf5] text-[#11131b]",
];

const normalizeItems = (items: unknown, field: AboutListField): AboutItem[] => {
  if (!Array.isArray(items)) return [];
  const defaults = DEFAULT_ABOUT_ICONS[field] || ["Sparkles"];
  return items
    .map((item: unknown, index: number) => {
      if (typeof item === "string")
        return { text: item, icon: defaults[index % defaults.length] };
      if (!item || typeof item !== "object") return null;
      const value = item as { text?: unknown; icon?: unknown };
      const icon = String(value.icon || "");
      return {
        text: String(value.text || ""),
        icon: ABOUT_ICON_MAP[icon] ? icon : defaults[index % defaults.length],
      };
    })
    .filter((item): item is AboutItem => Boolean(item?.text));
};

interface AboutChipsProps {
  items: unknown;
  field: AboutListField;
}

const AboutChips = ({ items, field }: AboutChipsProps) => (
  <div className="flex flex-wrap gap-2.5">
    {normalizeItems(items, field).map((item, index) => {
      const iconOption = ABOUT_ICON_MAP[item.icon] || ABOUT_ICON_MAP.Sparkles;
      const Icon = iconOption.Icon;
      return (
        <span
          className={`inline-flex min-h-10 items-center gap-2 border-2 border-black px-3 py-2 font-mono text-xs font-semibold shadow-[3px_3px_0_var(--shadow-color)] sm:text-[13px] ${chipTones[index % chipTones.length]}`}
          key={`${item.text}-${index}`}
        >
          <Icon
            className={`size-4 shrink-0 ${iconOption.color}`}
            aria-hidden="true"
          />
          {item.text}
        </span>
      );
    })}
  </div>
);

interface AboutMeProps {
  profile?: Profile;
  education?: Education[];
  about?: Partial<AboutMeData>;
}

const AboutMe = ({ profile = {}, education = [], about = {} }: AboutMeProps) => {
  const interests = Array.isArray(about.interests)
    ? about.interests
    : [
        "Software Engineering",
        "AI Engineering",
        "Neural Networks & Deep Learning",
      ];
  const languages = Array.isArray(about.favoriteLanguages)
    ? about.favoriteLanguages
    : ["TypeScript", "Python"];
  const beyondCode = Array.isArray(about.beyondCode)
    ? about.beyondCode
    : ["Watching movies", "Reading books", "Running", "Playing mobile games"];

  return (
    <ScrollReveal
      as="section"
      id="about"
      className="mt-9 border-2 border-black bg-[var(--surface)] p-5 shadow-[8px_8px_0_var(--shadow-color)] sm:p-8 lg:p-11"
    >
      <div className="mb-8 flex items-start gap-4">
        <span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">
          01
        </span>
        <div>
          <p className="mb-3 font-mono text-[10px] font-black tracking-[.22em] text-[var(--muted)]">
            A LITTLE ABOUT ME
          </p>
          <h2 className="m-0 text-4xl font-black leading-[.95] text-[var(--paper)] sm:text-6xl">
            About Me<span className="text-[#168aad]">.</span>
          </h2>
        </div>
      </div>

      <div className="ml-0 lg:ml-14">
        <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <p className="m-0 self-center font-mono text-sm leading-[1.85] text-[var(--muted)] sm:text-base lg:text-[17px]">
            {about.description ||
            `Hi, I'm ${profile.fullName || "Yehezkiel"}, a computer science student passionate about building software and exploring Artificial Intelligence. I enjoy learning things deeply and understanding how they work.`}
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-[minmax(170px,.62fr)_1.38fr]">
          <div className={labelClass}>Full Name</div>
          <div className={`${valueClass} font-mono text-sm`}>
            <Sparkles
              className="mr-2.5 inline-block size-4 align-[-3px] text-[#168aad]"
              aria-hidden="true"
            />
            {profile.fullName || "Yehezkiel Haganta Tarigan"}
          </div>

          <div className={labelClass}>Interest</div>
          <div className={valueClass}>
            <AboutChips items={interests} field="interests" />
          </div>

          <div className={labelClass}>Favorite Programming Languages</div>
          <div className={valueClass}>
            <AboutChips items={languages} field="favoriteLanguages" />
          </div>

          <div id="education" className={labelClass}>
            Education
          </div>
          <div className={`${valueClass} grid gap-4 font-mono text-sm`}>
            {education.length ? (
              education.map((item) => (
                <article
                  className="flex items-center gap-3.5 text-[var(--paper)]"
                  key={item.id || item.institution}
                >
                  {item.image ? (
                    <img
                      className="size-12 shrink-0 object-contain p-[3px]"
                      src={item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/uploads/${item.image}`}
                      alt={`${item.institution} logo`}
                    />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center text-[#168aad]">
                      <GraduationCap className="size-[30px]" aria-hidden="true" />
                    </span>
                  )}
                  <div>
                    <strong className="text-sm">{item.institution}</strong>
                    <br />
                    <span className="text-xs text-[var(--muted)]">
                      {[item.fieldOfStudy, item.level].filter(Boolean).join(" · ")}
                    </span>
                    <br />
                    <small className="text-xs text-[var(--muted)]">
                      {item.startYear} –{" "}
                      {Number(item.endYear) || "Present"}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <p className="m-0 text-[var(--muted)]">
                No education history has been added yet.
              </p>
            )}
          </div>

          <div className={labelClass}>Beyond the Code</div>
          <div className={`${valueClass} border-b-0`}>
            <AboutChips items={beyondCode} field="beyondCode" />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default AboutMe;
