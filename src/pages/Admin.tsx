import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, LogOut, Loader2 } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/html") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an HTML file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an HTML file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const htmlContent = await file.text();
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      // Check if content already exists for this date
      const { data: existing } = await supabase
        .from("daily_graphs")
        .select("id")
        .eq("upload_date", formattedDate)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("daily_graphs")
          .update({
            html_content: htmlContent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("daily_graphs")
          .insert({
            html_content: htmlContent,
            upload_date: formattedDate,
            user_id: session.session.user.id,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Content uploaded for ${format(selectedDate, "MMMM do, yyyy")}`,
      });

      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload content",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <>
      <SEO 
        title="Admin Panel | Dailygraph"
        description="Dailygraph admin panel for content management."
        noIndex={true}
      />
      <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose the date for which you want to upload content
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
              <CardDescription>
                Upload HTML file for {format(selectedDate, "MMMM do, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">HTML File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".html"
                  onChange={handleFileChange}
                />
              </div>

              {file && (
                <div className="p-3 bg-secondary rounded-md">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Select a date from the calendar</p>
            <p>• Choose an HTML file containing your content</p>
            <p>• The file can include HTML, CSS, and JavaScript</p>
            <p>• All interactive features will be preserved</p>
            <p>• If content already exists for the selected date, it will be updated</p>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Admin;
