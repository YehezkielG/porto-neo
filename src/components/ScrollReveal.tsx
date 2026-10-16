import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type RevealTag = 'div' | 'section' | 'article';
type ScrollRevealProps = PropsWithChildren<Omit<HTMLMotionProps<'div'>, 'children'>> & { as?: RevealTag };

const ScrollReveal = ({ as = 'div', children, ...props }: ScrollRevealProps) => {
  const reduceMotion = useReducedMotion();
  const MotionElement = as === 'section' ? motion.section : as === 'article' ? motion.article : motion.div;

  return (
    <MotionElement
      initial={reduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </MotionElement>
  );
};

export default ScrollReveal;
