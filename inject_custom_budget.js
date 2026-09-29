const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// 1. Add states
const stateTarget = "const [timeline, setTimeline] = useState('1-2 weeks');";
const newStates = `const [timeline, setTimeline] = useState('1-2 weeks');
  const [customBudgetAmount, setCustomBudgetAmount] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');`;
code = code.replace(stateTarget, newStates);

// 2. Add 'Custom' to BUDGETS
code = code.replace(/'Flexible'/g, "'Flexible',\n      'Custom'");

// 3. Update submit handler
const submitTarget = `          message: queryDetails.trim(),
          priority: 'high'
        });`;
const submitReplacement = `          message: queryDetails.trim(),
          priority: 'high',
          custom_budget_amount: budget === 'Custom' ? customBudgetAmount.trim() : undefined,
          custom_features: budget === 'Custom' ? customFeatures.trim() : undefined,
          reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined
        });`;
code = code.replace(submitTarget, submitReplacement);

// 4. Inject AnimatePresence for the expanding Custom UI
// Wait, AnimatePresence is imported from 'framer-motion' or 'motion/react'. Let's check imports.
// I will just use motion.div if it's there. 

const uiTarget = `                        </div>
                      </div>
  
                      {/* Timeline */}`;

const customUi = `                        </div>

                        {/* CUSTOM BUDGET EXTENDED PORTAL */}
                        <AnimatePresence>
                          {budget === 'Custom' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-2xl p-4 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-widest">Custom Rate Portal</h4>
                                </div>
                                
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                    Your Desired Rate / Budget
                                  </label>
                                  <input
                                    type="text"
                                    value={customBudgetAmount}
                                    onChange={e => setCustomBudgetAmount(e.target.value)}
                                    placeholder="e.g. $2000, 50K PKR, Flexible"
                                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                    Special Features Needed
                                  </label>
                                  <textarea
                                    value={customFeatures}
                                    onChange={e => setCustomFeatures(e.target.value)}
                                    rows={2}
                                    placeholder="Any specific complex features, API integrations, etc."
                                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                    Reference Websites / Links (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={referenceLinks}
                                    onChange={e => setReferenceLinks(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
  
                      {/* Timeline */}`;

code = code.replace(uiTarget, customUi);

// Save
fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
