"use client";
import { useEffect, useState } from "react";
import { UploadCloud, File, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDocAPI, updateDocAPI } from "../../endpoints/docs";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const UploadForm = ({ edit, user, mutationKey, onUpdateSuccess }) => {
  const [val, setVal] = useState({ title: "", file: null });
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (edit) {
      setVal({ title: edit.title, file: null });
      // Extract original file name from file_path
      if (edit.file_path) {
        const fileName = edit.file_path.split('-').slice(1).join('-'); // Remove timestamp prefix
        setFileName(fileName || "Current file (unchanged)");
      } else {
        setFileName("No file");
      }
    } else {
      setVal({ title: "", file: null });
      setFileName("");
    }
  }, [edit]);

  // Upload mutation for new files
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

  // Update mutation for existing files
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      setLoading(true);
      setError('');
      await updateDocAPI(payload, edit.id);
      setLoading(false);
    },
    onSuccess: () => {
      toast.success('File updated successfully!');
      queryClient.invalidateQueries(mutationKey);
      setVal({ title: '', file: null });
      setFileName('');
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    },
    onError: () => {
      setLoading(false);
      toast.error('Error updating document. Please try again.');
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
    
    if (edit) {
      updateMutation.mutate(val);
    } else {
      uploadMutation.mutate(val);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setVal({ ...val, file: selectedFile });
    }
  };

  const handleCancelEdit = () => {
    if (onUpdateSuccess) {
      onUpdateSuccess();
    }
  };

  const isLoading = loading || uploadMutation.isLoading || updateMutation.isLoading;

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {edit ? <File size={18} /> : <UploadCloud size={18} />}
            </div>
            <CardTitle className="text-xl">{edit ? "Edit File" : "Upload File"}</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {edit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Cancel editing"
              >
                <X size={14} />
              </Button>
            )}
            
            {!edit && (
              <Badge variant="outline" className="text-xs">
                Secure File Sharing
              </Badge>
            )}
          </div>
        </div>
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
            <Label htmlFor="file">{edit ? "Replace File (Optional)" : "Upload File"}</Label>
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
                  {fileName ? fileName : edit ? "Click to replace file or leave unchanged" : "Click to browse or drag and drop"}
                </span>
              </label>
            </div>
            {edit && (
              <p className="text-xs text-muted-foreground">
                Leave file unchanged to only update the title
              </p>
            )}
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
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : edit ? 'UPDATE' : 'UPLOAD'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;