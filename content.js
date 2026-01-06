// content.js – działa na każdej stronie business.allegro.pl
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "grabOfferIds") {
    const ids = new Set();

    // 1. Linki z offerId (najpewniejsze – widoczne przy najechaniu)
    document.querySelectorAll('a[href*="offerId="]').forEach(a => {
      const match = a.href.match(/offerId[=:](\d+)/);
      if (match) ids.add(match[1]);
    });

    // 2. Atrybuty data-offer-id (nowsze Allegro)
    document.querySelectorAll('[data-offer-id]').forEach(el => {
      const id = el.getAttribute('data-offer-id');
      if (id && /^\d+$/.test(id)) ids.add(id);
    });

    // 3. data-analytics-offer-id
    document.querySelectorAll('[data-analytics-offer-id]').forEach(el => {
      const id = el.getAttribute('data-analytics-offer-id');
      if (id && /^\d+$/.test(id)) ids.add(id);
    });

    const result = Array.from(ids).sort((a, b) => a - b);

    sendResponse({
      count: result.length,
      ids: result
    });
  }
});