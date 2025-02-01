import confetti from "canvas-confetti";

export function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// 🎉 animation
export function cheerful() {
  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  });
}

export function shuffleArray<T = any>(arr: T[], outputLength?: number): T[] {
  const array = [...arr]
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  if (outputLength) {
    return array.slice(0, outputLength);
  }
  return array;
}
