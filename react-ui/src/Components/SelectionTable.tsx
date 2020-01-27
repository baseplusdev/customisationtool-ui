import React, { useContext } from 'react';
import styled from 'styled-components';
import ICategorisedIngredient from '../Interfaces/CategorisedIngredient';
import StyledHeading from './Shared/Heading';
import StyledCategory from './Category';
import { CustomiseContext } from '../CustomiseContext';
import StyledIngredient from './Ingredient';
import IWordpressProduct, { ISelectableProduct } from '../Interfaces/WordpressProduct';

export interface SelectionTableProps {
  categorisedIngredients: ICategorisedIngredient[]
}

const SelectionTable: React.SFC<SelectionTableProps> = ({categorisedIngredients}) => {

  const { updateCategorisedIngredients, totalIngredientsSelected, updateTotalIngredientsSelected } = useContext(CustomiseContext);

  const onCategorySelect = (categoryId: number) => {
    updateCategorisedIngredients(
      categorisedIngredients.map(category => {
        category.selected = false;
        if(category.id === categoryId)
          category.selected = true;  
        return category;
      })
    )
  }

  const onIngredientSelect = (ingredientId: number) => {
    updateCategorisedIngredients(
      categorisedIngredients.map(category => {
        category.ingredients.map(ingredient => {
          if(ingredient.id === ingredientId)
            ingredient.selected = !ingredient.selected;
        })
        return category;  
      })
    )

    const allIngredients = categorisedIngredients.flatMap(categories => categories.ingredients);
    const selectedIngredients = getUniqueIngredients(allIngredients.filter(ingredients => ingredients.selected));
    updateTotalIngredientsSelected(selectedIngredients.length);
  }

  const getUniqueIngredients = (ingredients: ISelectableProduct[]) => {
    return ingredients.filter((value, index, arr) => arr.findIndex(item => (item.id === value.id)) === index)
  }

  const getSelectedCategoryIngredients = () => {
    return categorisedIngredients.filter(category => category.selected)[0].ingredients;
  }

  return (
    <SelectionWrapper>
      <Categories>
        <StyledHeading>Categories</StyledHeading>
        <CategoriesWrapper>
          {categorisedIngredients.map(category => <StyledCategory selected={category.selected} selectCategory={() => onCategorySelect(category.id)} key={category.id}>{category.category}</StyledCategory>)}
        </CategoriesWrapper>
      </Categories>
      <Ingredients>
        <StyledHeading>Ingredients</StyledHeading>
      </Ingredients>
      <IngredientsWrapper>
      {totalIngredientsSelected >= 2 ? "Please select only two products" : ""}
      {
        categorisedIngredients.some(category => category.selected) &&
          getSelectedCategoryIngredients().map(ingredient => <StyledIngredient key={ingredient.id} ingredient={ingredient} selectIngredient={() => onIngredientSelect(ingredient.id)}></StyledIngredient>)
      }
      </IngredientsWrapper>
      <Summary>
        <StyledHeading>Summary</StyledHeading>
      </Summary>
    </SelectionWrapper>
  )
}
 
export default SelectionTable;


const SelectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  ${props => props.theme.mediaQueries.tablet} {
    grid-template-rows: auto 1fr;
    grid-template-columns: 200px 1fr 250px;
  }
`;

const CategoriesWrapper = styled.div`
  width:100%;
  display: flex;
  ${props => props.theme.mediaQueries.tablet} {
    display: block;
  }
`;

const Categories = styled.div`
  border-top: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  grid-row: 2;
  grid-column: 1/ span 2;
  width: 100%;
  overflow-x: scroll;
  h2{
    display: none;
  }
  ${props => props.theme.mediaQueries.tablet} {
    h2{
      display: block;
      text-align:left;
      padding: 20px;
    }
    border: none;
    border-right: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
    grid-column: 1;
  }
`;
  
  
const Summary = styled.div`
  border-left: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
  grid-row: 1;
  grid-column: 2;
  ${props => props.theme.mediaQueries.tablet} {
    grid-column: 3;
    grid-row: 1 / span 2;
    h2{
      border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
    }
  }
`;

const IngredientsWrapper = styled.div`
  width:100%;
  display: grid;
  ${props => props.theme.mediaQueries.tablet} {
    display: block;
  }
  .selected {
    opacity: 1;
  }
`;
  
const Ingredients = styled.div`
  grid-row: 1
  grid-column: 1;
  ${props => props.theme.mediaQueries.tablet} {
    border-bottom: solid 1px ${props => props.theme.brandColours.baseDarkGreen};
    grid-column: 1 /span 2;
  }
`;