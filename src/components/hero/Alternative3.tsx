import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const useMultilingualTypewriter = (texts: string[], speed: number = 35) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timer = setInterval(() => {
      if (isTyping) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setCurrentIndex((currentIndex + 1) % texts.length);
          setIsTyping(true);
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [texts, currentIndex, isTyping, charIndex, speed]);

  return displayText;
};

// Alternative 3: Titre intégré dans le header de la fenêtre
const Alternative3 = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const typewriterText = useMultilingualTypewriter([
    "Résident fiscal français, budget 250 000€, appartement 2 chambres proche mer, maximum 500m de la plage, résidence avec piscine, parking privé, vue mer, climatisation, quartier Limassol",
    "UK tax resident, £200,000 budget, 2-bedroom flat near beach, walking distance to shops, communal pool and gym, parking space, balcony with sea view, modern kitchen, Paphos area",
    "Residente fiscal español, 280.000€, piso 2 habitaciones en Limassol, cerca playa, piscina comunitaria, plaza de garaje, terraza grande, aire acondicionado, urbanización cerrada",
    "Residente fiscale italiano, 300.000€, appartamento 2 camere vista mare, piano alto, aria condizionata, parcheggio coperto, residence con piscina, vicino centro Limassol, terrazzo 20m²",
    "Έλληνας κάτοικος εξωτερικού, 250.000€, διαμέρισμα 2 υπνοδωμάτια Λεμεσός, κοντά σε παραλία, πάρκινγκ, ασανσέρ, μπαλκόνι με θέα θάλασσα, κλιματισμός, ανακαινισμένο",
    "Резидент России, 350 000€ для Golden Visa, квартира 2 спальни у моря в Лимассоле, охраняемая территория, подземный паркинг, бассейн, спортзал, вид на море",
    "中国投资者，35万欧元黄金签证，利马索尔海景公寓，2卧室，24小时保安，地下停车位，健身房和游泳池，可出租管理，高楼层，现代装修",
    "Deutscher Steuerresident, 280.000€, 2-Zimmer-Wohnung Larnaca, Erdgeschoss mit Terrasse, Strandnähe max 500m, Pool, Klimaanlage, Parkplatz, ruhige Lage, Neubau oder renoviert"
  ], 35);

  const handleSendMessage = () => {
    const value = inputValue.trim();
    if (!value) return;

    console.log('[Hero] handleSendMessage triggered via', { value });

    // Sauvegarder le texte pour transfert
    localStorage.setItem('pending-search', value);

    // Blur pour assurer le scroll (mobile/clavier)
    inputRef.current?.blur();

    const expansionSection = document.getElementById('expansion-container');
    const chatSection = document.getElementById('start-experience');

    const dispatchTransfer = () => {
      console.log('[Hero] dispatch hero-search-transferred');
      window.dispatchEvent(new CustomEvent('hero-search-transferred'));
    };

    const startY = window.scrollY;
    const targetSection = expansionSection || chatSection;
    if (targetSection) {
      const navbarOffset = 80;
      const y = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => {
        const moved = Math.abs(window.scrollY - startY) > 20;
        if (!moved) {
          window.location.hash = '#start-experience';
        }
        dispatchTransfer();
        
        // DÉCLENCHER LA TRUSTBAR APRÈS L'ARRIVÉE SUR LA SECTION
        setTimeout(() => {
          localStorage.setItem('search-clicked', 'true');
          window.dispatchEvent(new CustomEvent('search-clicked'));
        }, 300);
      }, 900);
    } else {
      window.location.hash = '#start-experience';
      setTimeout(() => {
        dispatchTransfer();
        // DÉCLENCHER LA TRUSTBAR APRÈS L'ARRIVÉE
        setTimeout(() => {
          localStorage.setItem('search-clicked', 'true');
          window.dispatchEvent(new CustomEvent('search-clicked'));
        }, 300);
      }, 500);
    }

    setInputValue('');
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full object-cover scale-125"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 scale-125"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/45" />
      
      {/* Contenu central */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        <motion.div className="mb-4">
          <motion.h1
            className="swaarg-hero-title text-white relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="relative inline-block"
            >
              ΣNKI-REALTY
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="relative w-96 h-[1px] mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>

        <motion.h2
          className="swaarg-large-title text-white/90 mb-16"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "-0.03em" }}
          transition={{ 
            duration: 2, 
            delay: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          Cyprus Properties
        </motion.h2>
      </div>

      {/* Chat Interface avec titre intégré dans le header */}
      <motion.div
        className="relative w-full max-w-2xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="relative bg-white/96 border border-white/25 rounded-xl shadow-2xl overflow-hidden"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        >
          {/* Header avec titre intégré */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 border-b border-gray-200/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-white text-xs font-medium tracking-wide">
                The First AI Powered Real Estate Platform
              </p>
            </div>
          </div>

          <div className="p-4">
            {/* Message typewriter */}
            <div className="mb-4 p-3 bg-gray-50/60 rounded-lg h-16 overflow-hidden">
              <div className="text-gray-800 text-xs leading-relaxed font-light">
                {typewriterText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </div>
            </div>

            {/* Input avec bouton intégré */}
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Votre recherche..."
                className="h-10 border-gray-200/40 focus:border-primary bg-white/80 rounded-lg text-sm pr-12"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
<button
  type="button"
  onClick={handleSendMessage}
  onPointerDown={() => { console.log('[Hero] pointerDown on search icon'); }}
  onTouchEnd={(e) => { e.preventDefault(); handleSendMessage(); }}
  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 bg-transparent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed z-50 pointer-events-auto"
  disabled={!inputValue.trim()}
  aria-label="Lancer la recherche"
>
  <Search className="w-4 h-4" />
</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Alternative3;
