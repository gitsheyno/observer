import { useEffect, useRef, useState } from "react";
type APICALL = {
  id: number;
  sentence: string;
};
import "./App.css";

export default function Mutation() {
  const [data, setData] = useState<APICALL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observeNode = useRef<HTMLDivElement | null>(null);

  const fetchApi = async (currentPage: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api?page=${currentPage}&limit=5`);
      const result = await res.json();
      setData((prev) => [...prev, ...result.data]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApi(1);
  }, []);

  useEffect(() => {
    if (!observeNode.current) return;
    const config = { childList: true, subTree: true };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        console.log(mutation, mutationList);
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
        } else if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(observeNode.current, config);
  }, []);
  return (
    <>
      <div className="container">
        {data.map((item, index) => (
          <p className="list" key={index}>
            {item.sentence} number {item.id}
          </p>
        ))}

        <div ref={observeNode} contentEditable={true}>
          <p>Please Enter</p>
        </div>
        <div className="loader">{isLoading && <p>Loading...</p>}</div>
      </div>
    </>
  );
}
