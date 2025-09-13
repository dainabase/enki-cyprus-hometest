import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  initials: string;
  title: string;
  name: string;
  description: string;
  country: string;
}

const testimonials: Testimonial[] = [
  {
    initials: "M.D",
    name: "Marie Dubois",
    title: "Investisseur, France",
    country: "🇫🇷",
    description:
      "L'équipe ENKI a parfaitement compris mes besoins d'optimisation fiscale. Leur expertise du marché chypriote et l'accompagnement Golden Visa ont été exceptionnels. Je recommande vivement leurs services."
  },
  {
    initials: "J.S",
    name: "John Smith",
    title: "Entrepreneur, UK",
    country: "🇬🇧",
    description:
      "Outstanding service from start to finish. The AI assistant helped me find the perfect property in Limassol within my budget. The team handled all legal aspects professionally."
  },
  {
    initials: "A.P",
    name: "Alexander Petrov",
    title: "Investisseur, Russie",
    country: "🇷🇺",
    description:
      "Профессиональная команда с глубоким знанием рынка. Помогли с выбором недвижимости в Пафосе и оформлением всех документов. Сервис на высшем уровне."
  },
  {
    initials: "L.M",
    name: "Liu Ming",
    title: "Investisseur, Chine",
    country: "🇨🇳",
    description:
      "专业的团队，对塞浦路斯房地产市场了解深入。Golden Visa申请过程顺利，投资回报超出预期。强烈推荐ENKI Reality的服务。"
  },
  {
    initials: "G.R",
    name: "Giuseppe Rossi",
    title: "Retraité, Italie",
    country: "🇮🇹",
    description:
      "Ho trovato la casa dei miei sogni a Cipro grazie a ENKI. Il team parla italiano e mi ha guidato in ogni fase dell'acquisto. Servizio impeccabile e grande professionalità."
  },
  {
    initials: "S.K",
    name: "Stefan Koch",
    title: "Investisseur, Allemagne",
    country: "🇩🇪",
    description:
      "Hervorragende Beratung und Unterstützung beim Immobilienkauf in Zypern. Das Team kennt sich bestens mit Steueroptimierung und Golden Visa aus. Sehr empfehlenswert!"
  }
];

export default function TestimonialsSection() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="bg-gradient-to-br from-[#FDF0E4] via-white to-[#D3E3F0] py-24 px-4 lg:px-8 grid items-center grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 overflow-hidden">
      <div className="p-4">
        <h3 className="text-5xl font-semibold text-[#A17964]">
          Ce que disent nos clients
        </h3>
        <p className="text-gray-600 my-4">
          Des investisseurs du monde entier nous font confiance pour leur projet immobilier à Chypre. 
          Découvrez leurs témoignages et rejoignez notre communauté internationale.
        </p>
        <SelectBtns
          numTracks={testimonials.length}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <Cards
        testimonials={testimonials}
        setSelected={setSelected}
        selected={selected}
      />
    </section>
  );
}

const SelectBtns = ({
  numTracks,
  setSelected,
  selected,
}: {
  numTracks: number;
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
}) => {
  return (
    <div className="flex gap-1 mt-8">
      {Array.from(Array(numTracks).keys()).map((n) => {
        return (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="h-1.5 w-full bg-gray-300 relative"
          >
            {selected === n ? (
              <motion.span
                className="absolute top-0 left-0 bottom-0 bg-[#57B9D6]"
                initial={{
                  width: "0%",
                }}
                animate={{
                  width: "100%",
                }}
                transition={{
                  duration: 5,
                }}
                onAnimationComplete={() => {
                  setSelected(selected === numTracks - 1 ? 0 : selected + 1);
                }}
              />
            ) : (
              <span
                className="absolute top-0 left-0 bottom-0 bg-[#57B9D6]"
                style={{
                  width: selected > n ? "100%" : "0%",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

const Cards = ({
  testimonials,
  selected,
  setSelected,
}: {
  testimonials: Testimonial[];
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="p-4 relative h-[450px] lg:h-[500px] shadow-xl rounded-2xl">
      {testimonials.map((t, i) => {
        return (
          <Card
            {...t}
            key={i}
            position={i}
            selected={selected}
            setSelected={setSelected}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  initials,
  description,
  name,
  title,
  country,
  position,
  selected,
  setSelected,
}: Testimonial & {
  position: number;
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}) => {
  const scale = position <= selected ? 1 : 1 + 0.015 * (position - selected);
  const offset = position <= selected ? 0 : 95 + (position - selected) * 3;
  const background = position % 2 ? "#57B9D6" : "#FDF0E4";
  const color = position % 2 ? "white" : "#A17964";

  return (
    <motion.div
      initial={false}
      style={{
        zIndex: position,
        transformOrigin: "left bottom",
        background,
        color,
      }}
      animate={{
        x: `${offset}%`,
        scale,
      }}
      whileHover={{
        translateX: position === selected ? 0 : -3,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      onClick={() => setSelected(position)}
      className="absolute top-0 left-0 w-full min-h-full p-8 lg:p-12 cursor-pointer flex flex-col justify-between rounded-2xl"
    >
      <div className="flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-3xl font-bold">{initials}</span>
        </div>
        <span className="ml-4 text-4xl">{country}</span>
      </div>
      
      <p className="text-lg lg:text-xl font-light italic my-8">
        "{description}"
      </p>
      
      <div>
        <span className="block font-semibold text-lg">{name}</span>
        <span className="block text-sm opacity-90">{title}</span>
      </div>
    </motion.div>
  );
};