import { createContext, useContext } from 'react';

interface SlideNavContextValue {
  goToSlide: (index: number) => void;
}

export const SlideNavContext = createContext<SlideNavContextValue>({
  goToSlide: () => {},
});

export function useSlideNav() {
  return useContext(SlideNavContext);
}
