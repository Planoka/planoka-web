

// ─── Couleurs principales ───────────────────────────────────────────────────

export const PLANOKA_ORANGE = '#E8610A';

// ─── Palette complète (Light / Dark) ────────────────────────────────────────

export const Colors = {
    light: {
        primary: PLANOKA_ORANGE,
        primaryHover: '#CF5208',
        primaryLight: '#FDF0E6',
        primaryText: '#7A3205',

        background: '#F5F0E8', // Creme
        surface: '#FFFFFF',
        surfaceSecondary: '#F7F7F5',

        text: '#0F0F0F',
        textSecondary: '#3D3D3D',
        textTertiary: '#6B6B6B',

        border: '#E8E8E8',
        borderStrong: '#D0D0D0',

        success: '#12A05C',
        successBg: '#D1FAE5',
        warning: '#F59E0B',
        warningBg: '#FEF3C7',
        danger: '#EF4444',
        dangerBg: '#FEE2E2',
        info: '#3B82F6',

        tabBar: '#FFFFFF',
        inputBg: '#FFFFFF',
        inputBorder: '#E8E8E8',
        imageOverlay: 'rgba(0,0,0,0.60)',
    },
    dark: {
        primary: PLANOKA_ORANGE,
        primaryHover: '#CF5208',
        primaryLight: '#2A1505',
        primaryText: '#FDDEC8',

        background: '#0A0A0A',
        surface: '#1A1A1A',
        surfaceSecondary: '#2A2A2A',

        text: '#F0F0F0',
        textSecondary: '#A8A8A8',
        textTertiary: '#6B6B6B',

        border: '#2A2A2A',
        borderStrong: '#3D3D3D',

        success: '#12A05C',
        successBg: '#052E16',
        warning: '#F59E0B',
        warningBg: '#2D1500',
        danger: '#EF4444',
        dangerBg: '#2D0A0A',
        info: '#3B82F6',

        tabBar: '#1A1A1A',
        inputBg: '#2A2A2A',
        inputBorder: '#3D3D3D',
        imageOverlay: 'rgba(0,0,0,0.70)',
    },
};

// ─── Catégories (Couleurs de base) ──────────────────────────────────────────

export const CategoryColors = {
    restauration: { main: '#E8610A', bg: '#FDF0E6', text: '#7A3205' },
    loisirs: { main: '#7C3AED', bg: '#EDE9FE', text: '#3B0764' },
    sorties: { main: '#059669', bg: '#D1FAE5', text: '#064E3B' },
    shopping: { main: '#DC2626', bg: '#FEE2E2', text: '#7F1D1D' },
    services: { main: '#2563EB', bg: '#DBEAFE', text: '#1E3A5F' },
    sante: { main: '#DB2777', bg: '#FCE7F3', text: '#831843' },
    education: { main: '#D97706', bg: '#FEF3C7', text: '#78350F' },
    sport: { main: '#0891B2', bg: '#CFFAFE', text: '#164E63' },
    tourisme: { main: '#F59E0B', bg: '#FEF3C7', text: '#78350F' },
    culture: { main: '#7C3AED', bg: '#EDE9FE', text: '#3B0764' },
};

// ─── Espacement (Base 4px) ──────────────────────────────────────────────────

export const Spacing = {
    s1: 4,
    s2: 8,
    s3: 12,
    s4: 16,
    s5: 20,
    s6: 24,
    s8: 32,
    s10: 40,
    s12: 48,
    s16: 64,
    s20: 80,
};

// ─── Rayons de bordure ──────────────────────────────────────────────────────

export const Radius = {
    sm: 4,      // Badges, tags
    md: 8,      // Boutons, inputs
    lg: 12,     // Cartes desktop
    xl: 16,     // Cartes mobiles, modales, sheets
    '2xl': 24,  // Pills, tab bar flottante
    full: 9999, // Avatars, boutons circulaires
};

// ─── Typographie (Mobile utilise les polices système) ───────────────────────

export const Typography = {
    fontFamily: 'sans-serif',
    fontSize: {
        caption: 11,
        bodyS: 13,
        bodyM: 14,
        bodyL: 16,
        h4: 16,
        h3: 18,
        overlayL: 20,
        h2: 24,
        overlayXL: 28,
        h1: 32,
        display: 48,
    },
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    lineHeight: {
        tight: 1.1,
        snug: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },
};

// ─── Constantes spécifiques Mobile ──────────────────────────────────────────

export const MobileLayout = {
    tabBarHeight: 72,
    tabBarMarginHorizontal: 16,
    tabBarRadius: Radius['2xl'],
    tabBarShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
};

export const Animation = {
    fast: 150,
    base: 200,
    slow: 300,
};