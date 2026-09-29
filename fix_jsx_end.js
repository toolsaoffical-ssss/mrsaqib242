const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

code = code.replace(
  /                  <\/div>\s*\n\s*\}\)\}\s*\n\s*<\/div>\s*\n\s*<\/div>/,
  '                  </div>\n                </>\n              )}\n            </div>\n          </div>'
);

// If the regex above fails, let's just replace the exact string:
code = code.replace(
  `                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>`,
  `                    </select>
                  </div>
                </div>
                </>
              )}
            </div>
          </div>`
);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
