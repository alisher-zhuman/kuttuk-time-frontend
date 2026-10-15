import { useEffect, useState } from "react";

const getMsLeft = (deadline: string) =>
  Math.max(0, new Date(deadline).getTime() - Date.now());

export const useCountdown = (deadline: string) => {
  const [msLeft, setMsLeft] = useState(() => getMsLeft(deadline));

  useEffect(() => {
    const id = setInterval(() => {
      const next = getMsLeft(deadline);

      setMsLeft(next);

      if (next === 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deadline]);

  return msLeft;
};
