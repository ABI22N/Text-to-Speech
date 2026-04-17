import React, { useRef } from 'react';

const TTSConverter = ({ text, setText }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async function() {
          const typedarray = new Uint8Array(this.result);
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageStrings = textContent.items.map(item => item.str);
            fullText += pageStrings.join(' ') + ' ';
          }
          setText(fullText);
        };
        fileReader.readAsArrayBuffer(file);
      } catch (err) {
        console.error("Error reading PDF:", err);
        alert("Failed to parse PDF file.");
      }
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please select a valid .txt or .pdf file");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here or paste your text to convert into speech..."
        style={{
          width: '100%',
          minHeight: '200px',
          background: 'var(--input-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'var(--text-main)',
          fontSize: '1.1rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.3s'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--panel-border)'}
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'var(--input-bg)',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px dashed var(--text-muted)'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Or upload a .txt / .pdf file:
        </div>
        <input 
          type="file" 
          accept=".txt,.pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          style={{
            background: 'var(--primary)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'var(--primary-hover)'}
          onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
        >
          Choose File
        </button>
      </div>
    </div>
  );
};

export default TTSConverter;
