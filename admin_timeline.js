const fs = require('fs');
let code = fs.readFileSync('src/components/AdminInquiriesManager.tsx', 'utf8');

// Ensure typescript knows about custom_timeline_date in the display logic.
// We just add it to the check and render it.

const displayCheck = `(selectedInquiry.custom_budget_amount || selectedInquiry.custom_features || selectedInquiry.reference_links)`;
const displayCheckReplacement = `(selectedInquiry.custom_budget_amount || selectedInquiry.custom_features || selectedInquiry.reference_links || selectedInquiry.custom_timeline_date)`;
code = code.replace(displayCheck, displayCheckReplacement);

const insertTarget = `                  {selectedInquiry.custom_budget_amount && (`;
const insertReplacement = `                  {selectedInquiry.custom_timeline_date && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">Custom Timeline Deadline</span>
                      <strong className="text-amber-400 text-sm">{selectedInquiry.custom_timeline_date}</strong>
                    </div>
                  )}

                  {selectedInquiry.custom_budget_amount && (`;

if (!code.includes('Custom Timeline Deadline')) {
    code = code.replace(insertTarget, insertReplacement);
    fs.writeFileSync('src/components/AdminInquiriesManager.tsx', code);
    console.log("Updated AdminInquiriesManager.tsx");
} else {
    console.log("Already added timeline to Admin");
}
