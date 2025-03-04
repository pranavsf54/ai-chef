import ReactMarkdown from "react-markdown";

export default function ChefRecipe(props) {
  return (
    <section className="suggested-recipe-container" aria-live="polite">
      <h2>AI Chef Recommends:</h2>
      <ReactMarkdown>{props.recipe}</ReactMarkdown>
    </section>
  );
}
