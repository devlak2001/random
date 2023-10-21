import { useEffect, useState } from "react";

export function useDeviceScreen() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    orientation: string | null;
  }>({
    width: 0,
    height: 0,
    orientation: null,
  });

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      orientation:
        window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    });
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
