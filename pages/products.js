import Header from "../components/Header";
import Center from "../components/Center";
import { mongooseConnect } from "../lib/mongoose";
import { Product } from "../models/Product";
import ProductsGrid from "../components/ProductsGrid";
import Title from "../components/Title";


const ProductsPage = ({ products }) => {
  return (
    <>
      <Header />
      <Center>
        <Title>All Products</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
};

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default ProductsPage;
