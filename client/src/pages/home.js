import { useEffect, useState} from "react";
import axios from "axios";
import {useGetUserId} from "../hooks/useGetUserId.js";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userId = useGetUserId();
  const [cookies, _] = useCookies(["access_token"]);
  useEffect(()=> {
      const fetchRecipe = async() => {
        try{
          const response = await axios.get("http://localhost:3001/recipes");
          setRecipes(response.data);
        }catch(err){
          console.error(err);
        }                                                                     
      };

      const fetchSavedRecipe = async() => {
        try{
          const response = await axios.get(`http://localhost:3001/recipes/saved-recipes/ids/${userId}`);
          setSavedRecipes(response.data.savedRecipes);
        }catch(err){
          console.error(err);
        }                                                                     
      };

      fetchRecipe();
      
      if(cookies.access_token) fetchSavedRecipe();
    }, [userId]);

  const saveRecipe = async (recipeId)=> {
    try{
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {recipeId,
        userId,
        },
        {headers: {authorization: cookies.access_token}}
        );
        setSavedRecipes(response.data.savedRecipes);
    }catch(err){
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h2> Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button 
                onClick={()=>saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
                >
                  {isRecipeSaved(recipe._id) ? "saved":"save"}
                </button>
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