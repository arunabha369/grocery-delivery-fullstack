import type { SVGProps } from "react";

export type ArtProps = SVGProps<SVGSVGElement>;

// Shared illustration palette, derived from the brand tokens in index.css
export const P = {
    green900: "#1b3022",
    green800: "#22392a",
    green700: "#2d4a35",
    green600: "#3d6b4a",
    green500: "#4f8a5c",
    leaf: "#6fb26a",
    leafLight: "#a8d895",
    mint: "#dcefd5",
    orange600: "#ea580c",
    orange500: "#f97316",
    orange400: "#fb923c",
    orange300: "#fdba74",
    orange100: "#ffedd5",
    cream: "#faf7f2",
    creamDark: "#f0ebe3",
    sand: "#e5dccd",
    red: "#e2553f",
    redDark: "#bf3b28",
    yellow: "#f6c445",
    yellowDark: "#dea52a",
    kraft: "#d9a066",
    kraftDark: "#b98048",
    kraftLight: "#e9c08e",
    bread: "#e3a95f",
    breadDark: "#b8773a",
    purple: "#7b4fb3",
    purpleDark: "#5c3a8c",
    sky: "#8ecae6",
    skyLight: "#d7eef8",
    blue: "#4f93cf",
    pink: "#f49fb0",
    pinkLight: "#fbd6de",
    skin: "#e7a97e",
    slate: "#334155",
    white: "#ffffff",
} as const;

export const svgDefaults = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": true,
    focusable: false,
} as const;
