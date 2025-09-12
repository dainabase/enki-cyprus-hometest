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
                      <div key={property.id} className="bg-white rounded-lg p-3 border border-gray-200/50 shadow-sm h-24 flex flex-col justify-between">
                        <div>
                          <h5 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-1">{property.title}</h5>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{typeof property.location === 'string' ? property.location : (property.location as any)?.city || 'Chypre'}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-bold text-sm">{property.price}</span>
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
                <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200/50">
                  <h4 className="font-semibold text-blue-800 text-sm mb-2">💰 Optimisation Fiscale</h4>
                  <p className="text-sm text-blue-700 mb-3 line-clamp-2">{message.fiscalOptimization.preview}</p>
                  <button className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors">
                    Créer un compte pour l'analyse complète →
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