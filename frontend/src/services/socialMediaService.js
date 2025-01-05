import axios from 'axios';

export const socialMediaService = {
  async shareToTwitter(data) {
    try {
      const response = await axios.post('/api/social/twitter/share', data);
      return response.data;
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      throw error;
    }
  },

  async postToDiscord(data) {
    try {
      const response = await axios.post('/api/social/discord/post', data);
      return response.data;
    } catch (error) {
      console.error('Error posting to Discord:', error);
      throw error;
    }
  },

  async shareToFacebook(data) {
    try {
      const response = await axios.post('/api/social/facebook/share', data);
      return response.data;
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      throw error;
    }
  },

  async scheduleSocialPost(data) {
    try {
      const response = await axios.post('/api/social/schedule', data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling social post:', error);
      throw error;
    }
  }
}; 