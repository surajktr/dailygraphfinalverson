-- Create topicwise table with same structure as current_affairs
CREATE TABLE public.topicwise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  upload_date date NOT NULL,
  questions jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topicwise ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can read topicwise" 
ON public.topicwise 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert topicwise" 
ON public.topicwise 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topicwise" 
ON public.topicwise 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topicwise" 
ON public.topicwise 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_topicwise_updated_at
BEFORE UPDATE ON public.topicwise
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();