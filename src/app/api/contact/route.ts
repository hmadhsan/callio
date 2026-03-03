import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

// Initialize Resend if the API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Validate inputs
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields.' },
                { status: 400 }
            );
        }

        // Save the message to the database
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject: subject || null,
                message,
                status: 'UNREAD',
            },
        });

        // Optionally send an email notification to the team
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Callio Contact Form <hello@callio.dev>', // Ensure you have a verified domain on Resend
                    to: 'hello@callio.dev',
                    replyTo: email,
                    subject: `New Contact Message: ${subject || 'No Subject'}`,
                    html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'None'}</p>
            <hr />
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br />')}</p>
          `,
                });
            } catch (emailError) {
                console.error('Failed to send notification email:', emailError);
                // We don't fail the request if the email fails, as the message is saved in the DB
            }
        }

        return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });

    } catch (error) {
        console.error('Failed to process contact form submission:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred while processing your request.' },
            { status: 500 }
        );
    }
}
