const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// The marker
const marker = "{/* STEP 3: REQUIREMENTS & LIVE SUMMARY */}";
const index = code.indexOf(marker);

if (index !== -1) {
    // Find the nearest closing div of the step 2 container before STEP 3
    const snippetBefore = code.substring(0, index);
    
    // We want to insert the Custom portal right before the two closing divs of the grid
    // Actually, replacing inside the grid is hard if we can't match it. Let's just insert it right before the marker, inside the main container but outside the 2-column grid? No, it's already outside the grid if we put it before the marker.
    // Wait, STEP 2 grid ends before STEP 3.
    // Let's insert it before the STEP 3 marker. It will appear at the bottom of STEP 2.

    const replacement = `{/* CUSTOM TIMELINE EXTENDED PORTAL */}
                  <AnimatePresence>
                    {timeline === 'Custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="bg-amber-50 border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-[inset_0_2px_10px_rgba(245,158,11,0.05)]">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <h4 className="text-sm font-black uppercase text-amber-800 tracking-widest">Select Target Date</h4>
                          </div>
                          
                          <div>
                            <input
                              type="date"
                              value={customTimelineDate}
                              onChange={e => setCustomTimelineDate(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-900 font-bold focus:outline-none focus:border-amber-500 shadow-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  ${marker}`;

    code = code.replace(marker, replacement);
    fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
    console.log("Injected before STEP 3");
} else {
    console.log("Marker not found");
}
