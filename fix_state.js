const fs = require('fs');
let code = fs.readFileSync('src/components/ToolsPage.tsx', 'utf8');

const stateInsert = `  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [showWhatsappPopup, setShowWhatsappPopup] = useState<boolean>(false);
  
  useEffect(() => {
    if (settings.whatsapp_popup_enabled && settings.whatsapp_channel_link) {
      const dismissed = localStorage.getItem('whatsapp_popup_dismissed_v2');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowWhatsappPopup(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [settings]);

  const dismissWhatsappPopup = () => {
    setShowWhatsappPopup(false);
    localStorage.setItem('whatsapp_popup_dismissed_v2', 'true');
  };`;

code = code.replace(/  const \[copiedToast, setCopiedToast\] = useState<string \| null>\(null\);/, stateInsert);

fs.writeFileSync('src/components/ToolsPage.tsx', code);
