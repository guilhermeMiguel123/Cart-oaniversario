import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Sparkles, Heart, Gift } from 'lucide-react';

// Tipagem das propriedades da Caixa de Presente
interface CssGiftBoxProps {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  progress: number;
}

// --- CAIXA DE PRESENTE 3D (Elegante e Feminina) ---
const CssGiftBox = ({ onTouchStart, onTouchEnd, progress }: CssGiftBoxProps) => {
  const faceClass = "absolute w-full h-full border border-pink-200/50 bg-pink-100 flex items-center justify-center overflow-hidden shadow-sm";
  
  const shakeIntensity = progress > 0 ? (progress / 100) * 6 : 0;
  const xShake = (Math.random() - 0.5) * shakeIntensity;
  const yShake = (Math.random() - 0.5) * shakeIntensity;
  const boxScale = progress > 0 ? 1 - (progress / 100) * 0.08 : 1;

  return (
    <div 
      className="relative w-48 h-48 cursor-pointer group select-none" 
      style={{ perspective: '1000px', touchAction: 'none' }} 
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d', x: xShake, y: yShake }}
        animate={{ 
          rotateY: [0, 360],
          rotateX: [10, 20, 10],
          y: progress > 0 ? 0 : [0, -12, 0],
          scale: boxScale
        }}
        transition={{ 
          rotateY: { repeat: Infinity, duration: 8, ease: "linear" },
          rotateX: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => {
          let transform = '';
          switch(face) {
            case 'front': transform = 'rotateY(0deg) translateZ(96px)'; break;
            case 'back': transform = 'rotateY(180deg) translateZ(96px)'; break;
            case 'left': transform = 'rotateY(-90deg) translateZ(96px)'; break;
            case 'right': transform = 'rotateY(90deg) translateZ(96px)'; break;
            case 'top': transform = 'rotateX(90deg) translateZ(96px)'; break;
            case 'bottom': transform = 'rotateX(-90deg) translateZ(96px)'; break;
            default: break;
          }

          return (
            <div key={face} className={faceClass} style={{ transform }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
              <div className="absolute w-8 h-full bg-rose-300 shadow-[0_0_15px_rgba(253,164,175,0.4)]" />
              <div className="absolute w-full h-8 bg-rose-300 shadow-[0_0_15px_rgba(253,164,175,0.4)]" />
            </div>
          );
        })}
      </motion.div>

      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none opacity-80">
        <circle 
          cx="50%" cy="50%" r="42%" 
          fill="none" 
          stroke="#fda4af" 
          strokeWidth={progress > 80 ? "6" : "3"} 
          strokeDasharray="1000"
          strokeDashoffset={1000 - (progress / 100) * 1000}
          className="transition-all duration-75"
          style={{ filter: `drop-shadow(0 0 ${progress > 50 ? '12px' : '4px'} rgba(253,164,175,0.9))` }}
        />
      </svg>

      <motion.div 
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-8 bg-pink-300/40 rounded-[100%] blur-md"
        animate={{ scale: progress > 0 ? 0.8 : [1, 1.1, 1], opacity: progress > 0 ? 0.6 : [0.4, 0.2, 0.4] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
    </div>
  );
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  isHeart: boolean;
  delay: number;
}

const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 5 + 4,
      isHeart: Math.random() > 0.4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute flex items-center justify-center"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            y: [50, -150],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, p.isHeart ? 25 : 180]
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
           {p.isHeart ? 
             <Heart size={p.size * 12} className="text-pink-300/60 fill-pink-200/40" /> : 
             <Sparkles size={p.size * 10} className="text-rose-300/70" />
           }
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  
  const holdTimer = useRef<number | null>(null);

  const birthdayData = {
    nome: "Yasmin",
    idade: "20",
    frase: "Wake up! Grab a brush and put a little make-up...",
    mensagem: "Hoje celebramos a pessoa maravilhosa e única que és! Que os teus 20 anos tragam momentos inesquecíveis, sorrisos sinceros e toda a magia que mereces. Continua a brilhar com a tua autenticidade e doçura. O mundo é todo teu!"
  };

  const toggleAudio = () => setAudioPlaying(!audioPlaying);

  useEffect(() => {
    if (isPressing && !isOpen) {
      holdTimer.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (holdTimer.current !== null) window.clearInterval(holdTimer.current);
            triggerExplosion();
            return 100;
          }
          return prev + 1.2;
        });
      }, 20);
    } else {
      if (holdTimer.current !== null) window.clearInterval(holdTimer.current);
      if (progress < 100 && !isOpen) {
        setProgress(0);
      }
    }
    return () => {
      if (holdTimer.current !== null) window.clearInterval(holdTimer.current);
    };
  }, [isPressing, isOpen, progress]);

  const triggerExplosion = () => {
    setIsPressing(false);
    setShowFlash(true);
    setAudioPlaying(true);
    
    setTimeout(() => {
      setIsOpen(true);
    }, 400);

    setTimeout(() => {
      setShowFlash(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 80, damping: 12 } }
  };

  return (
    <div className="min-h-screen bg-rose-50 text-rose-950 font-sans selection:bg-pink-300 overflow-x-hidden relative">
      
      <AnimatePresence>
        {showFlash && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeIn" }}
            />
            <motion.div 
              className="absolute w-32 h-32 border-[20px] border-pink-200 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 25, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {audioPlaying && (
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/UrsugWL1Fss?autoplay=1&loop=1&playlist=UrsugWL1Fss"
          title="YouTube"
          frameBorder="0"
          allow="autoplay"
          className="hidden"
        />
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="gift-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-rose-50 via-pink-50 to-white overflow-hidden"
          >
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 bg-[radial-gradient(circle,transparent_10%,#ffe4e6_100%)]"
              style={{ opacity: progress / 100 }}
            />

            <div className="absolute top-20 text-center px-6 z-10">
              <motion.h1 
                className={`text-4xl font-serif tracking-wide transition-colors duration-500 ${progress > 50 ? 'text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'text-rose-800'}`}
              >
                Uma surpresa <br/> muito especial...
              </motion.h1>
              <motion.p 
                animate={progress > 0 ? { scale: 1.05 } : { scale: 1 }}
                className="text-rose-400 mt-4 text-sm font-medium tracking-widest uppercase bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-rose-100"
              >
                Pressiona e segura ✨
              </motion.p>
            </div>

            <div className="w-full flex-1 flex items-center justify-center mt-12 z-20">
              <CssGiftBox 
                onTouchStart={() => setIsPressing(true)}
                onTouchEnd={() => setIsPressing(false)}
                progress={progress}
              />
            </div>

            <motion.div 
              animate={{ y: [0, 5, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute bottom-12 flex flex-col items-center gap-2 z-10"
            >
              <Heart size={16} className={`transition-colors ${progress > 50 ? 'text-rose-500 fill-rose-500' : 'text-rose-300 fill-rose-300'}`} />
              <div className={`w-[1px] h-16 bg-gradient-to-b transition-colors ${progress > 50 ? 'from-rose-500' : 'from-rose-300'} to-transparent`} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="birthday-card"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="min-h-screen w-full p-6 pb-24 flex flex-col items-center bg-gradient-to-b from-rose-50 to-pink-100 relative"
          >
            <FloatingParticles />

            <motion.header variants={itemVariants} className="w-full pt-12 mb-8 text-center relative z-10">
              <h2 className="text-6xl font-serif text-rose-800 leading-none tracking-tight">
                {birthdayData.nome}
              </h2>
              <p className="text-xl font-medium uppercase tracking-[0.3em] text-rose-500 mt-4">
                Feliz 20 Anos
              </p>
            </motion.header>

            <motion.div variants={itemVariants} className="mb-10 text-center px-6 max-w-sm z-10">
              <p className="italic text-rose-700/70 text-sm font-medium leading-relaxed bg-white/40 backdrop-blur-sm py-3 px-5 rounded-2xl border border-white/60 shadow-sm">
                "{birthdayData.frase}"
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-sm z-10 mt-2">
              <motion.section 
                animate={{ y: [0, -8, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl relative shadow-[0_15px_40px_-15px_rgba(244,63,94,0.2)]"
              >
                <h3 className="text-center font-cursive text-rose-600 text-4xl mb-6">Parabéns!</h3>
                <p className="text-rose-900/80 text-center leading-relaxed text-[15px] font-medium">
                  {birthdayData.mensagem}
                </p>
              </motion.section>
            </motion.div>

            <div className="fixed bottom-8 right-8 z-50">
              <button onClick={toggleAudio} className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center border border-rose-100 shadow-lg">
                {audioPlaying ? <Volume2 size={24} className="text-rose-500" /> : <VolumeX size={24} className="text-rose-300" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-cursive { font-family: 'Dancing Script', cursive; }
      `}</style>
    </div>
  );
}