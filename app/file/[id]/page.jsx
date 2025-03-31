"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDocAPI } from "@/app/endpoints/docs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Copy, 
  Mail, 
  File, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  Link as LinkIcon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

const FilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const doc = await getDocAPI(id);
        setData(doc);
        setError("");
      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Failed to load the file. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.file_url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  const sendEmail = async () => {
    if (!recipientEmail) {
      setError("Please enter a recipient email address.");
      setSuccessMessage("");
      return;
    }

    setSendingEmail(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail, fileUrl: data.file_url }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Email sent successfully!");
        setRecipientEmail("");
      } else {
        setError(result.error || "Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Something went wrong while sending the email.");
    } finally {
      setSendingEmail(false);
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

  return (
    <>
    <Navigation/>
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-primary/90 to-blue-600 text-primary-foreground relative">
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground">
            File Details
          </h1>
          <p className="mt-3 text-lg  max-w-2xl mx-auto text-primary-foreground">
            View, download, or share your file securely.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error && !data ? (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>File Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="bg-primary/10 p-6 rounded-full">
                      <File className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">{data.title}</h3>
                    {data.date && (
                      <div className="text-sm text-muted-foreground">
                        Uploaded on {formatDate(data.date)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Download & Share</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Download Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Download File</h3>
                  <a 
                    href={data.file_url} 
                    className="w-full"
                  >
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>

                {/* Copy Link Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Copy Link</h3>
                  <Button 
                    onClick={handleCopy} 
                    variant={copySuccess ? "outline" : "default"}
                    className="w-full flex items-center gap-2"
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4" />
                        Copy File Link
                      </>
                    )}
                  </Button>
                </div>

                {/* Email Section */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Share via Email</h3>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter recipient email address"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                    <Button 
                      onClick={sendEmail} 
                      disabled={sendingEmail}
                      className="w-full flex items-center gap-2"
                    >
                      {sendingEmail ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          Send
                        </>
                      )}
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {successMessage && (
                      <Alert variant="default" className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-700">Success</AlertTitle>
                        <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
    <Footer/>
    </>
  );

};

export default FilePage;