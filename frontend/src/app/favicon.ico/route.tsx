import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0284c7',
          borderRadius: 6,
          fontSize: 20,
          fontWeight: 700,
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        F
      </div>
    ),
    { width: 32, height: 32 }
  );
}
