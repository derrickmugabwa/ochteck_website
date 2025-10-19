import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const contentType = 'image/png';

export default async function Icon() {
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('favicon_url')
      .eq('is_active', true)
      .single();

    // If custom favicon exists, redirect to it
    if (settings?.favicon_url) {
      // Fetch the image and return it
      const response = await fetch(settings.favicon_url);
      const blob = await response.blob();
      return new Response(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }
  } catch (error) {
    console.error('Error loading custom favicon:', error);
  }

  // Fallback: Return a simple generated icon
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0070f3',
          color: 'white',
          fontSize: 48,
          fontWeight: 'bold',
        }}
      >
        O
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
