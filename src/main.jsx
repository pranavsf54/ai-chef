import React from "react";
import IngredientsList from "./components/IngredientsList";
import ChefRecipe from "./components/ChefRecipe";
import { getRecipeFromGemini } from "./ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Scroll to this div after the user clicks "Get Recipe"
  const loaderRef = React.useRef(null);

  async function getRecipe() {
    // Show the loader immediately
    setLoading(true);

    // Use a timeout to ensure that the loader is rendered and its layout is complete
    setTimeout(() => {
      // Scroll to the loader element's bottom using window.scrollTo
      if (loaderRef.current) {
        const loaderBottom =
          loaderRef.current.offsetTop + loaderRef.current.offsetHeight;
        window.scrollTo({
          top: loaderBottom,
          behavior: "smooth",
        });
      }
    }, 100); // delay of 100ms can be adjusted

    // Fetch the recipe
    const recipeMarkdown = await getRecipeFromGemini(ingredients);
    setRecipe(recipeMarkdown);
    setLoading(false);

    // Optionally, scroll again so the recipe is fully visible
    setTimeout(() => {
      if (loaderRef.current) {
        const loaderBottom =
          loaderRef.current.offsetTop + loaderRef.current.offsetHeight;
        window.scrollTo({
          top: loaderBottom,
          behavior: "smooth",
        });
      }
    }, 100);
  }

  function addIngredient(formData) {
    const newIngredient = formData.get("ingredient");
    setIngredients((prev) => [...prev, newIngredient]);
  }

  function removeIngredient() {
    setIngredients((prev) => prev.slice(0, -1));
  }

  return (
    <main>
      <div className="add-ingredient-container">
        <form action={addIngredient} className="add-ingredient-form">
          <input
            type="text"
            placeholder="e.g. oregano"
            aria-label="Add ingredient"
            name="ingredient"
          />
          <button>Add ingredient</button>
        </form>
        <p className="instructions">
          Add at least 4 ingredients to generate a recipe
        </p>
      </div>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={getRecipe}
          removeIngredient={removeIngredient}
        />
      )}

      <div ref={loaderRef}></div>

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Fetching your recipe, please wait...</p>
        </div>
      )}

      {recipe && !loading && <ChefRecipe recipe={recipe} />}
    </main>
  );
}
