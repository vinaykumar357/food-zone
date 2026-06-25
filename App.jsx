import { useEffect, useState } from "react";
import styled from "styled-components";
import SearchResult from "./components/SearchResult/SearchResult";

export const BASE_URL = "http://localhost:9000";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Topcontainer = styled.section`
  min-height: 140px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  align-items: center;

  .search {
    input {
      background-color: transparent;
      border: 1px solid red;
      color: white;
      border-radius: 5px;
      height: 40px;
      font-size: 16px;
      padding: 0 10px;
      outline: none;
    }
  }
`;

const FilterContainer = styled.section`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 0 16px 16px;
  cursor: pointer;
`;

 export const Button = styled.button`
  display: flex;
  align-items: center;

  background: ${(p) => (p.$active ? "#ff1f1f" : "#ff4343")};
  border-radius: 5px;
  padding: 6px 12px;
  border: none;
  color: white;
  cursor: pointer;
  gap: 12px;

  transition: transform 120ms ease, background 120ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const filters = ["all", "breakfast", "lunch", "dinner"];
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(BASE_URL, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`);
        }
        const json = await response.json();
        // Some backends respond with { items: [...] } instead of a raw array.
        setData(Array.isArray(json) ? json : json?.items ?? []);

      } catch (e) {
        const msg = e?.name === "AbortError" ? "request timed out" : e?.message;
        setError(msg ? `unable to fetch data: ${msg}` : "unable to fetch data");
      } finally {
        setLoading(false);
      }

    };

    fetchFoodData();
  }, []);

  if (error) return <div style={{ color: "white" }}>{error}</div>;
  if (loading) return <div style={{ color: "white" }}>loading</div>;

  return (
    <>
      <Container>
        <Topcontainer>
          <div className="logo">
            <img src="/Foody Zone.svg" alt="logo" />
          </div>

          <div className="search">
            <input
              placeholder="search food"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        </Topcontainer>
      </Container>

      <FilterContainer>
        {filters.map((f) => (
          <Button
            key={f}
            type="button"
            $active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </Button>
        ))}
      </FilterContainer>

      <SearchResult
        data={
          activeFilter === "all"
            ? data
            : data.filter((item) => item.type === activeFilter)
        }
        searchQuery={searchQuery}
      />

    </>
  );
};

export default App;

