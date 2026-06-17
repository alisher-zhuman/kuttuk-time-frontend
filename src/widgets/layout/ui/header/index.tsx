import { Icon } from "@shared/ui/icon";

export const Header = () => (
  <header className="px-4 h-12 bg-(--color-header) border-b border-(--color-line) flex items-center gap-2.5">
    <div className="flex items-center flex-1 min-w-0 leading-none">
      <div className="text-lg font-extrabold text-(--color-ink) tracking-tight whitespace-nowrap">
        Kuttuk<span className="text-(--color-primary)">Time</span>
      </div>
    </div>

    <div className="flex items-center gap-2.5 shrink-0">
      <div className="flex items-center gap-1.25 h-7.5 px-2.75 rounded-full bg-(--color-surface) text-(--color-ink) shrink-0">
        <Icon
          name="globe"
          size={15}
          strokeWidth={2}
          color="var(--color-primary)"
        />
        <span className="text-sm font-extrabold tracking-wide">РУ</span>
      </div>

      <div className="w-8 h-8 rounded-full bg-(--color-surface) flex items-center justify-center shrink-0">
        <Icon
          name="user"
          size={19}
          strokeWidth={2}
          color="var(--color-primary)"
        />
      </div>
    </div>
  </header>
);
