import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ThemeProvider } from '@/lib/theme';
import Battleground from '@/components/Battleground';
import OpeningSequence from '@/components/OpeningSequence';
import Navbar from '@/components/Navbar';
import Home from '@/components/sections/Home';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

const INTRO_MUSIC = 'https://res.cloudinary.com/sbfmucqg/video/upload/v1794035389/PUBG_MOBILE_THEME_MUSIC_Versi_Okestra.mp3';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.45;
    void audio.play();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    void audio.play().catch(() => undefined);
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) void audio.play();
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <audio ref={audioRef} src={INTRO_MUSIC} loop preload="auto" />
        {introDone ? (
          <>
            <Battleground />
            <Navbar />
            <main>
              <Home />
              <About />
              <Skills />
              <Projects />
              <Resume />
              <Contact />
            </main>
            <Footer />
            <button
              type="button"
              onClick={toggleMusic}
              className="music-toggle"
              aria-label={muted ? 'Unmute intro music' : 'Mute intro music'}
              title={muted ? 'Unmute music' : 'Mute music'}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </>
        ) : (
          <OpeningSequence onBegin={startMusic} onComplete={() => setIntroDone(true)} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
