"use client";
import { useEffect, useState } from "react";

const UploadForm = ({ edit }) => {
  const [val, setVal] = useState({ title: "", file: "" });

  useEffect(() => {
    if (edit) {
      setVal({ title: edit.title, file: edit.file });
    }
  }, [edit]);
  return (
    <div className="mt-10 border p-5 rounded-md">
      <h4 className="font-bold text-center">{edit ? "Edit" : "Upload"} File</h4>
      <input
        type="text"
        placeholder="Title"
        className="p-1 w-full border my-2"
        value={val.title}
        onChange={(e) => setVal({ ...val, title: e.target.value })}
      />
      <input
        type="file"
        className="p-1 w-full border my-2"
        onChange={(e) => setVal({ ...val, file: e.target.files[0] })}
      />
      <div className="text-center">
        <button className="bg-slate-800 text-white py-1 px-2 rounded-md outline-none mt-2">
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadForm;