import type { ReactNode } from "react";
import { P, svgDefaults, type ArtProps } from "./palette";

const Scene = ({ children, shadow = true, ...props }: ArtProps & { children: ReactNode; shadow?: boolean }) => (
    <svg viewBox="0 0 240 180" {...svgDefaults} {...props}>
        <path d="M122 14C172 10 216 42 218 92C220 144 176 172 122 170C66 168 22 142 22 92C22 42 72 18 122 14Z" fill={P.creamDark} />
        {shadow && <ellipse cx="120" cy="160" rx="70" ry="6" fill={P.green900} fillOpacity=".08" />}
        {children}
    </svg>
);

const Leaf = ({ x, y, r = 0, s = 1, fill = P.leaf }: { x: number; y: number; r?: number; s?: number; fill?: string }) => (
    <path transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} d="M0 0C5-10 16-13 22-11C19-3 10 3 0 0Z" fill={fill} />
);

const Sparkle = ({ x, y, s = 1, fill = P.orange300 }: { x: number; y: number; s?: number; fill?: string }) => (
    <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-8C1-2 2-1 8 0C2 1 1 2 0 8C-1 2-2 1-8 0C-2-1-1-2 0-8Z" fill={fill} />
);

export const EmptyCartArt = (props: ArtProps) => (
    <Scene {...props}>
        <path d="M34 60C48 40 66 36 82 40" stroke={P.green600} strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
        <Leaf x={30} y={66} r={-30} s={1.1} fill={P.leafLight} />
        <Sparkle x={186} y={44} />
        <Sparkle x={200} y={70} s={0.6} fill={P.leafLight} />
        <path d="M86 92C86 46 154 46 154 92" stroke={P.green700} strokeWidth="8" strokeLinecap="round" />
        <path d="M62 94H178L166 148C164.7 154 160 158 154 158H86C80 158 75.3 154 74 148Z" fill={P.kraft} />
        <path d="M66 112H174M70 130H170M73 146H167" stroke={P.kraftDark} strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
        <path d="M94 98L97 156M120 98V156M146 98L143 156" stroke={P.kraftDark} strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
        <rect x="56" y="86" width="128" height="15" rx="7.5" fill={P.kraftDark} />
    </Scene>
);

export const NoResultsArt = (props: ArtProps) => (
    <Scene {...props}>
        <Leaf x={172} y={120} r={-60} s={1.2} fill={P.leafLight} />
        <circle cx="176" cy="140" r="15" fill={P.red} />
        <path d="M176 125l4-5 1 6 6-1-4 5 5 3-6 1-1 5-4-5-4 3 1-6-6-1 5-3Z" fill={P.green500} />
        <Sparkle x={52} y={50} />
        <Sparkle x={196} y={48} s={0.7} fill={P.leafLight} />
        <path d="M144 114L174 144" stroke={P.green900} strokeWidth="16" strokeLinecap="round" />
        <circle cx="114" cy="84" r="40" fill={P.white} stroke={P.green700} strokeWidth="10" />
        <path d="M90 72C94 62 102 56 112 54" stroke={P.creamDark} strokeWidth="5" strokeLinecap="round" />
        <path d="M103 74C103 66 108 62 114.5 62C121 62 126 66.5 126 72.5C126 79 120 81 116 84V89" stroke={P.orange500} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="116" cy="101" r="4.5" fill={P.orange500} />
    </Scene>
);

export const NoOrdersArt = (props: ArtProps) => (
    <Scene {...props}>
        <Sparkle x={48} y={46} />
        <Sparkle x={200} y={40} s={0.7} fill={P.leafLight} />
        <path d="M112 44C106 34 108 24 116 18" stroke={P.green600} strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
        <Leaf x={118} y={36} r={-70} s={1.1} />
        <path d="M92 64H176L184 44H100Z" fill="#c9925a" />
        <path d="M66 82L92 64H176L150 82Z" fill={P.kraftDark} />
        <path d="M66 82L92 64L68 52L42 70Z" fill={P.kraftLight} />
        <path d="M150 82L176 64L200 76L174 94Z" fill={P.kraftLight} />
        <path d="M150 82L176 64V136L150 156Z" fill="#c68d52" />
        <rect x="66" y="82" width="84" height="74" fill={P.kraft} />
        <rect x="84" y="104" width="48" height="28" rx="4" fill={P.white} fillOpacity=".92" />
        <path d="M92 114H124M92 122H112" stroke={P.sand} strokeWidth="3" strokeLinecap="round" />
    </Scene>
);

export const NoAddressArt = (props: ArtProps) => (
    <Scene {...props}>
        <Sparkle x={46} y={44} />
        <Leaf x={196} y={112} r={-120} s={1.1} fill={P.leafLight} />
        <path d="M48 80L88 68V142L48 154Z" fill={P.mint} />
        <path d="M88 68L130 80V154L88 142Z" fill="#c3e2b8" />
        <path d="M130 80L170 68V142L130 154Z" fill={P.mint} />
        <path d="M58 136C74 120 92 132 108 116C122 102 138 112 156 94" stroke={P.orange500} strokeWidth="3" strokeDasharray="5 6" strokeLinecap="round" />
        <ellipse cx="156" cy="96" rx="11" ry="3.5" fill={P.green900} fillOpacity=".15" />
        <path d="M156 28C141 28 130 39 130 53C130 71 156 94 156 94S182 71 182 53C182 39 171 28 156 28Z" fill={P.orange500} />
        <path d="M143 40C146 35 151 33 156 33" stroke={P.white} strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
        <circle cx="156" cy="53" r="9" fill={P.white} />
    </Scene>
);

export const NoDealsArt = (props: ArtProps) => (
    <Scene {...props}>
        <Sparkle x={186} y={40} />
        <Sparkle x={42} y={120} s={0.7} fill={P.leafLight} />
        <path d="M58 30L46 56H58L50 80L74 48H61L69 30Z" fill={P.yellow} />
        <g transform="rotate(-16 120 96)">
            <path d="M160 94C176 84 184 70 176 60" stroke={P.green700} strokeWidth="3" strokeLinecap="round" />
            <path d="M76 62H146L178 94L146 126H76C71.6 126 68 122.4 68 118V70C68 65.6 71.6 62 76 62Z" fill={P.orange500} />
            <path d="M76 62H146L154 70H76C72 70 68 72 68 76V70C68 65.6 71.6 62 76 62Z" fill={P.white} fillOpacity=".18" />
            <circle cx="152" cy="94" r="7" fill={P.creamDark} />
            <circle cx="92" cy="82" r="7" stroke={P.white} strokeWidth="4.5" />
            <circle cx="120" cy="106" r="7" stroke={P.white} strokeWidth="4.5" />
            <path d="M120 76L92 112" stroke={P.white} strokeWidth="5" strokeLinecap="round" />
        </g>
    </Scene>
);

export const NotFoundArt = (props: ArtProps) => (
    <Scene {...props}>
        <Sparkle x={196} y={44} />
        <path d="M84 40C84 30 91 24 100 24C109 24 116 30 116 38C116 46 108 48 104 52V58" stroke={P.green700} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="104" cy="71" r="4.5" fill={P.green700} />
        <path d="M44 106L58 92H148L136 106Z" fill={P.kraftLight} />
        <rect x="44" y="104" width="94" height="52" rx="6" fill={P.kraft} />
        <path d="M136 106L148 92V144L136 156Z" fill={P.kraftDark} />
        <circle cx="86" cy="130" r="14" fill={P.green700} />
        <path d="M86 139c-6-1-8-6-6-12 6 1 8 6 6 12Z" fill={P.leafLight} />
        <path d="M87 139c0-5 3-8 8-9 1 5-2 9-8 9Z" fill={P.leaf} />
        <circle cx="170" cy="144" r="15" fill={P.red} />
        <ellipse cx="164" cy="138" rx="3" ry="4.5" fill={P.white} fillOpacity=".35" />
        <path d="M170 129C174 122 181 121 184 123C181 128 175 130 170 129Z" fill={P.leaf} />
        <circle cx="202" cy="150" r="10" fill={P.orange400} />
        <circle cx="198" cy="146" r="2" fill={P.white} fillOpacity=".45" />
    </Scene>
);

export const EnvelopeArt = (props: ArtProps) => (
    <svg viewBox="0 0 200 160" {...svgDefaults} {...props}>
        <circle cx="100" cy="84" r="72" fill={P.mint} />
        <path d="M22 52C30 38 44 32 58 34" stroke={P.green600} strokeOpacity=".35" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
        <path transform="translate(168 42) scale(1)" d="M0-9C1-2 2-1 9 0C2 1 1 2 0 9C-1 2-2 1-9 0C-2-1-1-2 0-9Z" fill={P.orange300} />
        <rect x="40" y="64" width="120" height="78" rx="10" fill={P.orange600} />
        <g transform="rotate(-4 100 70)">
            <rect x="58" y="26" width="84" height="80" rx="6" fill={P.white} />
            <path d="M70 44H118M70 56H130M70 68H110" stroke={P.creamDark} strokeWidth="5" strokeLinecap="round" />
            <path d="M122 88c-7-1-10-7-8-14 7 1 10 7 8 14Z" fill={P.leaf} />
            <path d="M123 88c0-6 4-10 10-11 1 6-3 10-10 11Z" fill={P.leafLight} />
        </g>
        <path d="M40 76L100 116L160 76V132C160 137.5 155.5 142 150 142H50C44.5 142 40 137.5 40 132Z" fill={P.orange500} />
        <path d="M42 140L90 108M158 140L110 108" stroke={P.orange600} strokeOpacity=".6" strokeWidth="2" />
    </svg>
);
