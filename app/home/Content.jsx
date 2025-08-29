"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { File, Trash2, Edit, Share2, Clock, Info, AlertCircle, Loader2, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { getDocsAPI, deleteDocAPI } from '../endpoints/docs';
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
  const queryClient = useQueryClient();

  // Fetch files with react-query
  const {
    data: docs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['docs', user?.id],
    queryFn: () => getDocsAPI(user.id),
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDocAPI,
    onSuccess: (_, item) => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries(['docs', user.id]);
      if (edit && edit.id === item.id) setEdit(null);
    },
    onError: () => toast.error('Error deleting file'),
  });

  // Real-time updates (Supabase subscription)
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const channel = supabase
      .channel('docChannel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'doc' }, (payload) => {
        queryClient.invalidateQueries(['docs', user.id]);
      })
      .subscribe();
    return () => channel.unsubscribe();
  }, [user, queryClient]);

  // Handle delete
  const handleDelete = (item) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteMutation.mutate(item);
    }
  };

  // Handle edit
  const handleEditClick = (item) => {
    setEdit(item);
    document.getElementById('upload-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Reset edit state after successful update
  const handleUpdateSuccess = () => {
    setEdit(null);
  };

  const formatDate = (item) => {
    const dateString = item.date || item.created_at;
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                  <span>{formatDate(item)}</span>
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

  return (
    <div className="max-w-full lg:h-screen mx-auto px-4 text-white sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-primary/90 to-blue-800">
      <Toaster />
      <div className="mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-background">
            Files
          </h1>
          <p className="mt-3 text-lg text-background max-w-2xl mx-auto">
            Upload, manage and share your files securely from one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1" id="upload-form-section">
          <UploadForm edit={edit} user={user} mutationKey={['docs', user?.id]} onUpdateSuccess={handleUpdateSuccess} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Files ({docs.length})</h2>
            
            {docs.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white text-black hover:bg-slate-200" size="sm">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    More Files
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Additional Files</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {docs.slice(3).map((file) => (
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
          
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {isError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">Error Loading Files</p>
                <p className="text-sm">{error?.message || 'Unknown error'}</p>
              </div>
            </div>
          )}
          
          {!isLoading && !isError && docs.length === 0 && (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="py-12 text-center">
                <Info className="h-12 w-12 text-muted-background mx-auto mb-4" />
                <h3 className="text-lg text-background font-medium mb-2">No Files Found</h3>
                <p className="text-muted-background mb-6">
                  You haven't uploaded any files yet. Use the form to upload your first file.
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {docs.slice(0, 3).map(renderFileCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;