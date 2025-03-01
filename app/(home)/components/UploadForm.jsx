"use client";
import { useEffect, useState } from "react";
import { addDocAPI } from "../../endpoints/docs";

const UploadForm = ({ edit }) => {
  const [val, setVal] = useState({ title: "", file: null });

  useEffect(() => {
    if (edit) {
      setVal({ title: edit.title, file: edit.file });
    }
  }, [edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!val.title || !val.file) {
      console.error("Title or file missing!");
      return;
    }

    try {
      await addDocAPI(val);
      setVal({ title: "", file: null });
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

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
        <button
          className="bg-slate-800 text-white py-1 px-2 rounded-md outline-none mt-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
