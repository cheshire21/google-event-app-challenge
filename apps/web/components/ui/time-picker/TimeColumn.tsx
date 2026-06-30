"use client";

import * as React from "react";
import { stopScroll } from "./utils";

const columnCls =
  "flex h-52 flex-col gap-0.5 overflow-y-scroll overscroll-contain py-6 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface TimeColumnProps {
  colRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

export function TimeColumn({ colRef, children }: TimeColumnProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-popover to-transparent" />
      <div ref={colRef} className={columnCls} onWheel={stopScroll}>
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-popover to-transparent" />
    </div>
  );
}
