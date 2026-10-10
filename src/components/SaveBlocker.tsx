import { useEffect } from 'react';

export function SaveBlocker() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Jab koi Ctrl + S (Windows) ya Cmd + S (Mac) dabaye
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); // Browser ka default complete save (HTML+CSS) rok do

        // Sirf khali HTML copy karo
        let htmlContent = document.documentElement.outerHTML;

        // Optionally, remove CSS links completely so it looks broken when they open it
        htmlContent = htmlContent.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
        htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Usay ek simple .html file mein daal kar download karwa do
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mrsaqib_index.html'; // Save honi wali file ka naam
        a.click();
        
        URL.revokeObjectURL(url);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
