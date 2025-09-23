/**
 * Utilitaires pour l'encodage base64 avec support Unicode complet
 * Nécessaire pour gérer les caractères grecs et accents dans les adresses
 */

/**
 * Encode une chaîne en base64 avec support Unicode
 */
export const safeBase64Encode = (str: string): string => {
  try {
    // Cette méthode gère correctement tous les caractères Unicode
    // encodeURIComponent + unescape + btoa = support Unicode complet
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    // Fallback avec un hash simple si erreur
    return generateSimpleHash(str);
  }
};

/**
 * Génère un hash simple comme fallback
 */
const generateSimpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Génère un hash court pour les identifiants
 */
export const generateShortHash = (str: string): string => {
  const timestamp = Date.now().toString(36);
  const strHash = generateSimpleHash(str);
  return `${strHash}-${timestamp}`.substring(0, 8);
};