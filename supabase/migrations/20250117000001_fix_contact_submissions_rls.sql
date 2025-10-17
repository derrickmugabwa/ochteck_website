-- Fix RLS policy for contact_submissions to allow anonymous inserts

-- Drop existing policy
DROP POLICY IF EXISTS "Public can submit contact forms" ON contact_submissions;

-- Create new policy that explicitly allows anonymous inserts
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);
