import { useState, useEffect, useRef, useCallback } from "react";
import logoImage from "./assets/black logo with wordmark.png";
import whiteLogoImage from "./assets/white logo with wordmark.png";

// ─── Brand Tokens ───────────────────────────────────────────────────────────
const C = {
  crimson: "#5B050B",
  crimsonHover: "#420308",
  crimsonLight: "#FFDBDD",
  crimsonMid: "#8A0A12",
  white: "#FEFDFD",
  roseMist: "#F5F3E4",
  silver: "#4C4C4C",
  burgundy: "#481A1A",
  blush: "#FFDBDD",
  black: "#000000",
  darkBg: "#0D0303",
  darkCard: "#1A0A0A",
  darkBorder: "#2E1010",
  darkCard2: "#200D0D",
  border: "#E5E0D4",
  muted: "#8A8A8A",
  sidebarBg: "#F7F5EE",
};

const F = {
  display: "'Roboto Slab', serif",
  body: "'Mulish', sans-serif",
  accent: "'Montserrat', sans-serif",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const LAYERS = {
  Crime: [
    { icon: "👥", name: "Domestic Violence" },
    { icon: "🍸", name: "DUI" },
    { icon: "✋", name: "Assault" },
    { icon: "💊", name: "Drug Offences" },
    { icon: "🏠", name: "Burglary" },
    { icon: "💳", name: "Fraud" },
    { icon: "🎨", name: "Vandalism" },
    { icon: "💀", name: "Murder" },
    { icon: "🔫", name: "Robbery" },
  ],
  Disaster: [
    { icon: "🌊", name: "Flood Risk" },
    { icon: "📡", name: "Earthquake Zones" },
    { icon: "🌀", name: "Storm Surge" },
    { icon: "🌋", name: "Volcanic Risk" },
    { icon: "🌊", name: "Tsunami Hazard" },
    { icon: "⛰️", name: "Landslide Prone" },
  ],
  Tourism: [
    { icon: "🏛️", name: "Heritage Sites" },
    { icon: "🏔️", name: "Natural Landmarks" },
    { icon: "🏖️", name: "Beach Resorts" },
    { icon: "🌿", name: "Eco-Tourism Parks" },
    { icon: "🏢", name: "Cultural Centers" },
    { icon: "🤿", name: "Diving Spots" },
  ],
  Healthcare: [
    { icon: "🏥", name: "Hospitals" },
    { icon: "💉", name: "Vaccination Centers" },
    { icon: "🩺", name: "Clinics & Urgencies" },
    { icon: "🧬", name: "Research Facilities" },
    { icon: "🚑", name: "Emergency Services" },
    { icon: "🏨", name: "Health Districts" },
  ],
};

const LEGENDS = {
  Crime: [
    { color: "#5B050B", label: "High Concentration" },
    { color: "#C44", label: "Medium Concentration" },
    { color: "#FFDBDD", label: "Low Concentration" },
  ],
  Disaster: [
    { color: "#5B050B", label: "High Risk" },
    { color: "#C44", label: "Medium Risk" },
    { color: "#FFDBDD", label: "Low Risk" },
  ],
  Tourism: [
    { color: "#5B050B", label: "Popular Destination" },
    { color: "#C44", label: "Moderate Interest" },
    { color: "#FFDBDD", label: "Emerging Site" },
  ],
  Healthcare: [
    { color: "#5B050B", label: "High Density" },
    { color: "#C44", label: "Medium Density" },
    { color: "#FFDBDD", label: "Low Density" },
  ],
};

const SAVED_ITEMS = [
  { type: "MAP VIEW", title: "Manila Crime Density 2023", edited: "Edited 2 days ago", tags: "GIS Data • JSON", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" },
  { type: "MAP VIEW", title: "Quezon City Heatmap", edited: "Edited 5 days ago", tags: "Population • Layered", img: "https://images.unsplash.com/photo-1596008194705-2091cd6764d4?w=400&q=80" },
  { type: "MAP VIEW", title: "Cebu Flood Risk Analysis", edited: "Edited 2 weeks ago", tags: "Elevation • Vector", img: "https://images.unsplash.com/photo-1547427736-0dca1cc2c980?w=400&q=80" },
];

const USE_CASES = [
  {
    title: "Urban Planning",
    desc: "Optimize city infrastructure using real-time population movement and land-use analysis. Identify high-demand zones for transit, green spaces, and utility expansion.",
    checks: ["Mobility & Traffic Modeling", "Site Suitability Analysis"],
    img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>),
  },
  {
    title: "Environmental Monitoring",
    desc: "Track ecological changes, air quality, and vegetation health over time. Help organizations meet sustainability goals and monitor disaster-prone regions.",
    checks: ["Carbon Footprint Tracking", "Risk & Resilience Assessment"],
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>),
  },
  {
    title: "Logistics Optimization",
    desc: "Streamline supply chains with intelligent routing and asset tracking. Reduce operational costs by analyzing transit patterns and predicting bottlenecks.",
    checks: ["Last-Mile Routing Efficiency", "Supply Chain Visualization"],
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><path d="m16 8 5 0 3 3v5h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>),
  },
  {
    title: "Retail Analytics",
    desc: "Understand consumer catchments and competitor proximities. Use location intelligence to select the best sites and optimize marketing reach from footfall data.",
    checks: ["Catchment Area Analysis", "Footfall & Trade Zone Insights"],
    img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>),
  },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function Logo({ dark = false, onClick, whiteLogo = false }) {
  const logoSrc = whiteLogo ? whiteLogoImage : logoImage;
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <img src={logoSrc} alt="GeoPik Logo" style={{ height: 40, objectFit: "contain" }} />
    </button>
  );
}

function Toast({ message, visible, success = true }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: C.black, color: C.white, padding: "14px 22px", borderRadius: 12,
      fontFamily: F.body, fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", gap: 10,
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0, transition: "all 0.3s ease", pointerEvents: "none",
    }}>
      <span style={{ color: success ? "#4CAF50" : C.crimson, fontSize: 18 }}>{success ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

function AuthField({ label, type = "text", value, onChange, placeholder, icon, signup }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  const bg = signup ? "#160606" : "#111";
  const borderColor = signup ? "#3A1010" : "#2D2D2D";
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: signup ? 11 : 13, fontWeight: 600, color: "#CCC", marginBottom: 8, letterSpacing: signup ? 1.5 : 0.3, textTransform: signup ? "uppercase" : "none", fontFamily: F.body }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 16, pointerEvents: "none" }}>{icon}</span>
        <input
          type={isPass ? (show ? "text" : "password") : type}
          value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: "14px 44px", fontFamily: F.body, fontSize: 14, color: C.white, outline: "none", boxSizing: "border-box" }}
        />
        {isPass && (
          <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 14 }}>
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, height: 1, background: "#2D2D2D" }} />
      <span style={{ fontSize: 12, color: "#555", fontFamily: F.body }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#2D2D2D" }} />
    </div>
  );
}

function SocialBtn({ label, onClick, signup }) {
  return (
    <button onClick={onClick} style={{ width: "100%", background: signup ? "#1E0E0E" : "transparent", border: `1px solid ${signup ? "#3A1A1A" : "#2D2D2D"}`, borderRadius: 10, padding: 13, fontFamily: F.body, fontSize: 14, fontWeight: 500, color: "#CCC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {label}
    </button>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function LandingPage({ navigate }) {
  return (
    <div style={{ minHeight: "100vh", background: C.white, fontFamily: F.body }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px", background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <Logo onClick={() => navigate("landing")} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => navigate("login")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F.body, fontSize: 14, color: C.silver, fontWeight: 600, padding: "8px 16px" }}>Log In</button>
          <button onClick={() => navigate("signup")} style={{ background: "none", border: `1.5px solid ${C.crimson}`, cursor: "pointer", fontFamily: F.body, fontSize: 14, color: C.crimson, fontWeight: 600, padding: "8px 20px", borderRadius: 8 }}>Sign Up</button>
          <button onClick={() => navigate("map")} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: F.body, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Explore Map</button>
        </div>
      </nav>

      <section style={{ background: `linear-gradient(135deg, ${C.roseMist} 0%, #EDE8DA 100%)`, padding: "90px 48px 110px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: C.blush, borderRadius: 20, padding: "4px 16px", marginBottom: 20, fontFamily: F.body, fontSize: 12, fontWeight: 700, color: C.crimson, letterSpacing: 1.5, textTransform: "uppercase" }}>Industry-Leading Platform</div>
        <h1 style={{ fontFamily: F.display, fontSize: 58, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: C.black, margin: 0 }}>
          Data Intelligence<br /><span style={{ color: C.crimson }}>Meets Location</span>
        </h1>
        <p style={{ marginTop: 22, fontSize: 16, color: C.silver, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.75, fontWeight: 400 }}>
          Transform complex geospatial data into actionable insights. Empower your organization to make smarter, location-driven decisions.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36 }}>
          <button onClick={() => navigate("map")} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 10, padding: "16px 36px", fontFamily: F.body, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Explore the Map →</button>
          <button onClick={() => navigate("signup")} style={{ background: "transparent", color: C.black, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "16px 28px", fontFamily: F.body, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Get Started Free</button>
        </div>
      </section>

      <section style={{ padding: "72px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.crimson, textTransform: "uppercase", fontFamily: F.body }}>Use Cases</p>
          <h2 style={{ fontFamily: F.display, fontSize: 38, fontWeight: 700, color: C.black, letterSpacing: -1, margin: "10px 0 0" }}>Built for Every Industry</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {USE_CASES.map((uc) => (
            <div key={uc.title} style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, background: C.white, transition: "box-shadow 0.25s, transform 0.25s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: 200, overflow: "hidden" }}>
                <img src={uc.img} alt={uc.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.parentElement.style.background = "#2d4a3e"; e.target.style.display = "none"; }} />
              </div>
              <div style={{ padding: 28 }}>
                <div style={{ width: 38, height: 38, background: C.blush, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, color: C.crimson }}>{uc.icon}</div>
                <h3 style={{ fontFamily: F.display, fontSize: 19, fontWeight: 700, marginBottom: 10, color: C.black }}>{uc.title}</h3>
                <p style={{ fontSize: 13.5, color: C.silver, lineHeight: 1.7, marginBottom: 14 }}>{uc.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 16 }}>
                  {uc.checks.map(c => (
                    <li key={c} style={{ fontSize: 13, color: C.silver, display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: C.crimson, fontWeight: 700 }}>✓</span> {c}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("map")} style={{ color: C.crimson, fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: F.body, padding: 0 }}>Learn more →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: C.black, padding: "88px 48px", textAlign: "center" }}>
        <h2 style={{ fontFamily: F.display, fontSize: 40, fontWeight: 700, color: C.white, letterSpacing: -1, margin: 0 }}>
          Ready to unlock your<br /><span style={{ color: C.crimson }}>spatial potential?</span>
        </h2>
        <p style={{ fontSize: 15, color: "#999", margin: "18px auto 40px", maxWidth: 440, lineHeight: 1.75 }}>Join hundreds of companies using GeoPik to drive growth and operational excellence.</p>
        <button onClick={() => navigate("signup")} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 12, padding: "18px 44px", fontFamily: F.body, fontSize: 17, fontWeight: 700, cursor: "pointer" }}>Get Started for Free</button>
      </section>

      <footer style={{ background: "#F9F7F2", borderTop: `1px solid ${C.border}`, padding: "52px 48px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, maxWidth: 1000, margin: "0 auto 40px" }}>
          <div>
            <Logo onClick={() => navigate("landing")} />
            <p style={{ fontSize: 13, color: C.silver, lineHeight: 1.7, marginTop: 14, maxWidth: 220 }}>Building the world's most accessible location intelligence platform for modern enterprises.</p>
          </div>
          {[["Product", ["Features", "Integrations", "Pricing"]], ["Resources", ["Documentation", "API Reference", "Community"]], ["Company", ["About Us", "Careers", "Privacy Policy"]]].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: F.accent, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.black, marginBottom: 16 }}>{title}</h4>
              {links.map(l => <a key={l} href="#" style={{ display: "block", fontSize: 13, color: C.silver, textDecoration: "none", marginBottom: 10 }}>{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: C.muted }}>© 2026 GeoPik Data Intelligence Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ navigate, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function doLogin() {
    if (!email || !password) { showToast("Please fill in all fields", false); return; }
    showToast("Welcome back! Redirecting...");
    setTimeout(() => navigate("map"), 1000);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.darkBg, backgroundImage: `radial-gradient(ellipse 60% 60% at 20% 80%, rgba(91,5,11,.4) 0%, transparent 60%)`, display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px" }}>
        <Logo dark onClick={() => navigate("landing")} whiteLogo />
        <span style={{ fontSize: 14, color: "#777", cursor: "pointer", fontFamily: F.body }} onClick={() => navigate("signup")}>No account? <strong style={{ color: C.white }}>Sign up</strong></span>
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: C.darkCard, borderRadius: 20, padding: "48px 52px", width: "100%", maxWidth: 480, border: `1px solid ${C.darkBorder}`, boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
          <h2 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 700, color: C.white, textAlign: "center", marginBottom: 8 }}>Welcome Back</h2>
          <p style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: 36, fontFamily: F.body }}>Enter your credentials to access your dashboard</p>
          <AuthField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="name@company.com" icon="✉" />
          <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon="🔒" />
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, marginTop: -10 }}>
            <span style={{ fontSize: 13, color: C.crimson, cursor: "pointer", fontFamily: F.body, fontWeight: 500 }}>Forgot password?</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: C.crimson, cursor: "pointer" }} />
            <label htmlFor="remember" style={{ fontSize: 13, color: "#888", cursor: "pointer", fontFamily: F.body }}>Remember this device</label>
          </div>
          <button onClick={doLogin} style={{ width: "100%", background: C.crimson, color: C.white, border: "none", borderRadius: 10, padding: 16, fontFamily: F.body, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 24 }}>Log In</button>
          <Divider label="Or continue with" />
          <SocialBtn label="Continue with Google" onClick={doLogin} />
          <SocialBtn label="Sign in with SSO" onClick={doLogin} />
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#555", fontFamily: F.body }}>
            Don't have an account?{" "}
            <span style={{ color: C.white, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("signup")}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ navigate, showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function doSignup() {
    if (!name || !email || !password) { showToast("Please fill in all fields", false); return; }
    showToast("Account created! Welcome to GeoPik!");
    setTimeout(() => navigate("map"), 1000);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.darkBg, backgroundImage: `radial-gradient(ellipse 60% 60% at 80% 80%, rgba(72,26,26,.5) 0%, transparent 60%)`, display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "20px 48px" }}>
        <Logo dark onClick={() => navigate("landing")} whiteLogo />
      </nav>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#1E0808", borderRadius: 20, padding: "48px 52px", width: "100%", maxWidth: 480, border: "1px solid #3D1515", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
          <h2 style={{ fontFamily: F.display, fontSize: 36, fontWeight: 700, color: C.white, marginBottom: 8 }}>Join GeoPik</h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 32, fontFamily: F.body }}>Start your mapping journey with us today.</p>
          <AuthField label="Full Name" type="text" value={name} onChange={setName} placeholder="Enter your full name" icon="👤" signup />
          <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="name@example.com" icon="✉" signup />
          <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a strong password" icon="🔒" signup />
          <button onClick={doSignup} style={{ width: "100%", background: C.crimson, color: C.white, border: "none", borderRadius: 10, padding: 16, fontFamily: F.body, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, marginBottom: 24 }}>Create Account</button>
          <Divider label="OR" />
          <SocialBtn label="Continue with Google" onClick={doSignup} signup />
          <SocialBtn label="Single Sign-On (SSO)" onClick={doSignup} signup />
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#555", fontFamily: F.body }}>
            Already have an account?{" "}
            <span style={{ color: C.white, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("login")}>Log In</span>
          </p>
        </div>
      </div>
      <footer style={{ textAlign: "center", padding: 20, fontSize: 11, color: "#333", letterSpacing: 1.5, fontFamily: F.body, textTransform: "uppercase" }}>© 2026 GeoPik Global Systems</footer>
    </div>
  );
}

function MapPage({ navigate, showToast }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("Crime");
  const [currentLayer, setCurrentLayer] = useState(0);
  const [timeRange, setTimeRange] = useState([2020, 2024]);
  const [coords, setCoords] = useState({ lat: "35.6764° N", lng: "139.6500° E" });
  const [searchQuery, setSearchQuery] = useState("");

  const HEATSPOTS = {
    Crime: [{ x: 0.75, y: 0.7, r: 0.45, c: "rgba(91,5,11,.85)", m: "rgba(140,40,20,.6)", o: "rgba(255,200,0,.25)" }, { x: 0.82, y: 0.85, r: 0.28, c: "rgba(100,8,15,.75)", m: "rgba(160,60,20,.5)", o: "rgba(255,210,30,.2)" }],
    Disaster: [{ x: 0.72, y: 0.65, r: 0.48, c: "rgba(91,5,11,.8)", m: "rgba(130,30,10,.55)", o: "rgba(255,190,0,.25)" }],
    Tourism: [{ x: 0.68, y: 0.6, r: 0.38, c: "rgba(91,5,11,.7)", m: "rgba(135,35,15,.5)", o: "rgba(255,195,10,.22)" }],
    Healthcare: [{ x: 0.5, y: 0.5, r: 0.4, c: "rgba(91,5,11,.7)", m: "rgba(125,25,10,.5)", o: "rgba(255,180,0,.2)" }, { x: 0.75, y: 0.55, r: 0.3, c: "rgba(91,5,11,.65)", m: "rgba(130,30,10,.45)", o: "rgba(255,195,10,.18)" }],
  };

  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    const mapEl = mapRef.current;
    if (!canvas || !mapEl) return;
    canvas.width = mapEl.offsetWidth;
    canvas.height = mapEl.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { width: w, height: h } = canvas;
    (HEATSPOTS[currentTab] || []).forEach(spot => {
      const r = spot.r * Math.min(w, h);
      const cx = spot.x * w, cy = spot.y * h;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0, spot.c); grd.addColorStop(0.3, spot.m);
      grd.addColorStop(0.6, spot.o); grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd; ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    });
  }, [currentTab]);

  useEffect(() => {
    const leafletLink = document.createElement("link");
    leafletLink.rel = "stylesheet";
    leafletLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletLink);
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletScript.onload = () => {
      if (mapInstanceRef.current) return;
      const L = window.L;
      mapInstanceRef.current = L.map("geopik-leaflet-map", { center: [35.6762, 139.6503], zoom: 11, zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.on("mousemove", e => {
        setCoords({ lat: `${Math.abs(e.latlng.lat).toFixed(4)}° ${e.latlng.lat >= 0 ? "N" : "S"}`, lng: `${Math.abs(e.latlng.lng).toFixed(4)}° ${e.latlng.lng >= 0 ? "E" : "W"}` });
      });
      mapInstanceRef.current.on("moveend", drawHeatmap);
      mapInstanceRef.current.on("zoomend", drawHeatmap);
      setTimeout(drawHeatmap, 400);
    };
    document.head.appendChild(leafletScript);
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => { setTimeout(drawHeatmap, 100); }, [currentTab, drawHeatmap]);

  function searchLocation() {
    if (!searchQuery.trim()) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(r => r.json())
      .then(data => {
        if (data.length > 0 && mapInstanceRef.current) {
          mapInstanceRef.current.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 12);
          showToast("Found: " + data[0].display_name.split(",").slice(0, 2).join(","));
          setTimeout(drawHeatmap, 500);
        } else showToast("Location not found", false);
      }).catch(() => showToast("Search unavailable", false));
  }

  function exportData() {
    const layer = LAYERS[currentTab][currentLayer]?.name || "data";
    const csv = `Layer,Period,Intensity\n${layer},${timeRange[0]}-${timeRange[1]},High`;
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `geopik_${currentTab.toLowerCase()}_export.csv`;
    a.click();
    showToast("CSV exported!");
  }

  const tabs = ["Crime", "Disaster", "Tourism", "Healthcare"];
  const layers = LAYERS[currentTab] || [];
  const legend = LEGENDS[currentTab] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: C.white, fontFamily: F.body }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "0 24px", height: 58, borderBottom: `1px solid ${C.border}`, background: C.white, gap: 32, flexShrink: 0, zIndex: 200 }}>
        <Logo onClick={() => navigate("landing")} />
        <div style={{ display: "flex", gap: 28 }}>
          {["Saved", "Explore Map"].map(link => (
            <button key={link} onClick={() => navigate(link === "Saved" ? "saved" : "map")} style={{ background: "none", border: "none", borderBottom: link === "Explore Map" ? `2px solid ${C.crimson}` : "2px solid transparent", color: link === "Explore Map" ? C.crimson : C.silver, fontFamily: F.body, fontSize: 14, fontWeight: 600, cursor: "pointer", paddingBottom: 2, height: 58 }}>
              {link}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", background: C.white, minWidth: 220 }}>
            <span style={{ color: C.muted, fontSize: 14 }}>🔍</span>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && searchLocation()} placeholder="Search Location" style={{ border: "none", outline: "none", fontFamily: F.body, fontSize: 13, color: C.black, background: "none", width: "100%" }} />
          </div>
          <button onClick={searchLocation} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: F.body }}>Search</button>
          <div onClick={() => navigate("profile")} style={{ width: 34, height: 34, borderRadius: "50%", background: "#DDD", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside style={{ width: 280, background: C.sidebarBg, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, margin: 0 }}>Map Filters</h2>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3, fontFamily: F.body }}>Customize your intelligence view</p>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Data Layers</p>
            {layers.map((l, i) => (
              <div key={l.name} onClick={() => { setCurrentLayer(i); showToast("Layer: " + l.name); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: i === currentLayer ? C.crimson : "transparent", color: i === currentLayer ? C.white : C.black, transition: "all 0.15s" }}>
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{l.name}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Region</p>
            <select style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, fontFamily: F.body, fontSize: 13, outline: "none" }}>
              {["Region X", "North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ padding: "0 20px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: C.muted }}>Time Period</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.crimson }}>{timeRange[0]} – {timeRange[1]}</span>
            </div>
            <input type="range" min={2015} max={2024} value={timeRange[0]} onChange={e => setTimeRange(t => [parseInt(e.target.value), t[1]])} style={{ width: "100%", accentColor: C.crimson, margin: "6px 0", display: "block" }} />
            <input type="range" min={2015} max={2024} value={timeRange[1]} onChange={e => setTimeRange(t => [t[0], parseInt(e.target.value)])} style={{ width: "100%", accentColor: C.crimson, margin: "6px 0", display: "block" }} />
          </div>
          <div style={{ margin: "0 20px 16px" }}>
            <div style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, padding: 14 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, fontFamily: F.body }}>Legend</h4>
              {legend.map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 12, color: C.silver }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: l.color, flexShrink: 0, display: "inline-block" }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "auto", padding: 20 }}>
            <button onClick={exportData} style={{ width: "100%", background: C.black, color: C.white, border: "none", borderRadius: 10, padding: 13, fontFamily: F.body, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              ⬇ Export Data (CSV)
            </button>
          </div>
        </aside>

        <div ref={mapRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 500, background: C.white, borderRadius: 10, padding: 4, display: "flex", gap: 2, boxShadow: "0 2px 14px rgba(0,0,0,0.15)", border: `1px solid ${C.border}` }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setCurrentTab(tab)} style={{ padding: "8px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: F.body, transition: "all 0.15s", background: currentTab === tab ? C.crimson : "transparent", color: currentTab === tab ? C.white : C.black }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ position: "absolute", top: 16, right: 16, zIndex: 500, display: "flex", flexDirection: "column", gap: 4 }}>
            {["+", "−"].map((label, i) => (
              <button key={i} onClick={() => i === 0 ? mapInstanceRef.current?.zoomIn() : mapInstanceRef.current?.zoomOut()} style={{ width: 36, height: 36, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 20, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>{label}</button>
            ))}
            <button onClick={() => {
              if (!navigator.geolocation || !mapInstanceRef.current) return;
              navigator.geolocation.getCurrentPosition(pos => { mapInstanceRef.current.setView([pos.coords.latitude, pos.coords.longitude], 13); showToast("Centered on your location"); setTimeout(drawHeatmap, 500); }, () => showToast("Location access denied", false));
            }} style={{ width: 36, height: 36, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 16, marginTop: 4, cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>⊕</button>
          </div>
          <div id="geopik-leaflet-map" style={{ width: "100%", height: "100%" }} />
          <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 400, opacity: 0.72 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 500, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", borderTop: `1px solid ${C.border}`, padding: "9px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 20, fontFamily: F.accent, fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>
              <span>LAT {coords.lat}</span><span>LONG {coords.lng}</span><span>RESOLUTION 0.5m / px</span>
            </div>
            <span style={{ fontSize: 11, color: C.muted }}>© 2026 GeoPik Intelligence. Map data from OpenStreetMap.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPage({ navigate, showToast }) {
  const [filter, setFilter] = useState("all");
  const items = filter === "recent"
    ? [...SAVED_ITEMS].sort((a, b) => a.edited.localeCompare(b.edited))
    : SAVED_ITEMS;

  return (
    <div style={{ minHeight: "100vh", background: "#0E0505", color: C.white, fontFamily: F.body }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "0 32px", height: 62, background: "#050101", borderBottom: "1px solid #1E0808", gap: 32, flexShrink: 0 }}>
        <Logo dark onClick={() => navigate("landing")} whiteLogo />
        <div style={{ display: "flex", gap: 28 }}>
          {[["Saved", "saved"], ["Explore Map", "map"]].map(([label, dest]) => (
            <button key={label} onClick={() => navigate(dest)} style={{ background: "none", border: "none", borderBottom: label === "Saved" ? `2px solid ${C.crimson}` : "2px solid transparent", color: label === "Saved" ? C.crimson : "#666", fontFamily: F.body, fontSize: 14, fontWeight: 600, cursor: "pointer", paddingBottom: 2, height: 62 }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #2A0A0A", borderRadius: 8, padding: "9px 14px", background: "#1A0505", minWidth: 240 }}>
            <span style={{ color: "#555" }}>🔍</span>
            <input type="text" placeholder="Search saved maps..." style={{ border: "none", outline: "none", fontFamily: F.body, fontSize: 13, color: C.white, background: "none", width: "100%" }} />
          </div>
          <div style={{ width: 36, height: 36, background: "#1A0808", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", fontSize: 16 }}>🔔</div>
          <div onClick={() => navigate("profile")} style={{ width: 34, height: 34, borderRadius: "50%", background: "#333", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </nav>

      <div style={{ padding: "44px 36px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h1 style={{ fontFamily: F.display, fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>Saved Maps</h1>
          <div style={{ display: "flex", gap: 4 }}>
            {[["all", "All Maps"], ["recent", "Recently Edited"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${filter === val ? C.crimson : "#2A0808"}`, background: filter === val ? C.crimson : "transparent", color: filter === val ? C.white : "#888", fontFamily: F.body }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {items.map(item => (
            <div key={item.title} onClick={() => navigate("map")} style={{ background: "#180808", borderRadius: 14, overflow: "hidden", border: "1px solid #280A0A", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; e.target.parentElement.style.background = "#2A0A0A"; }} />
                <span style={{ position: "absolute", top: 10, left: 10, background: C.crimson, color: C.white, fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "4px 8px", borderRadius: 5 }}>{item.type}</span>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontFamily: F.display, fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>📅 {item.edited}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11.5, color: "#555" }}>{item.tags}</span>
                  <span style={{ fontSize: 12.5, color: C.crimson, fontWeight: 700 }}>View →</span>
                </div>
              </div>
            </div>
          ))}
          <div onClick={() => navigate("map")} style={{ background: "#180808", borderRadius: 14, border: "2px dashed #2A0A0A", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 260, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.crimson; e.currentTarget.style.background = "#200D0D"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A0A0A"; e.currentTarget.style.background = "#180808"; }}
          >
            <div style={{ width: 52, height: 52, background: "#280A0A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: "1.5px solid #3A1515" }}>
              <span style={{ color: C.crimson, fontSize: 26, lineHeight: 1 }}>+</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#aaa", marginBottom: 6, fontFamily: F.body }}>Create New Analysis</h3>
            <p style={{ fontSize: 12, color: "#555" }}>Start a fresh map project</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 44, paddingBottom: 20 }}>
          {["‹", "1", "2", "3", "…", "12", "›"].map((p, i) => (
            <button key={i} onClick={() => p !== "…" && showToast(`Loading page ${p}...`)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${p === "1" ? C.crimson : "#2A0808"}`, background: p === "1" ? C.crimson : "transparent", color: p === "1" ? C.white : "#777", fontFamily: F.body, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>

      <footer style={{ background: "#050101", borderTop: "1px solid #1E0808", padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Logo dark onClick={() => navigate("landing")} whiteLogo />
          <p style={{ fontSize: 12, color: "#333", marginTop: 4 }}>© 2026 GeoPik Intelligence. All spatial data rights reserved.</p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Service", "API Docs", "Support"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ navigate, showToast }) {
  const [activeSection, setActiveSection] = useState("account");
  const [fullName, setFullName] = useState("Alexander Vance");
  const [email, setEmail] = useState("alexander.vance@geopik.io");
  const [phone, setPhone] = useState("+63 917 123 4567");
  const [region, setRegion] = useState("Philippines");
  const [bio, setBio] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [notifToggles, setNotifToggles] = useState({ mapUpdates: true, systemAlerts: true, weeklyReports: false });
  const fileInputRef = useRef(null);

  const REGIONS = ["Philippines", "United States", "Singapore", "Japan", "Australia", "United Kingdom", "Canada", "Germany"];

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast("File exceeds 2MB limit", false); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result);
    reader.readAsDataURL(file);
  }

  function toggleNotif(key) {
    setNotifToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const inputStyle = {
    width: "100%", background: "#1A0707", border: "1px solid #2A0A0A",
    borderRadius: 8, padding: "13px 16px", fontFamily: F.body, fontSize: 14,
    color: C.white, outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", color: "#555", marginBottom: 10, fontFamily: F.body,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0303", color: C.white, fontFamily: F.body, display: "flex", flexDirection: "column" }}>

      {/* ── Navbar ── */}
      <nav style={{ display: "flex", alignItems: "center", padding: "0 32px", height: 62, background: "#050101", borderBottom: "1px solid #1E0808", flexShrink: 0, gap: 32 }}>
        <Logo dark onClick={() => navigate("landing")} whiteLogo />
        <div style={{ display: "flex", gap: 28 }}>
          {[["Profile", "profile"], ["Saved", "saved"], ["Explore Map", "map"]].map(([label, dest]) => (
            <button key={label} onClick={() => navigate(dest)}
              style={{ background: "none", border: "none", borderBottom: label === "Profile" ? `2px solid ${C.crimson}` : "2px solid transparent", color: label === "Profile" ? C.crimson : "#666", fontFamily: F.body, fontSize: 14, fontWeight: 600, cursor: "pointer", paddingBottom: 2, height: 62 }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #2A0A0A", borderRadius: 8, padding: "9px 14px", background: "#1A0505", minWidth: 240 }}>
            <span style={{ color: "#555", fontSize: 14 }}>🔍</span>
            <input type="text" placeholder="Search saved maps..." style={{ border: "none", outline: "none", fontFamily: F.body, fontSize: 13, color: C.white, background: "none", width: "100%" }} />
          </div>
          <div style={{ width: 36, height: 36, background: "#1A0808", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", fontSize: 16 }}>🔔</div>
          <div onClick={() => navigate("profile")} style={{ width: 34, height: 34, borderRadius: "50%", background: "#333", cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            {avatarSrc ? <img src={avatarSrc} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 230, background: "#0D0404", borderRight: "1px solid #1E0808", padding: "32px 16px", flexShrink: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.crimson, textTransform: "uppercase", marginBottom: 4, fontFamily: F.body, paddingLeft: 12 }}>Profile Settings</p>
          <p style={{ fontSize: 11, color: "#444", letterSpacing: 1, textTransform: "uppercase", marginBottom: 28, fontFamily: F.body, paddingLeft: 12 }}>Manage Your Intelligence</p>
          {[
            { key: "account", icon: "👤", label: "Account" },
            { key: "notifications", icon: "🔔", label: "Notifications" },
          ].map(item => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 4, background: activeSection === item.key ? "#1E0808" : "transparent", color: activeSection === item.key ? C.white : "#555", fontFamily: F.body, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", textAlign: "left" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: "48px 52px", overflowY: "auto" }}>

          {/* Account Section */}
          {activeSection === "account" && (
            <>
              <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 700, color: C.white, marginBottom: 6 }}>Personal Information</h1>
              <p style={{ fontSize: 14, color: "#555", marginBottom: 40, fontFamily: F.body }}>Update your administrative credentials and geographic parameters.</p>

              {/* Avatar Row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 44 }}>
                <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
                  <div style={{ width: 110, height: 110, borderRadius: 10, background: "#1E0808", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #2E0E0E" }}>
                    {avatarSrc
                      ? <img src={avatarSrc} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 40 }}>👤</span>
                    }
                  </div>
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{ position: "absolute", bottom: 5, right: 5, width: 26, height: 26, background: C.crimson, border: "none", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                    ✏️
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleAvatarUpload} />
                </div>
                <div>
                  <h3 style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 8 }}>Avatar Signature</h3>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 18, fontFamily: F.body }}>
                    Recommended format: .JPG or .PNG. Maximum file size: 2MB.<br />
                    Dimensions: 512x512px.
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => fileInputRef.current?.click()}
                      style={{ padding: "9px 20px", background: "#1E0808", border: "1px solid #3A1010", borderRadius: 7, color: C.white, fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                      Upload New
                    </button>
                    <button onClick={() => { setAvatarSrc(null); showToast("Avatar removed"); }}
                      style={{ padding: "9px 20px", background: "transparent", border: `1px solid ${C.crimson}`, borderRadius: 7, color: C.crimson, fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px 28px", marginBottom: 22 }}>
                <div>
                  <label style={labelStyle}>Full Identity</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Intelligence Hub (Email)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Secure Line (Phone)</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Operational Region</label>
                  <div style={{ position: "relative" }}>
                    <select value={region} onChange={e => setRegion(e.target.value)}
                      style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                      {REGIONS.map(r => <option key={r} value={r} style={{ background: "#1A0707" }}>{r}</option>)}
                    </select>
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none", fontSize: 13 }}>▾</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 52 }}>
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write a short bio..."
                  style={{ ...inputStyle, resize: "vertical", minHeight: 114 }} />
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => showToast("Deactivation request sent", false)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.crimson, fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer" }}>
                  <span style={{ fontSize: 15 }}>⊠</span> Deactivate Terminal
                </button>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => navigate("saved")}
                    style={{ padding: "12px 28px", background: "#1E0808", border: "1px solid #3A1010", borderRadius: 8, color: C.white, fontFamily: F.body, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={() => showToast("Changes saved successfully!")}
                    style={{ padding: "12px 28px", background: C.crimson, border: "none", borderRadius: 8, color: C.white, fontFamily: F.body, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <>
              <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 700, color: C.white, marginBottom: 6 }}>Notifications</h1>
              <p style={{ fontSize: 14, color: "#555", marginBottom: 40, fontFamily: F.body }}>Manage your alert preferences and communication channels.</p>
              {[
                { key: "mapUpdates", label: "Map Updates", desc: "Get notified when a saved map is updated" },
                { key: "systemAlerts", label: "System Alerts", desc: "Receive critical system and platform alerts" },
                { key: "weeklyReports", label: "Weekly Reports", desc: "Receive a weekly summary of your activity" },
              ].map(item => (
                <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #1E0808" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: C.white, marginBottom: 4, fontFamily: F.body }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#555", fontFamily: F.body }}>{item.desc}</p>
                  </div>
                  <div onClick={() => toggleNotif(item.key)}
                    style={{ width: 44, height: 24, background: notifToggles[item.key] ? C.crimson : "#2A0808", borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, border: `1px solid ${notifToggles[item.key] ? C.crimsonMid : "#3A1010"}` }}>
                    <div style={{ position: "absolute", top: 3, left: notifToggles[item.key] ? 23 : 3, width: 16, height: 16, background: C.white, borderRadius: "50%", transition: "left 0.2s" }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
                <button onClick={() => showToast("Notification preferences saved!")}
                  style={{ padding: "12px 28px", background: C.crimson, border: "none", borderRadius: 8, color: C.white, fontFamily: F.body, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                  Save Preferences
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function GeoPikApp() {
  const [page, setPage] = useState("landing");
  const [toast, setToast] = useState({ visible: false, message: "", success: true });
  const toastTimer = useRef(null);

  function navigate(dest) {
    setPage(dest);
    window.scrollTo(0, 0);
  }

  function showToast(message, success = true) {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, message, success });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600;700&family=Mulish:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body { font-family: 'Mulish', sans-serif; }
        .leaflet-control-zoom, .leaflet-attribution-flag { display: none !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #5B050B; border-radius: 3px; }
      `}</style>

      {page === "landing" && <LandingPage navigate={navigate} />}
      {page === "login"   && <LoginPage   navigate={navigate} showToast={showToast} />}
      {page === "signup"  && <SignupPage  navigate={navigate} showToast={showToast} />}
      {page === "map"     && <MapPage     navigate={navigate} showToast={showToast} />}
      {page === "saved"   && <SavedPage   navigate={navigate} showToast={showToast} />}
      {page === "profile" && <ProfilePage navigate={navigate} showToast={showToast} />}

      <Toast message={toast.message} visible={toast.visible} success={toast.success} />
    </>
  );
}