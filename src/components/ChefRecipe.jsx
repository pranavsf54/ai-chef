import React from "react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChefRecipe({ recipe }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!recipe) return;
    setDisplayedText(""); // Reset when a new recipe is provided
    let i = 0;
    const intervalId = setInterval(() => {
      i++;
      setDisplayedText(recipe.slice(0, i));

      // Scroll to the bottom of the page as new text is added
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });

      if (i >= recipe.length) {
        clearInterval(intervalId);
      }
    }, 10); // Faster typing: 10ms per character

    return () => clearInterval(intervalId);
  }, [recipe]);

  return (
    <>
      <section className="suggested-recipe-container" aria-live="polite">
        <h2>AI Chef Recommends</h2>
        <ReactMarkdown>{displayedText}</ReactMarkdown>
      </section>
    </>
  );
}
