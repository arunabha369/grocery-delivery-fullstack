import { P, svgDefaults, type ArtProps } from "./palette";

const Wheel = ({ cx }: { cx: number }) => (
    <g>
        <circle cx={cx} cy="214" r="30" fill={P.green900} />
        <circle cx={cx} cy="214" r="15" fill={P.creamDark} />
        <circle cx={cx} cy="214" r="6" fill={P.sand} stroke={P.green900} strokeOpacity=".25" strokeWidth="2" />
    </g>
);

/** Delivery rider on a scooter with an insulated grocery box. */
export default function ScooterArt({ speedLines = true, ...props }: ArtProps & { speedLines?: boolean }) {
    return (
        <svg viewBox="0 0 400 270" {...svgDefaults} {...props}>
            <ellipse cx="206" cy="248" rx="168" ry="9" fill="#000" fillOpacity=".12" />

            {speedLines && (
                <g stroke={P.orange300} strokeWidth="6" strokeLinecap="round">
                    <path d="M10 150H44" />
                    <path d="M22 176H52" strokeOpacity=".7" />
                    <path d="M4 202H36" strokeOpacity=".45" />
                </g>
            )}

            <Wheel cx={112} />
            <Wheel cx={304} />

            {/* delivery box on rear rack */}
            <rect x="60" y="136" width="76" height="7" rx="3.5" fill={P.green900} />
            <rect x="58" y="62" width="82" height="76" rx="12" fill={P.green700} />
            <path d="M58 76a12 12 0 0 1 12-12h58a12 12 0 0 1 12 12v6H58Z" fill={P.green900} />
            <circle cx="99" cy="110" r="17" fill={P.orange500} />
            <path d="M99 121c-7-1-10-7-8-15 7 1 10 7 8 15Z" fill={P.white} />
            <path d="M100 121c0-6 4-11 10-12 1 7-3 11-10 12Z" fill={P.white} fillOpacity=".75" />

            {/* rear body */}
            <path d="M64 208C62 170 90 146 134 144H200C210 144 214 152 210 162L198 200C196 206 190 208 184 208Z" fill={P.orange500} />
            <path d="M84 176C92 162 108 156 128 156" stroke={P.white} strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" />

            {/* floorboard + front shield + fender */}
            <rect x="182" y="198" width="96" height="13" rx="6.5" fill={P.green900} />
            <path d="M262 210C266 176 274 136 288 100H306C296 138 290 174 288 210Z" fill={P.orange500} />
            <path d="M272 208C276 182 332 182 336 208Z" fill={P.orange600} />

            {/* handlebar + headlight */}
            <path d="M296 102L300 76" stroke={P.green900} strokeWidth="8" strokeLinecap="round" />
            <path d="M276 76L318 70" stroke={P.green900} strokeWidth="7" strokeLinecap="round" />
            <path d="M318 98L372 84V120Z" fill={P.yellow} fillOpacity=".25" />
            <circle cx="312" cy="100" r="9" fill="#fde68a" stroke={P.orange600} strokeWidth="2.5" />

            {/* seat */}
            <rect x="142" y="132" width="72" height="15" rx="7.5" fill={P.green900} />

            {/* rider — leg */}
            <path d="M178 132L230 146L226 194" stroke={P.slate} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="216" y="188" width="34" height="13" rx="6.5" fill={P.green900} />

            {/* rider — torso */}
            <path d="M160 138C158 110 172 82 198 72L226 80C218 98 208 120 208 140Z" fill={P.green500} />
            <path d="M198 72L226 80L220 92C212 88 204 86 196 86Z" fill={P.orange500} />

            {/* rider — arm */}
            <path d="M212 88C236 100 258 94 280 78" stroke={P.green600} strokeWidth="14" strokeLinecap="round" />
            <circle cx="283" cy="76" r="7.5" fill={P.skin} />

            {/* rider — head + helmet */}
            <rect x="208" y="58" width="12" height="16" rx="5" fill={P.skin} />
            <circle cx="218" cy="48" r="17" fill={P.skin} />
            <path d="M199 52C198 36 208 25 221 25C234 25 242 35 241 47L240 52Z" fill={P.orange500} />
            <path d="M226 37H240.4C241.4 41 241.3 46 240 50H226C224.6 46 224.6 41 226 37Z" fill={P.green900} fillOpacity=".85" />
            <path d="M199 52H240" stroke={P.orange600} strokeWidth="3" strokeLinecap="round" />
            <path d="M207 31C212 28 217 27 222 27" stroke={P.white} strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}
