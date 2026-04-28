import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'cyprus-terra': {
					DEFAULT: 'hsl(var(--cyprus-terra))',
					foreground: 'hsl(var(--cyprus-terra-foreground))'
				},
				'golden-visa': {
					DEFAULT: 'hsl(var(--golden-visa))',
					foreground: 'hsl(var(--golden-visa-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				/* ============================================================
				 * ENKI Realty — Design System Couche 5 (verrouillée 28/04/2026)
				 *
				 * Namespace 'enki' pour éviter toute collision avec les tokens
				 * Shadcn existants pendant la phase de migration.
				 *
				 * Usage : bg-enki-bg, text-enki-fg, border-enki-accent-soft,
				 *         bg-enki-aero-500, text-enki-chamoisee-700, etc.
				 *
				 * Voir docs/design-system/05-color-system.md
				 * ============================================================ */
				enki: {
					/* Sémantiques (basculent automatiquement light/dark) */
					bg: 'var(--bg)',
					card: 'var(--card)',
					fg: 'var(--fg)',
					'fg-muted': 'var(--fg-muted)',
					accent: 'var(--accent)',
					'accent-soft': 'var(--accent-soft)',
					warm: 'var(--warm)',
					/* Échelle Aero · 11 paliers · hue 220° */
					'aero-50':  'var(--aero-50)',
					'aero-100': 'var(--aero-100)',
					'aero-200': 'var(--aero-200)',
					'aero-300': 'var(--aero-300)',
					'aero-400': 'var(--aero-400)',
					'aero-500': 'var(--aero-500)',
					'aero-600': 'var(--aero-600)',
					'aero-700': 'var(--aero-700)',
					'aero-800': 'var(--aero-800)',
					'aero-900': 'var(--aero-900)',
					'aero-950': 'var(--aero-950)',
					/* Échelle Chamoisée · 11 paliers · hue 50° */
					'chamoisee-50':  'var(--chamoisee-50)',
					'chamoisee-100': 'var(--chamoisee-100)',
					'chamoisee-200': 'var(--chamoisee-200)',
					'chamoisee-300': 'var(--chamoisee-300)',
					'chamoisee-400': 'var(--chamoisee-400)',
					'chamoisee-500': 'var(--chamoisee-500)',
					'chamoisee-600': 'var(--chamoisee-600)',
					'chamoisee-700': 'var(--chamoisee-700)',
					'chamoisee-800': 'var(--chamoisee-800)',
					'chamoisee-900': 'var(--chamoisee-900)',
					'chamoisee-950': 'var(--chamoisee-950)',
					/* Échelle Encre · 11 paliers · hue 250° (anchor 700) */
					'encre-50':  'var(--encre-50)',
					'encre-100': 'var(--encre-100)',
					'encre-200': 'var(--encre-200)',
					'encre-300': 'var(--encre-300)',
					'encre-400': 'var(--encre-400)',
					'encre-500': 'var(--encre-500)',
					'encre-600': 'var(--encre-600)',
					'encre-700': 'var(--encre-700)',
					'encre-800': 'var(--encre-800)',
					'encre-900': 'var(--encre-900)',
					'encre-950': 'var(--encre-950)',
				}
			},
			boxShadow: {
				'premium': 'var(--shadow-premium)',
				'elegant': 'var(--shadow-lg)',
				'cyprus': '0 10px 30px -10px hsl(199 63% 59% / 0.25)',
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-premium': 'var(--gradient-premium)',
				'gradient-ocean': 'var(--gradient-ocean)',
				'gradient-sand': 'var(--gradient-sand)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
