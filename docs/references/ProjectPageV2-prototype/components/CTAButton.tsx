import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackCTAClick } from '../utils/tracking';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'arrow' | 'phone' | 'mail' | 'none';
  location: string;
  fullWidth?: boolean;
  className?: string;
}

export function CTAButton({
  text,
  onClick,
  variant = 'primary',
  size = 'md',
  icon = 'arrow',
  location,
  fullWidth = false,
  className = ''
}: CTAButtonProps) {

  const handleClick = () => {
    trackCTAClick(text, location);
    onClick?.();
  };

  const iconMap = {
    arrow: ArrowRight,
    phone: Phone,
    mail: Mail,
    none: null
  };

  const IconComponent = iconMap[icon];

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg'
  };

  const variantClasses = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={fullWidth ? 'w-full' : 'inline-block'}
    >
      <Button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          rounded-full font-medium
          transition-all duration-300
          flex items-center justify-center gap-2
          ${className}
        `}
      >
        {text}
        {IconComponent && (
          <IconComponent className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
        )}
      </Button>
    </motion.div>
  );
}
