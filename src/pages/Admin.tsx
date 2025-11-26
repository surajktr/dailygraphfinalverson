import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, LogOut, Loader2 } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";

type ContentType = "editorial" | "current_affairs" | "vocab";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editorialFile, setEditorialFile] = useState<File | null>(null);
  const [currentAffairsFile, setCurrentAffairsFile] = useState<File | null>(null);
  const [vocabFile, setVocabFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<ContentType | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: ContentType) => {
    const selectedFile = e.target.files?.[0];
    const expectedType = type === "editorial" ? "text/html" : "application/json";
    
    if (selectedFile && selectedFile.type === expectedType) {
      if (type === "editorial") setEditorialFile(selectedFile);
      else if (type === "current_affairs") setCurrentAffairsFile(selectedFile);
      else if (type === "vocab") setVocabFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: `Please select a ${type === "editorial" ? "HTML" : "JSON"} file`,
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (type: ContentType) => {
    const file = type === "editorial" ? editorialFile : 
                 type === "current_affairs" ? currentAffairsFile : vocabFile;
    
    if (!file) {
      toast({
        title: "No file selected",
        description: `Please select a ${type === "editorial" ? "HTML" : "JSON"} file to upload`,
        variant: "destructive",
      });
      return;
    }

    setUploading(type);

    try {
      const content = await file.text();
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      if (type === "editorial") {
        // Editorial upload to daily_graphs
        const { data: existing } = await supabase
          .from("daily_graphs")
          .select("id")
          .eq("upload_date", formattedDate)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("daily_graphs")
            .update({
              html_content: content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("daily_graphs")
            .insert({
              html_content: content,
              upload_date: formattedDate,
              user_id: session.session.user.id,
            });
          if (error) throw error;
        }
      } else if (type === "current_affairs") {
        // Current Affairs upload
        const jsonData = JSON.parse(content);
        const { data: existing } = await supabase
          .from("current_affairs")
          .select("id")
          .eq("upload_date", formattedDate)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("current_affairs")
            .update({
              questions: jsonData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("current_affairs")
            .insert({
              questions: jsonData,
              upload_date: formattedDate,
              user_id: session.session.user.id,
            });
          if (error) throw error;
        }
      } else if (type === "vocab") {
        // Vocab upload
        const jsonData = JSON.parse(content);
        const { data: existing } = await supabase
          .from("vocab_questions")
          .select("id")
          .eq("upload_date", formattedDate)
          .maybeSingle();

        const vocabData = {
          syno_questions: jsonData.syno || null,
          idioms_questions: jsonData.idioms_questions || null,
          ows_questions: jsonData.ows_questions || null,
          news_vocabulary_questions: jsonData.news_vocabulary_questions || null,
          updated_at: new Date().toISOString(),
        };

        if (existing) {
          const { error } = await supabase
            .from("vocab_questions")
            .update(vocabData)
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("vocab_questions")
            .insert({
              ...vocabData,
              upload_date: formattedDate,
              user_id: session.session.user.id,
            });
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: `${type === "editorial" ? "Editorial" : type === "current_affairs" ? "Current Affairs" : "Vocab"} uploaded for ${format(selectedDate, "MMMM do, yyyy")}`,
      });

      // Reset file
      if (type === "editorial") setEditorialFile(null);
      else if (type === "current_affairs") setCurrentAffairsFile(null);
      else if (type === "vocab") setVocabFile(null);
      
      // Reset file input
      const fileInput = document.getElementById(`${type}-upload`) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload content",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
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

        {/* Content Upload Tabs */}
        <Tabs defaultValue="editorial" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editorial">Editorial</TabsTrigger>
            <TabsTrigger value="current_affairs">Current Affairs</TabsTrigger>
            <TabsTrigger value="vocab">Vocab</TabsTrigger>
          </TabsList>

          {/* Editorial Tab */}
          <TabsContent value="editorial">
            <Card>
              <CardHeader>
                <CardTitle>Upload Editorial</CardTitle>
                <CardDescription>
                  Upload HTML file for {format(selectedDate, "MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editorial-upload">HTML File</Label>
                  <Input
                    id="editorial-upload"
                    type="file"
                    accept=".html"
                    onChange={(e) => handleFileChange(e, "editorial")}
                  />
                </div>

                {editorialFile && (
                  <div className="p-3 bg-secondary rounded-md">
                    <p className="text-sm font-medium">{editorialFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(editorialFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleUpload("editorial")}
                  disabled={!editorialFile || uploading === "editorial"}
                  className="w-full"
                >
                  {uploading === "editorial" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Editorial
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Affairs Tab */}
          <TabsContent value="current_affairs">
            <Card>
              <CardHeader>
                <CardTitle>Upload Current Affairs</CardTitle>
                <CardDescription>
                  Upload JSON file with questions for {format(selectedDate, "MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_affairs-upload">JSON File</Label>
                  <Input
                    id="current_affairs-upload"
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, "current_affairs")}
                  />
                </div>

                {currentAffairsFile && (
                  <div className="p-3 bg-secondary rounded-md">
                    <p className="text-sm font-medium">{currentAffairsFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(currentAffairsFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleUpload("current_affairs")}
                  disabled={!currentAffairsFile || uploading === "current_affairs"}
                  className="w-full"
                >
                  {uploading === "current_affairs" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Current Affairs
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Expected JSON format:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`[{
  "question_en": "...",
  "question_hi": "...",
  "answer": "...",
  "options": ["..."],
  "extra_details": "..."
}]`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vocab Tab */}
          <TabsContent value="vocab">
            <Card>
              <CardHeader>
                <CardTitle>Upload Vocab Questions</CardTitle>
                <CardDescription>
                  Upload JSON file with vocab questions for {format(selectedDate, "MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vocab-upload">JSON File</Label>
                  <Input
                    id="vocab-upload"
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, "vocab")}
                  />
                </div>

                {vocabFile && (
                  <div className="p-3 bg-secondary rounded-md">
                    <p className="text-sm font-medium">{vocabFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(vocabFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleUpload("vocab")}
                  disabled={!vocabFile || uploading === "vocab"}
                  className="w-full"
                >
                  {uploading === "vocab" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Vocab
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Expected JSON format:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`{
  "syno": [{...}],
  "idioms_questions": [{...}],
  "ows_questions": [{...}],
  "news_vocabulary_questions": [{...}]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default Admin;
