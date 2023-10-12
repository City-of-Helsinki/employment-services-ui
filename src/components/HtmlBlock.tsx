import { useEffect } from 'react';
import parse from 'html-react-parser';

import { DrupalFormattedText } from '@/lib/types';

interface HtmlBlockProps {
  field_text: DrupalFormattedText;
}

export function HtmlBlock({ field_text }: HtmlBlockProps): JSX.Element {
  useEffect(() => {
    const links = document.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
      const href = links[i].getAttribute('href');

      if (href && (href.endsWith('.doc') || href.endsWith('.pdf'))) {
        links[i].removeAttribute('data-is-external');
        if (links[i] instanceof Element) {
          const parentElement = links[i].parentNode as HTMLElement;
          parentElement?.classList.add('modified-before');
        }
      }
    }
  }, []);

  return (
    <div className="block-text">
      {parse(field_text?.processed)}
    </div>
  );
}

export default HtmlBlock;
