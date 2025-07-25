"use client";
import { useEffect, useState } from "react";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDocAPI } from "../../endpoints/docs";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const UploadForm = ({ edit, user, mutationKey }) => {
  const [val, setVal] = useState({ title: "", file: null });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (edit) {
      setVal({ title: edit.title, file: edit.file });
      setFileName(edit.file?.name || "Current file");
    }
  }, [edit]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (payload) => {
      setLoading(true);
      setError('');
      await addDocAPI(payload);
      setLoading(false);
    },
    onSuccess: () => {
      toast.success('File uploaded successfully!');
      queryClient.invalidateQueries(mutationKey);
      setVal({ title: '', file: null });
      setFileName('');
    },
    onError: () => {
      setLoading(false);
      toast.error('Error uploading document. Please try again.');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!val.title) {
      setError('Please enter a title for your file');
      return;
    }
    if (!val.file && !edit) {
      setError('Please select a file to upload');
      return;
    }
    uploadMutation.mutate(val);
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || uploadMutation.isLoading}
          >
            {loading || uploadMutation.isLoading ? 'Processing...' : edit ? 'Update File' : 'Upload File'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;