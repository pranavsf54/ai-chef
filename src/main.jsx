import React from "react";
import IngredientsList from "./components/IngredientsList";
import ChefRecipe from "./components/ChefRecipe";
import { getRecipeFromGemini } from "./ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // We'll scroll to this div after the user clicks "Get Recipe"
  const recipeRef = React.useRef(null);

  async function getRecipe() {
    // 1) Scroll to the recipeRef so the user sees the loader immediately.
    recipeRef.current?.scrollIntoView({ behavior: "smooth" });

    // 2) Show loader while fetching
    setLoading(true);

    // 3) Fetch the recipe
    const recipeMarkdown = await getRecipeFromGemini(ingredients);

    // 4) Hide loader and set the recipe
    setLoading(false);
    setRecipe(recipeMarkdown);
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

      <div ref={recipeRef}></div>

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
