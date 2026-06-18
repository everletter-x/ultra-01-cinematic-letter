import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface Chapter {
  title: string;
  text: string;
}

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  chapters: Chapter[];
  captions: string[];
  closing: string;
}

function useConfigLoader<T>(path: string) {
  const [config, setConfig] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch(path)
      .then(r => r.json())
      .then(d => {
        setConfig(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [path]);
  return { config, loading, error };
}

function useIntersectionObserver(threshold = 0.5) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function ChapterSection({
  chapter,
  index,
  total,
  photo,
  caption,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  photo?: string;
  caption?: string;
}) {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  const gradients = [
    'from-deep-black via-dark-luxury/80 to-deep-black',
    'from-dark-luxury via-[#1a1520] to-dark-luxury',
    'from-dark-luxury via-[#1a1015] to-dark-luxury',
    'from-deep-black via-dark-luxury/90 to-deep-black',
  ];

  return (
    <section
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b ${
        gradients[index % gradients.length]
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Chapter number */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="text-gold-accent/40 font-serif text-sm tracking-[0.3em] uppercase">
          Bab {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-elegant-white mb-6 leading-tight">
              {chapter.title}
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-gold-accent to-transparent mb-8" />
            <p className="font-serif text-lg md:text-xl text-warm-white/70 leading-relaxed italic">
              {chapter.text}
            </p>
            {caption && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 text-gold-accent/60 text-sm tracking-widest uppercase"
              >
                {caption}
              </motion.p>
            )}
          </motion.div>

          {/* Photo side */}
          {photo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} flex justify-center`}
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-gold-accent/20 to-rose/20 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <motion.div
                  className="relative overflow-hidden rounded-lg shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img
                    src={photo}
                    alt={caption || 'Foto'}
                    className="w-full max-w-md h-auto object-cover"
                    animate={{
                      scale: [1, 1.05, 1],
                      x: [0, -5, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chapter progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-accent/30 to-transparent" />
    </section>
  );
}

function PhotoSection({
  photos,
  captions,
}: {
  photos: string[];
  captions: string[];
}) {
  const { ref, isVisible } = useIntersectionObserver(0.2);

  const particles = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      left: `${(i * 7 + 3) % 100}%`,
      top: `${(i * 11 + 5) % 100}%`,
      duration: 3 + (i % 4),
      delay: (i % 5) * 0.6,
    })), []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-luxury via-deep-black to-dark-luxury overflow-hidden py-20"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-accent/30 rounded-full"
            style={{
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-elegant-white mb-4">
            Momen-Momen Kita
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 * i }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-gold-accent/30 to-rose/30 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-dark-luxury">
                <motion.img
                  src={photo}
                  alt={captions[i] || 'Foto'}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif text-sm text-gold-accent/80 tracking-widest uppercase">
                    {captions[i]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LongLetterSection({ message, sender }: { message: string; sender: string }) {
  const { ref, isVisible } = useIntersectionObserver(0.2);
  const paragraphs = message.split('\n\n');

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-luxury via-[#0d0a0f] to-dark-luxury overflow-hidden py-20"
    >
      {/* Elegant background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Decorative quote mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 0.15, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -top-12 -left-8 text-gold-accent font-serif text-[120px] leading-none select-none"
          >
            &ldquo;
          </motion.div>

          <div className="space-y-8">
            {paragraphs.map((paragraph, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * i + 0.5 }}
              >
                {i === 0 ? (
                  <p className="font-serif text-xl md:text-2xl text-elegant-white leading-relaxed">
                    <span className="float-left text-6xl md:text-7xl text-gold-accent mr-3 mt-1 leading-none font-serif">
                      {paragraph.charAt(0)}
                    </span>
                    {paragraph.slice(1)}
                  </p>
                ) : (
                  <p className="font-serif text-xl md:text-2xl text-elegant-white/90 leading-relaxed italic">
                    {paragraph}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-12 text-right"
          >
            <p className="font-serif text-lg text-gold-accent/70 italic">
              Dengan cinta,
            </p>
            <p className="font-serif text-2xl text-elegant-white mt-2">
              {sender}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ClosingSection({ closing, recipient }: { closing: string; recipient: string }) {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-luxury via-deep-black to-dark-luxury">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(201,169,110,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(201,169,110,0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(201,169,110,0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.p
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-elegant-white mb-8 leading-tight"
            animate={
              isVisible
                ? { textShadow: ['0 0 0px rgba(201,169,110,0)', '0 0 30px rgba(201,169,110,0.3)', '0 0 0px rgba(201,169,110,0)'] }
                : {}
            }
            transition={{ duration: 4, repeat: Infinity }}
          >
            {closing}
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: '100px' } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="font-serif text-xl text-gold-accent/60 tracking-[0.2em]"
          >
            Untuk {recipient}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-black to-transparent" />
    </section>
  );
}

function ChapterNav({
  total,
  activeChapter,
}: {
  total: number;
  activeChapter: number;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {[...Array(total)].map((_, i) => (
        <motion.div
          key={i}
          className="relative"
          whileHover={{ scale: 1.5 }}
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === activeChapter
                ? 'bg-gold-accent shadow-[0_0_10px_rgba(201,169,110,0.5)]'
                : 'bg-gold-accent/20 hover:bg-gold-accent/50'
            }`}
          />
          {i === activeChapter && (
            <motion.div
              layoutId="activeChapter"
              className="absolute -inset-1 rounded-full border border-gold-accent/50"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function MusicButton({ music, musicTitle }: { music: string; musicTitle: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (music) {
      audioRef.current = new Audio(`/${music}`);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [music]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2 }}
      className="fixed bottom-8 left-8 z-50 flex items-center gap-3 px-5 py-3 bg-dark-luxury/80 backdrop-blur-md border border-gold-accent/30 rounded-full hover:border-gold-accent/60 transition-all duration-300 group min-h-[48px]"
      onClick={togglePlay}
      aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isPlaying ? { rotate: 360 } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 flex items-center justify-center"
      >
        {isPlaying ? (
          <div className="flex gap-0.5">
            <motion.div
              className="w-0.5 h-3 bg-gold-accent"
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="w-0.5 h-3 bg-gold-accent"
              animate={{ scaleY: [1.5, 1, 1.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="w-0.5 h-3 bg-gold-accent"
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        ) : (
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-gold-accent border-b-[5px] border-b-transparent ml-0.5" />
        )}
      </motion.div>
      <span className="text-xs text-gold-accent/70 font-serif tracking-wider">
        {musicTitle}
      </span>
    </motion.button>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-deep-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-12 h-12 border border-gold-accent/30 rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full border-t border-gold-accent rounded-full" />
        </motion.div>
        <p className="font-serif text-gold-accent/60 text-sm tracking-[0.3em] uppercase">
          Memuat
        </p>
      </motion.div>
    </div>
  );
}

export default function CinematicLetter() {
  const { config, loading, error } = useConfigLoader<Config>('/config.json');
  const [activeChapter, setActiveChapter] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && config) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, config]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const sections = containerRef.current.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setActiveChapter(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !config) {
    return (
      <div className="min-h-screen bg-dark-luxury flex items-center justify-center">
        <p className="text-rose">Gagal memuat konfigurasi</p>
      </div>
    );
  }

  const totalSections = 1 + config.chapters.length + 2 + 1; // opening + chapters + photos + letter + closing

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={`Surat untuk ${config.recipient} dari ${config.sender}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <AnimatePresence>
        {showContent && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Opening Scene */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Cinematic background */}
              <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-dark-luxury to-deep-black" />

              {/* Animated light rays */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-0 bg-gradient-conic from-gold-accent/10 via-transparent to-transparent rounded-full" />
                </motion.div>
              </div>

              <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Top decorative line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '120px' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mb-12"
                />

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="font-serif text-5xl md:text-6xl lg:text-7xl text-elegant-white mb-6 leading-tight"
                >
                  {config.title}
                </motion.h1>

                {/* Decorative element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  className="flex items-center justify-center gap-4 mb-8"
                >
                  <div className="w-8 h-[1px] bg-gold-accent/50" />
                  <div className="w-2 h-2 border border-gold-accent/50 rotate-45" />
                  <div className="w-8 h-[1px] bg-gold-accent/50" />
                </motion.div>

                {/* Message preview */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="font-serif text-lg md:text-xl text-warm-white/50 italic max-w-2xl mx-auto"
                >
                  {config.message.split('\n')[0]}
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 3 }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-gold-accent/40 tracking-[0.2em] uppercase">
                      Gulir ke bawah
                    </span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-gold-accent/40 to-transparent" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Chapter Sections */}
            {config.chapters.map((chapter, i) => (
              <ChapterSection
                key={i}
                chapter={chapter}
                index={i}
                total={config.chapters.length}
                photo={config.photos[i]}
                caption={config.captions[i]}
              />
            ))}

            {/* Photo Gallery Section */}
            <PhotoSection photos={config.photos} captions={config.captions} />

            {/* Long Letter Section */}
            <LongLetterSection message={config.message} sender={config.sender} />

            {/* Closing Section */}
            <ClosingSection closing={config.closing} recipient={config.recipient} />

            {/* Navigation */}
            <ChapterNav total={totalSections} activeChapter={activeChapter} />

            {/* Music Button */}
            <MusicButton music={config.music} musicTitle={config.musicTitle} />

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/6282320114535?text=Halo%2C%20saya%20tertarik%20dengan%20EverLetter%20Cinematic%20Letter!"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 left-6 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pesan Sekarang
            </a>

            {/* Pricing Badge */}
            <div className="fixed bottom-6 right-6 z-50 bg-dark-luxury/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gold-accent/30">
              <p className="text-elegant-white/60 text-xs mb-1">Ultra Premium</p>
              <p className="text-2xl font-bold text-gold-accent">Rp 95K</p>
            </div>

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'EverLetter - Cinematic Letter',
                    text: 'Lihat hadiah digital indah ini!',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link disalin ke clipboard!');
                }
              }}
              className="fixed bottom-20 right-6 z-50 bg-elegant-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-full shadow-lg hover:bg-elegant-white/30 transition-colors flex items-center gap-2"
              aria-label="Bagikan"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
