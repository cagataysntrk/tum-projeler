import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Tüm isteklere izin ver
  return NextResponse.next();
}

// Auth kontrolü yapılmayacak
export const config = {
  matcher: []
}; 