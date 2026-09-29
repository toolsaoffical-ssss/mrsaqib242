const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// 1. Add state
const stateTarget = "const [customBudgetAmount, setCustomBudgetAmount] = useState('');";
const stateReplacement = `const [customBudgetAmount, setCustomBudgetAmount] = useState('');\n  const [customTimelineDate, setCustomTimelineDate] = useState('');`;
code = code.replace(stateTarget, stateReplacement);

// 2. Add to submit handler
const submitTarget = `          reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined
        });`;
const submitReplacement = `          reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined,
          custom_timeline_date: timeline === 'Custom' ? customTimelineDate.trim() : undefined
        });`;
code = code.replace(submitTarget, submitReplacement);

// 3. Inject the UI
// I will target the end of the Timeline block.
const uiTarget = `                            </button>
                          ))}
                        </div>
                      </div>`;
                      
const uiReplacement = `                            </button>
                          ))}
                        </div>
                        
                        {/* CUSTOM TIMELINE EXTENDED PORTAL */}
                        <AnimatePresence>
                          {timeline === 'Custom' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-amber-50 border border-amber-500/20 rounded-2xl p-4 shadow-[inset_0_2px_10px_rgba(245,158,11,0.05)]">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <h4 className="text-xs font-black uppercase text-amber-800 tracking-widest">Select Target Date</h4>
                                </div>
                                
                                <div>
                                  <input
                                    type="date"
                                    value={customTimelineDate}
                                    onChange={e => setCustomTimelineDate(e.target.value)}
                                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-900 font-bold focus:outline-none focus:border-amber-500 shadow-sm"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>`;

code = code.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
console.log("Updated ContactTeamPage.tsx");
