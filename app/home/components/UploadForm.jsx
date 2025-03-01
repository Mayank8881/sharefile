// "use client";
// import { useEffect, useState } from "react";
// import { addDocAPI } from "../../endpoints/docs";

// const UploadForm = ({ edit }) => {
//   const [val, setVal] = useState({ title: "", file: null });

//   useEffect(() => {
//     if (edit) {
//       setVal({ title: edit.title, file: edit.file });
//     }
//   }, [edit]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!val.title || !val.file) {
//       console.error("Title or file missing!");
//       return;
//     }

//     try {
//       await addDocAPI(val);
//       setVal({ title: "", file: null });
//     } catch (error) {
//       console.error("Error uploading document:", error);
//     }
//   };

//   return (
//     <div className="mt-10 border p-5 rounded-md">
//       <h4 className="font-bold text-center">{edit ? "Edit" : "Upload"} File</h4>
//       <input
//         type="text"
//         placeholder="Title"
//         className="p-1 w-full border my-2"
//         value={val.title}
//         onChange={(e) => setVal({ ...val, title: e.target.value })}
//       />
//       <input
//         type="file"
//         className="p-1 w-full border my-2"
//         onChange={(e) => setVal({ ...val, file: e.target.files[0] })}
//       />
//       <div className="text-center">
//         <button
//           className="bg-slate-800 text-white py-1 px-2 rounded-md outline-none mt-2"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadForm;

"use client";
import { useEffect, useState } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDocAPI } from "../../endpoints/docs";

const UploadForm = ({ edit, user }) => {
  const [val, setVal] = useState({ title: "", file: null });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (edit) {
      setVal({ title: edit.title, file: edit.file });
      setFileName(edit.file?.name || "Current file");
    }
  }, [edit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!val.title) {
      setError("Please enter a title for your file");
      return;
    }
    
    if (!val.file && !edit) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      await addDocAPI(val);
      setLoading(false);
      setSuccess(true);
      
      if (!edit) {
        // Only reset form if not editing
        setVal({ title: "", file: null });
        setFileName("");
      }
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setLoading(false);
      setError("Error uploading document. Please try again.");
      console.error("Error uploading document:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setVal({ ...val, file: selectedFile });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {edit ? <File size={18} /> : <UploadCloud size={18} />}
          </div>
          <CardTitle className="text-xl">{edit ? "Edit File" : "Upload File"}</CardTitle>
        </div>
        {!edit && (
          <Badge variant="outline" className="mt-2 self-start">
            Secure File Sharing
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">File Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter file title"
              value={val.title}
              onChange={(e) => setVal({ ...val, title: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {fileName ? fileName : "Click to browse or drag and drop"}
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
              File {edit ? "updated" : "uploaded"} successfully!
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Processing..." : edit ? "Update File" : "Upload File"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;