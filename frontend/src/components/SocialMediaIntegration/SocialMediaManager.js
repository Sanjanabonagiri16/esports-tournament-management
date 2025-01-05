import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import { socialMediaService } from '../../services/socialMediaService';

const SocialMediaManager = ({ tournamentId }) => {
  const [post, setPost] = useState({
    content: '',
    platforms: {
      twitter: true,
      discord: true,
      facebook: false
    }
  });

  const handleShare = async () => {
    try {
      const promises = [];
      if (post.platforms.twitter) {
        promises.push(socialMediaService.shareToTwitter({
          tournamentId,
          content: post.content
        }));
      }
      if (post.platforms.discord) {
        promises.push(socialMediaService.postToDiscord({
          tournamentId,
          content: post.content
        }));
      }
      if (post.platforms.facebook) {
        promises.push(socialMediaService.shareToFacebook({
          tournamentId,
          content: post.content
        }));
      }

      await Promise.all(promises);
      setPost({ ...post, content: '' });
    } catch (error) {
      console.error('Error sharing to social media:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Social Media Manager
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Post Content"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={post.platforms.twitter}
                    onChange={(e) => setPost({
                      ...post,
                      platforms: { ...post.platforms, twitter: e.target.checked }
                    })}
                  />
                }
                label="Twitter"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={post.platforms.discord}
                    onChange={(e) => setPost({
                      ...post,
                      platforms: { ...post.platforms, discord: e.target.checked }
                    })}
                  />
                }
                label="Discord"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={post.platforms.facebook}
                    onChange={(e) => setPost({
                      ...post,
                      platforms: { ...post.platforms, facebook: e.target.checked }
                    })}
                  />
                }
                label="Facebook"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleShare}
              disabled={!post.content || !Object.values(post.platforms).some(v => v)}
            >
              Share
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SocialMediaManager; 