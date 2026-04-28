#!/usr/bin/env python3
"""
Builder du Brand Book Color Lab — ENKI Realty Couche 5
Genere docs/design-system/05-color-lab/brand-book.html
"""
from pathlib import Path
from textwrap import dedent

OUT = Path(__file__).parent / 'brand-book.html'

# ============================================================
# DONNEES — 9 palettes
# ============================================================

PALETTES = [
    {
        "id": 1, "key": "p1", "name": "Encre du Sage",
        "registre": "grave",
        "manifesto": "L'encre noire d'un cabinet d'avocat parisien sur papier creme de manuel universitaire. Une seule matiere precieuse — le laiton patine — revelee comme un sceau. La marque s'efface, le contenu existe.",
        "reference": "Phaidon × Sotheby's International Realty × Vercel/Geist",
        "light": {
            "primary": "oklch(0.16 0.008 240)", "primary_hex": "#101418",
            "accent":  "oklch(0.62 0.07 65)",   "accent_hex": "#A8825A",
            "background": "oklch(0.98 0.005 80)", "background_hex": "#FAF7F2",
            "foreground": "oklch(0.16 0.008 240)", "foreground_hex": "#101418",
            "card":   "oklch(1 0 0)",       "card_hex": "#FFFFFF",
            "muted":  "oklch(0.50 0.005 75)","muted_hex": "#6B6862",
            "border": "oklch(0.89 0.012 80)","border_hex": "#E2DCD0",
            "success": "oklch(0.52 0.05 145)", "success_hex": "#5C8A5F",
            "warning": "oklch(0.63 0.10 65)",  "warning_hex": "#B58954",
            "destructive": "oklch(0.45 0.13 25)", "destructive_hex": "#8E3528",
            "info": "oklch(0.40 0.04 240)",    "info_hex": "#3D506C",
        },
        "dark": {
            "primary": "oklch(0.62 0.07 65)",  "primary_hex": "#A8825A",
            "accent":  "oklch(0.62 0.07 65)",  "accent_hex": "#A8825A",
            "background": "oklch(0.16 0.008 240)", "background_hex": "#101418",
            "foreground": "oklch(0.93 0.010 80)",  "foreground_hex": "#F0EBE0",
            "card":   "oklch(0.20 0.008 240)", "card_hex": "#1A1F26",
            "muted":  "oklch(0.55 0.008 240)", "muted_hex": "#6E7886",
            "border": "oklch(0.30 0.008 240)", "border_hex": "#373E4A",
        },
        "forces": ["Sobriete ultime", "Autorite editoriale (Phaidon)", "Inimitable a 10 ans"],
        "risques": ["Peut paraitre froid au premier regard", "Manque chaleur mediterraneenne"],
        "note": 5,
        "photo_hero": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Spacejoy / Andrii Ganzevych on Unsplash",
    },
    {
        "id": 2, "key": "p2", "name": "Maison Lombard",
        "registre": "grave",
        "manifesto": "Le bleu encre d'un encrier de notaire parisien sur papier sable, une touche de bordeaux profond pour les moments d'engagement. La marque assume son heritage sans poussiere.",
        "reference": "Lombard Odier × Edmond de Rothschild × Pictet",
        "light": {
            "primary": "oklch(0.23 0.06 250)", "primary_hex": "#0E2240",
            "accent":  "oklch(0.36 0.13 25)",  "accent_hex": "#7A2520",
            "secondary": "oklch(0.61 0.09 80)","secondary_hex": "#A88B4B",
            "background": "oklch(0.95 0.008 80)","background_hex": "#F5F2EC",
            "foreground": "oklch(0.23 0.06 250)","foreground_hex": "#0E2240",
            "card":   "oklch(0.97 0.008 80)",  "card_hex": "#F8F5EF",
            "muted":  "oklch(0.50 0.018 250)", "muted_hex": "#5C6470",
            "border": "oklch(0.86 0.012 85)",  "border_hex": "#D9D3C5",
            "success": "oklch(0.45 0.07 145)", "success_hex": "#506E55",
            "warning": "oklch(0.61 0.09 80)",  "warning_hex": "#A88B4B",
            "destructive": "oklch(0.36 0.13 25)", "destructive_hex": "#7A2520",
            "info": "oklch(0.40 0.04 240)",    "info_hex": "#3D506C",
        },
        "dark": {
            "primary": "oklch(0.61 0.09 80)",   "primary_hex": "#A88B4B",
            "accent":  "oklch(0.36 0.13 25)",   "accent_hex": "#7A2520",
            "background": "oklch(0.17 0.05 250)","background_hex": "#0A1628",
            "foreground": "oklch(0.89 0.022 85)","foreground_hex": "#E8E0CC",
            "card":   "oklch(0.21 0.05 250)",  "card_hex": "#0F1D33",
            "muted":  "oklch(0.55 0.02 250)",  "muted_hex": "#6B7385",
            "border": "oklch(0.30 0.04 250)",  "border_hex": "#2C3850",
        },
        "forces": ["Heritage banque privee credible", "Triade encre + bordeaux + or rare", "Autorite institutionnelle"],
        "risques": ["Risque 'banque privee 1900'", "Bordeaux peut sembler date si mal calibre"],
        "note": 4,
        "photo_hero": "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Joel Filipe / Anders Jilden on Unsplash",
    },
    {
        "id": 3, "key": "p3", "name": "Abzu",
        "registre": "grave",
        "manifesto": "L'eau profonde d'Enki — pas la mer Egee carte postale, mais l'eau souterraine primordiale du mythe sumerien — sur la pierre calcaire chypriote, revelee par un foil de laiton patine. Une marque chaleureuse-mais-grave, qui parle bas et qui a lu.",
        "reference": "Aman × Lombard Odier × Anthropic × Therme Vals (Zumthor)",
        "light": {
            "primary": "oklch(0.21 0.04 250)", "primary_hex": "#0F1E2E",
            "accent":  "oklch(0.62 0.07 65)",  "accent_hex": "#A8825A",
            "background": "oklch(0.93 0.020 85)","background_hex": "#F4EEDF",
            "foreground": "oklch(0.21 0.04 250)","foreground_hex": "#0F1E2E",
            "card":   "oklch(0.98 0.005 80)",  "card_hex": "#FAF7F2",
            "muted":  "oklch(0.56 0.025 80)",  "muted_hex": "#8E7E62",
            "border": "oklch(0.89 0.025 85)",  "border_hex": "#E5DCC9",
            "success": "oklch(0.46 0.06 165)", "success_hex": "#4F8074",
            "warning": "oklch(0.63 0.10 65)",  "warning_hex": "#B58954",
            "destructive": "oklch(0.45 0.13 25)","destructive_hex": "#8E3528",
            "info": "oklch(0.40 0.04 240)",    "info_hex": "#3D506C",
        },
        "dark": {
            "primary": "oklch(0.62 0.07 65)",  "primary_hex": "#A8825A",
            "accent":  "oklch(0.62 0.07 65)",  "accent_hex": "#A8825A",
            "background": "oklch(0.16 0.035 245)","background_hex": "#0B1622",
            "foreground": "oklch(0.91 0.022 85)", "foreground_hex": "#EFE7D2",
            "card":   "oklch(0.25 0.045 250)", "card_hex": "#142235",
            "muted":  "oklch(0.60 0.025 80)",  "muted_hex": "#998668",
            "border": "oklch(0.32 0.03 250)",  "border_hex": "#2C3B50",
        },
        "forces": ["Honore le mythe sans folkloriser", "Encre + pierre + laiton (95/5 parfait)", "Compatible Aman / Anthropic / Phaidon"],
        "risques": ["Demande discipline stricte sur le laiton (5% max)", "Pierre claire fragile en photo basse qualite"],
        "note": 5,
        "photo_hero": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Anders Jilden / Daoudi Aissa on Unsplash",
    },
    {
        "id": 4, "key": "p4", "name": "Pierre de Paphos",
        "registre": "lumineux",
        "manifesto": "La pierre calcaire chypriote au crepuscule — pas la mer Egee mais la falaise ocre — avec un bronze mediterraneen comme sceau. Une marque qui dit lieu avant de dire transaction.",
        "reference": "Borgo Egnazia × Cap Karoso × Aman",
        "light": {
            "primary": "oklch(0.36 0.045 65)", "primary_hex": "#5C4632",
            "accent":  "oklch(0.43 0.045 65)", "accent_hex": "#735840",
            "secondary":"oklch(0.36 0.06 245)","secondary_hex":"#1F4861",
            "background":"oklch(0.94 0.012 85)","background_hex":"#F2EDE3",
            "foreground":"oklch(0.18 0.005 75)","foreground_hex":"#1A1815",
            "card":   "oklch(0.96 0.012 85)",  "card_hex": "#F5F1E8",
            "muted":  "oklch(0.50 0.020 80)",  "muted_hex": "#7C7060",
            "border": "oklch(0.84 0.022 85)",  "border_hex": "#DDD2BD",
            "success":"oklch(0.46 0.06 145)", "success_hex": "#5A7D5E",
            "warning":"oklch(0.62 0.09 75)",  "warning_hex": "#A88656",
            "destructive":"oklch(0.45 0.13 25)","destructive_hex":"#8E3528",
            "info":"oklch(0.36 0.06 245)",    "info_hex": "#1F4861",
        },
        "dark": {
            "primary": "oklch(0.62 0.06 75)",  "primary_hex": "#A48A66",
            "accent":  "oklch(0.43 0.045 65)", "accent_hex": "#735840",
            "background":"oklch(0.18 0.005 75)","background_hex":"#1A1815",
            "foreground":"oklch(0.94 0.012 85)","foreground_hex":"#F2EDE3",
            "card":   "oklch(0.24 0.020 75)",  "card_hex": "#27241F",
            "muted":  "oklch(0.62 0.025 80)",  "muted_hex": "#A0917A",
            "border": "oklch(0.32 0.020 75)",  "border_hex": "#3A352D",
        },
        "forces": ["Premiere palette qui dit 'lieu'", "Bronze mediterraneen rare", "Bleu Adriatique en accent secondaire"],
        "risques": ["Risque 'Borgo Egnazia copiee'", "Trop chaude pour la rigueur Lexaia"],
        "note": 4,
        "photo_hero": "https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1582120123028-19ea3eea59e7?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Daoudi Aissa / Quaritsch Photography on Unsplash",
    },
    {
        "id": 5, "key": "p5", "name": "Quartzite de Vals",
        "registre": "hybride",
        "manifesto": "Inspiree de la Therme Vals de Peter Zumthor — un gris-vert mineral qui n'est ni bleu ni vert, l'eau-pierre comme une seule matiere, avec un rouge oxyde rare emprunte aux bains de feu de Vals comme moment d'initiation. Une marque qui ne ressemble a rien dans le PropTech, et qui parle a voix tres basse.",
        "reference": "Therme Vals × Rosewood Discovery Green × Christie's red signature",
        "light": {
            "primary": "oklch(0.30 0.015 165)", "primary_hex": "#2A3530",
            "accent":  "oklch(0.36 0.13 25)",   "accent_hex": "#7A2520",
            "background":"oklch(0.91 0.022 85)","background_hex":"#EFE7D2",
            "foreground":"oklch(0.24 0.012 165)","foreground_hex":"#1F2825",
            "card":   "oklch(0.94 0.022 85)",   "card_hex": "#F2ECD8",
            "muted":  "oklch(0.48 0.012 165)",  "muted_hex": "#5F6862",
            "border": "oklch(0.83 0.025 85)",   "border_hex": "#D8CFB7",
            "success":"oklch(0.46 0.06 145)",   "success_hex": "#5A7D5E",
            "warning":"oklch(0.62 0.10 70)",    "warning_hex": "#B0805A",
            "destructive":"oklch(0.36 0.13 25)","destructive_hex":"#7A2520",
            "info":"oklch(0.40 0.03 240)",      "info_hex": "#3F4C66",
        },
        "dark": {
            "primary": "oklch(0.55 0.015 165)", "primary_hex": "#737E78",
            "accent":  "oklch(0.45 0.13 25)",   "accent_hex": "#9B3424",
            "background":"oklch(0.20 0.012 165)","background_hex":"#161D1A",
            "foreground":"oklch(0.88 0.025 85)","foreground_hex":"#E5DDC8",
            "card":   "oklch(0.25 0.012 165)", "card_hex": "#1D2520",
            "muted":  "oklch(0.60 0.012 165)", "muted_hex": "#86918A",
            "border": "oklch(0.32 0.012 165)", "border_hex": "#2D3631",
        },
        "forces": ["Ne ressemble a aucun PropTech", "Reference Zumthor (architecture culte)", "Quartzite + rouge initiation = signature unique"],
        "risques": ["Tres tres rare = peut paraitre etrange a public B2B2C", "Le rouge demande maturite chromatique"],
        "note": 5,
        "photo_hero": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Joel Filipe / Anders Jilden on Unsplash",
    },
    {
        "id": 6, "key": "p6", "name": "Olive & Argile",
        "registre": "lumineux",
        "manifesto": "Le feuillage des oliviers chypriotes au crepuscule, l'argile seche des collines de Larnaca, le sable chaud d'une plage en fin de journee. Une marque qui sourit calmement.",
        "reference": "Borgo Egnazia × Aman Sveti Stefan × oliveraies de Toscane (Luigi Ghirri)",
        "light": {
            "primary": "oklch(0.58 0.06 110)", "primary_hex": "#7A8855",
            "accent":  "oklch(0.55 0.12 40)",  "accent_hex": "#A85F3C",
            "background":"oklch(0.92 0.025 80)","background_hex":"#F2EAD8",
            "foreground":"oklch(0.27 0.018 110)","foreground_hex":"#2E3528",
            "card":   "oklch(0.95 0.020 85)",  "card_hex": "#F4EFE0",
            "muted":  "oklch(0.52 0.025 100)", "muted_hex": "#7A7359",
            "border": "oklch(0.85 0.025 85)",  "border_hex": "#DBD0B5",
            "success":"oklch(0.50 0.06 145)",  "success_hex": "#638865",
            "warning":"oklch(0.62 0.10 70)",   "warning_hex": "#B0805A",
            "destructive":"oklch(0.45 0.13 25)","destructive_hex":"#8E3528",
            "info":"oklch(0.40 0.04 240)",     "info_hex": "#3D506C",
        },
        "dark": {
            "primary": "oklch(0.68 0.06 110)", "primary_hex": "#9DAA75",
            "accent":  "oklch(0.60 0.12 40)",  "accent_hex": "#B36B45",
            "background":"oklch(0.21 0.020 110)","background_hex":"#1F2218",
            "foreground":"oklch(0.92 0.025 80)","foreground_hex":"#F2EAD8",
            "card":   "oklch(0.27 0.020 110)", "card_hex": "#272B1F",
            "muted":  "oklch(0.62 0.025 100)", "muted_hex": "#9C9272",
            "border": "oklch(0.32 0.020 110)", "border_hex": "#363A2B",
        },
        "forces": ["Premiere palette qui sourit", "Olive + argile = ancrage mediterranee veritable", "Ouvre vers retraites + jeunes couples"],
        "risques": ["Risque Airbnb sur l'argile si mal calibre", "Olive peut sembler lifestyle 'wellness' generique"],
        "note": 4,
        "photo_hero": "https://images.unsplash.com/photo-1591456983933-0c10fe26d8ec?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1543365067-fa127bcb2303?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Amaury Salas / Karl Hedin on Unsplash",
    },
    {
        "id": 7, "key": "p7", "name": "Lumiere du Sud",
        "registre": "lumineux",
        "manifesto": "Le coucher de soleil sur le calcaire chypriote, la lumiere d'or qui pose la pierre, le bleu Egee desature d'une mer tranquille en fin de journee. Une marque qui dit le temps long.",
        "reference": "Aman Venice × Six Senses Mediterranee × Joel Meyerowitz Cape Cod",
        "light": {
            "primary": "oklch(0.78 0.06 75)",   "primary_hex": "#D4B88A",
            "accent":  "oklch(0.63 0.10 65)",   "accent_hex": "#B88547",
            "tertiary":"oklch(0.45 0.025 130)", "tertiary_hex":"#5C6850",
            "quaternary":"oklch(0.58 0.035 220)","quaternary_hex":"#6B8590",
            "background":"oklch(0.97 0.012 85)","background_hex":"#FAF6ED",
            "foreground":"oklch(0.22 0.015 80)","foreground_hex":"#27241D",
            "card":   "oklch(0.98 0.010 85)",  "card_hex": "#FBF8F0",
            "muted":  "oklch(0.50 0.020 75)",  "muted_hex": "#7A6E5D",
            "border": "oklch(0.88 0.020 85)",  "border_hex": "#E1D6BD",
            "success":"oklch(0.45 0.025 130)", "success_hex": "#5C6850",
            "warning":"oklch(0.63 0.10 65)",   "warning_hex": "#B88547",
            "destructive":"oklch(0.45 0.13 25)","destructive_hex":"#8E3528",
            "info":"oklch(0.58 0.035 220)",    "info_hex": "#6B8590",
        },
        "dark": {
            "primary": "oklch(0.78 0.06 75)",   "primary_hex": "#D4B88A",
            "accent":  "oklch(0.68 0.10 65)",   "accent_hex": "#C99352",
            "background":"oklch(0.20 0.020 75)","background_hex":"#1F1A14",
            "foreground":"oklch(0.95 0.020 85)","foreground_hex":"#F4EFDE",
            "card":   "oklch(0.25 0.020 75)",  "card_hex": "#26211B",
            "muted":  "oklch(0.62 0.020 75)",  "muted_hex": "#998E7B",
            "border": "oklch(0.32 0.020 75)",  "border_hex": "#332D24",
        },
        "forces": ["Quatre accents possibles (sable + ocre + olive + Egee)", "Tres mediterranee sans Airbnb", "Lit comme Aman Venice"],
        "risques": ["Trop d'accents = risque de dilution", "Demande discipline 95/5 forte"],
        "note": 4,
        "photo_hero": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1591456983933-0c10fe26d8ec?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Vinicius Amano / Amaury Salas on Unsplash",
    },
    {
        "id": 8, "key": "p8", "name": "Mediterranee Vivante",
        "registre": "lumineux",
        "manifesto": "L'olivier, la terre cuite des amphores anciennes, l'eau profonde d'une crique abritee, le papier creme d'un manuscrit grec ancien. Une marque qui parle a la Mediterranee eternelle.",
        "reference": "Cap Karoso × Aman Sveti Stefan × musees archeologiques (terracotta antique)",
        "light": {
            "primary": "oklch(0.52 0.06 115)", "primary_hex": "#6B7548",
            "accent":  "oklch(0.50 0.12 35)",  "accent_hex": "#9C5238",
            "tertiary":"oklch(0.36 0.06 245)", "tertiary_hex":"#1F4861",
            "background":"oklch(0.98 0.005 80)","background_hex":"#FAF7F2",
            "foreground":"oklch(0.22 0.015 110)","foreground_hex":"#272A1F",
            "card":   "oklch(1 0 0)",            "card_hex": "#FFFFFF",
            "muted":  "oklch(0.50 0.020 110)", "muted_hex": "#727861",
            "border": "oklch(0.89 0.012 80)",  "border_hex": "#E2DCD0",
            "success":"oklch(0.52 0.06 115)",  "success_hex": "#6B7548",
            "warning":"oklch(0.62 0.10 70)",   "warning_hex": "#B0805A",
            "destructive":"oklch(0.50 0.12 35)","destructive_hex":"#9C5238",
            "info":"oklch(0.36 0.06 245)",     "info_hex": "#1F4861",
        },
        "dark": {
            "primary": "oklch(0.65 0.06 115)", "primary_hex": "#8E9968",
            "accent":  "oklch(0.55 0.12 35)",  "accent_hex": "#AC5E40",
            "background":"oklch(0.20 0.020 115)","background_hex":"#1B1F14",
            "foreground":"oklch(0.95 0.012 80)","foreground_hex":"#F2EFE5",
            "card":   "oklch(0.25 0.020 115)", "card_hex": "#22271A",
            "muted":  "oklch(0.62 0.020 115)", "muted_hex": "#929A7A",
            "border": "oklch(0.32 0.020 115)", "border_hex": "#2F3525",
        },
        "forces": ["Triade vivante (olive + terracotta + eau profonde)", "Joue Mediterranee eternelle", "Riche sans surcharger"],
        "risques": ["3 accents = discipline 95/5 difficile", "Terracotta calibre fin (anti-Airbnb requis)"],
        "note": 4,
        "photo_hero": "https://images.unsplash.com/photo-1543365067-fa127bcb2303?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Karl Hedin / Anders Jilden on Unsplash",
    },
    {
        "id": 9, "key": "p9", "name": "Abzu au Lever du Soleil",
        "registre": "hybride",
        "manifesto": "L'eau profonde d'Enki au moment ou le soleil mediterraneen se leve sur la pierre. La gravite du mythe rencontre la lumiere du Sud. La marque tient les deux mains : la rationnelle (Lexaia, encre, autorite) et l'emotionnelle (vie qui eleve, olive, ciel).",
        "reference": "Aman Venice (gravite encree + lumiere doree) × Cap Karoso (indigo + ocre) × Anthropic (chaleur academique)",
        "light": {
            "primary": "oklch(0.21 0.04 250)",  "primary_hex": "#0F1E2E",
            "accent":  "oklch(0.62 0.06 115)",  "accent_hex": "#8B9560",
            "secondary": "oklch(0.72 0.08 80)", "secondary_hex":"#C9A66B",
            "background":"oklch(0.93 0.020 85)","background_hex":"#F4EEDF",
            "foreground":"oklch(0.21 0.04 250)","foreground_hex":"#0F1E2E",
            "card":   "oklch(0.98 0.005 80)",  "card_hex": "#FAF7F2",
            "muted":  "oklch(0.56 0.025 80)",  "muted_hex": "#8E7E62",
            "border": "oklch(0.89 0.025 85)",  "border_hex": "#E5DCC9",
            "success":"oklch(0.50 0.06 115)",  "success_hex": "#677149",
            "warning":"oklch(0.72 0.08 80)",   "warning_hex": "#C9A66B",
            "destructive":"oklch(0.45 0.13 25)","destructive_hex":"#8E3528",
            "info":"oklch(0.40 0.04 240)",     "info_hex": "#3D506C",
        },
        "dark": {
            "primary": "oklch(0.72 0.08 80)",  "primary_hex": "#C9A66B",
            "accent":  "oklch(0.65 0.06 115)", "accent_hex": "#8E9968",
            "background":"oklch(0.16 0.035 245)","background_hex":"#0B1622",
            "foreground":"oklch(0.91 0.022 85)","foreground_hex":"#EFE7D2",
            "card":   "oklch(0.25 0.045 250)", "card_hex": "#142235",
            "muted":  "oklch(0.60 0.025 80)",  "muted_hex": "#998668",
            "border": "oklch(0.32 0.03 250)",  "border_hex": "#2C3B50",
        },
        "forces": ["Tient les deux mains : rationnel + emotionnel", "Encre Abzu (mythe) + olive + ocre (vie)", "Synthese strategique du brainstorm"],
        "risques": ["Trois accents = discipline 95/5 critique", "Definir clairement role olive vs ocre"],
        "note": 5,
        "photo_hero": "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1600&q=85&auto=format&fit=crop",
        "photo_secondary": "https://images.unsplash.com/photo-1591456983933-0c10fe26d8ec?w=1200&q=85&auto=format&fit=crop",
        "photo_credit": "Photo by Anders Jilden / Amaury Salas on Unsplash",
    },
]

# Photo neutre commune pour la mosaique (toutes vignettes meme background)
PHOTO_MOSAIC = "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=900&q=80&auto=format&fit=crop"

# Photos pour Section Ambiance (3 mockups)
AMBIANCE_PHOTOS = [
    {
        "src": "https://images.unsplash.com/photo-1591456983933-0c10fe26d8ec?w=2000&q=85&auto=format&fit=crop",
        "credit": "Photo by Amaury Salas on Unsplash",
        "alt": "Olivier chypriote au crepuscule",
        "quote": "Une maison n'est pas un investissement. C'est un endroit ou l'on revient.",
        "context": "Pissouri, district de Limassol — oliveraie ancienne en lisiere du projet Maison de l'Olivier",
    },
    {
        "src": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2000&q=85&auto=format&fit=crop",
        "credit": "Photo by Vinicius Amano on Unsplash",
        "alt": "Villa contemporaine mediterraneenne au coucher de soleil",
        "quote": "Le luxe est une affaire de proportions, pas d'or.",
        "context": "Coral Bay Residences — Paphos, livraison T4 2026",
    },
    {
        "src": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=85&auto=format&fit=crop",
        "credit": "Photo by Joel Filipe on Unsplash",
        "alt": "Detail architectural beton-pierre-eau (Tadao Ando / Therme Vals)",
        "quote": "L'eau qui sait, la pierre qui recoit.",
        "context": "Etude de matieres pour la Couche 5 — beton lisse, calcaire local, eau peu profonde",
    },
]

# ============================================================
# UTILS
# ============================================================

def render_palette_vars(p):
    """Retourne les CSS custom properties pour une palette (light + dark)"""
    L = p["light"]; D = p["dark"]
    keys_light = ["primary","accent","background","foreground","card","muted","border"]
    if "secondary" in L: keys_light.append("secondary")
    if "tertiary" in L: keys_light.append("tertiary")
    if "quaternary" in L: keys_light.append("quaternary")
    if "success" in L: keys_light.extend(["success","warning","destructive","info"])

    out = []
    for k in keys_light:
        if k in L:
            out.append(f"  --{p['key']}-{k}: {L[k]};")
            out.append(f"  --{p['key']}-{k}-hex: {L[k+'_hex']};")
    keys_dark = ["primary","accent","background","foreground","card","muted","border"]
    for k in keys_dark:
        if k in D:
            out.append(f"  --{p['key']}-dark-{k}: {D[k]};")
            out.append(f"  --{p['key']}-dark-{k}-hex: {D[k+'_hex']};")
    return "\n".join(out)


def render_swatch(name, oklch, hex_):
    return f'''<div class="swatch">
      <div class="swatch-color" style="background:{oklch};"></div>
      <div class="swatch-meta">
        <div class="swatch-name">--{name}</div>
        <div class="swatch-oklch">{oklch}</div>
        <div class="swatch-hex">{hex_}</div>
      </div>
    </div>'''


def render_tokens_grid(p, theme="light"):
    L = p[theme]
    items = []
    keys = ["primary","accent","background","foreground","card","muted","border"]
    if "secondary" in L: keys.insert(2, "secondary")
    if "tertiary" in L: keys.insert(3, "tertiary")
    if "quaternary" in L: keys.insert(4, "quaternary")
    if theme == "light" and "success" in L:
        keys.extend(["success","warning","destructive","info"])
    for k in keys:
        if k in L:
            items.append(render_swatch(k, L[k], L[k+"_hex"]))
    return "\n    ".join(items)


def palette_inline_style(p, theme="light"):
    """Retourne un style inline qui set les vars --imm-* pour une section donnee."""
    src = p[theme]
    parts = []
    for k, v in src.items():
        if k.endswith("_hex"): continue
        parts.append(f"--imm-{k}: {v}")
        if (k+"_hex") in src:
            parts.append(f"--imm-{k}-hex: {src[k+'_hex']}")
    return "; ".join(parts)


# ============================================================
# RENDU SECTIONS
# ============================================================

HEAD = '''<!--
  Brand Book Color Lab — ENKI Realty Couche 5
  Produit par Claude Code (Claude Opus 4.7) le 27 avril 2026
  Brief de Claude Opus 4.7 (web), valide par Jean-Marie Delaunay
  9 palettes en exploration · light + dark mode · WCAG audit · Photographies editoriales

  Generation : python3 docs/design-system/05-color-lab/build.py
  Source des palettes : Notion Couche 5 — https://www.notion.so/34f8c7bb25158159a40ae74dad3bf1c1
-->
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ENKI Realty — Color Lab · Couche 5 · 9 palettes</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300..900;1,300..900&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
<style>
__CSS__
</style>
</head>
<body data-theme="light">
__CONTENT__
<script>
__JS__
</script>

<!--
  Photo credits (toutes images Unsplash, licence libre commerciale) :
  - Spacejoy / Andrii Ganzevych (architecture interieure beton)
  - Joel Filipe (architecture brutaliste mediterraneenne)
  - Anders Jilden (eau profonde, calcaire)
  - Daoudi Aissa (pierre mediterraneenne, falaise)
  - Vinicius Amano (villa contemporaine)
  - Karl Hedin (oliviers anciens)
  - Amaury Salas (oliviers chypriotes)
  - Quaritsch Photography (paysage mediterraneen)

  Si une photo deplait a Jean-Marie : modifier la cle photo_hero ou photo_secondary
  dans build.py (palette concernee), regenerer.

  Brand Book Color Lab — ENKI Realty Couche 5
  Produit par Claude Code (Claude Opus 4.7) le 27 avril 2026
  Brief de Claude Opus 4.7 (web), valide par Jean-Marie Delaunay
-->
</body>
</html>
'''


def build():
    css = build_css()
    content = (
        build_toolbar() +
        build_cover() +
        build_brief() +
        build_verrous() +
        build_mosaic() +
        build_immersions() +
        build_ambiance() +
        build_compare() +
        build_reco() +
        build_tech() +
        build_footer()
    )
    js = build_js()

    html = HEAD.replace("__CSS__", css).replace("__CONTENT__", content).replace("__JS__", js)
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} ({len(html)} chars)")


# ============================================================
# CSS
# ============================================================

def build_css():
    palette_vars = "\n\n".join([
        f"  /* Palette {p['id']} — {p['name']} */\n" + render_palette_vars(p)
        for p in PALETTES
    ])

    return dedent(f"""
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    :root {{
      --font-sans: 'Hanken Grotesk', -apple-system, sans-serif;
      --font-serif: 'Schibsted Grotesk', Georgia, serif;
      --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

      /* Couche 4 paper / ink communs */
      --ink: #0a0a0a;
      --paper: #fafaf7;
      --line: rgba(10,10,10,0.10);

{palette_vars}
    }}

    /* Variables courantes selon palette + theme — pilotees par JS */
    body {{
      --current-primary: var(--p3-primary);
      --current-accent: var(--p3-accent);
      --current-background: var(--p3-background);
      --current-foreground: var(--p3-foreground);
      --current-card: var(--p3-card);
      --current-muted: var(--p3-muted);
      --current-border: var(--p3-border);
      --current-secondary: var(--p3-accent);

      --current-primary-hex: var(--p3-primary-hex);
      --current-accent-hex: var(--p3-accent-hex);
      --current-background-hex: var(--p3-background-hex);
      --current-foreground-hex: var(--p3-foreground-hex);
      --current-muted-hex: var(--p3-muted-hex);
      --current-border-hex: var(--p3-border-hex);

      font-family: var(--font-sans);
      background: var(--current-background);
      color: var(--current-foreground);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.6s ease, color 0.6s ease;
    }}

    .container {{ max-width: 1280px; margin: 0 auto; padding: 0 48px; }}

    /* ========== TOOLBAR globale ========== */
    .toolbar {{
      position: fixed; top: 0; right: 0; left: 0;
      z-index: 100;
      background: var(--current-background);
      border-bottom: 1px solid var(--current-border);
      padding: 14px 32px;
      display: flex; justify-content: space-between; align-items: center;
      gap: 32px;
      backdrop-filter: blur(8px);
    }}
    .toolbar-brand {{
      font-family: var(--font-mono);
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--current-muted);
    }}
    .toolbar-brand span {{ color: var(--current-foreground); }}
    .toolbar-controls {{ display: flex; align-items: center; gap: 16px; }}
    .palette-pills {{ display: flex; gap: 6px; }}
    .palette-pill {{
      width: 26px; height: 26px;
      border: 1px solid var(--current-border);
      cursor: pointer;
      position: relative;
      transition: transform 0.2s ease;
      font-size: 0;
      border-radius: 50%;
    }}
    .palette-pill:hover {{ transform: translateY(-1px); }}
    .palette-pill.active {{
      outline: 2px solid var(--current-foreground);
      outline-offset: 2px;
    }}
    .palette-pill::after {{
      content: attr(data-id);
      position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
      font-family: var(--font-mono); font-size: 9px;
      color: var(--current-muted);
    }}
    .theme-toggle {{
      font-family: var(--font-mono);
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.10em;
      padding: 8px 14px;
      border: 1px solid var(--current-border);
      background: transparent;
      color: var(--current-foreground);
      cursor: pointer;
      transition: all 0.3s ease;
    }}
    .theme-toggle:hover {{ background: var(--current-foreground); color: var(--current-background); }}

    /* ========== Sections generales ========== */
    section.book {{
      padding: 96px 0;
      border-bottom: 1px solid var(--current-border);
    }}
    .section-head {{
      display: grid; grid-template-columns: 1fr 3fr; gap: 48px;
      margin-bottom: 64px; align-items: baseline;
    }}
    .section-num {{
      font-family: var(--font-mono); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--current-muted);
    }}
    .section-title {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 48px; line-height: 1.05; letter-spacing: -0.02em;
      margin-bottom: 16px;
    }}
    .section-title em {{ font-style: italic; color: var(--current-muted); }}
    .section-lead {{
      font-size: 18px; line-height: 1.6;
      color: var(--current-muted);
      max-width: 720px;
    }}

    h2, h3, h4 {{ color: var(--current-foreground); }}
    p {{ color: var(--current-foreground); }}
    p.muted {{ color: var(--current-muted); }}

    em {{ font-style: italic; }}

    /* ========== Cover ========== */
    .cover {{
      min-height: 100vh;
      padding: 120px 0 80px;
      display: flex; flex-direction: column; justify-content: space-between;
    }}
    .cover-top {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--current-muted);
      display: flex; justify-content: space-between;
    }}
    .cover-title {{
      margin: auto 0;
    }}
    .cover-eyebrow {{
      font-family: var(--font-mono); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: var(--current-muted);
      margin-bottom: 32px;
    }}
    .cover-h1 {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: clamp(64px, 11vw, 144px);
      line-height: 0.92; letter-spacing: -0.04em;
      margin-bottom: 32px;
    }}
    .cover-h1 em {{ font-style: italic; color: var(--current-accent); }}
    .cover-sub {{
      font-size: 22px; line-height: 1.4;
      color: var(--current-muted);
      max-width: 720px;
    }}
    .cover-bottom {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--current-muted);
      display: flex; justify-content: space-between;
      padding-top: 64px;
      border-top: 1px solid var(--current-border);
    }}

    /* ========== Brief / Verrous ========== */
    .brief-paragraph {{
      font-size: 19px; line-height: 1.7;
      color: var(--current-foreground);
      margin-bottom: 28px;
      max-width: 760px;
    }}
    .brief-paragraph em {{ font-style: italic; color: var(--current-accent); }}
    .verrous {{ display: grid; gap: 32px; max-width: 920px; }}
    .verrou {{
      display: grid; grid-template-columns: 60px 1fr; gap: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--current-border);
    }}
    .verrou:last-child {{ border-bottom: none; }}
    .verrou-num {{
      font-family: var(--font-mono); font-size: 14px;
      color: var(--current-accent); font-weight: 500;
      letter-spacing: 0.05em;
    }}
    .verrou-text {{ font-size: 17px; line-height: 1.6; }}
    .verrou-text strong {{
      font-family: var(--font-serif); font-weight: 500;
      font-style: italic; font-size: 19px;
      color: var(--current-foreground);
      display: block; margin-bottom: 8px;
    }}

    /* ========== Mosaique 3x3 ========== */
    .mosaic {{
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }}
    .mosaic-card {{
      cursor: pointer;
      background: var(--mc-card, #fff);
      border: 1px solid var(--mc-border, var(--current-border));
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      overflow: hidden;
      position: relative;
      aspect-ratio: 320 / 420;
      display: flex; flex-direction: column;
    }}
    .mosaic-card:hover {{
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(10,10,10,0.10);
      border-color: var(--mc-accent);
    }}
    .mosaic-photo {{
      flex: 1;
      background-size: cover; background-position: center;
      position: relative;
    }}
    .mosaic-photo::after {{
      content: '';
      position: absolute; inset: 0;
      background: var(--mc-overlay, rgba(15,30,46,0.5));
      mix-blend-mode: multiply;
    }}
    .mosaic-mockup {{
      position: absolute; inset: 24px;
      color: var(--mc-fg, white);
      display: flex; flex-direction: column; justify-content: center;
      gap: 12px;
      z-index: 2;
    }}
    .mosaic-eyebrow {{
      font-family: var(--font-mono); font-size: 9px;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--mc-accent);
    }}
    .mosaic-h {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 22px; line-height: 1.05;
    }}
    .mosaic-h em {{ font-style: italic; }}
    .mosaic-p {{
      font-size: 11px; line-height: 1.5;
      color: var(--mc-muted, rgba(255,255,255,0.75));
    }}
    .mosaic-cta {{
      align-self: flex-start;
      font-family: var(--font-sans); font-weight: 500; font-size: 11px;
      padding: 8px 14px;
      background: var(--mc-accent);
      color: var(--mc-accent-fg, white);
      margin-top: 4px;
    }}
    .mosaic-footer {{
      padding: 16px 20px;
      border-top: 1px solid rgba(255,255,255,0.15);
      background: var(--mc-card, #fff);
      color: var(--mc-card-fg, var(--current-foreground));
      display: flex; justify-content: space-between; align-items: baseline;
    }}
    .mosaic-name {{
      font-family: var(--font-serif); font-style: italic; font-size: 16px;
    }}
    .mosaic-id {{
      font-family: var(--font-mono); font-size: 10px;
      color: var(--mc-card-muted, var(--current-muted));
      letter-spacing: 0.08em;
    }}

    /* ========== Immersion (une par palette) ========== */
    .immersion {{
      padding: 96px 0;
      background: var(--imm-background);
      color: var(--imm-foreground);
      border-bottom: 1px solid var(--imm-border);
      transition: background-color 0.5s ease, color 0.5s ease;
    }}
    .immersion[data-theme="dark"] {{
      background: var(--imm-dark-background, var(--imm-background));
      color: var(--imm-dark-foreground, var(--imm-foreground));
    }}
    .imm-head {{
      display: grid; grid-template-columns: 1fr 320px; gap: 64px;
      margin-bottom: 64px;
      align-items: end;
    }}
    .imm-eyebrow {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--imm-muted);
      margin-bottom: 16px;
    }}
    .imm-name {{
      font-family: var(--font-serif); font-weight: 400; font-style: italic;
      font-size: 64px; line-height: 1; letter-spacing: -0.025em;
      margin-bottom: 24px;
      color: var(--imm-foreground);
    }}
    .imm-manifesto {{
      font-size: 18px; line-height: 1.55;
      color: var(--imm-muted);
      max-width: 640px;
    }}
    .imm-ref {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--imm-muted);
      margin-top: 16px;
    }}
    .imm-toggle {{
      align-self: end;
      display: flex; gap: 1px; border: 1px solid var(--imm-border);
    }}
    .imm-toggle button {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: var(--imm-muted);
      cursor: pointer;
    }}
    .imm-toggle button.active {{
      background: var(--imm-foreground);
      color: var(--imm-background);
    }}

    /* Tokens grid */
    .tokens-section {{ margin-bottom: 72px; }}
    .tokens-section h3 {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--imm-muted);
      margin-bottom: 24px;
    }}
    .tokens-grid {{
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }}
    .swatch {{
      background: var(--imm-card);
      border: 1px solid var(--imm-border);
      overflow: hidden;
    }}
    .swatch-color {{ height: 80px; }}
    .swatch-meta {{ padding: 12px 16px; }}
    .swatch-name {{
      font-family: var(--font-mono); font-size: 11px;
      color: var(--imm-foreground);
      margin-bottom: 4px;
    }}
    .swatch-oklch {{
      font-family: var(--font-mono); font-size: 10px;
      color: var(--imm-muted);
      margin-bottom: 2px; word-break: break-all;
    }}
    .swatch-hex {{
      font-family: var(--font-mono); font-size: 10px;
      color: var(--imm-muted); text-transform: uppercase;
    }}

    /* Hero ENKI */
    .imm-mockup-label {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--imm-muted);
      margin: 64px 0 24px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--imm-border);
    }}
    .mockup-hero {{
      position: relative;
      aspect-ratio: 1200/680;
      background-size: cover; background-position: center;
      overflow: hidden;
      border: 1px solid var(--imm-border);
    }}
    .mockup-hero-overlay {{
      position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--imm-background) 0%, transparent 60%, rgba(0,0,0,0.3) 100%);
    }}
    .mockup-hero-content {{
      position: absolute; left: 64px; bottom: 64px; right: 64px;
      max-width: 720px;
    }}
    .mockup-hero .h-eyebrow {{
      font-family: var(--font-mono); font-size: 12px;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: var(--imm-accent);
      margin-bottom: 24px;
    }}
    .mockup-hero h2 {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 64px; line-height: 1; letter-spacing: -0.035em;
      margin-bottom: 24px;
      color: var(--imm-foreground);
    }}
    .mockup-hero h2 em {{ font-style: italic; color: var(--imm-accent); }}
    .mockup-hero .h-sub {{
      font-size: 18px; line-height: 1.6;
      color: var(--imm-foreground); opacity: 0.85;
      margin-bottom: 32px;
      max-width: 580px;
    }}
    .mockup-hero .ctas {{ display: flex; gap: 16px; }}
    .btn-primary {{
      font-family: var(--font-sans); font-weight: 500; font-size: 16px;
      padding: 14px 28px;
      background: var(--imm-primary);
      color: var(--imm-background);
      border: 1px solid var(--imm-primary);
      cursor: pointer;
      transition: opacity 0.2s ease;
    }}
    .btn-primary:hover {{ opacity: 0.9; }}
    .btn-secondary {{
      font-family: var(--font-sans); font-weight: 500; font-size: 16px;
      padding: 14px 28px;
      background: transparent;
      color: var(--imm-foreground);
      border: 1px solid var(--imm-border);
      cursor: pointer;
    }}
    .btn-secondary:hover {{ background: var(--imm-foreground); color: var(--imm-background); }}

    /* Page projet */
    .mockup-projet {{
      background: var(--imm-card);
      border: 1px solid var(--imm-border);
      overflow: hidden;
    }}
    .projet-photo {{
      aspect-ratio: 16/9;
      background-size: cover; background-position: center;
      position: relative;
    }}
    .projet-content {{ padding: 56px 64px; }}
    .projet-eyebrow {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--imm-accent);
      margin-bottom: 16px;
    }}
    .projet-title {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 48px; line-height: 1.05; letter-spacing: -0.025em;
      margin-bottom: 12px;
    }}
    .projet-title em {{ font-style: italic; color: var(--imm-muted); }}
    .projet-loc {{
      font-size: 17px; color: var(--imm-muted);
      margin-bottom: 32px;
    }}
    .projet-kpis {{
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
      padding: 28px 0;
      border-top: 1px solid var(--imm-border);
      border-bottom: 1px solid var(--imm-border);
      margin-bottom: 32px;
    }}
    .kpi-label {{
      font-family: var(--font-mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--imm-muted);
      margin-bottom: 8px;
    }}
    .kpi-value {{
      font-family: var(--font-mono); font-size: 24px; font-weight: 500;
      letter-spacing: -0.01em;
      color: var(--imm-foreground);
      font-feature-settings: 'tnum';
    }}
    .projet-desc {{
      font-size: 17px; line-height: 1.65;
      color: var(--imm-foreground);
      max-width: 720px; margin-bottom: 32px;
    }}
    .projet-cta {{ display: flex; gap: 16px; }}

    /* Drawer fiche bien */
    .drawer-row {{
      display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
      align-items: start;
    }}
    .drawer {{
      background: var(--imm-card);
      border: 1px solid var(--imm-border);
      padding: 40px 44px;
      max-width: 600px;
    }}
    .drawer-eyebrow {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--imm-accent);
      margin-bottom: 16px;
    }}
    .drawer-title {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 36px; line-height: 1.05; letter-spacing: -0.025em;
      margin-bottom: 24px;
    }}
    .drawer-title em {{ font-style: italic; color: var(--imm-muted); }}
    .drawer-gallery {{
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
      margin-bottom: 32px;
    }}
    .drawer-thumb {{
      aspect-ratio: 1;
      background-size: cover; background-position: center;
      background-color: var(--imm-border);
    }}
    .drawer-data {{
      font-family: var(--font-mono); font-size: 13px;
      color: var(--imm-foreground);
      background: color-mix(in oklch, var(--imm-background), var(--imm-foreground) 4%);
      border-left: 2px solid var(--imm-accent);
      padding: 24px 28px; margin: 0 0 28px;
      line-height: 2.0;
      font-feature-settings: 'tnum';
    }}
    .drawer-data table {{ width: 100%; border-collapse: collapse; }}
    .drawer-data td {{ padding: 2px 0; }}
    .drawer-data td:first-child {{ color: var(--imm-muted); }}
    .drawer-data td:last-child {{ text-align: right; color: var(--imm-foreground); }}
    .drawer-desc {{
      font-size: 16px; line-height: 1.6;
      color: var(--imm-foreground);
      margin-bottom: 28px;
    }}
    .agent-bubble {{
      background: color-mix(in oklch, var(--imm-background), var(--imm-foreground) 4%);
      border: 1px solid var(--imm-border);
      padding: 20px 24px;
      margin-bottom: 28px;
      display: grid; grid-template-columns: 40px 1fr; gap: 16px;
    }}
    .agent-avatar {{
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--imm-primary);
      display: flex; align-items: center; justify-content: center;
      color: var(--imm-background);
      font-family: var(--font-serif); font-style: italic; font-weight: 500;
      font-size: 16px;
    }}
    .agent-label {{
      font-family: var(--font-mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--imm-muted);
      margin-bottom: 6px;
    }}
    .agent-msg {{
      font-style: italic; font-size: 15px; line-height: 1.55;
      color: var(--imm-foreground);
    }}
    .drawer-cta {{ display: flex; gap: 12px; }}
    .drawer-cta .btn-primary, .drawer-cta .btn-secondary {{ font-size: 14px; padding: 12px 20px; }}

    /* Lexaia */
    .mockup-lexaia {{
      background: var(--imm-card);
      border: 1px solid var(--imm-border);
      padding: 56px 64px;
    }}
    .lexaia-head {{
      display: grid; grid-template-columns: 1fr auto; gap: 32px;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--imm-border);
    }}
    .lexaia-h-l {{ }}
    .lexaia-tag {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: var(--imm-accent);
      margin-bottom: 8px;
    }}
    .lexaia-meta {{
      font-family: var(--font-mono); font-size: 10px;
      color: var(--imm-muted);
      line-height: 1.7;
    }}
    .lexaia-meta-r {{
      font-family: var(--font-mono); font-size: 10px;
      color: var(--imm-muted); text-align: right;
      line-height: 1.7;
    }}
    .lexaia-title {{
      font-family: var(--font-serif); font-weight: 400;
      font-size: 36px; line-height: 1.1; letter-spacing: -0.02em;
      margin-bottom: 24px;
    }}
    .lexaia-title em {{ font-style: italic; color: var(--imm-accent); }}
    .lexaia-summary {{
      font-size: 16px; line-height: 1.65;
      color: var(--imm-foreground);
      max-width: 760px;
      margin-bottom: 40px;
    }}
    .lexaia-summary + .lexaia-summary {{ margin-top: -20px; }}
    .lexaia-table-wrap {{
      background: var(--imm-background);
      border: 1px solid var(--imm-border);
      overflow-x: auto;
      margin-bottom: 24px;
    }}
    table.lexaia-table {{
      width: 100%; border-collapse: collapse;
      font-family: var(--font-mono); font-size: 13px;
      font-feature-settings: 'tnum';
    }}
    .lexaia-table th, .lexaia-table td {{
      padding: 14px 20px;
      text-align: left;
      border-bottom: 1px solid var(--imm-border);
    }}
    .lexaia-table th {{
      color: var(--imm-muted);
      font-weight: 400;
      text-transform: uppercase; letter-spacing: 0.08em;
      font-size: 10px;
      vertical-align: bottom;
    }}
    .lexaia-table th.scenario {{
      color: var(--imm-foreground);
      font-size: 12px;
      letter-spacing: 0.06em;
    }}
    .lexaia-table th small {{
      display: block; font-size: 9px;
      color: var(--imm-muted);
      margin-top: 2px;
    }}
    .lexaia-table td {{ color: var(--imm-foreground); }}
    .lexaia-table tr.head-sep td {{
      border-bottom: 2px solid var(--imm-foreground);
      padding-top: 4px;
      padding-bottom: 4px;
    }}
    .lexaia-table tr.total td {{
      font-weight: 500; color: var(--imm-foreground);
      background: color-mix(in oklch, var(--imm-background), var(--imm-foreground) 5%);
    }}
    .lexaia-table tr.eco td {{
      color: var(--imm-accent); font-weight: 500;
    }}
    .lexaia-disclaimer {{
      font-size: 12px; line-height: 1.6;
      color: var(--imm-muted);
    }}

    /* WCAG bandeau */
    .wcag {{
      margin-top: 64px;
      padding-top: 24px;
      border-top: 1px solid var(--imm-border);
    }}
    .wcag h4 {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--imm-muted);
      margin-bottom: 16px;
    }}
    .wcag-grid {{
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
      font-family: var(--font-mono); font-size: 12px;
    }}
    .wcag-cell {{
      padding: 12px 14px;
      border: 1px solid var(--imm-border);
      background: var(--imm-card);
    }}
    .wcag-pair {{ font-size: 10px; color: var(--imm-muted); margin-bottom: 6px; }}
    .wcag-ratio {{ color: var(--imm-foreground); font-size: 18px; font-weight: 500; }}
    .wcag-verdict {{ font-size: 9px; letter-spacing: 0.10em; margin-top: 4px; text-transform: uppercase; }}
    .wcag-verdict.aaa {{ color: var(--imm-accent); }}
    .wcag-verdict.aa {{ color: var(--imm-foreground); }}
    .wcag-verdict.fail {{ color: #c0392b; }}

    /* ========== Section ambiance ========== */
    .ambiance-mockup {{
      position: relative;
      aspect-ratio: 16/8;
      margin-bottom: 24px;
      overflow: hidden;
      background-size: cover; background-position: center;
    }}
    .ambiance-mockup .overlay {{
      position: absolute; inset: 0;
      background: linear-gradient(180deg, transparent 40%, var(--current-background) 100%);
    }}
    .ambiance-mockup .overlay-text {{
      position: absolute; inset: 0;
      padding: 56px 80px;
      color: white;
      display: flex; flex-direction: column; justify-content: flex-end;
    }}
    .ambiance-mockup .overlay-text-eyebrow {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.14em;
      color: rgba(255,255,255,0.85);
      margin-bottom: 16px;
    }}
    .ambiance-mockup .overlay-text-quote {{
      font-family: var(--font-serif); font-style: italic; font-weight: 400;
      font-size: 56px; line-height: 1.05; letter-spacing: -0.02em;
      max-width: 800px;
      color: white;
    }}
    .ambiance-mockup .overlay-text-context {{
      font-size: 13px; line-height: 1.5;
      color: rgba(255,255,255,0.7);
      margin-top: 16px;
    }}
    .ambiance-detail {{
      display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
      align-items: start;
      padding: 48px 0 96px;
    }}
    .ambiance-detail-text {{
      font-size: 17px; line-height: 1.7;
      color: var(--current-foreground);
    }}
    .ambiance-detail-text em {{ font-style: italic; color: var(--current-accent); }}

    /* ========== Tableau comparatif ========== */
    .compare-table {{
      width: 100%;
      border-collapse: collapse;
      background: var(--current-card);
      border: 1px solid var(--current-border);
    }}
    .compare-table th, .compare-table td {{
      padding: 18px 20px;
      text-align: left;
      border-bottom: 1px solid var(--current-border);
      vertical-align: top;
    }}
    .compare-table th {{
      font-family: var(--font-mono); font-size: 10px;
      text-transform: uppercase; letter-spacing: 0.10em;
      color: var(--current-muted);
      font-weight: 400;
      background: color-mix(in oklch, var(--current-background), var(--current-foreground) 3%);
    }}
    .compare-table td.cmp-name {{
      font-family: var(--font-serif); font-style: italic; font-size: 18px;
      color: var(--current-foreground);
    }}
    .compare-table td.cmp-text {{ font-size: 14px; line-height: 1.55; color: var(--current-foreground); }}
    .compare-table .stars {{ color: var(--current-accent); font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.1em; }}
    .compare-table ul {{ list-style: none; padding-left: 0; }}
    .compare-table ul li {{ font-size: 13px; line-height: 1.55; color: var(--current-muted); padding-left: 12px; position: relative; margin-bottom: 4px; }}
    .compare-table ul li::before {{ content: '·'; position: absolute; left: 0; color: var(--current-accent); }}

    /* ========== Recommandation ========== */
    .reco {{
      background: var(--current-card);
      border-left: 2px solid var(--current-accent);
      padding: 48px 56px;
      max-width: 820px;
    }}
    .reco p {{
      font-size: 17px; line-height: 1.7;
      margin-bottom: 20px;
      color: var(--current-foreground);
    }}
    .reco p em {{ font-style: italic; color: var(--current-accent); }}
    .reco h3 {{
      font-family: var(--font-serif); font-style: italic;
      font-size: 28px; margin-bottom: 24px;
    }}

    /* ========== Section technique ========== */
    .tech-grid {{
      display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
    }}
    .tech-card {{
      background: var(--current-card);
      border: 1px solid var(--current-border);
      padding: 32px 36px;
    }}
    .tech-card h3 {{
      font-family: var(--font-serif); font-style: italic;
      font-size: 22px; margin-bottom: 16px;
    }}
    .tech-card p {{ font-size: 15px; line-height: 1.65; color: var(--current-foreground); margin-bottom: 12px; }}
    .tech-card ul {{ list-style: none; padding: 0; }}
    .tech-card ul li {{ font-size: 14px; line-height: 1.6; padding-left: 20px; position: relative; }}
    .tech-card ul li::before {{ content: '→'; position: absolute; left: 0; color: var(--current-accent); }}
    pre.code {{
      font-family: var(--font-mono); font-size: 12px;
      background: var(--current-foreground);
      color: var(--current-background);
      padding: 24px 28px;
      overflow-x: auto;
      line-height: 1.6;
      margin-top: 16px;
    }}
    pre.code .comment {{ color: var(--current-muted); }}
    pre.code .var {{ color: var(--current-accent); }}

    /* ========== Footer ========== */
    .book-footer {{
      padding: 80px 0;
      background: var(--current-foreground);
      color: var(--current-background);
    }}
    .book-footer .container {{ display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }}
    .book-footer h4 {{
      font-family: var(--font-mono); font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--current-muted);
      margin-bottom: 16px;
    }}
    .book-footer p, .book-footer li {{
      font-size: 14px; line-height: 1.7;
      color: var(--current-background); opacity: 0.8;
    }}
    .book-footer ul {{ list-style: none; padding: 0; }}
    .book-footer a {{ color: var(--current-background); text-decoration: underline; opacity: 0.85; }}
    .book-footer .signature {{
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.15);
      font-family: var(--font-serif); font-style: italic; font-size: 16px;
      grid-column: 1 / -1;
      opacity: 0.9;
    }}

    /* Responsive minimal */
    @media (max-width: 1100px) {{
      .container {{ padding: 0 32px; }}
      .mosaic {{ grid-template-columns: repeat(2, 1fr); }}
      .imm-head {{ grid-template-columns: 1fr; }}
      .tokens-grid {{ grid-template-columns: repeat(2, 1fr); }}
      .drawer-row {{ grid-template-columns: 1fr; }}
      .ambiance-detail {{ grid-template-columns: 1fr; }}
      .tech-grid {{ grid-template-columns: 1fr; }}
      .book-footer .container {{ grid-template-columns: 1fr; }}
      .mockup-hero h2, .ambiance-mockup .overlay-text-quote {{ font-size: 36px; }}
      .cover-h1 {{ font-size: 64px; }}
    }}
    """).strip()


# ============================================================
# Toolbar
# ============================================================

def build_toolbar():
    pills = "\n".join([
        f'<button class="palette-pill" data-pal="{p["key"]}" data-id="P{p["id"]}" '
        f'style="background:linear-gradient(135deg,{p["light"]["primary_hex"]} 0%,{p["light"]["primary_hex"]} 50%,{p["light"]["accent_hex"]} 50%,{p["light"]["accent_hex"]} 100%);" '
        f'title="{p["name"]}">{p["name"]}</button>'
        for p in PALETTES
    ])
    return f'''
<div class="toolbar">
  <div class="toolbar-brand">ENKI Realty · <span>Color Lab</span> · Couche 5</div>
  <div class="toolbar-controls">
    <div class="palette-pills" id="palettePills">
{pills}
    </div>
    <button class="theme-toggle" id="themeToggle">Light · Dark</button>
  </div>
</div>
'''


# ============================================================
# Cover (Section 1)
# ============================================================

def build_cover():
    return '''
<section class="book cover">
  <div class="container">
    <div class="cover-top">
      <div>ENKI REALTY · DESIGN SYSTEM<br>COUCHE 5 · COLOR EXPLORATION</div>
      <div>VERSION DE TRAVAIL · 27 AVRIL 2026<br>9 PALETTES CANDIDATES</div>
    </div>
    <div class="cover-title">
      <div class="cover-eyebrow">BRAND BOOK · COLOR LAB</div>
      <h1 class="cover-h1"><em>Color</em> Lab.</h1>
      <p class="cover-sub">Neuf palettes candidates pour la marque ENKI Realty, mockees en mode reel light + dark, avec photographies de registre editorial. Document de travail interne — Jean-Marie Delaunay arbitrera la palette finale apres lecture comparative.</p>
    </div>
    <div class="cover-bottom">
      <div>PRODUIT PAR CLAUDE OPUS 4.7<br>(SUR BRIEF DE CLAUDE OPUS 4.7 WEB)</div>
      <div>SOUS L'AUTORITE DE<br>JEAN-MARIE DELAUNAY</div>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 2 — Brief
# ============================================================

def build_brief():
    return '''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">02 · BRIEF</div>
      <div>
        <h2 class="section-title">Le brief, en <em>trois</em> lignes.</h2>
        <p class="section-lead">Ce que la marque doit porter, ce qu'elle ne sera jamais, et la discipline qui la rendra inimitable.</p>
      </div>
    </div>
    <p class="brief-paragraph">ENKI Realty est une plateforme d'achat immobilier neuf a Chypre pour acheteurs europeens. Marque positionnee <em>Sage + Magician</em>, heritiere du mythe sumerien d'Enki, dieu de l'eau douce et de la connaissance bienveillante.</p>
    <p class="brief-paragraph">Cinq attributs invariants : <em>puissance, ordre, droiture, justesse, divinite</em>. Voix : calme, precise, pedagogique, chaleureuse, discrete, mythique sans etre theatrale.</p>
    <p class="brief-paragraph">Discipline 95/5 : 95 % de neutres calibres (encre + pierre + papier), 5 % d'accent rare. Cette discipline, plus que la palette elle-meme, rend la marque <em>inimitable a 10 ans</em>.</p>
  </div>
</section>
'''


# ============================================================
# Section 3 — 5 verrous non negociables
# ============================================================

def build_verrous():
    verrous = [
        ("Discipline 95/5", "95 % de neutres, 5 % d'accent. Toujours. Le 5 % est un sceau, jamais un aplat."),
        ("Jamais #FFFFFF, jamais #000000", "Toujours un creme calibre (papier sable / pierre claire) et un noir tinte (encre profonde, jamais pur). C'est la regle qui distingue Phaidon de Default."),
        ("Bannissements", "Bleu SaaS, terracotta Airbnb, beige generique, vert fintech, or sature, bleu Santorini. Aucune de ces signatures ne peut entrer dans la marque."),
        ("L'accent est un sceau, jamais un aplat", "Pattern Christie's : un seul moment de revelation chromatique par page. Le rouge surgit, il ne tapisse pas. Le laiton signe, il ne decore pas."),
        ("Les italiques Schibsted sont semantiques, jamais decoratives", "Rappel Couche 4. Une italique signe un nom propre, signifie une emphase, cite une voix. Jamais 'pour faire joli'."),
    ]
    rows = "".join([
        f'<div class="verrou"><div class="verrou-num">0{i+1}</div><div class="verrou-text"><strong>{t}</strong>{d}</div></div>'
        for i, (t, d) in enumerate(verrous)
    ])
    return f'''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">03 · VERROUS</div>
      <div>
        <h2 class="section-title">Cinq verrous <em>non-negociables</em>.</h2>
        <p class="section-lead">Ces regles, validees en Couche 1 et Couche 4, conditionnent toute decision chromatique. Une palette qui ne les respecte pas est exclue d'office.</p>
      </div>
    </div>
    <div class="verrous">{rows}</div>
  </div>
</section>
'''


# ============================================================
# Section 4 — Mosaique 3x3
# ============================================================

def build_mosaic():
    cards = []
    for p in PALETTES:
        L = p["light"]
        # Style par carte avec variables locales
        style_vars = (
            f"--mc-card:{L['card_hex']};"
            f"--mc-border:{L['border_hex']};"
            f"--mc-fg:#FFFFFF;"
            f"--mc-muted:rgba(255,255,255,0.78);"
            f"--mc-accent:{L['accent_hex']};"
            f"--mc-accent-fg:#FFFFFF;"
            f"--mc-card-fg:{L['foreground_hex']};"
            f"--mc-card-muted:{L['muted_hex']};"
            f"--mc-overlay:color-mix(in oklch,{L['primary_hex']} 70%,transparent);"
        )
        cards.append(f'''
    <div class="mosaic-card" style="{style_vars}" data-pal="{p['key']}" onclick="goToImmersion('{p['key']}')">
      <div class="mosaic-photo" style="background-image:url('{PHOTO_MOSAIC}');">
        <div class="mosaic-mockup">
          <div class="mosaic-eyebrow">PISSOURI · LIMASSOL</div>
          <div class="mosaic-h"><em>L'eau</em> qui sait,<br>la pierre qui recoit.</div>
          <div class="mosaic-p">Acquisition immobiliere neuve a Chypre, accompagnee par Lexaia.</div>
          <div class="mosaic-cta">Commencer une conversation</div>
        </div>
      </div>
      <div class="mosaic-footer">
        <div class="mosaic-name">{p['name']}</div>
        <div class="mosaic-id">P{p['id']:02d}</div>
      </div>
    </div>''')
    return f'''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">04 · MOSAIQUE</div>
      <div>
        <h2 class="section-title">Les neuf palettes, <em>cote a cote</em>.</h2>
        <p class="section-lead">Meme hero, meme typographie, meme photo de fond. Seule la couche chromatique change. C'est le test de comparabilite honnete : voir laquelle parle vrai au premier regard.</p>
      </div>
    </div>
    <div class="mosaic">{''.join(cards)}</div>
  </div>
</section>
'''


# ============================================================
# Section 5 — 9 immersions
# ============================================================

def build_immersions():
    parts = []
    for p in PALETTES:
        parts.append(build_one_immersion(p))
    return ''.join(parts)


def build_one_immersion(p):
    L = p["light"]; D = p["dark"]
    style_light = palette_inline_style(p, "light")
    style_dark_supplement = "; ".join([f"--imm-dark-{k}: {v}" for k, v in D.items() if not k.endswith("_hex")])

    tokens_light = render_tokens_grid(p, "light")
    # Tokens dark
    keys_dark = ["primary","accent","background","foreground","card","muted","border"]
    swatches_dark = []
    for k in keys_dark:
        if k in D:
            swatches_dark.append(render_swatch(k+" (dark)", D[k], D[k+"_hex"]))
    tokens_dark = "\n    ".join(swatches_dark)

    photo_hero = p["photo_hero"]
    photo_secondary = p["photo_secondary"]

    # Manifesto en italique partiel
    return f'''
<section class="immersion" id="imm-{p["key"]}" data-pal="{p["key"]}" style="{style_light}; {style_dark_supplement}" data-theme="light">
  <div class="container">
    <div class="imm-head">
      <div>
        <div class="imm-eyebrow">PALETTE 0{p['id']} · {p['registre'].upper()}</div>
        <h2 class="imm-name">{p['name']}</h2>
        <p class="imm-manifesto">{p['manifesto']}</p>
        <div class="imm-ref">{p['reference']}</div>
      </div>
      <div class="imm-toggle" data-toggle="{p['key']}">
        <button data-mode="light" class="active">Light</button>
        <button data-mode="dark">Dark</button>
      </div>
    </div>

    <div class="tokens-section">
      <h3>Tokens · light mode</h3>
      <div class="tokens-grid">
    {tokens_light}
      </div>
    </div>

    <div class="tokens-section">
      <h3>Tokens · dark mode</h3>
      <div class="tokens-grid">
    {tokens_dark}
      </div>
    </div>

    <div class="imm-mockup-label">MOCKUP · HERO ENKI</div>
    <div class="mockup-hero" style="background-image:url('{photo_hero}');">
      <div class="mockup-hero-overlay"></div>
      <div class="mockup-hero-content">
        <div class="h-eyebrow">PROPRIETES NEUVES — LIMASSOL · PAPHOS · LARNACA</div>
        <h2><em>L'eau</em> qui sait, la pierre qui <em>recoit</em>.</h2>
        <p class="h-sub">ENKI Realty accompagne les acheteurs europeens dans leur projet d'acquisition immobiliere neuve a Chypre. Notre agent conversationnel vous ecoute, Lexaia analyse votre fiscalite, et nous vous presentons les projets qui correspondent vraiment a votre vie.</p>
        <div class="ctas">
          <button class="btn-primary">Commencer une conversation</button>
          <button class="btn-secondary">Decouvrir Lexaia</button>
        </div>
      </div>
    </div>

    <div class="imm-mockup-label">MOCKUP · PAGE PROJET — MAISON DE L'OLIVIER</div>
    <div class="mockup-projet">
      <div class="projet-photo" style="background-image:url('{photo_secondary}');"></div>
      <div class="projet-content">
        <div class="projet-eyebrow">PISSOURI · DISTRICT DE LIMASSOL · LIVRAISON T2 2027</div>
        <h2 class="projet-title">Maison de l'<em>Olivier</em>.</h2>
        <p class="projet-loc">MK Studio Lemesos · 4 unites · de 870 000 a 1 240 000 EUR</p>
        <div class="projet-kpis">
          <div><div class="kpi-label">Surface habitable</div><div class="kpi-value">240 — 320 m²</div></div>
          <div><div class="kpi-label">Terrain</div><div class="kpi-value">800 — 1 100 m²</div></div>
          <div><div class="kpi-label">Distance plage</div><div class="kpi-value">1 800 m</div></div>
        </div>
        <p class="projet-desc">Quatre maisons independantes posees sur une oliveraie ancienne, a 1,8 km de la baie de Pissouri. Architecture en pierre locale et beton lisse, toits-terrasses orientes sud-est, piscines privatives. Etudes fiscales <em>Lexaia</em> disponibles pour residents francais, allemands, belges et neerlandais.</p>
        <div class="projet-cta">
          <button class="btn-primary">Voir les unites disponibles</button>
          <button class="btn-secondary">Demander un rendez-vous</button>
        </div>
      </div>
    </div>

    <div class="imm-mockup-label">MOCKUP · DRAWER NIVEAU 3 — FICHE BIEN</div>
    <div class="drawer-row">
      <div class="drawer">
        <div class="drawer-eyebrow">APPARTEMENT B-04 · CORAL BAY RESIDENCES</div>
        <h2 class="drawer-title"><em>Trois</em> chambres,<br>vue mer franche.</h2>
        <div class="drawer-gallery">
          <div class="drawer-thumb" style="background-image:url('{photo_hero}');"></div>
          <div class="drawer-thumb" style="background-image:url('{photo_secondary}');"></div>
          <div class="drawer-thumb" style="background-image:url('{PHOTO_MOSAIC}');"></div>
        </div>
        <div class="drawer-data">
          <table>
            <tr><td>Surface interieure</td><td>124 m²</td></tr>
            <tr><td>Terrasse</td><td>18 m²</td></tr>
            <tr><td>Chambres</td><td>3</td></tr>
            <tr><td>Salles de bain</td><td>2</td></tr>
            <tr><td>Etage</td><td>2 / 4</td></tr>
            <tr><td>Orientation</td><td>Sud-Ouest</td></tr>
            <tr><td>Parking</td><td>1 place souterraine</td></tr>
            <tr><td>Stockage</td><td>5 m² inclus</td></tr>
            <tr><td>Prix</td><td>685 000 EUR</td></tr>
            <tr><td>Livraison</td><td>T4 2026</td></tr>
          </table>
        </div>
        <p class="drawer-desc">Cet appartement occupe l'angle sud-ouest du deuxieme etage. La lumiere y est continue de 9h a 18h en hiver, pleine en apres-midi. La terrasse de 18 m² donne sur la baie sans vis-a-vis. Les finitions sont conformes au standard Aristo Premium : sols en pierre Vratza, cuisine equipee Liebherr et Bosch, climatisation centralisee.</p>
        <div class="agent-bubble">
          <div class="agent-avatar">E</div>
          <div>
            <div class="agent-label">AGENT ENKI · CONVERSATIONNEL</div>
            <div class="agent-msg">"Cet appartement correspond bien a ce que vous m'avez decrit, Marie. Vue degagee, lumiere forte en apres-midi, et le projet est eligible a la residence chypriote pour vos parents si vous achetez en nom propre. Voulez-vous que Lexaia modelise les trois scenarios fiscaux possibles ?"</div>
          </div>
        </div>
        <div class="drawer-cta">
          <button class="btn-primary">Demander une visite</button>
          <button class="btn-secondary">Sauvegarder dans mon espace</button>
        </div>
      </div>

      <div>
        <div class="imm-mockup-label" style="margin-top:0;">MOCKUP · LEXAIA — RAPPORT PATRIMONIAL</div>
        <div class="mockup-lexaia">
          <div class="lexaia-head">
            <div class="lexaia-h-l">
              <div class="lexaia-tag">LEXAIA · RAPPORT PATRIMONIAL</div>
              <div class="lexaia-meta">Emis le 27 avril 2026<br>Valable jusqu'au 27 octobre 2026</div>
            </div>
            <div class="lexaia-meta-r">DESTINATAIRE<br>Marie L., residente fiscale<br>francaise</div>
          </div>
          <h2 class="lexaia-title">Trois scenarios pour votre acquisition a <em>Coral Bay</em>.</h2>
          <p class="lexaia-summary">Marie L., residente fiscale francaise (statut salariee, tranche marginale 41 %), envisage l'acquisition d'un appartement neuf a Coral Bay pour 685 000 EUR (scenario nominal), avec horizon de detention 10-15 ans et possibilite de location partielle saisonniere.</p>
          <p class="lexaia-summary">Trois structurations sont envisageables. Le scenario A (achat en nom propre, residence fiscale francaise maintenue) est le plus simple administrativement mais le moins efficace fiscalement. Le scenario B (achat en nom propre, transfert residence fiscale a Chypre via statut <em>non-dom</em>) optimise tres significativement la fiscalite courante. Le scenario C (achat via societe chypriote dediee) est pertinent si l'acquisition s'inscrit dans une strategie patrimoniale plus large.</p>
          <div class="lexaia-table-wrap">
          <table class="lexaia-table">
            <thead>
            <tr>
              <th></th>
              <th class="scenario">Scenario A<small>Nom propre · France</small></th>
              <th class="scenario">Scenario B<small>Non-dom · Chypre</small></th>
              <th class="scenario">Scenario C<small>Societe chypriote</small></th>
            </tr>
            </thead>
            <tbody>
            <tr><td>Acquisition (TVA 5%)</td><td>685 000 EUR</td><td>685 000 EUR</td><td>685 000 EUR</td></tr>
            <tr><td>Frais de transfert</td><td>20 550 EUR</td><td>20 550 EUR</td><td>20 550 EUR</td></tr>
            <tr><td>Frais juridiques</td><td>6 850 EUR</td><td>6 850 EUR</td><td>8 200 EUR</td></tr>
            <tr><td>Frais societe</td><td>—</td><td>—</td><td>3 500 EUR</td></tr>
            <tr class="total"><td>Investissement initial</td><td>712 400 EUR</td><td>712 400 EUR</td><td>717 250 EUR</td></tr>
            <tr class="head-sep"><td colspan="4"></td></tr>
            <tr><td>Loyer locatif annuel net</td><td>24 480 EUR</td><td>24 480 EUR</td><td>24 480 EUR</td></tr>
            <tr><td>Imposition annuelle</td><td>10 165 EUR</td><td>2 800 EUR</td><td>3 060 EUR</td></tr>
            <tr><td>Revenu net annuel</td><td>14 315 EUR</td><td>21 680 EUR</td><td>21 420 EUR</td></tr>
            <tr class="head-sep"><td colspan="4"></td></tr>
            <tr class="eco"><td>Economie annuelle vs A</td><td>—</td><td>+ 7 365 EUR</td><td>+ 7 105 EUR</td></tr>
            <tr class="eco"><td>Economie sur 10 ans</td><td>—</td><td>+ 73 650 EUR</td><td>+ 71 050 EUR</td></tr>
            </tbody>
          </table>
          </div>
          <p class="lexaia-disclaimer">Ce rapport est un document pedagogique produit par Lexaia, le systeme d'analyse fiscale d'ENKI Realty. Il ne constitue ni un conseil juridique, ni un conseil fiscal au sens des professions reglementees. Les scenarios presentes sont des modelisations basees sur les donnees declarees par le destinataire et sur la reglementation en vigueur a la date d'emission. Toute mise en oeuvre doit etre validee par un avocat fiscaliste ou un expert-comptable agree dans la juridiction concernee.</p>
        </div>
      </div>
    </div>

    <div class="wcag" data-wcag-pal="{p['key']}">
      <h4>CONTRASTE WCAG 2.2 — AUDIT AUTOMATIQUE</h4>
      <div class="wcag-grid">
        <div class="wcag-cell">
          <div class="wcag-pair">FOREGROUND / BACKGROUND</div>
          <div class="wcag-ratio" data-fg="{L['foreground_hex']}" data-bg="{L['background_hex']}">—</div>
          <div class="wcag-verdict"></div>
        </div>
        <div class="wcag-cell">
          <div class="wcag-pair">PRIMARY / BACKGROUND</div>
          <div class="wcag-ratio" data-fg="{L['primary_hex']}" data-bg="{L['background_hex']}">—</div>
          <div class="wcag-verdict"></div>
        </div>
        <div class="wcag-cell">
          <div class="wcag-pair">ACCENT / BACKGROUND</div>
          <div class="wcag-ratio" data-fg="{L['accent_hex']}" data-bg="{L['background_hex']}">—</div>
          <div class="wcag-verdict"></div>
        </div>
        <div class="wcag-cell">
          <div class="wcag-pair">FG DARK / BG DARK</div>
          <div class="wcag-ratio" data-fg="{D['foreground_hex']}" data-bg="{D['background_hex']}">—</div>
          <div class="wcag-verdict"></div>
        </div>
      </div>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 6 — Ambiance émotionnelle
# ============================================================

def build_ambiance():
    mockups = []
    for i, m in enumerate(AMBIANCE_PHOTOS):
        mockups.append(f'''
    <div class="ambiance-mockup" style="background-image:url('{m['src']}');">
      <div class="overlay"></div>
      <div class="overlay-text">
        <div class="overlay-text-eyebrow">{m['context']}</div>
        <div class="overlay-text-quote">"{m['quote']}"</div>
      </div>
    </div>''')
    return f'''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">06 · AMBIANCE</div>
      <div>
        <h2 class="section-title">L'ambiance <em>emotionnelle</em>.</h2>
        <p class="section-lead">Les memes trois mockups, sous le filtre de la palette en cours. Bascule entre les neuf palettes en haut de page pour voir laquelle parle a la marque. C'est ici que la decision se prend.</p>
      </div>
    </div>
    {''.join(mockups)}
    <div class="ambiance-detail">
      <div class="ambiance-detail-text">
        <p style="font-family:var(--font-serif);font-style:italic;font-size:32px;line-height:1.15;letter-spacing:-0.02em;margin-bottom:24px;">"Une marque qui dure dix ans n'est pas une marque qui plait <em>tout de suite</em>. C'est une marque qui ne se demode <em>jamais</em>."</p>
        <p>La discipline 95/5 est l'arme principale. Plus que la palette elle-meme. Une mauvaise palette appliquee avec discipline reste defendable. Une bonne palette appliquee sans discipline devient bruit.</p>
      </div>
      <div class="ambiance-detail-text">
        <p>Quand vous parcourez les neuf immersions, regardez moins les couleurs et plus la <em>retenue</em>. Demandez-vous : sur quelle palette le mot "Olivier" en italique signe-t-il vraiment ? Sur quelle palette le tableau Lexaia donne-t-il l'impression d'un cabinet d'experts plutot que d'un dashboard SaaS ?</p>
        <p>Les palettes graves (P1, P2, P3, P5, P9) maximisent l'autorite. Les palettes lumineuses (P4, P6, P7, P8) maximisent la chaleur. Aucune n'est "bonne" ou "mauvaise" dans l'absolu. Le choix est un choix de positionnement final dans le quadrant Sage × Magician.</p>
      </div>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 7 — Tableau comparatif
# ============================================================

def build_compare():
    rows = []
    for p in PALETTES:
        forces = "<ul>" + "".join([f"<li>{f}</li>" for f in p["forces"]]) + "</ul>"
        risques = "<ul>" + "".join([f"<li>{r}</li>" for r in p["risques"]]) + "</ul>"
        manifesto_court = p["manifesto"].split(".")[0] + "."
        stars = "★" * p["note"] + "☆" * (5 - p["note"])
        rows.append(f'''
        <tr>
          <td class="cmp-name">P0{p['id']} · {p['name']}</td>
          <td class="cmp-text">{manifesto_court}</td>
          <td class="cmp-text" style="text-transform:uppercase;letter-spacing:0.06em;font-family:var(--font-mono);font-size:11px;">{p['registre']}</td>
          <td>{forces}</td>
          <td>{risques}</td>
          <td><span class="stars">{stars}</span></td>
        </tr>''')
    return f'''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">07 · TABLEAU</div>
      <div>
        <h2 class="section-title">Synthese <em>comparative</em>.</h2>
        <p class="section-lead">Pour relire en un coup d'oeil. Les notes Claude sont indicatives — les arbitrages finaux relevent de Jean-Marie.</p>
      </div>
    </div>
    <div style="overflow-x:auto;">
    <table class="compare-table">
      <thead>
        <tr>
          <th style="width:18%;">Palette</th>
          <th style="width:24%;">Manifesto (1 phrase)</th>
          <th style="width:10%;">Registre</th>
          <th style="width:20%;">Forces</th>
          <th style="width:20%;">Risques / compromis</th>
          <th style="width:8%;">Note</th>
        </tr>
      </thead>
      <tbody>
        {''.join(rows)}
      </tbody>
    </table>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 8 — Recommandation
# ============================================================

def build_reco():
    return '''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">08 · RECOMMANDATION</div>
      <div>
        <h2 class="section-title">Recommandation <em>honnete</em>.</h2>
        <p class="section-lead">Ce que je defendrais si j'etais directeur artistique senior d'ENKI Realty pour les dix prochaines annees.</p>
      </div>
    </div>
    <div class="reco">
      <h3>La plus defendable a 10 ans : <em>Abzu au Lever du Soleil</em> (P09).</h3>
      <p>Trois palettes tiennent la corde : <em>Encre du Sage</em> (P01), <em>Abzu</em> (P03), et <em>Abzu au Lever du Soleil</em> (P09). Toutes trois respectent la discipline 95/5. Toutes trois sont compatibles avec les references Aman / Phaidon / Anthropic. Toutes trois evitent les bannissements (bleu SaaS, terracotta Airbnb, vert fintech).</p>
      <p>P01 est la plus sobre — elle s'efface jusqu'a l'austerite. C'est sa force et sa limite : elle dit autorite mais elle ne dit pas <em>lieu</em>. ENKI Realty parle de Chypre, du soleil, de la pierre. Une palette qui n'evoque rien de mediterraneen perd un signal narratif fort.</p>
      <p>P03 (<em>Abzu</em>) honore le mythe sans folkloriser. C'est la plus "ENKI" au sens strict du nom. Sa limite : elle reste tres grave. Un client qui cherche la transformation lifestyle (plage, communaute, soleil) ne sentira pas immediatement la chaleur du Sud.</p>
      <p>P09 (<em>Abzu au Lever du Soleil</em>) tient les deux mains du brief : la rationnelle (encre Abzu pour Lexaia, l'autorite, la rigueur) et l'emotionnelle (olive vivant et ocre miel comme accents alternants pour la vie qui s'eleve, le soleil qui pose la pierre). Le risque est la discipline : trois accents demandent de tres bien definir le role de chacun (olive = "vie / lifestyle", ocre = "valeur / transaction"). Mais ce risque est gerable par un design system rigoureux — et il est largement compense par la richesse narrative.</p>
      <p>Voies de modification possibles si Jean-Marie veut <em>hybrider</em> :</p>
      <p style="font-family:var(--font-mono);font-size:14px;line-height:1.7;background:color-mix(in oklch, var(--current-background), var(--current-foreground) 4%);padding:20px 24px;border-left:2px solid var(--current-accent);">→ P03 + accent secondaire ocre miel emprunte a P09 pour les CTAs primaires<br>→ P01 + accent unique laiton P03 pour reintroduire un signal mediterraneen<br>→ P09 avec olive supprime (ne garder que encre + ocre) si trois accents semblent trop</p>
      <p>Ma recommandation finale : tester P09 en pratique sur 3-5 ecrans reels (homepage, page projet, fiche bien, rapport Lexaia, formulaire) avant de figer. Si la discipline 95/5 tient, c'est elle. Si elle craque, replier sur P03 + ocre alternant.</p>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 9 — Section technique
# ============================================================

def build_tech():
    code = '''<span class="comment">/* Palette retenue — a appliquer en Couche 8 (Tailwind) */</span>
:root {
  <span class="var">--primary</span>:        oklch(0.21 0.04 250);   <span class="comment">/* Encre Abzu */</span>
  <span class="var">--accent-olive</span>:   oklch(0.62 0.06 115);   <span class="comment">/* Olive vivant — vie */</span>
  <span class="var">--accent-ocre</span>:    oklch(0.72 0.08 80);    <span class="comment">/* Ocre miel — valeur */</span>
  <span class="var">--background</span>:     oklch(0.93 0.020 85);   <span class="comment">/* Pierre claire */</span>
  <span class="var">--foreground</span>:     oklch(0.21 0.04 250);
  <span class="var">--card</span>:           oklch(0.98 0.005 80);   <span class="comment">/* Papier */</span>
  <span class="var">--muted</span>:          oklch(0.56 0.025 80);
  <span class="var">--border</span>:         oklch(0.89 0.025 85);
}

<span class="comment">/* Dark mode */</span>
.dark {
  <span class="var">--primary</span>:        oklch(0.72 0.08 80);
  <span class="var">--background</span>:     oklch(0.16 0.035 245);  <span class="comment">/* Abzu nuit */</span>
  <span class="var">--foreground</span>:    oklch(0.91 0.022 85);
  <span class="var">--card</span>:           oklch(0.25 0.045 250);
  <span class="var">--muted</span>:          oklch(0.60 0.025 80);
  <span class="var">--border</span>:         oklch(0.32 0.03 250);
}'''
    return f'''
<section class="book">
  <div class="container">
    <div class="section-head">
      <div class="section-num">09 · TECHNIQUE</div>
      <div>
        <h2 class="section-title">Notes <em>techniques</em>.</h2>
        <p class="section-lead">Pour le futur developpeur (et pour Jean-Marie). Format colorimétrique, architecture des tokens, et liens de reference.</p>
      </div>
    </div>
    <div class="tech-grid">
      <div class="tech-card">
        <h3>Format colorimetrique : OKLCH.</h3>
        <p>Les valeurs sont en OKLCH (Lightness Chroma Hue) plutot que HSL. OKLCH est perceptuel : a luminosite egale, deux couleurs apparaissent reellement de meme luminosite a l'oeil. C'est le format moderne (CSS Color Level 4) supporte par tous les navigateurs evergreen.</p>
        <p>Fallback HEX fournis pour les outils qui ne supportent pas OKLCH (Figma plugins legacy, mailers). Les valeurs HEX sont generees depuis OKLCH avec une matrice sRGB et arrondies.</p>
        <p>Outil recommande pour iterer : <strong>OKLCH Color Picker</strong> (oklch.com), gratuit, par Andrey Sitnik.</p>
      </div>
      <div class="tech-card">
        <h3>Architecture des tokens.</h3>
        <p>Trois tiers, comme Tailwind shadcn :</p>
        <ul>
          <li><strong>Tier 1 — Reference</strong> : valeurs brutes (ex: <code>--ink-950: oklch(...)</code>)</li>
          <li><strong>Tier 2 — Semantic</strong> : roles UI (ex: <code>--primary</code>, <code>--accent</code>)</li>
          <li><strong>Tier 3 — Component</strong> : usages contextuels (ex: <code>--btn-primary-bg</code>)</li>
        </ul>
        <p>L'avantage : on peut basculer une marque entiere en changeant le Tier 1 sans toucher au Tier 3. Le Tier 2 fait le pivot.</p>
        <p>Liens utiles :</p>
        <ul>
          <li><a href="https://uicolors.app" style="color:var(--current-accent);">uicolors.app</a> — generation de scales accessibles</li>
          <li><a href="https://realtimecolors.com" style="color:var(--current-accent);">realtimecolors.com</a> — apercu live</li>
          <li><a href="https://oklch.com" style="color:var(--current-accent);">oklch.com</a> — picker OKLCH par Sitnik</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:48px;">
      <h3 style="font-family:var(--font-serif);font-style:italic;font-size:24px;margin-bottom:16px;">Snippet — la palette recommandee.</h3>
      <pre class="code">{code}</pre>
    </div>
  </div>
</section>
'''


# ============================================================
# Section 10 — Footer
# ============================================================

def build_footer():
    return '''
<footer class="book-footer">
  <div class="container">
    <div>
      <h4>SOURCES NOTION</h4>
      <ul>
        <li><a href="https://www.notion.so/34f8c7bb25158159a40ae74dad3bf1c1">Couche 5 — Color System</a></li>
        <li><a href="https://www.notion.so/34f8c7bb25158180b17ac82291e7a3b5">Recherche approfondie + brainstorm</a></li>
        <li><a href="https://www.notion.so/34d8c7bb251581498d58cbc26bb35e2a">Brand Manifesto v1.2</a></li>
        <li><a href="https://www.notion.so/34f8c7bb251581ba9b75e54f5bb437fc">Couche 4 — Typography</a></li>
      </ul>
    </div>
    <div>
      <h4>COUCHES VALIDEES DU DESIGN SYSTEM</h4>
      <ul>
        <li><strong>Couche 1</strong> — Brand Manifesto v1.2 (25 avril 2026)</li>
        <li><strong>Couche 2</strong> — Conversational Tier (en cours)</li>
        <li><strong>Couche 3</strong> — Architecture Commerciale CRM</li>
        <li><strong>Couche 4</strong> — Typography Stack v1.0 (27 avril 2026 — VALIDEE)</li>
        <li><strong>Couche 5</strong> — Color System (en exploration · 9 palettes — ce document)</li>
        <li><strong>Couches 6-8</strong> — Motion, Imagery, Tailwind tokens (a venir)</li>
      </ul>
    </div>
    <div class="signature">
      Brand Book Color Lab — produit par Claude Opus 4.7 (Claude Code) sous l'autorite de Jean-Marie Delaunay.<br>
      Brief de Claude Opus 4.7 (web). 27 avril 2026 · Version 1.0 · Document de travail interne.
    </div>
  </div>
</footer>
'''


# ============================================================
# JS
# ============================================================

def build_js():
    pal_keys = ", ".join([f'"{p["key"]}"' for p in PALETTES])
    return r'''
const PALETTES = [%s];

// =============== Theme + Palette state =================
const state = {
  palette: 'p3',  // default Abzu
  theme: 'light',
};

function applyGlobal() {
  const body = document.body;
  body.dataset.theme = state.theme;
  const p = state.palette;

  // Set --current-* vars from chosen palette + theme
  const map = state.theme === 'dark'
    ? ['primary','accent','background','foreground','card','muted','border']
    : ['primary','accent','background','foreground','card','muted','border','secondary'];

  map.forEach(k => {
    const variant = state.theme === 'dark' ? `--${p}-dark-${k}` : `--${p}-${k}`;
    const fallback = `--${p}-${k}`;
    body.style.setProperty(`--current-${k}`, `var(${variant}, var(${fallback}))`);
    body.style.setProperty(`--current-${k}-hex`, `var(${variant}-hex, var(${fallback}-hex))`);
  });

  // Update active pill
  document.querySelectorAll('.palette-pill').forEach(b => {
    b.classList.toggle('active', b.dataset.pal === p);
  });

  // Update theme toggle label
  const tog = document.getElementById('themeToggle');
  if (tog) tog.textContent = state.theme === 'light' ? 'Light · Dark' : 'Dark · Light';

  // Persist
  try {
    localStorage.setItem('enki_color_lab', JSON.stringify(state));
  } catch (e) {}
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('enki_color_lab') || '{}');
    if (saved.palette && PALETTES.includes(saved.palette)) state.palette = saved.palette;
    if (saved.theme === 'dark' || saved.theme === 'light') state.theme = saved.theme;
  } catch (e) {}
}

function bindToolbar() {
  document.querySelectorAll('.palette-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.palette = btn.dataset.pal;
      applyGlobal();
    });
  });
  const tog = document.getElementById('themeToggle');
  if (tog) tog.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyGlobal();
  });
}

// =============== Immersion local toggle =================
function bindImmersionToggles() {
  document.querySelectorAll('.imm-toggle').forEach(group => {
    const palKey = group.dataset.toggle;
    const section = document.querySelector(`.immersion[data-pal="${palKey}"]`);
    if (!section) return;
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        // Update active button
        group.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
        // Update section
        section.dataset.theme = mode;
        if (mode === 'dark') {
          ['primary','accent','background','foreground','card','muted','border'].forEach(k => {
            const v = getComputedStyle(section).getPropertyValue(`--imm-dark-${k}`);
            const vHex = getComputedStyle(section).getPropertyValue(`--imm-dark-${k}-hex`);
            if (v) section.style.setProperty(`--imm-${k}`, v.trim());
            if (vHex) section.style.setProperty(`--imm-${k}-hex`, vHex.trim());
          });
        } else {
          // Reset by removing inline overrides — fallback to original style attr
          ['primary','accent','background','foreground','card','muted','border'].forEach(k => {
            section.style.removeProperty(`--imm-${k}`);
            section.style.removeProperty(`--imm-${k}-hex`);
          });
        }
      });
    });
  });
}

// =============== Mosaic scroll =================
function goToImmersion(palKey) {
  state.palette = palKey;
  applyGlobal();
  const target = document.getElementById('imm-' + palKey);
  if (target) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
window.goToImmersion = goToImmersion;

// =============== WCAG contrast =================
function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  const num = parseInt(hex, 16);
  return [(num>>16)&255, (num>>8)&255, num&255];
}
function relativeLuminance([r,g,b]) {
  const ch = c => {
    c /= 255;
    return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  };
  return 0.2126*ch(r) + 0.7152*ch(g) + 0.0722*ch(b);
}
function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hexToRgb(hex1));
  const L2 = relativeLuminance(hexToRgb(hex2));
  const [a,b] = L1 > L2 ? [L1,L2] : [L2,L1];
  return (a+0.05)/(b+0.05);
}
function verdictForRatio(r) {
  // Body text large requires 4.5:1 for AA, 7:1 for AAA
  if (r >= 7) return ['AAA','aaa'];
  if (r >= 4.5) return ['AA','aa'];
  if (r >= 3) return ['AA Large','aa'];
  return ['FAIL','fail'];
}
function computeWCAG() {
  document.querySelectorAll('.wcag-cell').forEach(cell => {
    const ratio = cell.querySelector('.wcag-ratio');
    const verd = cell.querySelector('.wcag-verdict');
    if (!ratio) return;
    const fg = ratio.dataset.fg;
    const bg = ratio.dataset.bg;
    if (!fg || !bg) return;
    try {
      const r = contrastRatio(fg, bg);
      ratio.textContent = r.toFixed(2) + ':1';
      const [v, cls] = verdictForRatio(r);
      verd.textContent = v;
      verd.className = 'wcag-verdict ' + cls;
    } catch(e) {
      ratio.textContent = '—';
    }
  });
}

// =============== Init =================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyGlobal();
  bindToolbar();
  bindImmersionToggles();
  computeWCAG();
});
''' % pal_keys


if __name__ == '__main__':
    build()
