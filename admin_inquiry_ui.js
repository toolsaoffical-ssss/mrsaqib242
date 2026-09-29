const fs = require('fs');
let code = fs.readFileSync('src/components/AdminInquiriesManager.tsx', 'utf8');

const target = `              {/* Full Requirements */}`;
const replacement = `              {/* Custom Portal Details (If Any) */}
              {(selectedInquiry.custom_budget_amount || selectedInquiry.custom_features || selectedInquiry.reference_links) && (
                <div className="space-y-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Custom Project Details
                  </h4>
                  
                  {selectedInquiry.custom_budget_amount && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">Desired Budget/Rate</span>
                      <strong className="text-emerald-300 text-sm">{selectedInquiry.custom_budget_amount}</strong>
                    </div>
                  )}

                  {selectedInquiry.custom_features && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">Special Features Needed</span>
                      <p className="text-zinc-200 text-sm bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
                        {selectedInquiry.custom_features}
                      </p>
                    </div>
                  )}

                  {selectedInquiry.reference_links && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-0.5">Reference Links</span>
                      <a href={selectedInquiry.reference_links.startsWith('http') ? selectedInquiry.reference_links : \`https://\${selectedInquiry.reference_links}\`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium hover:underline break-all">
                        {selectedInquiry.reference_links}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Full Requirements */}`;

if(code.includes('Custom Portal Details')) {
  console.log("Already updated");
} else {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/AdminInquiriesManager.tsx', code);
  console.log("Replaced successfully!");
}
