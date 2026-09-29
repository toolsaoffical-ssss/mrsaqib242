const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

const target = `                            </button>
                          ))}
                        </div>
                      </div>`;

const replacement = `                            </button>
                          ))}
                        </div>

                        {/* CUSTOM TIMELINE EXTENDED PORTAL */}
                        <AnimatePresence>
                          {timeline === 'Custom' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden md:col-span-2"
                            >
                              <div className="bg-amber-50 border border-amber-500/20 rounded-2xl p-4 shadow-[inset_0_2px_10px_rgba(245,158,11,0.05)] mt-4">
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

if(code.includes('CUSTOM TIMELINE EXTENDED PORTAL')) {
    console.log('Already exists');
} else {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
    console.log('Replaced');
}
