import styled from "styled-components";
import ProductBox from "./ProductBox";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding-top: 30px;
  @media screen and (min-width: 768px){
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ProductsGrid = ({ products }) => {
  return (
    <Grid>
      {products?.length > 0 &&
        products.map((product) => <ProductBox {...product} key={product.id} />)}
    </Grid>
  );
};

export default ProductsGrid;
