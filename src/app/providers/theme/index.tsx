import { type ReactNode } from "react";

import "@shared/store";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => <>{children}</>;
