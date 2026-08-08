import { useEffect, useState } from "react";

type Props = {
  text: string;
  animate: boolean;
  onFinished?: () => void;
};

function Typewriter({
  text,
  animate,
  onFinished,
}: Props) {
  const [displayed, setDisplayed] = useState(
    animate ? "" : text
  );

  useEffect(() => {
    if (!animate) {
      setDisplayed(text);
      return;
    }

    let index = 0;

    setDisplayed("");

    const timer = setInterval(() => {
      index++;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(timer);
        onFinished?.();
      }
    }, 18);

    return () => clearInterval(timer);
  }, [text, animate, onFinished]);

  return (
    <span className="block max-w-full break-words whitespace-pre-wrap">
      {displayed}
    </span>
  );
}

export default Typewriter;