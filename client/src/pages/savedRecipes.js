import { useEffect, useState} from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId.js";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userId = useGetUserId();

  useEffect(()=> {
      
      const fetchRecipe = async() => {
        try{
          const response = await axios.get(`http://localhost:3001/recipes/saved-recipes/${userId}`);
          setSavedRecipes(response.data.savedRecipes);
        }catch(err){
          console.error(err);
        }                                                                     
      };

      fetchRecipe();
    }, [userId]);

  return (
    <div>
      <h2> Saved Recipes</h2>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imgUrl}  alt={recipe.name}/>
            <p> Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};