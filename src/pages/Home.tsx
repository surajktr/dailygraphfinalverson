import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BookA, Globe, Menu, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

interface Article {
  id: string;
  title: string | null;
  upload_date: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentArticles();
  }, []);

  const fetchRecentArticles = async () => {
    try {
      setLoading(true);
      
      // Get date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const formattedDate = format(sevenDaysAgo, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("daily_content")
        .select("id, title, upload_date")
        .gte("upload_date", formattedDate)
        .order("upload_date", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (id: string) => {
    navigate(`/${id}`);
  };

  // Icon colors for variety
  const iconColors = [
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-orange-100 text-orange-600",
  ];

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">
              THE <span className="text-vocab">NEWS</span>
            </h1>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-6 max-w-2xl mx-auto">
          {/* Category Buttons */}
          <div className="flex gap-8 justify-center mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-20 h-20 rounded-full bg-vocab text-vocab-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <BookA className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium text-foreground">Vocab</span>
            </button>
            
            <button
              onClick={() => navigate("/admin")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-20 h-20 rounded-full bg-current-affairs text-current-affairs-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Globe className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium text-foreground">Current Affairs</span>
            </button>
          </div>

          {/* Recent Posts Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Posts</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recent articles found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    className="w-full flex items-start gap-4 p-4 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${iconColors[index % iconColors.length]} flex items-center justify-center`}>
                      <span className="text-xl font-bold">
                        {article.title?.charAt(0) || "A"}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                        {article.title || "Untitled Article"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Published: {format(new Date(article.upload_date), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
