"use client";

import { useState } from "react";

export default function StagePreview() {
  const [stage, setStage] = useState<"start" | "preview">("start");

  return <div>StagePreview</div>;
}
