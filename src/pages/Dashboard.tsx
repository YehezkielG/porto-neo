import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Biodata from "../components/Biodata";
import Pendidikan from "../components/Pendidikan";
import Pengalaman from "../components/Pengalaman";
import Keahlian from "../components/Keahlian";
import Karya from "../components/Karya";
import TechnicalDomains from "../components/TechnicalDomains";
import Links from "../components/Links";
import AboutMeAdmin from "../components/AboutMeAdmin";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("biodata");

  useEffect(() => { document.title = "Dashboard - Portfolio Editor"; }, []);
  if (!token) return <Navigate to="/login" replace />;

  const tabs = [
    { id: "biodata", label: "Profile" }, { id: "pendidikan", label: "Education" },
    { id: "pengalaman", label: "Experience" }, { id: "keahlian", label: "Skills" },
    { id: "about-me", label: "About Me" }, { id: "karya", label: "Projects" },
    { id: "technical-domains", label: "Technical Domains" }, { id: "links", label: "Links" },
  ];

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-40px))] py-[30px] max-[760px]:w-[calc(100%-28px)] max-[760px]:pt-[18px]">
      <header className="mb-5 flex items-center justify-between gap-4 max-[760px]:items-start max-[760px]:flex-col">
        <div>
          <h1 className="mb-2 text-3xl font-black text-[var(--paper)]">Portfolio Dashboard</h1>
          <p className="text-sm text-[var(--muted)]">Signed in as: <strong>{user?.nama_lengkap || user?.username || "Admin"}</strong></p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link className="inline-flex min-h-[42px] items-center justify-center border-2 border-black bg-[var(--lavender)] px-4 text-xs font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]" to="/">View Public Site</Link>
          <button className="inline-flex min-h-[42px] items-center justify-center border-2 border-black bg-[#fffdf5] px-3.5 text-xs font-extrabold text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)]" onClick={toggleTheme}>{theme === "light" ? "☀️ Light" : "🌙 Dark"}</button>
          <button className="inline-flex min-h-[42px] items-center justify-center border-2 border-black bg-[#dc3545] px-4 text-xs font-extrabold text-white shadow-[4px_4px_0_var(--shadow-color)]" onClick={() => { logout(); navigate("/login"); }}>Log Out</button>
        </div>
      </header>

      <nav className="mb-[15px] flex flex-wrap gap-2" aria-label="Dashboard sections">
        {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id} className={`inline-flex min-h-[42px] items-center justify-center border-2 border-black px-3.5 py-[9px] text-xs font-extrabold shadow-[4px_4px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--shadow-color)] ${activeTab === tab.id ? "bg-[#168aad] text-[#080a12]" : "bg-[#c8b6ff] text-[#11131b]"}`}>{tab.label}</button>)}
      </nav>

      <section className="mb-6 border-2 border-black bg-[var(--surface)] p-6 shadow-[7px_7px_0_var(--shadow-color)]">
        {activeTab === "biodata" && <Biodata token={token} />}
        {activeTab === "pendidikan" && <Pendidikan token={token} />}
        {activeTab === "pengalaman" && <Pengalaman token={token} />}
        {activeTab === "keahlian" && <Keahlian token={token} />}
        {activeTab === "about-me" && <AboutMeAdmin token={token} />}
        {activeTab === "karya" && <Karya token={token} />}
        {activeTab === "technical-domains" && <TechnicalDomains token={token} />}
        {activeTab === "links" && <Links token={token} />}
      </section>
    </main>
  );
};

export default Dashboard;
