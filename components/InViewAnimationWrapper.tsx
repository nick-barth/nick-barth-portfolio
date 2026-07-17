"use client";

import { ReactNode } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface InViewAnimationWrapperProps {
  children: ReactNode;
  animationClass: string;
}

export function InViewAnimationWrapper({
  children,
  animationClass,
}: InViewAnimationWrapperProps) {
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className={isInView ? animationClass : ""}>
      {children}
    </div>
  );
}
