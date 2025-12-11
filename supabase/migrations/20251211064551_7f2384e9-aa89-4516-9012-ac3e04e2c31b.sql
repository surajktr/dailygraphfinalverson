-- Add antonyms_questions column to vocab_questions table
ALTER TABLE public.vocab_questions 
ADD COLUMN antonyms_questions jsonb DEFAULT NULL;