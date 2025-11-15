import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type DailyContent = Database['public']['Tables']['daily_content']['Row'] & {
  slug?: string;
  description?: string | null;
  featured_image?: string | null;
  author?: string | null;
  category?: string | null;
  keywords?: string[] | null;
};

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setError("No article slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to fetch by slug first, fallback to id
        const { data, error: fetchError } = await supabase
          .from("daily_content")
          .select("*")
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();

        if (fetchError) {
          console.error("Error fetching article:", fetchError);
          setError("Article not found");
          toast({
            title: "Article not found",
            description: "The article you're looking for doesn't exist.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setArticle(data as DailyContent);
      } catch (err) {
        console.error("Error loading article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "The article you're looking for doesn't exist."}</p>
        <Button onClick={() => navigate("/")} variant="default">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const articleTitle = article.title || "Untitled Article";
  const articleUrl = `https://dailygraph.in/${article.slug || article.id}`;
  const publishDate = new Date(article.upload_date);
  const modifiedDate = new Date(article.updated_at);

  // Article Schema.org structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articleTitle,
    "description": article.description || articleTitle,
    "image": article.featured_image || "https://storage.googleapis.com/gpt-engineer-file-uploads/UzSD8RN0vxV8yG4nsGmtjwj9YJC3/uploads/1761919607072-Gemini_Generated_Image_ozubhhozubhhozub.png",
    "datePublished": publishDate.toISOString(),
    "dateModified": modifiedDate.toISOString(),
    "author": {
      "@type": "Organization",
      "name": article.author || "Dailygraph",
      "url": "https://dailygraph.in"
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Dailygraph",
      "logo": {
        "@type": "ImageObject",
        "url": "https://storage.googleapis.com/gpt-engineer-file-uploads/UzSD8RN0vxV8yG4nsGmtjwj9YJC3/uploads/1761919607072-Gemini_Generated_Image_ozubhhozubhhozub.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dailygraph.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category || "Articles",
        "item": `https://dailygraph.in/${article.category ? article.category.toLowerCase() : 'articles'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": articleTitle,
        "item": articleUrl
      }
    ]
  };

  return (
    <>
      <SEO
        title={`${articleTitle} - Dailygraph`}
        description={article.description || `Read ${articleTitle} on Dailygraph - SSC CGL, CHSL Preparation with News Articles`}
        keywords={article.keywords?.join(", ") || "SSC CGL, SSC CHSL, news article, competitive exams"}
        ogTitle={articleTitle}
        ogDescription={article.description || articleTitle}
        ogImage={article.featured_image || undefined}
        ogUrl={articleUrl}
        schema={[articleSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header with back button */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <article className="container max-w-4xl mx-auto px-4 py-8">
          {/* Category Badge */}
          {article.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {article.category}
              </span>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {articleTitle}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author || "Dailygraph"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={publishDate.toISOString()}>
                {format(publishDate, "MMMM dd, yyyy")}
              </time>
            </div>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.featured_image}
                alt={articleTitle}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Description */}
          {article.description && (
            <div className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {article.description}
            </div>
          )}

          {/* Article HTML Content */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.html_content }}
          />

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Related Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
};

export default Article;
