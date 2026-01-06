document.getElementById('grab').addEventListener('click', async () => {
  const btn = document.getElementById('grab');
  const resultDiv = document.getElementById('result');
  
  btn.disabled = true;
  btn.textContent = 'Szukam ofert...';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, () => {
    chrome.tabs.sendMessage(tab.id, { action: "grabOfferIds" }, (response) => {
      if (!response || response.count === 0) {
        resultDiv.style.display = 'block';
        resultDiv.textContent = 'Nie znaleziono żadnych ofert!\nPrzewiń stronę w dół, żeby załadowały się wszystkie oferty, a potem kliknij ponownie.';
        btn.textContent = 'ZBIERZ ID OFERT';
        btn.disabled = false;
        return;
      }

      const text = response.ids.join('\n');
      resultDiv.style.display = 'block';
      resultDiv.textContent = text;
      resultDiv.classList.add('success');
      
      // Automatyczne kopiowanie do schowka
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = `SKOPIOWANO ${response.count} ID!`;
        setTimeout(() => {
          btn.textContent = 'ZBIERZ ID OFERT';
          btn.disabled = false;
        }, 3000);
      });
    });
  });
});