import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import BaseLayout from '../components/BaseLayout';
import MusicPlayer from '../components/MusicPlayer';
import Section from '../components/Section';

/* ── Config Loader Hook ── */
interface LetterConfig {
  theme?: string;
  recipient?: string;
  sender?: string;
  recipientName?: string;
  senderName?: string;
  message?: string[];
  photos?: { src: string; alt: string; caption?: string }[] | string[];
  chapters?: { title: string; text: string }[];
  captions?: string[];
  audioSrc?: string;
  autoplayAudio?: boolean;
  ultra?: boolean;
}

function useConfigLoader(path?: string) {
  const [config, setConfig] = useState<LetterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        let res: Response;
        if (path) {
          res = await fetch(path);
        } else {
          res = await fetch('/api/config');
        }
        if (!res.ok) throw new Error(`Failed to load config (${res.status})`);
        const data: LetterConfig = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [path]);

  return { config, loading, error };
}

/* ── Gold Particle Field ── */
function GoldParticleField({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  })), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(var(--primary), 0.12)',
            boxShadow: `0 0 ${p.size * 2}px rgba(var(--primary), 0.08)`,
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ── Film Grain Overlay (unique to Cinematic) ── */
function FilmGrain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 2, -1, 1, 0], y: [0, -1, 2, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.7'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}

/* ── Cinematic Scroll Progress ── */
function ScrollProgress({ progress }: { progress: any }) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: progress,
        background: 'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--primary-dim)))',
      }}
    />
  );
}

/* ── Cinematic Loading Screen ── */
function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgb(var(--bg-start))' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-8"
        style={{ backgroundColor: 'rgb(var(--bg-start))' }}
        initial={{ y: 0 }}
        animate={{ y: -32 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{ backgroundColor: 'rgb(var(--bg-start))' }}
        initial={{ y: 0 }}
        animate={{ y: 32 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Rotating diamond */}
      <motion.div
        className="relative w-20 h-20 mb-8"
        animate={{ rotate: 45 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-2 border rotate-45"
          style={{
            borderColor: 'rgb(var(--primary))',
            boxShadow: '0 0 30px rgba(var(--primary), 0.2)',
          }}
        />
        <div
          className="absolute inset-4 border"
          style={{
            borderColor: 'rgba(var(--primary), 0.3)',
            transform: 'rotate(22.5deg)',
          }}
        />
      </motion.div>

      <motion.p
        className="text-xs tracking-[0.5em] uppercase"
        style={{ color: 'rgb(var(--primary-dim))' }}
        initial={{ opacity: 0, letterSpacing: '0.8em' }}
        animate={{ opacity: 1, letterSpacing: '0.5em' }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Cinematic Letter
      </motion.p>

      {/* Loading progress */}
      <motion.div
        className="mt-8 h-[1px] w-32 origin-left"
        style={{ backgroundColor: 'rgba(var(--primary), 0.2)' }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: 'rgb(var(--primary))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Hero Section with parallax + 3D tilt ── */
function HeroSection({ recipientName }: { recipientName?: string }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.15], [0, 5]);

  return (
    <motion.section
      className="relative min-h-[110vh] flex flex-col items-center justify-center px-5 overflow-hidden"
      style={{ opacity, y, scale, rotateX, transformPerspective: 1200 }}
    >
      {/* Cinematic rotating rings */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{ border: '1px solid rgba(var(--primary), 0.04)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{ border: '1px solid rgba(var(--primary), 0.06)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{ border: '1px solid rgba(var(--primary), 0.08)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      {/* Central glow */}
      <div
        className="absolute w-[200px] h-[200px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(var(--primary), 0.3), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center relative z-10"
      >
        <motion.p
          className="text-[10px] tracking-[0.6em] uppercase mb-8"
          style={{ color: 'rgb(var(--primary-dim))' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Sebuah Surat Untukmu
        </motion.p>

        <h1
          className="text-5xl md:text-7xl lg:text-[7rem] font-serif mb-8 leading-[1.1] tracking-tight"
          style={{ color: 'rgb(var(--primary))' }}
        >
          {recipientName || 'Dear You'}
        </h1>

        <motion.div
          className="w-12 h-px mx-auto mb-6"
          style={{ backgroundColor: 'rgb(var(--primary))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        <motion.p
          className="text-sm md:text-base max-w-lg mx-auto leading-relaxed font-serif-alt italic"
          style={{ color: 'rgb(var(--text-muted))' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Beberapa kata butuh seumur hidup untuk ditulis, tapi hanya sekejap untuk dibaca.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border flex justify-center pt-2"
          style={{ borderColor: 'rgba(var(--primary), 0.2)' }}
        >
          <motion.div
            className="w-[2px] h-2 rounded-full"
            style={{ backgroundColor: 'rgb(var(--primary))' }}
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* ── 3D Parallax Section Wrapper ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0, -1.5]);
  return (
    <motion.div className={className} style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}>
      {children}
    </motion.div>
  );
}

/* ── Emotional Depth Section (new) ── */
function EmotionalDepthSection() {
  const paragraphs = [
    "Aku ingat pertama kali aku melihatmu — bukan hanya cahaya yang menangkap matamu, tapi cara seluruh ruangan seolah bergeser, seolah alam semesta telah menyusun ulang dirinya untuk memberi tempat bagimu di dunia ini. Itu sunyi, hampir tak terasa, tapi aku merasakannya di setiap serat keberadaanku.",
    "Ada jenis cinta yang tidak mengumumkan dirinya dengan kembang api. Ia datang seperti fajar — perlahan, lembut, mewarnai langit dengan warna-warna yang tak pernah kau tahu ada. Itulah yang kau lakukan padaku. Kau mengubah hari-hariku yang biasa menjadi sesuatu yang layak dikenang.",
    "Aku telah belajar bahwa cinta bukan tentang kesempurnaan. Ini tentang hadir, hari demi hari, dengan semua kekuranganmu terbuka dan hatimu lebar terbuka. Ini tentang memilih seseorang bahkan ketika dunia memberimu seribu alasan untuk tidak. Dan aku memilihmu — setiap hari.",
    "Kata-kata ini mungkin pudar seiring waktu, tapi perasaan yang mereka bawa terukir di bagian terdalam diriku. Kau bukan sekadar bab dalam ceritaku — kau adalah seluruh narasi, benang yang menghubungkan setiap momen bermakna yang pernah kukenal.",
    "Jadi di sini, dalam ruang sunyi antara kata dan keheningan, aku tinggalkan untukmu ini: kau dicintai, mendalam dan sepenuhnya, dengan cara yang tak bisa kata-kata ungkapkan sepenuhnya. Dan cinta itu — cintaku padamu — akan melampaui setiap bintang di langit.",
  ];

  return (
    <Section>
      <ParallaxSection speed={0.1}>
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] tracking-[0.5em] uppercase mb-4 font-semibold"
              style={{ color: 'rgb(var(--primary-dim))' }}>
              Perasaanku
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide"
              style={{ color: 'rgb(var(--primary))' }}>
              Jam-Jam Hening
            </h2>
            <div className="w-16 h-[1px] mx-auto mt-6"
              style={{ background: `linear-gradient(90deg, transparent, rgba(var(--primary), 0.3), transparent)` }} />
          </motion.div>

          {paragraphs.map((text, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="text-lg md:text-xl leading-[2] font-serif-alt italic text-white/80">
                {i === 0 && (
                  <span className="text-5xl md:text-6xl font-serif float-left mr-3 mt-1 leading-none"
                    style={{ color: 'rgb(var(--primary))' }}>
                    {text.charAt(0)}
                  </span>
                )}
                {i === 0 ? text.slice(1) : text}
              </p>
              {i < paragraphs.length - 1 && (
                <div className="flex justify-center mt-10">
                  <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ParallaxSection>
    </Section>
  );
}

/* ── Opening Chapter ── */
function OpeningChapter({ message, recipientName }: { message?: string[]; recipientName?: string }) {
  const lines = message && message.length > 0
    ? message[0]?.split('\n') || []
    : [        'Sejak pertama kita bertemu, sesuatu telah berubah di alam semesta.', 'Penyesuaian bintang yang sunyi dan baru kini mengerti maknanya.'];

  return (
    <Section fullScreen>
      <ParallaxSection speed={0.12}>
        <div className="glass p-8 md:p-16 max-w-3xl mx-auto">
          <motion.p
            className="text-[10px] tracking-[0.4em] uppercase mb-8"
            style={{ color: 'rgb(var(--primary-dim))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Bab Satu
          </motion.p>

          <motion.p
            className="text-xs tracking-[0.25em] uppercase mb-6"
            style={{ color: 'rgb(var(--primary-dim))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kepada {recipientName || 'Kamu'}
          </motion.p>

          <div className="space-y-5">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                className="text-lg md:text-xl leading-[1.8] font-serif-alt italic"
                style={{ color: 'rgb(var(--text))' }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {i === 0 && (
                  <span className="text-5xl md:text-6xl font-serif float-left mr-3 mt-1 leading-none" style={{ color: 'rgb(var(--primary))' }}>
                    {line.charAt(0)}
                  </span>
                )}
                {i === 0 ? line.slice(1) : line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-10 h-px w-20"
            style={{ backgroundColor: 'rgb(var(--primary))' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </div>
      </ParallaxSection>
    </Section>
  );
}

/* ── Photo Card with Ken Burns effect ── */
function PhotoCard({ src, alt, caption, index }: { src: string; alt: string; caption?: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.25s ease-out' }}
    >
      <div className="glass overflow-hidden rounded-glass">
        {/* Ken Burns slow zoom */}
        <motion.div
          className="aspect-[4/5] bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 12 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {caption && (
        <motion.p
          className="mt-4 text-[11px] text-center tracking-[0.15em] font-serif-alt italic"
          style={{ color: 'rgb(var(--text-muted))' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.12 + 0.3 }}
        >
          {caption}
        </motion.p>
      )}
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(var(--primary), 0.08), transparent 70%)',
        }}
      />
      {/* Cinematic vignette on hover */}
      <div
        className="absolute inset-0 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
        }}
      />
    </motion.div>
  );
}

/* ── Chapter Divider ── */
function ChapterDivider({ number }: { number: number }) {
  return (
    <div className="flex items-center justify-center gap-6 py-16">
      <motion.div
        className="h-px flex-1 max-w-20"
        style={{ backgroundColor: 'rgba(var(--primary), 0.15)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.span
        className="text-[10px] tracking-[0.5em] uppercase"
        style={{ color: 'rgb(var(--primary-dim))' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Bab {number}
      </motion.span>
      <motion.div
        className="h-px flex-1 max-w-20"
        style={{ backgroundColor: 'rgba(var(--primary), 0.15)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
}

/* ── Closing Section ── */
function ClosingSection({ senderName }: { senderName?: string }) {
  return (
    <Section fullScreen>
      <div className="text-center">
        <motion.div
          className="mb-10"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg className="w-10 h-10 mx-auto" style={{ color: 'rgb(var(--primary))' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        <motion.p
          className="text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: 'rgb(var(--primary-dim))' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Dengan Cinta
        </motion.p>

        <motion.p
          className="text-3xl md:text-4xl lg:text-5xl font-serif"
          style={{ color: 'rgb(var(--primary))' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {senderName || 'Me'}
        </motion.p>

        <motion.div
          className="mt-10 h-px w-16 mx-auto"
          style={{ backgroundColor: 'rgba(var(--primary), 0.3)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </div>
    </Section>
  );
}

/* ── Main Page ── */
export default function Home() {
  const { config, loading } = useConfigLoader();
  const { scrollYProgress } = useScroll();
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [showLoading, setShowLoading] = useState(true);
  const theme = config?.theme || 'ultra-cinematic';
  const ultra = true;

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || showLoading) {
    return (
      <BaseLayout theme={theme} ultra={ultra}>
        <LoadingScreen />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout theme={theme} ultra={ultra} className="relative">
      <ScrollProgress progress={scrollProgress} />
      <GoldParticleField count={18} />
      <FilmGrain />

      <MusicPlayer
        audioSrc={config?.audioSrc}
        autoPlay={config?.autoplayAudio}
      />

      <HeroSection recipientName={config?.recipientName || config?.recipient} />

      <ChapterDivider number={1} />

      <OpeningChapter
        message={config?.chapters?.map(c => c.text) || config?.message}
        recipientName={config?.recipientName || config?.recipient}
      />

      {/* Photo Gallery */}
      {config?.photos && config.photos.length > 0 && (
        <>
          <ChapterDivider number={2} />
          <Section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
              {config.photos.map((photo, i) => (
                <PhotoCard key={i} {...photo} index={i} />
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Emotional Depth */}
      <ChapterDivider number={3} />
      <EmotionalDepthSection />

      {/* Remaining message lines */}
      {config?.message && config.message.length > 1 && (
        <>
          <ChapterDivider number={4} />
          <Section>
            <ParallaxSection speed={0.1}>
              <div className="glass p-8 md:p-16 max-w-3xl mx-auto space-y-8">
                {config.message.slice(1).map((paragraph, i) => (
                  <motion.p
                    key={i}
                    className="text-lg md:text-xl leading-[1.8] font-serif-alt italic"
                    style={{ color: 'rgb(var(--text))' }}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </ParallaxSection>
          </Section>
        </>
      )}

      <ClosingSection senderName={config?.senderName} />
    </BaseLayout>
  );
}
