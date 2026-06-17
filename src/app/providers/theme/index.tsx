import { type ReactNode } from "react";

import "@app/stores/theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => <>{children}</>;
