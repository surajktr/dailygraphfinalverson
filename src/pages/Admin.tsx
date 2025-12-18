import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, LogOut, Loader2, Copy, Check, Key } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";

type ContentType = "editorial" | "current_affairs" | "topicwise";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editorialFile, setEditorialFile] = useState<File | null>(null);
  const [currentAffairsFile, setCurrentAffairsFile] = useState<File | null>(null);
  const [topicwiseFile, setTopicwiseFile] = useState<File | null>(null);
  const [currentAffairsJson, setCurrentAffairsJson] = useState<string>("");
  const [topicwiseJson, setTopicwiseJson] = useState<string>("");
  const [uploading, setUploading] = useState<ContentType | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const API_KEY = "dg_api_k3y_2024_s3cur3_upl04d_x7m9p2q";
  const API_URL = "https://cdwikwwpakmlauiddasz.supabase.co/functions/v1/content-upload-api";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: ContentType) => {
    const selectedFile = e.target.files?.[0];
    const expectedType = type === "editorial" ? "text/html" : "application/json";
    
    if (selectedFile && selectedFile.type === expectedType) {
      if (type === "editorial") setEditorialFile(selectedFile);
      else if (type === "current_affairs") setCurrentAffairsFile(selectedFile);
      else if (type === "topicwise") setTopicwiseFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: `Please select a ${type === "editorial" ? "HTML" : "JSON"} file`,
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (type: ContentType, useJsonInput: boolean = false) => {
    const file = type === "editorial" ? editorialFile : 
                 type === "current_affairs" ? currentAffairsFile : topicwiseFile;
    const jsonInput = type === "current_affairs" ? currentAffairsJson : topicwiseJson;
    
    if (!useJsonInput && !file) {
      toast({
        title: "No file selected",
        description: `Please select a ${type === "editorial" ? "HTML" : "JSON"} file to upload`,
        variant: "destructive",
      });
      return;
    }

    if (useJsonInput && !jsonInput.trim()) {
      toast({
        title: "No JSON provided",
        description: "Please paste JSON content to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(type);

    try {
      const content = useJsonInput ? jsonInput : await file!.text();
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
        // Current Affairs upload - table needs to be created via migration
        const jsonData = JSON.parse(content);
        const { data: existing } = await (supabase as any)
          .from("current_affairs")
          .select("id")
          .eq("upload_date", formattedDate)
          .maybeSingle();

        if (existing) {
          const { error } = await (supabase as any)
            .from("current_affairs")
            .update({
              questions: jsonData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await (supabase as any)
            .from("current_affairs")
            .insert({
              questions: jsonData,
              upload_date: formattedDate,
              user_id: session.session.user.id,
            });
          if (error) throw error;
        }
      } else if (type === "topicwise") {
        // Topicwise upload - same format as current affairs
        const jsonData = JSON.parse(content);
        const { data: existing } = await (supabase as any)
          .from("topicwise")
          .select("id")
          .eq("upload_date", formattedDate)
          .maybeSingle();

        if (existing) {
          const { error } = await (supabase as any)
            .from("topicwise")
            .update({
              questions: jsonData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await (supabase as any)
            .from("topicwise")
            .insert({
              questions: jsonData,
              upload_date: formattedDate,
              user_id: session.session.user.id,
            });
          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: `${type === "editorial" ? "Editorial" : type === "current_affairs" ? "Current Affairs" : "Topicwise"} uploaded for ${format(selectedDate, "MMMM do, yyyy")}`,
      });

      // Reset file and json input
      if (type === "editorial") setEditorialFile(null);
      else if (type === "current_affairs") {
        setCurrentAffairsFile(null);
        setCurrentAffairsJson("");
      } else if (type === "topicwise") {
        setTopicwiseFile(null);
        setTopicwiseJson("");
      }
      
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
            <TabsTrigger value="topicwise">Topicwise</TabsTrigger>
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
                  Upload JSON file or paste JSON for {format(selectedDate, "MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Option */}
                <div className="space-y-2">
                  <Label htmlFor="current_affairs-upload">Option 1: Upload JSON File</Label>
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
                  onClick={() => handleUpload("current_affairs", false)}
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
                      Upload from File
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Paste JSON Option */}
                <div className="space-y-2">
                  <Label htmlFor="current_affairs-json">Option 2: Paste JSON Code</Label>
                  <Textarea
                    id="current_affairs-json"
                    placeholder="Paste your JSON here..."
                    value={currentAffairsJson}
                    onChange={(e) => setCurrentAffairsJson(e.target.value)}
                    className="min-h-[200px] font-mono text-xs"
                  />
                </div>

                <Button
                  onClick={() => handleUpload("current_affairs", true)}
                  disabled={!currentAffairsJson.trim() || uploading === "current_affairs"}
                  className="w-full"
                  variant="secondary"
                >
                  {uploading === "current_affairs" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from Pasted JSON
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Expected JSON format:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`{
  "title": "Quiz Title",
  "description": "Description",
  "questions": [{
    "id": 1,
    "question_en": "...",
    "question_hi": "...",
    "options": [
      {"label": "A", "text_en": "...", "text_hi": "..."}
    ],
    "answer": "A",
    "explanation_en": "...",
    "explanation_hi": "..."
  }]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Topicwise Tab */}
          <TabsContent value="topicwise">
            <Card>
              <CardHeader>
                <CardTitle>Upload Topicwise Questions</CardTitle>
                <CardDescription>
                  Upload JSON file or paste JSON for {format(selectedDate, "MMMM do, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Option */}
                <div className="space-y-2">
                  <Label htmlFor="topicwise-upload">Option 1: Upload JSON File</Label>
                  <Input
                    id="topicwise-upload"
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, "topicwise")}
                  />
                </div>

                {topicwiseFile && (
                  <div className="p-3 bg-secondary rounded-md">
                    <p className="text-sm font-medium">{topicwiseFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(topicwiseFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleUpload("topicwise", false)}
                  disabled={!topicwiseFile || uploading === "topicwise"}
                  className="w-full"
                >
                  {uploading === "topicwise" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from File
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Paste JSON Option */}
                <div className="space-y-2">
                  <Label htmlFor="topicwise-json">Option 2: Paste JSON Code</Label>
                  <Textarea
                    id="topicwise-json"
                    placeholder="Paste your JSON here..."
                    value={topicwiseJson}
                    onChange={(e) => setTopicwiseJson(e.target.value)}
                    className="min-h-[200px] font-mono text-xs"
                  />
                </div>

                <Button
                  onClick={() => handleUpload("topicwise", true)}
                  disabled={!topicwiseJson.trim() || uploading === "topicwise"}
                  className="w-full"
                  variant="secondary"
                >
                  {uploading === "topicwise" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from Pasted JSON
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Expected JSON format (same as Current Affairs):</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`{
  "title": "Quiz Title",
  "description": "Description",
  "questions": [{
    "id": 1,
    "question_en": "...",
    "question_hi": "...",
    "options": [
      {"label": "A", "text_en": "...", "text_hi": "..."}
    ],
    "answer": "A",
    "explanation_en": "...",
    "explanation_hi": "..."
  }]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Upload Documentation
            </CardTitle>
            <CardDescription>
              Use this API to upload content programmatically (Editorial, Current Affairs, Topicwise)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Key */}
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <code className="flex-1 bg-muted p-2 rounded text-sm font-mono break-all">
                  {API_KEY}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(API_KEY, 'api-key')}
                >
                  {copied === 'api-key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* API URL */}
            <div className="space-y-2">
              <Label>API Endpoint</Label>
              <div className="flex gap-2">
                <code className="flex-1 bg-muted p-2 rounded text-sm font-mono break-all">
                  {API_URL}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(API_URL, 'api-url')}
                >
                  {copied === 'api-url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Required Headers */}
            <div className="space-y-2">
              <Label>Required Headers</Label>
              <div className="bg-muted p-3 rounded text-sm space-y-1">
                <p><code>Content-Type: application/json</code></p>
                <p><code>x-api-key: {API_KEY}</code></p>
              </div>
            </div>

            {/* Type 1: Editorial */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-base font-semibold">1. Editorial Upload (HTML)</Label>
              <div className="bg-muted p-3 rounded text-sm space-y-2">
                <p><strong>type:</strong> <code>"editorial"</code></p>
                <p><strong>upload_date:</strong> <code>"YYYY-MM-DD"</code></p>
                <p><strong>html_content:</strong> Full HTML content string</p>
                <p><strong>title:</strong> (optional) Title string</p>
              </div>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST "${API_URL}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${API_KEY}" \\
  -d '{
    "type": "editorial",
    "upload_date": "2024-12-18",
    "title": "Daily Editorial",
    "html_content": "<div data-article-id=\\"1\\"><h2>Article Title</h2><p>Content...</p></div>"
  }'`}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(`curl -X POST "${API_URL}" -H "Content-Type: application/json" -H "x-api-key: ${API_KEY}" -d '{"type": "editorial", "upload_date": "2024-12-18", "title": "Daily Editorial", "html_content": "<div data-article-id=\\"1\\"><h2>Title</h2><p>Content</p></div>"}'`, 'curl-editorial')}
              >
                {copied === 'curl-editorial' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Editorial cURL
              </Button>
            </div>

            {/* Type 2: Current Affairs */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-base font-semibold">2. Current Affairs Upload (JSON)</Label>
              <div className="bg-muted p-3 rounded text-sm space-y-2">
                <p><strong>type:</strong> <code>"current_affairs"</code></p>
                <p><strong>upload_date:</strong> <code>"YYYY-MM-DD"</code></p>
                <p><strong>questions:</strong> Array of question objects</p>
              </div>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST "${API_URL}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${API_KEY}" \\
  -d '{
    "type": "current_affairs",
    "upload_date": "2024-12-18",
    "questions": {
      "title": "Current Affairs Quiz",
      "description": "Daily quiz",
      "questions": [
        {
          "id": 1,
          "question_en": "Question in English?",
          "question_hi": "प्रश्न हिंदी में?",
          "options": [
            {"label": "A", "text_en": "Option A", "text_hi": "विकल्प A"},
            {"label": "B", "text_en": "Option B", "text_hi": "विकल्प B"},
            {"label": "C", "text_en": "Option C", "text_hi": "विकल्प C"},
            {"label": "D", "text_en": "Option D", "text_hi": "विकल्प D"}
          ],
          "answer": "A",
          "explanation_en": "Explanation in English",
          "explanation_hi": "हिंदी में व्याख्या"
        }
      ]
    }
  }'`}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(`curl -X POST "${API_URL}" -H "Content-Type: application/json" -H "x-api-key: ${API_KEY}" -d '{"type": "current_affairs", "upload_date": "2024-12-18", "questions": {"title": "Quiz", "questions": []}}'`, 'curl-ca')}
              >
                {copied === 'curl-ca' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Current Affairs cURL
              </Button>
            </div>

            {/* Type 3: Topicwise */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-base font-semibold">3. Topicwise Upload (JSON)</Label>
              <div className="bg-muted p-3 rounded text-sm space-y-2">
                <p><strong>type:</strong> <code>"topicwise"</code></p>
                <p><strong>upload_date:</strong> <code>"YYYY-MM-DD"</code></p>
                <p><strong>questions:</strong> Array of question objects (same format as Current Affairs)</p>
              </div>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST "${API_URL}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${API_KEY}" \\
  -d '{
    "type": "topicwise",
    "upload_date": "2024-12-18",
    "questions": {
      "title": "Topicwise Quiz",
      "description": "Topic specific quiz",
      "questions": [
        {
          "id": 1,
          "question_en": "Question in English?",
          "question_hi": "प्रश्न हिंदी में?",
          "options": [
            {"label": "A", "text_en": "Option A", "text_hi": "विकल्प A"},
            {"label": "B", "text_en": "Option B", "text_hi": "विकल्प B"},
            {"label": "C", "text_en": "Option C", "text_hi": "विकल्प C"},
            {"label": "D", "text_en": "Option D", "text_hi": "विकल्प D"}
          ],
          "answer": "B",
          "explanation_en": "Explanation in English",
          "explanation_hi": "हिंदी में व्याख्या"
        }
      ]
    }
  }'`}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(`curl -X POST "${API_URL}" -H "Content-Type: application/json" -H "x-api-key: ${API_KEY}" -d '{"type": "topicwise", "upload_date": "2024-12-18", "questions": {"title": "Quiz", "questions": []}}'`, 'curl-tw')}
              >
                {copied === 'curl-tw' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Topicwise cURL
              </Button>
            </div>

            {/* Success Response */}
            <div className="space-y-2 border-t pt-4">
              <Label>Success Response</Label>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "message": "Content created/updated successfully",
  "type": "current_affairs",
  "upload_date": "2024-12-18",
  "questions_count": 10
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Admin;
