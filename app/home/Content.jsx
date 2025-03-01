// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import DeleteIcon from "./components/DeleteIcon";
// import EditIcon from "./components/EditIcon";
// import UploadForm from "./components/UploadForm";
// import { createClient } from "../utils/supabase/client";
// import { deleteDocAPI } from "../endpoints/docs";

// const Content = ({ data, user }) => {
//   const [edit, setEdit] = useState(null);
//   const [docs, setDocs] = useState(data || []);

//   const supabase = createClient();

//   useEffect(() => {
//     if (!user) return;

//     const fetchFiles = async () => {
//       if (!user || !user.id) {
//         console.error("User ID is missing.");
//         return;
//       }
    
//       const { data: files, error } = await supabase
//         .from("doc")
//         .select("*")
//         .eq("uid", user.id);
    
//       if (error) {
//         console.error("Error fetching files:", error.message || error);
//       } else {
//         setDocs(files);
//       }
//     };
    

//     fetchFiles();

//     const channel = supabase
//       .channel("docChannel")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "doc" },
//         (payload) => {
//           console.log("Supabase update:", payload);

//           if (payload.eventType === "INSERT" && payload.new.user_id === user.id) {
//             setDocs((prev) => [payload.new, ...prev]); // ✅ Add only if it belongs to the user
//           } else if (payload.eventType === "DELETE") {
//             setDocs((prev) => prev.filter((el) => el.id !== payload.old.id));
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, [user]);

//   // Handle document deletion
//   const handleDelete = async (item) => {
//     const { error } = await supabase.from("doc").delete().eq("id", item.id);

//     if (error) {
//       console.error("Error deleting file:", error);
//     } else {
//       setDocs((prev) => prev.filter((el) => el.id !== item.id));
//     }
//   };

//   return (
//     <section>
//       <div className="max-w-96 mx-auto">
//         <UploadForm edit={edit} user={user} />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-10">
//         {docs.length > 0 ? (
//           docs.map((item) => (
//             <div key={item.id} className="border rounded-md shadow-md p-4">
//               <Link href={`/file/${item.id}`}>
//                 <h4 className="font-bold text-lg">{item.title}</h4>
//               </Link>
//               <div className="flex justify-between">
//                 <small>{item.date}</small>
//                 <div className="flex space-x-4">
//                   <EditIcon onClick={() => setEdit(item)} />
//                   <DeleteIcon onClick={() => handleDelete(item)} />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No files available</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Content;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { File, Trash2, Edit, Share2, Clock, Info, AlertCircle, Loader2, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../utils/supabase/client";
import { deleteDocAPI } from "../endpoints/docs";
import UploadForm from "./components/UploadForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Content = ({ data, user }) => {
  const [edit, setEdit] = useState(null);
  const [docs, setDocs] = useState(data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMoreFiles, setShowMoreFiles] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      if (!user || !user.id) {
        console.error("User ID is missing.");
        return;
      }
      
      setLoading(true);
      const { data: files, error } = await supabase
        .from("doc")
        .select("*")
        .eq("uid", user.id);
      
      setLoading(false);
      
      if (error) {
        setError("Error loading your files. Please refresh the page.");
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
            setDocs((prev) => [payload.new, ...prev]);
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
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }
    
    try {
      const { error } = await supabase.from("doc").delete().eq("id", item.id);

      if (error) {
        throw error;
      } else {
        setDocs((prev) => prev.filter((el) => el.id !== item.id));
        // If editing the file that was just deleted, clear edit state
        if (edit && edit.id === item.id) {
          setEdit(null);
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditClick = (item) => {
    setEdit(item);
    // Smooth scroll to the upload form
    document.getElementById("upload-form-section").scrollIntoView({ behavior: "smooth" });
  };

  // Render file card
  const renderFileCard = (item) => (
    <Card 
      key={item.id} 
      className="overflow-hidden group hover:shadow-md transition-all duration-300 border"
    >
      <div className="absolute h-1 bg-primary w-0 group-hover:w-full transition-all duration-500 top-0 left-0"></div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-3 rounded-md">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Link href={`/file/${item.id}`}>
                <h3 className="font-medium text-lg hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </Link>
              <div className="flex items-center text-muted-foreground text-sm mt-1 space-x-4">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditClick(item)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(item)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <Link href={`/file/${item.id}`}>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Determine which files to display
  const displayedFiles = docs.slice(0, 3);
  const hiddenFiles = docs.slice(3);
  const hasMoreFiles = docs.length > 3;

  return (
    <div className="max-w-full h-screen mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-primary/90 to-purple-600">
      <div className="mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Files
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload, manage and share your files securely from one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1" id="upload-form-section">
          <UploadForm edit={edit} user={user} />
          
          {edit && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setEdit(null)}
                className="w-full max-w-md mx-auto"
              >
                Cancel Editing
              </Button>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Files ({docs.length})</h2>
            
            {hasMoreFiles && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    More Files
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Additional Files</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hiddenFiles.map((file) => (
                    <DropdownMenuItem key={file.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <Link href={`/file/${file.id}`} className="flex-1 hover:text-primary">
                          <span className="truncate">{file.title}</span>
                        </Link>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditClick(file);
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(file);
                            }}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {loading && (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Error Loading Files</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {!loading && !error && docs.length === 0 && (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Files Found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't uploaded any files yet. Use the form to upload your first file.
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {displayedFiles.map(renderFileCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;