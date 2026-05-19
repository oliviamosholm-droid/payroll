export function EmptyStateIllustration() {
    return (
        <svg
            width="180"
            height="140"
            viewBox="0 0 180 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Soft background blob */}
            <ellipse cx="90" cy="120" rx="64" ry="8" fill="#EBEBEB" />

            {/* Back document (tilted left) */}
            <g transform="translate(50 22) rotate(-10 32 40)">
                <rect
                    width="64"
                    height="80"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#75A0F5"
                    strokeWidth="1.5"
                />
                <rect x="10" y="14" width="44" height="4" rx="2" fill="#DEEBFF" />
                <rect x="10" y="24" width="36" height="4" rx="2" fill="#DEEBFF" />
                <rect x="10" y="34" width="40" height="4" rx="2" fill="#DEEBFF" />
            </g>

            {/* Middle document (slightly tilted right) */}
            <g transform="translate(60 16) rotate(6 32 40)">
                <rect
                    width="64"
                    height="80"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#75A0F5"
                    strokeWidth="1.5"
                />
                <rect x="10" y="14" width="44" height="4" rx="2" fill="#DEEBFF" />
                <rect x="10" y="24" width="36" height="4" rx="2" fill="#DEEBFF" />
                <rect x="10" y="34" width="40" height="4" rx="2" fill="#DEEBFF" />
                <rect x="10" y="44" width="32" height="4" rx="2" fill="#DEEBFF" />
            </g>

            {/* Front document */}
            <g transform="translate(58 24)">
                <rect
                    width="64"
                    height="80"
                    rx="6"
                    fill="#FFFFFF"
                    stroke="#4573D2"
                    strokeWidth="1.5"
                />
                <rect x="10" y="14" width="44" height="4" rx="2" fill="#4573D2" />
                <rect x="10" y="24" width="36" height="4" rx="2" fill="#75A0F5" />
                <rect x="10" y="34" width="40" height="4" rx="2" fill="#75A0F5" />
                <rect x="10" y="44" width="32" height="4" rx="2" fill="#75A0F5" />
                <rect x="10" y="54" width="38" height="4" rx="2" fill="#75A0F5" />
            </g>

            {/* Plus badge */}
            <g transform="translate(118 12)">
                <circle cx="14" cy="14" r="14" fill="#4573D2" />
                <path
                    d="M14 7v14M7 14h14"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
            </g>

            {/* Sparkle accents */}
            <g fill="#4573D2">
                <path d="M28 40l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2-3.2-1.2 3.2-1.2z" opacity="0.8" />
                <path d="M152 78l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" opacity="0.6" />
                <path d="M40 92l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" opacity="0.5" />
            </g>
        </svg>
    );
}
