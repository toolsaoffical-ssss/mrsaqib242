const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// Replace the old direct Supabase call with server-side API call
const oldSubmit = `const res = await submitInquiryToDB({
          name: clientName.trim(),
          email: clientEmail.trim() || 'contact@client.com',
          phone: clientPhone.trim(),
          service_type: serviceType,
          budget,
          timeline,
          subject: \`Project Inquiry: \${serviceType}\`,
          message: queryDetails.trim(),
            priority: 'high',
            custom_budget_amount: budget === 'Custom' ? customBudgetAmount.trim() : undefined,
            custom_features: budget === 'Custom' ? customFeatures.trim() : undefined,
            reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined,
            custom_timeline_date: timeline === 'Custom' ? customTimelineDate.trim() : undefined
          });`;

const newSubmit = `const apiRes = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: clientName.trim(),
            email: clientEmail.trim() || 'contact@client.com',
            phone: clientPhone.trim(),
            service_type: serviceType,
            budget,
            timeline,
            subject: \`Project Inquiry: \${serviceType}\`,
            message: queryDetails.trim(),
            priority: 'high',
            custom_budget_amount: budget === 'Custom' ? customBudgetAmount.trim() : undefined,
            custom_features: budget === 'Custom' ? customFeatures.trim() : undefined,
            reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined,
            custom_timeline_date: timeline === 'Custom' ? customTimelineDate.trim() : undefined
          })
        });
        const res = await apiRes.json();`;

if (code.includes('submitInquiryToDB({')) {
    code = code.replace(oldSubmit, newSubmit);
    
    // Remove the import of submitInquiryToDB
    code = code.replace(
        "import { submitInquiryToDB } from '../lib/inquiriesService';",
        "// Contact form now uses server-side /api/contact route"
    );
    
    fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
    console.log("SUCCESS: Replaced submitInquiryToDB with /api/contact");
} else {
    console.log("FAILED: Could not find submitInquiryToDB block");
}
