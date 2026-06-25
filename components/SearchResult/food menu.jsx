import styled from "styled-components";
import { BASE_URL } from "../../App";

/* eslint-disable react/prop-types */

const normalizeImagePath = (imagePath) => {
  if (!imagePath) return "";
  if (typeof imagePath !== "string") return "";

  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
};

const toImageUrl = (imagePath) => {
  const normalized = normalizeImagePath(imagePath);
  if (!normalized) return "";

  try {
    return new URL(normalized, BASE_URL).toString();
  } catch {
    // If backend returns something weird, don't crash rendering.
    return "";
  }
};

const SearchResult = ({ data, searchQuery }) => {

  // Helps identify backend response shape mismatches quickly.
  // Safe because it only logs when `data` changes.
  console.log("SearchResult data:", data);

  const list = Array.isArray(data) ? data : data?.items;

  const normalizedQuery = (searchQuery ?? "").trim().toLowerCase();
  const filteredList =
    Array.isArray(list) && normalizedQuery
      ? list.filter((item) => {
          const name = item?.name ?? item?.title ?? "";
          const type = item?.type ?? "";
          const text = item?.text ?? item?.description ?? "";
          return (
            String(name).toLowerCase().includes(normalizedQuery) ||
            String(type).toLowerCase().includes(normalizedQuery) ||
            String(text).toLowerCase().includes(normalizedQuery)
          );
        })
      : list;

  if (!Array.isArray(filteredList) || filteredList.length === 0) {

    return (

      <FoodCardContainer>
        <FoodCards>
          <div style={{ color: "white", opacity: 0.9 }}>No food found</div>
        </FoodCards>
      </FoodCardContainer>
    );
  }

  return (
    <FoodCardContainer>
      <FoodCards>
        {filteredList.map((item, idx) => {

          const name = item?.name ?? item?.title ?? item?.food?.name ?? `Food ${idx + 1}`;
          const food = item?.food ?? item;
          // Backend returns { name, price, text, image, type }
          // so the description should come from `text`.
          const description =
            item?.text ??
            food?.text ??
            food?.description ??
            food?.type ??
            item?.description ??
            item?.type ??
            "";

          const image = item?.image ?? food?.image ?? "";
          const price = item?.price ?? food?.price;

          return (
            <FoodCard key={name + idx}>
              <div className="food_image">
                <img src={toImageUrl(image)} alt={food?.name || name || "food"} />
              </div>
              <div className="food_info">
                <div className="info">
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <button>{Number(price ?? 0).toFixed(2)}</button>
              </div>
            </FoodCard>
          );
        })}
      </FoodCards>
    </FoodCardContainer>
  );
};

export default SearchResult
const FoodCardContainer = styled.section`
  height: calc(100vh - 210px);
  background-image: url("/bg.png");
  background-size: cover;
  background-position: center;
`;

const FoodCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 32px;
  column-gap: 25px;
  justify-content: center;
  align-items: center;
  padding-top: 80px;
`;

const FoodCard = styled.div`
  width: 260px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  padding: 12px;
  background: rgba(50, 51, 67, 0.35);

  .food_info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }

  h3 {
    margin-top: 8px;
    font-size: 16px;
    font-weight: 500;
    text-align: right;
  }

  p {
    margin-top: 4px;
    font-size: 12px;
    text-align: right;
  }

  button {
    margin-top: 10px;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    background: #ff4343;
    color: white;
    cursor: pointer;
  }
`;







