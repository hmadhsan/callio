import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log("Using API Key:", process.env.RESEND_API_KEY?.substring(0, 8) + "...");
    console.log("Sending from:", "invites@callio.dev");

    try {
        const { data, error } = await resend.emails.send({
            from: 'Callio <invites@callio.dev>',
            to: 'hmadhsan97@gmail.com', // The email from the screenshot
            subject: 'Test Email Diagnostic',
            html: '<p>Testing Resend configuration.</p>'
        });

        if (error) {
            console.error("Resend API returned an error:");
            console.error(JSON.stringify(error, null, 2));
        } else {
            console.log("Email sent successfully! Data:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("SDK Threw an Exception:");
        console.error(err);
    }
}

testEmail();
