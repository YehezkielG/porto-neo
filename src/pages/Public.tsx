import { useState, useEffect } from "react";
import { GetPublic, BASE_URL, delay } from "../api/backendApi";
import { useTheme } from "../context/ThemeContext";
import nofoto from "../assets/nofoto.svg";
import Loading from "../components/Loading";
import { DomainIcon } from "../components/DomainIcon";
import AboutMe from "../components/AboutMe";
import ProfileLinkIcon, { PROFILE_LINKS } from "../components/ProfileLinkIcon";
import { Mail, Phone } from "lucide-react";
import KiroAI from "../components/KiroAI";
import ScrollReveal from "../components/ScrollReveal";
import type { PublicPortfolioData, SkillLevel } from '../types';

const Public = () => {
  const { theme, toggleTheme } = useTheme();
  const [portfolioData, setPortfolioData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Portfolio â€” Yehezkiel";
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [response] = await Promise.all([GetPublic(), delay(250)]);
        if (response.data.status === "success") setPortfolioData(response.data.data);
        else setError("Could not load portfolio data.");
      } catch (err) {
        console.error(err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  if (loading) return <Loading type="fixed" title="Loading portfolio..." />;
  if (error) return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 rotate-[-4deg] border-2 border-black bg-[#168aad] px-4 py-2 font-black uppercase text-black shadow-[7px_7px_0_var(--shadow-color)]">Oops!</span>
      <h2 className="mb-3 text-4xl font-black text-white">The server is unavailable.</h2>
      <p className="mb-6 text-slate-300">{error}</p>
      <button className="inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[var(--accent)] px-3.5 py-[9px] text-xs font-extrabold text-[#080a12] shadow-[4px_4px_0_var(--shadow-color)]" onClick={() => window.location.reload()}>Try Again â†—</button>
    </main>
  );

  const profil = portfolioData?.profil || {};
  const about = portfolioData?.about_me || {};
  const pendidikan = portfolioData?.riwayat_pendidikan || [];
  const pengalaman = portfolioData?.pengalaman || [];
  const keahlian = portfolioData?.keahlian || [];
  const karya = portfolioData?.karya_terbaik || [];
  const technicalDomains = portfolioData?.technical_domains || [];
  const profileLinks = portfolioData?.links || [];
  const githubProfile = profileLinks.find((item) => {
    if (item.platform !== "github") return false;
    try { return ["http:", "https:"].includes(new URL(item.url).protocol); } catch { return false; }
  });
  const getFotoUrl = () => !profil.foto ? nofoto : profil.foto.startsWith("http") ? profil.foto : `${BASE_URL}/uploads/${profil.foto}`;
  const phoneHref = profil.nomor_hp ? `tel:${profil.nomor_hp.replace(/[^\d+]/g, "")}` : null;

  return (
    <main className="mx-auto w-[min(1080px,calc(100%-48px))] py-5 sm:py-7 max-[760px]:w-[min(100%-28px,600px)] max-[760px]:pt-3">
      <header className="mb-[22px] flex min-h-[72px] items-center justify-between gap-5 border-2 border-[var(--ink)] bg-[var(--surface)] px-5 py-3 shadow-[6px_6px_0_var(--shadow-color)] max-[760px]:min-h-[60px] max-[760px]:px-3 max-[760px]:py-[9px]">
        <a href="#top" className="inline-flex items-center gap-[9px] font-mono text-[22px] font-black tracking-[-.1em] text-[var(--paper)]"><span className="size-[13px] rounded-full border-2 border-black bg-[var(--lime)]" />YK<span className="text-[#168aad]">.</span></a>
        <nav className="hidden items-center gap-7 font-mono text-xs font-bold uppercase tracking-[.18em] sm:flex">
          <a href="#about" className="text-[var(--muted)] transition-colors hover:text-[var(--lime)]">About</a><a href="#education" className="text-[var(--muted)] transition-colors hover:text-[var(--lime)]">Education</a><a href="#work" className="text-[var(--muted)] transition-colors hover:text-[var(--lime)]">Work</a><a href="#kiro" className="text-[var(--muted)] transition-colors hover:text-[var(--lime)]">Kiro AI</a><a href="#links" className="text-[var(--muted)] transition-colors hover:text-[var(--lime)]">Links</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[#fffdf5] px-3.5 py-[9px] text-xs font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)] max-[760px]:min-h-[38px] max-[760px]:px-[9px] max-[760px]:py-[7px] max-[760px]:text-[10px]" onClick={toggleTheme}>{theme === "light" ? "â— Dark" : "â—‘ Light"}</button>
        </div>
      </header>

      <ScrollReveal as="section" id="top" className="relative grid min-h-[510px] grid-cols-[1.15fr_.85fr] items-center overflow-hidden border-2 border-black bg-[var(--accent)] px-[clamp(32px,7vw,86px)] py-[clamp(32px,7vw,86px)] text-[#101216] shadow-[9px_9px_0_var(--shadow-color)] before:absolute before:right-[17%] before:top-[-95px] before:size-[260px] before:rounded-full before:border-2 before:border-black before:bg-[var(--lime)] before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-[14px] after:w-[45%] after:bg-[repeating-linear-gradient(135deg,#000_0_5px,transparent_5px_10px)] after:content-[''] max-[760px]:grid-cols-1 max-[760px]:gap-4 max-[760px]:px-[25px] max-[760px]:pb-[45px] max-[760px]:pt-[76px]">
        <div className="absolute left-[30px] top-7 z-[1] rotate-[-3deg] border-2 border-black bg-[var(--lime)] px-[10px] py-[7px] font-mono text-[10px] font-black text-[#080a12] shadow-[4px_4px_0_var(--shadow-color)] max-[430px]:left-[17px]">DIGITAL PORTFOLIO Â· 2025</div>
        <div className="relative z-[1]">
          <p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">HELLO, I'M</p>
          <h1 className="m-0 max-w-[700px] overflow-wrap-anywhere text-[clamp(64px,9vw,124px)] font-black leading-[.86] tracking-[-.09em] text-[#101216] max-[760px]:text-[clamp(60px,16vw,100px)]">
            Ezekiel
            <span className="text-[var(--lime)] [text-shadow:3px_3px_0_#000]">.</span></h1>
          <p className="mb-0 mt-6 max-w-[510px] font-mono text-[15px] leading-[1.75] text-[#20212a] max-[760px]:text-[13px]">I love building intelligent systems and understanding how the things work.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[var(--accent)] px-3.5 py-[9px] text-xs font-extrabold text-[#080a12] shadow-[4px_4px_0_var(--shadow-color)]">Explore my work <span aria-hidden="true">â†˜</span></a>
            <a href="#about" className="inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[#fffdf5] px-3.5 py-[9px] text-xs font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]">Get to know me â†“</a>
          </div>
        </div>
        <div className="relative z-[1] my-5 w-full max-w-[330px] justify-self-center rotate-[3deg] max-[760px]:w-[min(65%,250px)] max-[760px]:justify-self-end max-[760px]:mb-5 max-[760px]:mr-5">
          <div className="aspect-[4/5] overflow-hidden border-[3px] border-black bg-[var(--lavender)] p-[10px] shadow-[10px_10px_0_var(--shadow-color)]"><img className="size-full object-cover saturate-[.86]" src={getFotoUrl()} alt={profil.nama_lengkap || "Profile photo"} onError={(e) => { e.currentTarget.src = nofoto; }} /></div>
          <span className="absolute bottom-[30px] right-[-25px] rotate-[-6deg] border-2 border-black bg-[var(--lime)] px-3 py-[9px] font-mono text-[9px] font-black leading-normal text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]">Always learning<br/>Always experimenting</span>
          <span className="absolute right-[-16px] top-[-28px] text-[68px] text-[var(--lime)] [text-shadow:3px_3px_0_#000] max-[760px]:right-[-25px]" aria-hidden="true">âœ³</span>
        </div>
        <div className="absolute bottom-[22px] right-7 font-mono text-[11px] font-black text-[#11131b]">01 / 07</div>
      </ScrollReveal>

      <AboutMe profile={profil} education={pendidikan} about={about} />

      <ScrollReveal as="section" id="work" className="mt-[34px] border-2 border-black bg-[var(--lavender)] p-[clamp(24px,5vw,58px)] text-[#11131b] shadow-[8px_8px_0_var(--shadow-color)]">
        <div className="mb-8 flex items-start gap-4"><span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">02</span><div><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">A FEW THINGS I'VE BUILT</p><h2 className="m-0 text-[clamp(38px,6vw,68px)] font-black leading-[.95] text-[#11131b]">Selected Work<span className="text-[#168aad]">.</span></h2></div></div>
        {karya.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{karya.map((item, index) => <article className={`overflow-hidden border-2 border-black ${["bg-[#fffdf5]", "bg-[var(--lime)]", "bg-[#ffb2d9]"][index % 3]} text-[#11131b] shadow-[7px_7px_0_var(--shadow-color)] transition-transform hover:-translate-y-1`} key={item.id || item.nama_karya}>{item.gambar && <img className="aspect-video max-h-[310px] w-full border-b-2 border-black object-cover" src={`${BASE_URL}/uploads/${item.gambar}`} alt={item.nama_karya} />}<div className="p-[22px]"><span className="font-mono text-[10px] font-black tracking-[.18em] text-[#555663]">PROJECT / {String(index + 1).padStart(2, "0")}</span><h3 className="mb-2 mt-3 text-[28px] font-black text-[#11131b]">{item.nama_karya}</h3><p className="text-sm leading-[1.7] text-[#454653]">{item.deskripsi}</p>{item.url && <a className="mt-2 inline-block border-b-2 border-black font-black text-[#11131b]" href={item.url} target="_blank" rel="noreferrer">View project â†—</a>}</div></article>)}</div> : <p className="border-2 border-dashed border-black p-8 text-center font-mono text-[#11131b]">Projects are being curated. Check back soon!</p>}
        {githubProfile && <a className="mt-6 inline-flex items-center gap-2.5 border-2 border-black bg-[var(--lime)] px-4 py-3 text-[13px] font-black text-[#11131b] shadow-[5px_5px_0_var(--shadow-color)] transition hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--shadow-color)]" href={githubProfile.url} target="_blank" rel="noopener noreferrer"><ProfileLinkIcon name="github" size={20} /><span>More projects on GitHub</span><span aria-hidden="true">â†—</span></a>}
      </ScrollReveal>

      <div className="mt-9 grid grid-cols-1 items-stretch gap-7 md:grid-cols-2">
        <ScrollReveal as="section" className="mt-[34px] w-full border-2 border-black bg-[var(--surface)] p-[clamp(24px,5vw,58px)] shadow-[8px_8px_0_var(--shadow-color)] max-[430px]:px-[17px] max-[430px]:py-[22px]">
          <div className="mb-[26px] flex items-start gap-4"><span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">03</span><div><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">WHAT I DO</p><h2 className="m-0 text-[clamp(34px,4vw,48px)] font-black leading-[.95] text-[var(--paper)]">Experience<span className="text-[#168aad]">.</span></h2></div></div>
          <div className="grid gap-5">{pengalaman.length ? pengalaman.map((item) => <article className="flex items-center gap-[15px] border-t border-[var(--line)] pt-[17px]" key={item.id || item.nama_perusahaan}>{item.gambar && <img className="size-[58px] shrink-0 border-2 border-black bg-[var(--accent)] object-cover shadow-[3px_3px_0_var(--shadow-color)]" src={`${BASE_URL}/uploads/${item.gambar}`} alt={`${item.nama_perusahaan} logo`} />}<div><h3 className="mb-[3px] text-[17px] font-black text-[var(--paper)]">{item.jabatan}</h3><p className="m-0 text-[13px] text-[var(--muted)]">{item.nama_perusahaan}</p><small className="font-mono text-[11px] text-[var(--muted)]">{item.tahun_mulai} â€” {Number(item.tahun_selesai) || "Present"}</small></div></article>) : <p className="text-[var(--muted)]">No experience has been added yet.</p>}</div>
        </ScrollReveal>
        <ScrollReveal as="section" className="mt-[34px] w-full border-2 border-black bg-[var(--lime)] p-[clamp(24px,5vw,58px)] shadow-[8px_8px_0_var(--shadow-color)] max-[430px]:px-[17px] max-[430px]:py-[22px]">
          <div className="mb-[26px] flex items-start gap-4"><span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">04</span><div><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">TOOLS IN MY TOOLBOX</p><h2 className="m-0 text-[clamp(34px,4vw,48px)] font-black leading-[.95] text-[#11131b]">Skills<span className="text-[#168aad]">.</span></h2></div></div>
          <div className="flex flex-wrap gap-3">
            {keahlian.length ? keahlian.map((item, i) => {
              const level: SkillLevel = ['Basic', 'Intermediate', 'Advanced'].includes(item.level) ? item.level : 'Basic';
              const steps = { Basic: 1, Intermediate: 2, Advanced: 3 }[level];
              return (
                <article className={`inline-flex min-w-[145px] flex-col items-start gap-3 border-2 border-black ${["bg-[#fffdf5]", "bg-[#ffb2d9]", "bg-[var(--lavender)]", "bg-[#ff8c63]"][i % 4]} px-[15px] py-[13px] font-black text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]`} key={item.id || item.nama_keahlian}>
                  <strong>{item.nama_keahlian}</strong>
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex gap-1" role="img" aria-label={`${level} skill level`}>
                      {[1, 2, 3].map((step) => <span className={`h-[5px] w-5 border border-[#11131b] ${step <= steps ? "bg-[#168aad]" : "bg-transparent"}`} key={step} />)}
                    </div>
                  </div>
                </article>
              );
            }) : <p className="text-[var(--muted)]">Skills will be added soon.</p>}
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal as="section" id="domains" className="mt-9 rounded-xl border-2 border-black bg-[#f6f2e9] p-[clamp(24px,4vw,42px)] text-[#11131b] shadow-[8px_8px_0_var(--shadow-color)]">
        <div className="mb-[25px] flex items-center gap-3.5">
          <span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">05</span>
          <div><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">TOOLS IN MY TOOLBOX</p><h2 className="m-0 text-[clamp(32px,5vw,48px)] font-extrabold text-[#11131b]">Technical Domains<span className="text-[#168aad]">.</span></h2></div>
        </div>
        {technicalDomains.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {technicalDomains.slice(0, 4).map((domain, index) => (
              <article className={`min-h-[142px] border-2 border-black p-4 ${["bg-[#168aad] text-[#fffdf5]", "bg-[var(--lime)] text-[#11131b]", "bg-[var(--lavender)] text-[#11131b]", "bg-[#fffdf5] text-[#11131b]"][index % 4]}`} key={domain.id}>
                <span className="mb-2.5 inline-flex min-h-[26px] items-center font-mono text-[22px] font-black leading-none"><DomainIcon name={domain.icon} size={26} /></span>
                <h3 className="mb-[7px] text-xl font-extrabold text-current">{domain.title}</h3>
                <p className="m-0 text-sm leading-[1.55] text-current opacity-90">{domain.tools}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-[#6e7180] p-5 text-[#535767]">Technical domains will appear here soon.</p>
        )}
        <p className="mb-0 mt-[15px] text-[13px] text-[#535767]">A few areas I can demonstrate through real projects and experience.</p>
      </ScrollReveal>

      <KiroAI />

      <ScrollReveal as="section" id="links" className="mt-9 border-2 border-black bg-[var(--accent)] p-[clamp(24px,4vw,42px)] text-[#11131b] shadow-[8px_8px_0_var(--shadow-color)]">
        <div className="mb-8 flex items-start gap-4">
          <span className="grid size-[42px] shrink-0 rotate-[-5deg] place-items-center border-2 border-black bg-[var(--lime)] font-mono text-xs font-black text-[#080a12] shadow-[3px_3px_0_var(--shadow-color)]">07</span>
          <div><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">FIND ME AROUND THE WEB</p><h2 className="m-0 text-[clamp(38px,6vw,60px)] font-black leading-[.95] text-[#11131b]">Links<span className="text-[#168aad]">.</span></h2></div>
        </div>
        {profileLinks.length ? (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {profileLinks.map((item, index) => {
              const platform = PROFILE_LINKS.find((entry) => entry.id === item.platform);
              let url;
              try { url = new URL(item.url); } catch { return null; }
              if (!platform || !["http:", "https:"].includes(url.protocol)) return null;
              return <a className={`relative flex min-h-[118px] items-center gap-3.5 overflow-hidden border-2 border-black p-5 text-[#11131b] shadow-[5px_5px_0_var(--shadow-color)] transition hover:translate-x-[3px] hover:translate-y-[3px] hover:-rotate-1 hover:shadow-[2px_2px_0_var(--shadow-color)] ${["bg-[#fffdf5]", "bg-[var(--lime)]", "bg-[var(--lavender)]", "bg-[#ffb2d9]"][index % 4]}`} key={item.id || item.platform} href={url.href} target="_blank" rel="noopener noreferrer"><span className="grid size-12 shrink-0 place-items-center border-2 border-black bg-[var(--accent)] text-[#11131b] shadow-[3px_3px_0_var(--shadow-color)]"><ProfileLinkIcon name={item.platform} size={25} /></span><span className="text-[17px] font-black tracking-[-.035em]">{platform.label}</span><span className="ml-auto self-start font-mono text-lg font-black" aria-hidden="true">â†—</span></a>;
            })}
          </div>
        ) : <p className="m-0 border-2 border-dashed border-[#11131b] p-5 font-mono text-[#17252b]">Social and portfolio links will appear here once added.</p>}
      </ScrollReveal>

      <ScrollReveal as="section" className="mt-9 flex items-center justify-between gap-8 border-2 border-black bg-[#f6f2e9] p-[clamp(28px,6vw,66px)] text-[#11131b] shadow-[8px_8px_0_var(--shadow-color)] max-[760px]:items-start max-[760px]:flex-col">
        <div className="[&_h2]:m-0 [&_h2]:text-[clamp(40px,7vw,76px)] [&_h2]:font-black [&_h2]:leading-[.92] [&_h2]:text-[#11131b] [&_em]:not-italic [&_em]:text-[#086788]"><p className="mb-3 font-mono text-[10px] font-black tracking-[.22em]">HAVE AN INTERESTING IDEA?</p><h2>Letâ€™s make<br/>something <em>matter.</em></h2></div>
        <div className="grid w-full max-w-[390px] [&>a]:flex [&>a]:items-center [&>a]:gap-[13px] [&>a]:border-b [&>a]:border-[#90909a] [&>a]:py-4 [&>a]:text-[#11131b] [&>a>span:nth-child(2)]:grid [&>a>span:nth-child(2)]:min-w-0 [&>a>span:nth-child(2)]:gap-[3px] [&_small]:font-mono [&_small]:text-[9px] [&_small]:font-extrabold [&_small]:tracking-[.14em] [&_small]:text-[#535767] [&_strong]:[overflow-wrap:anywhere] [&_strong]:font-mono [&_strong]:text-[13px] [&_strong]:text-[#11131b] [&>a>span:last-child]:ml-auto [&>a>span:last-child]:text-[#086788]">
          {phoneHref && <a href={phoneHref}><span className="grid size-[42px] shrink-0 place-items-center border-2 border-black bg-[var(--lime)] shadow-[3px_3px_0_var(--shadow-color)]"><Phone size={20} aria-hidden="true" /></span><span><small>PHONE</small><strong>{profil.nomor_hp}</strong></span><span className="ml-auto text-[#086788]" aria-hidden="true">&#8599;</span></a>}
          {profil.email && <a href={`mailto:${profil.email}`}><span className="grid size-[42px] shrink-0 place-items-center border-2 border-black bg-[var(--lime)] shadow-[3px_3px_0_var(--shadow-color)]"><Mail size={20} aria-hidden="true" /></span><span><small>EMAIL</small><strong>{profil.email}</strong></span><span className="ml-auto text-[#086788]" aria-hidden="true">&#8599;</span></a>}
        </div>
      </ScrollReveal>
      <footer className="flex justify-between gap-[15px] px-[2px] pt-7 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--muted)] max-[760px]:flex-col [&_b]:text-[#168aad]">
        <span>Â© {new Date().getFullYear()} {profil.nama_lengkap || "Yehezkiel Haganta Tarigan"}</span>
        <span>Built with curiosity <b>âœ³</b></span>
      </footer>
    </main>
  );
};

export default Public;
