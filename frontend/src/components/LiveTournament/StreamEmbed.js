import React from 'react';
import { Box } from '@mui/material';

const StreamEmbed = ({ url }) => {
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Twitch
    if (url.includes('twitch.tv')) {
      const channel = url.split('/').pop();
      return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()
        : new URLSearchParams(new URL(url).search).get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: '500px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'black',
          color: 'white'
        }}
      >
        Stream not available
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '500px', position: 'relative' }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </Box>
  );
};

export default StreamEmbed; 