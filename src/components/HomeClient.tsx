"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import UserMenu from "@/components/UserMenu";

/* ───────────── Custom hook: Intersection Observer for scroll-reveal ───────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ───────────── Custom hook: 3D card tilt on mouse move ───────────── */
function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/* ───────────── Custom hook: Magnetic button effect ───────────── */
function useMagnetic() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    };

    const handleLeave = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return ref;
}

/* ───────────── Custom hook: Counter animation ───────────── */
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function HomeClient({ settings, services, portfolios, testimonials, faqs }: any) {
  /* --- Cursor follower state --- */
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* --- Hover-aware class toggle --- */
  const hoverProps = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  };

  /* --- Navbar scroll shadow --- */
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 20) {
          headerRef.current.classList.add("navbar-scrolled");
        } else {
          headerRef.current.classList.remove("navbar-scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* --- FAQ accordion state --- */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* --- Reveal refs --- */
  const heroReveal = useReveal();
  const servicesHeadReveal = useReveal();
  const keunggulanReveal = useReveal();
  const alurReveal = useReveal();
  const portfolioReveal = useReveal();
  const testimonialReveal = useReveal();
  const faqReveal = useReveal();
  const formReveal = useReveal();

  /* --- Card tilt refs --- */
  const card1 = useCardTilt();
  const card2 = useCardTilt();
  const card3 = useCardTilt();

  /* --- Magnetic button --- */
  const magneticBtn = useMagnetic();

  /* --- Counter refs --- */
  const counter1 = useCounter(500, 2000);
  const counter2 = useCounter(15, 1800);
  const counter3 = useCounter(98, 2200);

  /* --- Parallax for hero bg --- */
  const heroBgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current) {
        const scrolled = window.scrollY;
        heroBgRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* --- Typewriter effect for hero subtitle --- */
  const fullText = "Jasa Jahit & Konveksi Profesional";
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 font-sans selection:bg-[#06371c] selection:text-white pb-0">

      {/* CURSOR FOLLOWER */}
      <div
        ref={cursorRef}
        className={`cursor-follower ${isHovering ? "hovering" : ""}`}
      />

      {/* HEADER */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 md:px-12 py-3 flex justify-between items-center transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#c7646b]">
            {/* Custom SVG Icon to approximate the logo in the image */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 3h-6z" />
              <path d="M9 5v4a3 3 0 0 0 6 0V5" />
              <path d="M12 12v6" />
              <circle cx="12" cy="20" r="2" />
              <line x1="7" y1="14" x2="17" y2="10" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-xl tracking-tight text-[#1e293b]">
              {settings.websiteName.includes('.') ? (
                <>
                  {settings.websiteName.split('.')[0]}
                  <span className="text-gray-400 font-normal">.{settings.websiteName.split('.').slice(1).join('.')}</span>
                </>
              ) : (
                settings.websiteName
              )}
            </span>
            <span className="text-[10.5px] text-gray-500 font-medium -mt-1">{settings.heroSubtitle}</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex gap-8 items-center">
          {[
            { label: "Beranda", href: "#", active: true },
            { label: "Layanan", href: "#layanan", active: false },
            { label: "Cara Pesan", href: "#alur", active: false },
            { label: "Tentang Kami", href: "#", active: false },
            { label: "Kontak", href: "#konsultasi", active: false }
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className={`text-sm font-semibold transition-colors relative pb-1 ${item.active ? "text-[#c7646b]" : "text-[#475569] hover:text-[#c7646b]"}`}
              {...hoverProps}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c7646b]" />
              )}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-6">
          <a
            ref={magneticBtn}
            href="/auth/login?redirect=whatsapp"
            target="_self"
            rel="noopener noreferrer"
            className="magnetic-hover bg-[#06371c] hover:bg-[#0a4d29] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 shadow-md shadow-[#06371c]/20 ripple"
            {...hoverProps}
          >
            Pesan Sekarang
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          <UserMenu />
        </div>
      </header>

      {/* HERO SECTION — Full-width seamless image blend + parallax */}
      <main className="relative overflow-hidden bg-[#f5f0eb]">
        {/* Background image with parallax */}
        <div className="absolute inset-0">
          <div 
            ref={heroBgRef}
            className="absolute top-0 right-0 w-full h-[120%] bg-cover bg-center bg-no-repeat will-change-transform"
            style={{ 
              backgroundPosition: '65% center',
              backgroundImage: settings.heroImage ? `url(${settings.heroImage})` : `url('/hero-blend.jpg')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0eb] via-[#f5f0eb]/95 via-[40%] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0eb]/30 via-transparent to-[#f5f0eb]/40"></div>
        </div>

        {/* Floating decorative particles */}
        <div className="particle bg-[#06371c] w-3 h-3 top-[20%] left-[15%]" style={{ animationDuration: '12s' }} />
        <div className="particle bg-[#00c2ff] w-2 h-2 top-[40%] left-[25%]" style={{ animationDuration: '16s', animationDelay: '2s' }} />
        <div className="particle bg-[#06371c] w-4 h-4 top-[60%] left-[10%]" style={{ animationDuration: '20s', animationDelay: '4s' }} />
        <div className="particle bg-[#00c2ff] w-2 h-2 top-[30%] left-[35%]" style={{ animationDuration: '14s', animationDelay: '1s' }} />
        
        <div ref={heroReveal} className="reveal relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-28">
          <div className="max-w-xl lg:max-w-[550px]">
            
            <p className="text-[#06371c] font-semibold tracking-[0.2em] uppercase text-xs mb-6">
              <span className={showCursor ? "typewriter-cursor" : ""}>{typedText}</span>
            </p>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-[1.15] tracking-tight mb-6">
              {settings.heroTitle.includes(',') ? (
                <>
                  {settings.heroTitle.split(',')[0]},{" "}
                  <br className="hidden md:block" />
                  <span className="animated-gradient-text">
                    {settings.heroTitle.split(',').slice(1).join(',').trim()}
                  </span>
                </>
              ) : (
                settings.heroTitle
              )}
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-md reveal stagger-2 visible">
              {settings.heroDescription}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-12">
              <a 
                href="/auth/login?redirect=whatsapp" 
                target="_self" 
                rel="noopener noreferrer" 
                className="bg-[#06371c] hover:bg-[#0a4d29] text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2.5 shadow-lg shadow-[#06371c]/20 ripple hover:scale-105 hover:shadow-xl"
                {...hoverProps}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {settings.heroCtaText || "Pesan Sekarang"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a 
                href="#portofolio" 
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 hover:shadow-md"
                {...hoverProps}
              >
                Lihat Portofolio
              </a>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-6 md:gap-10 pt-8 border-t border-gray-300/40">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>, title: "Bahan Premium", sub: "Pilihan" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, title: "Jahitan Rapi &", sub: "Tahan Lama" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>, title: "Harga Kompetitif", sub: "& Transparan" },
            ].map((badge, i) => (
              <div key={i} className={`flex items-center gap-3 group stagger-${i + 3}`} {...hoverProps}>
                <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#06371c] shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 animate-float-slow" style={{ animationDelay: `${i * 0.5}s` }}>
                  {badge.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm group-hover:text-[#06371c] transition-colors">{badge.title}</p>
                  <p className="text-gray-500 text-xs">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* STATS BAR */}
      <div className="bg-[#06371c] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-3 gap-8 text-center">
          <div ref={counter1.ref} className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-1">{counter1.count}+</div>
            <div className="text-white/60 text-xs md:text-sm font-medium">Klien Puas</div>
          </div>
          <div ref={counter2.ref} className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-1">{counter2.count}+</div>
            <div className="text-white/60 text-xs md:text-sm font-medium">Tahun Pengalaman</div>
          </div>
          <div ref={counter3.ref} className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-1">{counter3.count}%</div>
            <div className="text-white/60 text-xs md:text-sm font-medium">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="layanan" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div ref={servicesHeadReveal} className="reveal flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#06371c] font-semibold tracking-wider uppercase text-sm mb-2 block">Layanan Profesional</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Layanan Kustom Sesuai Kebutuhan Anda</h2>
            </div>
            <a href="/auth/login?redirect=whatsapp" target="_self" className="bg-[#f3f7f4] text-[#06371c] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#e0ece5] transition-colors hover:scale-105">
              Pesan Layanan Spesifik →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {services.map((svc: any, i: number) => (
              <div key={svc.id} ref={i === 0 ? card1 : i === 1 ? card2 : card3} className="card-tilt bg-[#fafafa] border border-gray-100 p-8 rounded-3xl group shimmer-container" {...hoverProps}>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#06371c] mb-6 icon-spin-hover" dangerouslySetInnerHTML={{ __html: svc.icon || "" }} />
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#06371c] transition-colors">{svc.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">{svc.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {svc.tags.split(',').map((tag: string, j: number) => (
                    <span key={j} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg font-medium badge-hover hover:border-[#06371c]/30 hover:text-[#06371c] transition-colors cursor-default">{tag.trim()}</span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div className="font-semibold text-gray-900">{svc.price}</div>
                  <a href="/auth/login?redirect=whatsapp" target="_self" className="text-[#06371c] font-bold text-sm hover:underline group-hover:translate-x-1 transition-transform">Pesan via WA →</a>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section className="py-24 bg-[#f3f7f4] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-[100px] opacity-60"></div>
        <div ref={keunggulanReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
          <span className="text-[#06371c] font-semibold tracking-wider uppercase text-sm mb-4 block">Mengapa JahitPakaian</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-16 max-w-3xl mx-auto leading-tight">
            Sentuhan Pengrajin Handal & Kemudahan Layanan Digital
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>,
                title: "Master Tailor 15 Tahun",
                desc: "Pakaian Anda ditangani langsung oleh penjahit senior bersertifikasi dengan pengalaman lebih dari 15 tahun di industri butik."
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
                title: "Garansi Hasil Jahitan (Garansi Fit)",
                desc: "Kami memberikan revisi gratis hingga pakaian benar-benar pas dengan bentuk tubuh dan ekspektasi Anda, tanpa biaya ekstra."
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
                title: "Bebas Konsultasi + Antar Jemput",
                desc: "Konsultasi model dan bahan bisa via WA kapan saja. Tersedia layanan pick-up & delivery untuk wilayah tertentu."
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 stagger-${i + 1} shimmer-container`}
                {...hoverProps}
              >
                <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center text-[#06371c] mb-6 group-hover:bg-[#06371c] group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#06371c] transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALUR PEMESANAN */}
      <section id="alur" className="py-24 bg-white border-t border-gray-100">
        <div ref={alurReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <span className="text-[#06371c] font-semibold tracking-wider uppercase text-sm mb-4 block">Proses Mudah</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">4 Langkah Menuju Busana Impian</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Konsultasi & Foto", desc: "Kirim foto referensi atau keluhan pakaian, kami akan berikan solusi dan harga awal." },
              { num: "02", title: "Pengukuran & Bahan", desc: "Kirim ukuran atau ukur di tempat, pilih bahan berkualitas yang kami rekomendasikan." },
              { num: "03", title: "Proses Penjahitan", desc: "Master Tailor mulai bekerja. Anda akan mendapat update pengerjaan secara transparan." },
              { num: "04", title: "Fitting & Pengiriman", desc: "Pakaian siap dicoba. Jika pas, akan langsung dikirim atau dijemput di lokasi Anda." },
            ].map((step, i) => (
              <div key={i} className={`relative group cursor-default stagger-${i + 1}`} {...hoverProps}>
                <div className="text-6xl font-serif font-bold text-gray-100 mb-4 transition-all duration-500 group-hover:text-[#06371c]/20 group-hover:scale-110 group-hover:-translate-y-1">
                  {step.num}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 border-l-2 border-[#06371c] pl-4 group-hover:border-l-4 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm pl-4 leading-relaxed group-hover:text-gray-800 transition-colors">{step.desc}</p>
                
                {/* Connector line (desktop) */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#06371c]/30 to-transparent group-hover:from-[#06371c] transition-all duration-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO — Bento Grid Layout */}
      <section id="portofolio" className="py-24 bg-[#fafafa] border-y border-gray-100">
        <div ref={portfolioReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-[#06371c] font-semibold tracking-wider uppercase text-sm mb-4 block">Karya Kami</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Portofolio Karya Atelier</h2>
            </div>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shrink-0 hover:scale-105">
              Lihat Semua di Instagram →
            </a>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large featured image */}
            {portfolios.length > 0 && (
              <div className="lg:col-span-7 portfolio-card relative min-h-[500px] bg-gray-200 cursor-pointer group" {...hoverProps}>
                <div className="portfolio-img absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${portfolios[0].imageUrl})` }}></div>
                <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                {/* Hover glow overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#06371c]/30 via-transparent to-transparent pointer-events-none z-[1]" />
                <div className="absolute bottom-8 left-8 right-8 z-[3]">
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30 mb-3 inline-block portfolio-label">{portfolios[0].category}</span>
                  <h3 className="text-white font-bold text-2xl md:text-3xl mb-1 group-hover:translate-x-2 transition-transform duration-500">{portfolios[0].title}</h3>
                  <p className="text-white/70 text-sm group-hover:translate-x-2 transition-transform duration-700">{portfolios[0].description}</p>
                </div>
              </div>
            )}

            {/* Smaller images */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {portfolios.slice(1, 3).map((pf: any, i: number) => (
                <div key={pf.id} className="portfolio-card relative min-h-[240px] flex-1 bg-gray-200 cursor-pointer group" {...hoverProps}>
                  <div className="portfolio-img absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${pf.imageUrl})` }}></div>
                  <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#06371c]/30 via-transparent to-transparent pointer-events-none z-[1]" />
                  <div className="absolute bottom-6 left-6 right-6 z-[3]">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30 mb-2 inline-block portfolio-label">{pf.category}</span>
                    <h3 className="text-white font-bold text-xl group-hover:translate-x-2 transition-transform duration-500">{pf.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div ref={testimonialReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Heading + CTA */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="text-[#06371c] font-semibold tracking-wider uppercase text-sm mb-4 block">Testimoni Pelanggan</span>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6 leading-tight">Dipercaya Ribuan Klien di Seluruh Indonesia</h2>
              <p className="text-gray-600 leading-relaxed mb-8">Bukan sekadar jasa jahit — kami membangun hubungan kepercayaan lewat setiap detail jahitan yang presisi.</p>
              <a
                href="#konsultasi"
                className="bg-[#06371c] hover:bg-[#0a4d29] text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all w-max shadow-lg shadow-[#06371c]/20 ripple hover:scale-105"
                {...hoverProps}
              >
                Konsultasi Sekarang
              </a>
            </div>
            
            {/* Right: Testimonial Cards */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Featured testimonial */}
              {testimonials.length > 0 && (
                <div className="bg-[#f3f7f4] border border-[#d1e0d7] p-8 rounded-3xl hover:shadow-lg transition-all duration-500 group" {...hoverProps}>
                  <div className="flex text-yellow-500 text-lg mb-5 tracking-widest">
                    {[...Array(testimonials[0].rating)].map((_, i) => (
                      <span key={i} className="inline-block hover:scale-125 transition-transform duration-200" style={{ transitionDelay: `${i * 50}ms` }}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed mb-8 italic group-hover:text-gray-900 transition-colors">
                    &quot;{testimonials[0].content}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#06371c] text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">{testimonials[0].initials}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonials[0].name}</h4>
                      <p className="text-gray-500 text-sm">{testimonials[0].role}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Smaller testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.slice(1, 3).map((t: any, i: number) => (
                  <div key={i} className="bg-[#fafafa] border border-gray-100 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group" {...hoverProps}>
                    <div className="flex text-yellow-500 text-sm mb-4 tracking-widest">
                      {[...Array(t.rating)].map((_, j) => (
                        <span key={j} className="inline-block hover:scale-125 transition-transform duration-200">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">&quot;{t.content}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${i % 2 === 0 ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"} flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform`}>{t.initials}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                        <p className="text-gray-500 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* FAQ — Split Layout with working Accordion */}
      <section id="faq" className="py-24 bg-[#fafafa] border-t border-gray-100">
        <div ref={faqReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Heading */}
            <div className="lg:col-span-4 flex flex-col justify-start">
              <span className="text-[#06371c] font-semibold tracking-wider uppercase text-xs mb-3 block">Tanya Jawab</span>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4 leading-tight">Pertanyaan yang Sering Ditanyakan</h2>
              <p className="text-gray-600 leading-relaxed mb-8">Belum menemukan jawaban yang Anda cari? Hubungi tim kami langsung — kami respon cepat.</p>


              {/* CTA Button */}
              <a 
                href="/auth/login?redirect=whatsapp" 
                target="_self" 
                rel="noopener noreferrer" 
                className="bg-[#06371c] hover:bg-[#0a4d29] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2.5 w-max shadow-lg shadow-[#06371c]/20 ripple hover:scale-105"
                {...hoverProps}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat Langsung via WhatsApp
              </a>
            </div>
            
            {/* Right: Accordion */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {faqs.map((item: any, i: number) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer ${
                    openFaq === i ? "border-[#06371c]/40 shadow-lg" : "border-gray-200 hover:border-[#06371c]/40 hover:shadow-md"
                  }`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  {...hoverProps}
                >
                  <div className="p-6 flex justify-between items-center">
                    <h3 className={`font-bold text-lg transition-colors ${openFaq === i ? "text-[#06371c]" : "text-gray-900"}`}>{item.question}</h3>
                    <div className={`text-[#06371c] text-xl font-light shrink-0 ml-4 transition-transform duration-500 ${openFaq === i ? "rotate-45 scale-125" : "group-hover:rotate-90"}`}>+</div>
                  </div>
                  <div className={`faq-item ${openFaq === i ? "open" : ""}`}>
                    <p className="text-gray-500 text-sm leading-relaxed px-6 pb-6">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section id="konsultasi" className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06371c]/10 rounded-full blur-[150px] pointer-events-none animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00c2ff]/5 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>
        <div ref={formReveal} className="reveal max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: CTA copy */}
            <div className="lg:col-span-5 flex flex-col justify-center text-white lg:sticky lg:top-32">
              <span className="text-[#00c2ff] font-semibold tracking-wider uppercase text-sm mb-4 block">Konsultasi Gratis</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                Mulai Wujudkan Pakaian Anda
              </h2>
              <p className="text-gray-400 leading-relaxed mb-10">
                Isi formulir di samping ini dengan detail kebutuhan Anda. Tim Master Tailor kami akan langsung menghubungi via WhatsApp dengan estimasi harga dan waktu pengerjaan.
              </p>
              
              <div className="flex flex-col gap-5">
                {[
                  "Respon cepat dalam 10 menit jam kerja",
                  "Konsultasi model dan bahan 100% gratis",
                  "Garansi fitting — revisi gratis jika belum pas",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 group" {...hoverProps}>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#00c2ff] shrink-0 group-hover:bg-[#00c2ff]/20 group-hover:scale-110 transition-all duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right: Form */}
            <div className="lg:col-span-7">
              <LeadForm />
            </div>
            
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] border-t border-white/10 pt-16 pb-8 px-6 md:px-12 lg:px-20 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 text-white w-8 h-8 flex items-center justify-center rounded-lg font-serif font-bold text-lg">J</div>
              <span className="font-serif font-bold text-xl tracking-tight text-white">jahitpakaian<span className="text-gray-500">.com</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Kami berdedikasi menciptakan pakaian sempurna untuk setiap bentuk tubuh. Presisi di setiap jahitan.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Layanan</h4>
            {["Penyesuaian & Alterasi", "Pembuatan Busana Baru", "Perbaikan & Resleting", "Layanan Ekspres 24 Jam"].map((item, i) => (
              <a key={i} href="#layanan" className="hover:text-white text-sm transition-colors hover:translate-x-1 inline-block transform duration-200">{item}</a>
            ))}
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Navigasi</h4>
            {[
              { label: "Layanan Jahit", href: "#layanan" },
              { label: "Alur Pemesanan", href: "#alur" },
              { label: "Portofolio", href: "#portofolio" },
              { label: "FAQ", href: "#faq" },
            ].map((item, i) => (
              <a key={i} href={item.href} className="hover:text-white text-sm transition-colors hover:translate-x-1 inline-block transform duration-200">{item.label}</a>
            ))}
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Kontak</h4>
            <div className="flex items-start gap-3 text-sm">
              <span className="shrink-0">📍</span> <span>{settings.address || "Belum ada alamat"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="shrink-0">🕒</span> <span>{settings.operationalHours || "Belum ada jam operasional"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="shrink-0">📞</span> <span>+{settings.whatsappNumber || "-"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="shrink-0">✉️</span> <span>{settings.email || "Belum ada email"}</span>
            </div>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 JahitPakaian.com. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
