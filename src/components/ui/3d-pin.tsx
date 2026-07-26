import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(35deg) scale(0.92)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "relative group/pin z-20 cursor-pointer flex items-center justify-center my-4",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-1 top-1/2 flex justify-start items-start rounded-2xl shadow-xl bg-surface border border-border group-hover/pin:border-accent/50 transition-transform duration-500 overflow-hidden"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div className="pointer-events-none w-full h-56 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-30 transition duration-500">
      <div className="w-full h-full flex-none inset-0 relative">
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-surface border border-border py-1 px-4 shadow-xl">
            <span className="relative z-20 text-primary text-xs font-semibold inline-block py-0.5">
              {title}
            </span>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-accent/0 via-accent/90 to-accent/0"></span>
          </div>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 0.4, 0], scale: 1 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 h-40 w-40 rounded-full bg-accent/20 border border-accent/30"
          />
        </div>

        <div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-accent translate-y-[10px] w-px h-16 group-hover/pin:h-28 transition-all duration-300" />
        <div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-accent translate-y-[10px] w-1.5 h-1.5 rounded-full z-40" />
      </div>
    </motion.div>
  );
};
