"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteIcon from "./components/DeleteIcon";
import EditIcon from "./components/EditIcon";
import UploadForm from "./components/UploadForm";
import { createClient } from "../utils/supabase/client";
import { deleteDocAPI } from "../endpoints/docs";

const Content = ({ data, user }) => {
  const [edit, setEdit] = useState(null);
  const [docs, setDocs] = useState(data || []);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      if (!user || !user.id) {
        console.error("User ID is missing.");
        return;
      }
    
      const { data: files, error } = await supabase
        .from("doc")
        .select("*")
        .eq("uid", user.id);
    
      if (error) {
        console.error("Error fetching files:", error.message || error);
      } else {
        setDocs(files);
      }
    };
    

    fetchFiles();

    const channel = supabase
      .channel("docChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "doc" },
        (payload) => {
          console.log("Supabase update:", payload);

          if (payload.eventType === "INSERT" && payload.new.user_id === user.id) {
            setDocs((prev) => [payload.new, ...prev]); // ✅ Add only if it belongs to the user
          } else if (payload.eventType === "DELETE") {
            setDocs((prev) => prev.filter((el) => el.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  // Handle document deletion
  const handleDelete = async (item) => {
    const { error } = await supabase.from("doc").delete().eq("id", item.id);

    if (error) {
      console.error("Error deleting file:", error);
    } else {
      setDocs((prev) => prev.filter((el) => el.id !== item.id));
    }
  };

  return (
    <section>
      <div className="max-w-96 mx-auto">
        <UploadForm edit={edit} user={user} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-10">
        {docs.length > 0 ? (
          docs.map((item) => (
            <div key={item.id} className="border rounded-md shadow-md p-4">
              <Link href={`/file/${item.id}`}>
                <h4 className="font-bold text-lg">{item.title}</h4>
              </Link>
              <div className="flex justify-between">
                <small>{item.date}</small>
                <div className="flex space-x-4">
                  <EditIcon onClick={() => setEdit(item)} />
                  <DeleteIcon onClick={() => handleDelete(item)} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No files available</p>
        )}
      </div>
    </section>
  );
};

export default Content;
