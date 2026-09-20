import { P, svgDefaults, type ArtProps } from "./palette";

const Leaf = ({ x, y, r = 0, s = 1, fill = P.leafLight }: { x: number; y: number; r?: number; s?: number; fill?: string }) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
        <path d="M0 0C6-12 20-16 28-14C24-4 12 4 0 0Z" fill={fill} />
        <path d="M2-1C10-6 18-10 25-12.5" stroke={P.green600} strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round" />
    </g>
);

const Sparkle = ({ x, y, s = 1, fill = P.orange300 }: { x: number; y: number; s?: number; fill?: string }) => (
    <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-12C1.5-3 3-1.5 12 0C3 1.5 1.5 3 0 12C-1.5 3-3 1.5-12 0C-3-1.5-1.5-3 0-12Z" fill={fill} />
);

/** Paper grocery bag overflowing with produce — the home hero centrepiece. */
export default function HeroArt(props: ArtProps) {
    return (
        <svg viewBox="0 0 560 520" {...svgDefaults} {...props}>
            {/* backdrop */}
            <circle cx="285" cy="272" r="214" fill={P.white} fillOpacity=".05" />
            <circle cx="285" cy="272" r="244" stroke={P.white} strokeOpacity=".12" strokeWidth="1.5" strokeDasharray="3 11" strokeLinecap="round" />
            <circle cx="474" cy="98" r="32" fill={P.orange500} fillOpacity=".9" />
            <circle cx="474" cy="98" r="45" stroke={P.orange500} strokeOpacity=".3" strokeWidth="2" />

            <Sparkle x={118} y={118} s={1.1} />
            <Sparkle x={506} y={290} s={0.8} fill={P.leafLight} />
            <Sparkle x={92} y={330} s={0.6} fill={P.white} />
            <Leaf x={96} y={214} r={-20} s={1.3} />
            <Leaf x={470} y={396} r={200} s={1.1} fill={P.leaf} />
            <Leaf x={392} y={64} r={30} s={0.8} />

            {/* ground shadow */}
            <ellipse cx="292" cy="474" rx="190" ry="14" fill="#000" fillOpacity=".22" />

            {/* bag interior (back rim) */}
            <path d="M190 250 L216 234 H414 L388 250 Z" fill={P.kraftDark} />

            {/* baguette */}
            <g transform="rotate(-22 236 250)">
                <rect x="216" y="92" width="42" height="200" rx="21" fill={P.bread} />
                <rect x="222" y="112" width="9" height="160" rx="4.5" fill={P.white} fillOpacity=".2" />
                <path d="M228 120l18 10M228 150l18 10M228 180l18 10M228 210l18 10" stroke={P.breadDark} strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* leafy greens */}
            <g>
                <path d="M300 250C272 214 262 168 280 128C296 150 308 196 312 250Z" fill={P.green500} />
                <path d="M306 250C300 196 314 142 350 116C356 160 340 210 326 250Z" fill={P.leaf} />
                <path d="M282 250C256 226 240 190 246 158C268 176 286 212 296 250Z" fill={P.green600} />
                <path d="M318 248C318 200 330 162 342 136M298 248C292 206 286 172 282 140M290 250C278 222 264 198 252 172" stroke={P.green900} strokeOpacity=".25" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* carrots */}
            <g transform="rotate(18 372 214)">
                <path d="M364 150H384L378 262H370Z" fill={P.orange500} />
                <path d="M367 170h8M369 196h9M368 224h7" stroke={P.orange600} strokeWidth="3" strokeLinecap="round" />
                <path d="M374 152C366 132 354 124 346 126C352 136 362 144 370 152Z" fill={P.leaf} />
                <path d="M374 152C376 130 386 118 396 118C392 132 384 144 378 152Z" fill={P.green500} />
            </g>

            {/* milk bottle */}
            <g>
                <rect x="332" y="120" width="30" height="36" rx="8" fill={P.white} />
                <rect x="328" y="106" width="38" height="18" rx="6" fill={P.orange500} />
                <rect x="318" y="146" width="58" height="120" rx="18" fill={P.white} />
                <rect x="318" y="186" width="58" height="42" fill={P.green600} />
                <path d="M347 216c-7-1-10-6-9-13 7 0 11 5 9 13Z" fill={P.leafLight} />
                <path d="M349 216c1-6 5-9 11-9 0 6-4 10-11 9Z" fill={P.white} fillOpacity=".8" />
                <rect x="326" y="156" width="8" height="24" rx="4" fill={P.creamDark} />
            </g>

            {/* bag front */}
            <path d="M388 250 L414 234 L410 446 Q409 456 400 460 L382 470 Z" fill={P.kraftDark} />
            <path d="M186 256 H388 L382 458 Q381 470 369 470 H205 Q193 470 192 458 Z" fill={P.kraft} />
            <path d="M182 248 H392 L388 272 H186 Z" fill={P.kraftLight} />
            <path d="M392 248 L418 232 L414 256 L388 272 Z" fill={P.kraft} />
            <path d="M200 300V448" stroke={P.white} strokeOpacity=".22" strokeWidth="8" strokeLinecap="round" />

            {/* bag badge */}
            <circle cx="287" cy="362" r="46" fill={P.green700} />
            <circle cx="287" cy="362" r="37" stroke={P.white} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="2 5" />
            <path d="M287 384C272 382 264 368 268 348C286 350 294 364 287 384Z" fill={P.leafLight} />
            <path d="M289 384C288 368 296 354 312 350C314 368 304 382 289 384Z" fill={P.leaf} />
            <path d="M287 384C284 372 280 362 274 354" stroke={P.green700} strokeWidth="2" strokeLinecap="round" />

            {/* tomato */}
            <g>
                <ellipse cx="176" cy="444" rx="40" ry="34" fill={P.red} />
                <ellipse cx="162" cy="432" rx="10" ry="7" fill={P.white} fillOpacity=".3" transform="rotate(-25 162 432)" />
                <path d="M176 414l7-8 2 10 10-2-7 8 8 6-11 1-2 9-6-8-7 6 1-10-10-2 9-5Z" fill={P.green500} />
            </g>

            {/* orange */}
            <g>
                <circle cx="414" cy="448" r="30" fill={P.orange400} />
                <circle cx="404" cy="440" r="3" fill={P.white} fillOpacity=".45" />
                <circle cx="422" cy="456" r="2" fill={P.orange600} fillOpacity=".5" />
                <circle cx="410" cy="462" r="2" fill={P.orange600} fillOpacity=".5" />
                <path d="M414 418C418 408 428 404 436 406C432 414 424 418 414 418Z" fill={P.leaf} />
            </g>
        </svg>
    );
}
