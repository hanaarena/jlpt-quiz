import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./loading.module.css";

interface LoadingProps {
  onFadeOut?: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onFadeOut }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // マウント後にすぐフェードアウト開始
    const timer = setTimeout(() => {
      setFadeOut(true);
      // アニメーションが終わったら onFadeOut を呼ぶ
    }, 500);

    return () => clearTimeout(timer);
  }, [onFadeOut]);

  return (
    <div
      className={`${styles.loadingOverlay} ${fadeOut ? styles.fadeOut : ""}`}
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif"
        alt="読み込み中..."
        className={styles.spinner}
        width={100}
        height={100}
        unoptimized
      />
    </div>
  );
};

export default Loading;
