const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// Fix submit handler
const submitRegex = /message:\s*queryDetails\.trim\(\),\s*priority:\s*'high'\s*}\);/;
const submitReplacement = `message: queryDetails.trim(),
          priority: 'high',
          custom_budget_amount: budget === 'Custom' ? customBudgetAmount.trim() : undefined,
          custom_features: budget === 'Custom' ? customFeatures.trim() : undefined,
          reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined
        });`;

if (submitRegex.test(code)) {
    code = code.replace(submitRegex, submitReplacement);
    console.log("Submit handler updated");
} else {
    console.log("Submit handler NOT FOUND");
}

// Ensure AnimatePresence is imported
if (!code.includes('AnimatePresence')) {
    code = code.replace("import { motion } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';");
}

// Inject Custom Budget Portal UI
const uiRegex = /\{\/\*\s*Timeline\s*\*\/\}/;
const customUi = `{/* CUSTOM BUDGET EXTENDED PORTAL */}
                      <AnimatePresence>
                        {budget === 'Custom' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden md:col-span-2"
                          >
                            <div className="bg-emerald-50 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[inset_0_2px_10px_rgba(16,185,129,0.05)]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <h4 className="text-sm font-black uppercase text-emerald-800 tracking-widest">Custom Rate & Scope Portal</h4>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                    Your Desired Rate / Budget
                                  </label>
                                  <input
                                    type="text"
                                    value={customBudgetAmount}
                                    onChange={e => setCustomBudgetAmount(e.target.value)}
                                    placeholder="e.g. $2000, 50K PKR, Flexible"
                                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 font-bold focus:outline-none focus:border-emerald-500 shadow-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                    Reference Websites / Links (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={referenceLinks}
                                    onChange={e => setReferenceLinks(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                  Special Features Needed
                                </label>
                                <textarea
                                  value={customFeatures}
                                  onChange={e => setCustomFeatures(e.target.value)}
                                  rows={2}
                                  placeholder="Any specific complex features, API integrations, etc."
                                  className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 resize-none shadow-sm"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Timeline */}`;

if (uiRegex.test(code)) {
    code = code.replace(uiRegex, customUi);
    console.log("UI updated");
} else {
    console.log("UI NOT FOUND");
}

fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
