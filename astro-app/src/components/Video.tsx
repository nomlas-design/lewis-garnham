import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import type { PortableTextBlock } from '@portabletext/types';
import { PortableText } from '@portabletext/react';

interface VideoProps {
  title: string;
  youtubeId: string;
  description?: PortableTextBlock[];
  details?: string;
  reverse?: boolean;
}

const Video = ({
  title,
  youtubeId,
  description,
  details,
  reverse = false,
}: VideoProps) => {
  return (
    <div className={`grid grid--video ${reverse ? 'grid--video-reverse' : ''}`}>
      <LiteYouTubeEmbed
        id={youtubeId}
        title={title}
        playerClass='lty-playbtn'
      />
      <div className='content content--video'>
        {title && <h3 className='copy__subtitle'>{title}</h3>}
        {description && (
          <div className='description'>
            <PortableText value={description} />
          </div>
        )}
        {details && <p className='copy__small'>{details}</p>}
      </div>
    </div>
  );
};

export default Video;
