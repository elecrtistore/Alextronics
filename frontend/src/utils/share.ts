const apiUrl = import.meta.env.VITE_API_URL;

function getBackendOrigin(): string {
  if (apiUrl && apiUrl.startsWith('http')) {
    return apiUrl.replace(/\/api\/?$/, '');
  }
  return window.location.origin;
}

export function getShareUrl(shareId: string): string {
  return `${getBackendOrigin()}/api/products/share/${shareId}`;
}

export function handleShare(shareId: string, name: string) {
  const url = getShareUrl(shareId);
  if (navigator.share) {
    navigator.share({ title: name, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied!');
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  }
}