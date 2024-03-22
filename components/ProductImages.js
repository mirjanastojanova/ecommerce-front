import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
const MainImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;
const ImageButton = styled.div`
  border-bottom: 1px solid #aaa;
  height: 50px;
  padding: 5px;
  cursor: pointer;
  ${(props) =>
    props.active
      ? `border: #ccc;`
      : `border:transparent; opacity: .7`}
`;

const MainImageWrapper = styled.div`
  text-align: center;
`;

const ProductImages = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  return (
    <>
      <MainImageWrapper>
        <MainImage src={activeImage} />
      </MainImageWrapper>
      <ImageButtons>
        {images.map((i) => (
          <ImageButton
            active={i === activeImage}
            onClick={() => setActiveImage(i)}
            key={i}
          >
            <Image src={i} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
};

export default ProductImages;
