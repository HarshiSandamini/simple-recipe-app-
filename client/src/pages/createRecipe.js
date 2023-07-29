import { useState } from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId.js";
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userId = useGetUserId();
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name:"",
    ingredients: [],
    instructions: "",
    imgUrl: "",
    cookingTime: 0,
    userOwner: userId, 
  });

  const  navigate = useNavigate(); 

  const handleChange = (event) => {
    const {name, value} = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients});
  };

  const addIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await axios.post(
        "http://localhost:3001/recipes", 
        recipe,
        {headers: {authorization: cookies.access_token}});
      alert("Recipe Created");
      console.log(response);
      navigate("/");
    }catch(err){
      console.error(err);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" onChange={handleChange}/>
        <label>Ingredients</label>
        {recipe.ingredients.map((ingredient, idx)=>(
          <input
            key={idx}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange = {(event) => handleIngredientChange(event, idx)}
          />
        ))} 
        <button onClick={addIngredient} type="button">Add Ingredient</button>
        <label htmlFor="instructions">Instructions</label>
        <textarea 
          id="instructions" 
          name="instructions" 
          onChange={handleChange}
        ></textarea>
        <label htmlFor="imgUrl">Image Url</label>
        <input type="text" id="imgUrl" name="imgUrl" onChange={handleChange}/>
        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input type="number" id="cookingTime" name="cookingTime" onChange={handleChange}/>
        <button type="submit"> Create Recipe </button>
      </form>
    </div>
  );
};