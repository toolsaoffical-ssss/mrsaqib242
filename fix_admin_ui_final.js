const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

const newUI = `                  </div>
                  
                  {/* Additional Marquee Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Text Color
                      </label>
                      <select
                        value={pageSettings.announcement_color || 'text-orange-200'}
                        onChange={e => setPageSettings({ ...pageSettings, announcement_color: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="text-orange-200">Orange/Amber</option>
                        <option value="text-white">Pure White</option>
                        <option value="text-emerald-300">Emerald Green</option>
                        <option value="text-blue-300">Cyan Blue</option>
                        <option value="text-purple-300">Purple</option>
                        <option value="text-rose-300">Rose Pink</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Animation Speed
                      </label>
                      <select
                        value={pageSettings.announcement_speed || 'normal'}
                        onChange={e => setPageSettings({ ...pageSettings, announcement_speed: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="slow">Slow</option>
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                        <option value="static">No Animation (Static)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Font Weight
                      </label>
                      <select
                        value={pageSettings.announcement_font || 'font-medium'}
                        onChange={e => setPageSettings({ ...pageSettings, announcement_font: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="font-normal">Normal</option>
                        <option value="font-medium">Medium</option>
                        <option value="font-bold">Bold</option>
                        <option value="font-black">Black (Thick)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>`;

code = code.replace(/                  <\/div>\s*\n\s*\)}\s*\n\s*<\/div>\s*\n\s*<\/div>/, newUI);
fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
