type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <span className={`text-[15px] font-semibold tracking-tight text-white ${className ?? ""}`}>
      message-ui
    </span>
  );
}
