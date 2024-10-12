import React, { useState } from 'react';
import { List, BookOpen, ShoppingCart, ChevronDown, ChevronUp, Plus, Minus, X } from 'lucide-react';

const QuantitySelector = ({ value, onChange, max = 10 }) => (
  <div className="flex items-center space-x-2">
    <button onClick={() => onChange(Math.max(1, value - 1))} className="p-1 bg-gray-200 rounded">
      <Minus size={16} />
    </button>
    <span>{value}</span>
    <button onClick={() => onChange(Math.min(max, value + 1))} className="p-1 bg-gray-200 rounded">
      <Plus size={16} />
    </button>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [recipeQuantities, setRecipeQuantities] = useState({});
  const [groceryQuantities, setGroceryQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const recipes = [
    {
      name: 'Spaghetti Bolognese',
      ingredients: ['Spaghetti', 'Ground beef', 'Tomato sauce', 'Onion', 'Garlic', 'Olive oil', 'Salt', 'Pepper'],
      portionSize: '4 servings'
    },
    { name: 'Chicken Stir Fry', ingredients: [] },
    { name: 'Vegetable Curry', ingredients: [] }
  ];

  const groceryCategories = [
    {
      name: 'Fruits & Vegetables',
      items: ['Apples', 'Bananas', 'Carrots', 'Broccoli', 'Tomatoes', 'Spinach', 'Oranges', 'Potatoes']
    },
    { name: 'Dairy & Eggs', items: [] },
    { name: 'Most Bought', items: [] },
    { name: 'Seasonal Items', items: [] }
  ];

  const toggleRecipe = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const updateRecipeQuantity = (recipeIndex, newQuantity) => {
    setRecipeQuantities({ ...recipeQuantities, [recipeIndex]: newQuantity });
  };

  const updateGroceryQuantity = (categoryIndex, itemIndex, newQuantity) => {
    setGroceryQuantities({
      ...groceryQuantities,
      [`${categoryIndex}-${itemIndex}`]: newQuantity
    });
  };

  const addRecipeToCart = (recipe, quantity) => {
    setConfirmationModal({ recipe, quantity });
  };

  const confirmAddRecipeToCart = (recipe, quantity, selectedIngredients) => {
    const newItems = selectedIngredients.map(ingredient => ({
      name: ingredient,
      quantity: quantity,
      recipe: recipe.name
    }));
    setCart([...cart, ...newItems]);
    setConfirmationModal(null);
  };

  const addGroceryItemToCart = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem.name === item);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.name === item ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ));
    } else {
      setCart([...cart, { name: item, quantity }]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Redesigned Top Bar */}
      <div className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-3xl font-bold mb-4">Food Shopper</h1>
            <div className="flex space-x-4">
              <button 
                className={`px-6 py-2 rounded-md text-lg transition-colors ${activeTab === 'recipes' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() => setActiveTab('recipes')}
              >
                Recipes
              </button>
              <button 
                className={`px-6 py-2 rounded-md text-lg transition-colors ${activeTab === 'groceries' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() => setActiveTab('groceries')}
              >
                Groceries
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <button 
            className="p-2 bg-blue-700 rounded-full relative"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'recipes' ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Recipes</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleRecipe(index)}
                >
                  <span className="text-xl">{recipe.name}</span>
                  {expandedRecipe === index ? <ChevronUp size={28} className="text-blue-600" /> : <ChevronDown size={28} className="text-blue-600" />}
                </div>
                {expandedRecipe === index && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside mb-4">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span>Portion size: {recipe.portionSize}</span>
                        <QuantitySelector
                          value={recipeQuantities[index] || 1}
                          onChange={(newQuantity) => updateRecipeQuantity(index, newQuantity)}
                        />
                      </div>
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => addRecipeToCart(recipe, recipeQuantities[index] || 1)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Groceries</h2>
            {groceryCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleCategory(categoryIndex)}
                >
                  <span className="text-xl">{category.name}</span>
                  {expandedCategory === categoryIndex ? <ChevronUp size={28} className="text-blue-600" /> : <ChevronDown size={28} className="text-blue-600" />}
                </div>
                {expandedCategory === categoryIndex && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <ul className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center justify-between">
                          <span>{item}</span>
                          <div className="flex items-center space-x-4">
                            <QuantitySelector
                              value={groceryQuantities[`${categoryIndex}-${itemIndex}`] || 1}
                              onChange={(newQuantity) => updateGroceryQuantity(categoryIndex, itemIndex, newQuantity)}
                            />
                            <button 
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                              onClick={() => addGroceryItemToCart(item, groceryQuantities[`${categoryIndex}-${itemIndex}`] || 1)}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.name} (x{item.quantity})</span>
                  <button onClick={() => removeFromCart(index)} className="text-red-500">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Confirmation Modal for Recipe */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Recipe Ingredients</h3>
            <p>Select ingredients to add for {confirmationModal.recipe.name} (x{confirmationModal.quantity}):</p>
            <ul className="my-4">
              {confirmationModal.recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input type="checkbox" id={`ingredient-${index}`} defaultChecked />
                  <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setConfirmationModal(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => confirmAddRecipeToCart(
                  confirmationModal.recipe, 
                  confirmationModal.quantity, 
                  confirmationModal.recipe.ingredients.filter((_, index) => document.getElementById(`ingredient-${index}`).checked)
                )}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
