import * as React from 'react';

export const useInView = () => {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current as HTMLDivElement);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return [inView, ref];
};
