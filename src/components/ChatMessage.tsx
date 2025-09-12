import { motion } from 'framer-motion';
import { Property } from '@/lib/supabase';
import PropertyCard from '@/components/ui/PropertyCard';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  properties?: Property[];
  fiscalOptimization?: {
    preview: string;
    details?: any;
  };
}

interface ChatMessageProps {
  message: ChatMessage;
}

// Indicateur de frappe IA
const TypingIndicator = () => (
  <div className="flex gap-1">
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
  </div>
);

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === 'user') {
    return (
      <motion.div 
        className="flex justify-end mb-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-primary text-white p-4 rounded-2xl rounded-br-md max-w-[70%] shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <span className="text-xs text-white/70 mt-2 block">
            {message.timestamp.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </motion.div>
    );
  }

  // Message IA
  return (
    <motion.div 
      className="flex justify-start mb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-100/80 p-4 rounded-2xl rounded-bl-md max-w-[80%] shadow-sm">
        {message.isTyping ? (
          <div className="flex items-center gap-3">
            <TypingIndicator />
            <span className="text-sm text-gray-600">L'IA analyse votre demande...</span>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-gray-800 mb-3">{message.content}</p>
            
            {/* Layout optimisé pour tout voir sans scroll */}
            <div className="mt-3 space-y-3">
              {/* Si propriétés trouvées */}
              {message.properties && message.properties.length > 0 && (
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-3">Propriétés recommandées :</h4>
                  <div className="grid gap-2">
                    {message.properties.slice(0, 3).map(property => (
                      <div key={property.id} className="bg-white rounded-lg p-3 border border-gray-200/50 shadow-sm h-20 flex">
                        {/* Titre - Zone fixe */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm text-gray-800 mb-1 truncate">{property.title}</h5>
                          <p className="text-xs text-gray-600 truncate">{typeof property.location === 'string' ? property.location : (property.location as any)?.city || 'Chypre'}</p>
                        </div>
                        {/* Prix et Type - Zone fixe droite */}
                        <div className="flex flex-col justify-center items-end w-24 ml-2">
                          <span className="text-primary font-bold text-xs mb-1">{property.price}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{property.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {message.properties.length > 3 && (
                    <button className="text-xs text-primary hover:text-primary/80 underline mt-2 font-medium transition-colors">
                      Voir les {message.properties.length - 3} autres propositions →
                    </button>
                  )}
                </div>
              )}
              
              {/* Si analyse fiscale - repositionnée pour être visible */}
              {message.fiscalOptimization && (
                <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/50 h-20 flex flex-col justify-between">
                  <h4 className="font-semibold text-blue-800 text-sm">💰 Optimisation Fiscale</h4>
                  <p className="text-xs text-blue-700 truncate">{message.fiscalOptimization.preview}</p>
                  <button className="text-blue-600 hover:text-blue-800 underline text-xs font-medium transition-colors self-start">
                    Analyse complète →
                  </button>
                </div>
              )}
            </div>

            <span className="text-xs text-gray-500 mt-3 block">
              {message.timestamp.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;