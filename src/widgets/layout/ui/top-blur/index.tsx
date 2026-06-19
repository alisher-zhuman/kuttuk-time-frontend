interface Props {
  height: number;
}

export const TopBlur = ({ height }: Props) => (
  <div
    aria-hidden="true"
    className="fixed top-0 inset-x-0 pointer-events-none z-20 backdrop-blur-xs mask-[linear-gradient(to_bottom,black_80%,rgba(0,0,0,0.25))]"
    style={{ height }}
  />
);
