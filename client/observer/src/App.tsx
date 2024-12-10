import { useState, useEffect, useRef } from "react";
import "./App.css";

type APICALL = {
  id: number;
  sentence: string;
};

function App() {
  const [data, setData] = useState<APICALL[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchApi = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api?page=${currentPage}&limit=5`);
      const result = await res.json();
      setData((prev) => [...prev, ...result.data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApi(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          console.log("clicked");
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.2 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading]);

  return (
    <>
      <div className="container">
        {data.map((item, index) => (
          <p className="list" key={index}>
            {item.sentence} number {item.id}
          </p>
        ))}
        <div ref={loaderRef} className="loader">
          {isLoading && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
}

export default App;
