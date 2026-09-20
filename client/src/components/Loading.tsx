import { LogoMark } from "./Logo";

const Loading = ({ fullScreen = false }: { fullScreen?: boolean }) => {
    return (
        <div className={`flex-center w-full flex-col gap-4 ${fullScreen ? "min-h-screen" : "min-h-96"}`} role="status">
            <div className="relative">
                <span className="absolute inset-0 animate-ping rounded-xl bg-app-orange/30" />
                <LogoMark className="relative size-10" />
            </div>
            <span className="text-sm text-app-text-light">Loading…</span>
        </div>
    );
};

export default Loading;
