# Instructions SmartTrustBar

## État actuel (Version Test - Toujours visible)

La TrustBar est maintenant **visible immédiatement** au chargement de la page pour que vous puissiez la voir et tester.

**Fichier : `/src/pages/Home.tsx` ligne 28**
```typescript
const [showTrustBar, setShowTrustBar] = useState(true);  // ← Toujours visible
```

---

## Pour revenir au comportement "smart" (apparition après clic recherche)

### Option 1 : Changement manuel simple

**Modifier `/src/pages/Home.tsx` ligne 28 :**
```typescript
const [showTrustBar, setShowTrustBar] = useState(false);  // ← Invisible au départ
```

Avec ce changement, la TrustBar apparaîtra **seulement** quand :
1. L'utilisateur clique sur le bouton recherche dans le hero
2. L'événement 'search-clicked' est dispatché
3. Le localStorage contient 'search-clicked' = 'true'

---

## Pour personnaliser le design

### Rendre le fond plus transparent

**Fichier : `/src/components/hero/SmartTrustBar.tsx` lignes 64-67**

Actuellement :
```typescript
style={{
  background: 'rgba(255, 255, 255, 0.95)',  // 95% opaque
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}}
```

Pour un fond plus transparent :
```typescript
style={{
  background: 'rgba(255, 255, 255, 0.7)',   // 70% opaque
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',  // Ombre plus légère
}}
```

Pour un fond complètement transparent (version originale) :
```typescript
style={{
  background: 'transparent',
  boxShadow: 'none',
}}
```

---

## Pour changer les textes

**Fichier : `/src/components/hero/SmartTrustBar.tsx` lignes 13-18**

```typescript
const items = [
  "20+ Développeurs Vérifiés",      // ← Modifiez ici
  "Recherche Assistée par IA",      // ← Modifiez ici
  "Multilingue (8 langues)",        // ← Modifiez ici
  "Accompagnement Personnalisé"     // ← Modifiez ici
];
```

---

## Pour ajuster le comportement sticky

**Fichier : `/src/components/hero/SmartTrustBar.tsx` ligne 33**

Actuellement, le sticky se désactive quand le titre arrive à **80px** du haut :
```typescript
rootMargin: '-80px 0px 0px 0px'
```

Pour changer cette distance :
- `-100px` : Se désactive plus tard (titre plus proche)
- `-50px` : Se désactive plus tôt (titre plus loin)

---

## Tests recommandés

1. **Test visibilité** : La barre est visible en haut de page ✓
2. **Test scroll** : La barre suit le scroll (sticky) ✓
3. **Test responsive** : Vérifier mobile (2 colonnes) et desktop (1 ligne)
4. **Test clic recherche** : Si vous remettez `useState(false)`, tester que la barre apparaît après clic

---

## Résolution des problèmes courants

### La barre n'est toujours pas visible
1. Vérifier que le build a réussi (`npm run build`)
2. Vérifier dans le navigateur que `showTrustBar = true` (DevTools React)
3. Vérifier qu'il n'y a pas d'erreur console

### La barre cache le menu burger
- Vérifier le z-index : TrustBar = 40, Navigation devrait être >= 50
- Fichier à vérifier : `/src/components/layout/Navbar.tsx`

### La barre ne suit pas le scroll
- Vérifier que `isSticky = true` dans SmartTrustBar
- Vérifier que `position: fixed` est bien appliqué

---

**Build réussi : ✓**
**Date : 2025-10-08**
