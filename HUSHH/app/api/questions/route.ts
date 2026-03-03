import { NextResponse } from 'next/server';
import { DEPARTMENTS, INTERNAL_QUESTIONS } from '@/lib/data/questions';

export async function GET() {
    try {
        return NextResponse.json({
            departments: DEPARTMENTS,
            questions: INTERNAL_QUESTIONS
        });
    } catch (error: any) {
        console.error('Error serving questions:', error);
        return NextResponse.json({ error: 'Failed to load questions', details: error.message }, { status: 500 });
    }
}
