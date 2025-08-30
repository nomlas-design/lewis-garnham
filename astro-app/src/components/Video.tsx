import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
const Video = () => {
  return (
    <div className='grid grid--video'>
      <LiteYouTubeEmbed
        id='dQw4w9WgXcQ'
        title='YouTube video player'
        playerClass='lty-playbtn'
      />
      <div className='content'></div>
    </div>
  );
};

export default Video;
