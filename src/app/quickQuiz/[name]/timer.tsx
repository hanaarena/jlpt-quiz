import { useEffect, useState } from "react";
import { formatHMS } from "@/app/utils/time";

interface TimerProps {
  startTime: number | null;
  isRunning: boolean;
}

export default function Timer({ startTime, isRunning }: TimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    let frameId: number;
    const updateTimer = () => {
      setTick((prev) => prev + 1);
      frameId = requestAnimationFrame(updateTimer);
    };

    frameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(frameId);
  }, [startTime, isRunning]);

  return <div className="timer font-mono">{formatHMS(startTime)}</div>;
}
