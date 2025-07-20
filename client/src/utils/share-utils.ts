import html2canvas from 'html2canvas';
import type { CompatibilityResult } from '@shared/schema';
import { getElement } from './abjad-calculator';

export function generateShareText(result: CompatibilityResult): string {
  const partner1Element = getElement(result.partner1DigitalRoot);
  const partner2Element = getElement(result.partner2DigitalRoot);
  
  const text = `🌟 Muslim Compatibility Results 🌟
Based on Islamic Numerology

${result.partner1Name} & ${result.partner2Name}: ${result.overallCompatibilityScore}% Compatible

Name Analysis:
- ${result.partner1Name}: ${partner1Element.name} Element (${partner1Element.arabic})
- ${result.partner2Name}: ${partner2Element.name} Element (${partner2Element.arabic})

${result.lifePathCompatibilityScore ? `Life Path Compatibility: ${result.lifePathCompatibilityScore}%` : ''}

Result: ${result.compatibilityLevel}!
${result.insights}

Calculated using Islamic Abjad numerology
#MuslimCompatibility #IslamicNumerology`;

  return text;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

export function shareToWhatsApp(text: string): void {
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/?text=${encodedText}`;
  window.open(url, '_blank');
}

export function shareToTwitter(text: string): void {
  const encodedText = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
  window.open(url, '_blank');
}

export function shareToFacebook(url: string): void {
  const encodedUrl = encodeURIComponent(url);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  window.open(facebookUrl, '_blank');
}

export async function shareAsImage(elementId: string, filename: string = 'compatibility-results.png'): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });

    if (navigator.share && 'canShare' in navigator) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: 'Muslim Compatibility Results',
                files: [file]
              });
            } catch (err) {
              // User cancelled or share failed, fallback to download
              downloadImage(canvas, filename);
            }
          } else {
            downloadImage(canvas, filename);
          }
        }
      });
    } else {
      // Fallback to download
      downloadImage(canvas, filename);
    }
    
    return true;
  } catch (err) {
    console.error('Error generating image:', err);
    return false;
  }
}

function downloadImage(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

export async function shareResults(result: CompatibilityResult, url: string): Promise<boolean> {
  const shareText = generateShareText(result);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Muslim Compatibility Results',
        text: shareText,
        url: url
      });
      return true;
    } catch (err) {
      // User cancelled or share API not supported, fallback to copy
      return await copyToClipboard(shareText);
    }
  } else {
    // Fallback to copy to clipboard
    return await copyToClipboard(shareText);
  }
}

export function shareViaEmail(result: CompatibilityResult): void {
  const subject = encodeURIComponent('Muslim Compatibility Results');
  const body = encodeURIComponent(generateShareText(result));
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
}