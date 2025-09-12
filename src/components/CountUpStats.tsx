import React, { useEffect, useRef } from "react";
import { animate, useInView, motion } from "framer-motion";

export const CountUpStats = () => {
  return (
    <motion.section
      id="market-kpis"
      className="bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.h2 
          className="swaarg-large-title text-center mb-8 text-primary md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Un marché en <span className="text-cyprus-terra">forte croissance</span>
        </motion.h2>

        <div className="flex flex-col items-center justify-center sm:flex-row">
          <Stat
            num={6.5}
            suffix="%"
            prefix="+"
            decimals={1}
            title="Prix au m² en 2024"
            source="Sources : <a href='https://www.globalpropertyguide.com/Europe/Cyprus/Price-History' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Property Guide</a> · <a href='https://www.ceicdata.com/en/indicator/cyprus/house-prices-growth' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>CEIC Data Analytics</a>"
          />
          <div className="h-[2px] w-16 bg-border/60 sm:h-16 sm:w-[2px]" />
          <Stat
            num={23.9}
            decimals={1}
            suffix="K"
            title="Transactions en 2024"
            source="Sources : <a href='https://www.pwc.com.cy/en/publications/cyprus-real-estate-market-review.html' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>PwC Cyprus Real Estate Market Review</a> · <a href='https://cyprus-mail.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Cyprus Mail</a>"
          />
          <div className="h-[2px] w-16 bg-border/60 sm:h-16 sm:w-[2px]" />
          <Stat
            num={70}
            suffix="%"
            title="Taux d'occupation locative"
            source="Sources : <a href='https://airbtics.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Airbtics Analytics</a> · <a href='https://investropa.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Investropa Property Guide</a>"
          />
          <div className="h-[2px] w-16 bg-border/60 sm:h-16 sm:w-[2px]" />
          <Stat
            num={4.75}
            decimals={2}
            suffix="%"
            title="Rendement locatif brut moyen"
            source="Sources : <a href='https://www.globalcitizensolutions.com/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Citizens Solutions</a> · <a href='https://www.rics.org/cyprus/' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>RICS Cyprus</a> · <a href='https://www.globalpropertyguide.com/Europe/Cyprus' target='_blank' class='text-muted-foreground hover:text-primary hover:underline transition-colors'>Global Property Guide</a>"
          />
        </div>
      </div>
    </motion.section>
  );
};

interface Props {
  num: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  title: string;
  source: string;
}

const Stat = ({ num, suffix, prefix = "", decimals = 0, title, source }: Props) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <motion.div 
      className="flex w-72 flex-col items-center py-8 sm:py-0"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", damping: 20 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, transition: { type: "spring", damping: 15 } }}
    >
      <motion.p 
        className="mb-4 text-center text-6xl md:text-7xl font-light text-primary sm:text-6xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut", type: "spring", damping: 15 }}
        viewport={{ once: true }}
      >
        {prefix}
        <span ref={ref}></span>
        {suffix}
      </motion.p>
      
      <motion.h3
        className="mb-4 text-center text-lg font-medium text-primary max-w-64 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>
      
      <motion.div
        className="text-xs text-center max-w-64"
        dangerouslySetInnerHTML={{ __html: source }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
};