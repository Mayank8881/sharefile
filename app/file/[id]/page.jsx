"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocAPI } from "@/app/endpoints/docs";

const FilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const doc = await getDocAPI(id);
      setData(doc);
    };

    if (id) fetchData();
  }, [id]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-screen-sm mx-auto mt-20 border p-4 flex flex-col items-center gap-4">
      <h4 className="font-bold text-lg">{data.title}</h4>
      
      <a href={data.file_url} className="bg-slate-800 text-white rounded-md py-2 px-4 w-full text-center">
        Download File
      </a>

      <button 
        onClick={() => navigator.clipboard.writeText(data.file_url)}
        className="bg-gray-500 text-white rounded-md py-2 px-4 w-full text-center"
      >
        Copy Path
      </button>
    </div>
  );
};

export default FilePage;
