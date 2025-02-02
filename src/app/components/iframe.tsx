import { useState } from "react";
import { createPortal } from "react-dom";

export default function Iframe({
  src,
  className,
  children,
  ...props
}: {
  src: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [contentRef, setContentRef] = useState(
    null as HTMLIFrameElement | null
  );
  const mountNode = document.body;
  return (
    <iframe
      src={src}
      className={className}
      sandbox="allow-scripts"
      {...props}
      ref={setContentRef}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
}
