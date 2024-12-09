import {
  animate,
  KeyframeOptions,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import { useRef } from "react";

type AnimatedCounterProps = {
  to: number;
  format?: boolean;
  animationOptions?: KeyframeOptions;
};

// const AnimatedCounter = ({ to, animationOptions }: AnimatedCounterProps) => {
//   const count = useMotionValue(0);
//   const rounded = useTransform(count, (latest) => Math.round(latest));

//   useEffect(() => {
//     const controls = animate(count, to);

//     return () => controls.stop();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return <motion.div>{rounded}</motion.div>;
// };

const AnimatedCounter = ({
  to,
  animationOptions,
  format,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    // Set initial value
    element.textContent = "0";

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 0.8,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = parseInt(value.toFixed(0)).toLocaleString("en");
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, inView, 0, to]);

  return <span ref={ref} />;
};

export default AnimatedCounter;
