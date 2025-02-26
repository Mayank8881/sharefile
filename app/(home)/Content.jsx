"use client";
import { useState } from "react";
import Link from "next/link";
import DeleteIcon from "./components/DeleteIcon";
import EditIcon from "./components/EditIcon";
import UploadForm from "./components/UploadForm";

const Content = ({ data }) => {
  const [edit, setEdit] = useState(null);
  return (
    <section>
      <div className="max-w-96 mx-auto">
        <UploadForm edit={edit} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-10">
        {data.map((item) => (
          <div key={item.id} className="border rounded-md shadow-md p-4">
            <Link href={`/file/${item.id}`}>
              <h4 className="font-bold text-lg">{item.title}</h4>
            </Link>
            <div className="flex justify-between">
              <small>{item.date}</small>
              <div className="flex space-x-4">
                <EditIcon onClick={() => setEdit(item)} />
                <DeleteIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Content;