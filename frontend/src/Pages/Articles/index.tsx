// src/Pages/Articles/index.tsx
import * as React from 'react';
import {
  Box,
  Sheet,
  Card,
  Typography,
  Grid,
  Stack,
  AspectRatio,
  Chip,
  Button,
  IconButton,
  Input,
  Divider,
  Avatar,
} from '@mui/joy';
import {
  IconSearch,
  IconClock,
  IconEye,
  IconHeart,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  readTime: string;
  views: string;
}

const heroMain: Article = {
  id: 1,
  title: 'Game Changing Virtual Reality Console Technology To Serve The Community',
  excerpt:
    'Discover how the next generation of VR consoles is transforming gaming, education, and remote collaboration.',
  imageUrl:
    'https://images.unsplash.com/photo-1580894742597-87d793ddaf26?w=1200&q=80',
  category: 'Technology',
  date: '24 August, 2024',
  readTime: '8 min read',
  views: '32k views',
};

const heroSide: Article[] = [
  {
    id: 2,
    title: 'New Modern Phone Brings Extra Revolutionary Performance',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    category: 'Mobile',
    date: '22 August, 2024',
    readTime: '5 min read',
    views: '12k views',
  },
  {
    id: 3,
    title: 'A Guide To Image Optimization On Jamstack Sites',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&q=80',
    category: 'Tutorial',
    date: '21 August, 2024',
    readTime: '6 min read',
    views: '9.3k views',
  },
  {
    id: 4,
    title: 'Using Automated Testing Tools To Improve Accessibility',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    category: 'Development',
    date: '20 August, 2024',
    readTime: '7 min read',
    views: '7.1k views',
  },
];

const editorsChoice: Article[] = [
  {
    id: 5,
    title: 'Using Automated Tests To Refactor Legacy Code',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    category: 'Review',
    date: '19 August, 2024',
    readTime: '4 min read',
    views: '5.2k views',
  },
  {
    id: 6,
    title: 'How To Search For A Developer Job Abroad',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&q=80',
    category: 'Career',
    date: '17 August, 2024',
    readTime: '6 min read',
    views: '3.8k views',
  },
  {
    id: 7,
    title: 'New Stunning Front-End UI Workshop Recap',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
    category: 'Design',
    date: '16 August, 2024',
    readTime: '5 min read',
    views: '4.1k views',
  },
];

const recentPosts: Article[] = [
  {
    id: 8,
    title: 'Best Tech Accessories To Work From Home Comfortably',
    excerpt:
      'We review keyboards, webcams, lighting, and ergonomic chairs that make remote work more enjoyable.',
    imageUrl:
      'https://images.unsplash.com/photo-1587613864521-9ef9ef42e814?w=1200&q=80',
    category: 'Review',
    date: '15 August, 2024',
    readTime: '9 min read',
    views: '10.4k views',
  },
  {
    id: 9,
    title: 'How To Create Advanced Animations With CSS',
    excerpt:
      'Take your interfaces to the next level with transitions, keyframes, and scroll-based effects.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    category: 'Tutorial',
    date: '14 August, 2024',
    readTime: '7 min read',
    views: '6.9k views',
  },
  {
    id: 10,
    title: 'New Stunning Front-End UI Trend Watch',
    excerpt:
      'Gradients, glassmorphism, and micro-animations are back — here’s how to use them tastefully.',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    category: 'Design',
    date: '13 August, 2024',
    readTime: '5 min read',
    views: '4.3k views',
  },
];

const trendingMain: Article = {
  id: 11,
  title: 'iPhone Devices Are Going To Be Incredible Nowadays',
  excerpt:
    'Between camera upgrades, powerful chips, and seamless ecosystem features, modern devices are more capable than ever.',
  imageUrl:
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80',
  category: 'Gadget',
  date: '12 August, 2024',
  readTime: '8 min read',
  views: '18.1k views',
};

const trendingGrid: Article[] = [
  {
    id: 12,
    title: 'One-Pan Baked Sausage And Lentils For Busy Devs',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    category: 'Lifestyle',
    date: '11 August, 2024',
    readTime: '4 min read',
    views: '3.4k views',
  },
  {
    id: 13,
    title: 'How To Create Advanced Animations With CSS',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    category: 'Tutorial',
    date: '10 August, 2024',
    readTime: '6 min read',
    views: '5.9k views',
  },
  {
    id: 14,
    title: 'State Of CSS: Influence The Future Of CSS',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    category: 'Report',
    date: '9 August, 2024',
    readTime: '5 min read',
    views: '4.7k views',
  },
  {
    id: 15,
    title: 'Essential Gear For Hybrid Work In 2024',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    category: 'Tech',
    date: '8 August, 2024',
    readTime: '6 min read',
    views: '4.0k views',
  },
];

const weeklyBest: Article[] = [
  {
    id: 16,
    title: 'WordPress Full-Site Editing: A Deep Dive',
    excerpt:
      'Discover the new editor, block themes, and how to migrate existing sites safely.',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    category: 'Tutorial',
    date: '7 August, 2024',
    readTime: '10 min read',
    views: '6.1k views',
  },
  {
    id: 17,
    title: 'Effective Communication For Everyday Meetings',
    excerpt:
      'Tips for facilitating productive online and offline meetings with your team.',
    imageUrl:
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80',
    category: 'Productivity',
    date: '6 August, 2024',
    readTime: '7 min read',
    views: '5.3k views',
  },
  {
    id: 18,
    title: 'A Roadmap For Building A Business Chatbot',
    excerpt:
      'From defining your use case to picking the right tools and measuring ROI.',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    category: 'Business',
    date: '5 August, 2024',
    readTime: '9 min read',
    views: '4.9k views',
  },
  {
    id: 19,
    title: 'Easy Fluid Typography With clamp()',
    excerpt:
      'Scale your font sizes smoothly across breakpoints with modern CSS techniques.',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    category: 'CSS',
    date: '4 August, 2024',
    readTime: '6 min read',
    views: '3.2k views',
  },
];

const popularSide: Article[] = [
  {
    id: 20,
    title: 'The Future Of CSS',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    category: 'Tech News',
    date: '3 August, 2024',
    readTime: '6 min read',
    views: '3.5k views',
  },
  {
    id: 21,
    title: 'Best Tech Accessories To Work From Home',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1587613864521-9ef9ef42e814?w=800&q=80',
    category: 'Review',
    date: '2 August, 2024',
    readTime: '7 min read',
    views: '3.1k views',
  },
  {
    id: 22,
    title: 'The Author Chocolate Cookie Daily',
    excerpt: '',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    category: 'Lifestyle',
    date: '1 August, 2024',
    readTime: '4 min read',
    views: '2.4k views',
  },
];

// small meta line
function Meta({ article }: { article: Article }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        color: 'text.secondary',
        mt: 0.5,
      }}
    >
      <Typography level="body-xs">{article.date}</Typography>
      <Typography level="body-xs">•</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconClock size={14} />
        <Typography level="body-xs">{article.readTime}</Typography>
      </Box>
      <Typography level="body-xs">•</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconEye size={14} />
        <Typography level="body-xs">{article.views}</Typography>
      </Box>
    </Box>
  );
}

export default function ArticlesHome() {
  return (
    <Box sx={{ bgcolor: 'background.body', minHeight: '100vh' }}>
      {/* Top header */}
      <Sheet
        variant="solid"
        color="neutral"
        sx={{ py: 0.5, fontSize: 12 }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'neutral.100',
          }}
        >
          <Typography level="body-xs">Follow us on</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconBrandFacebook size={16} />
            <IconBrandTwitter size={16} />
            <IconBrandInstagram size={16} />
            <IconBrandLinkedin size={16} />
          </Box>
        </Box>
      </Sheet>

      {/* Main nav */}
      <Sheet
        variant="outlined"
        sx={{
          border: 'none',
          borderBottom: '1px solid',
          borderColor: 'neutral.outlinedBorder',
          bgcolor: 'background.surface',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            level="h3"
            fontWeight={800}
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            Blogs
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'About Us', href: '/about' },
              { label: 'Features', href: '/features' },
              { label: 'Categories', href: '/categories' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => (
              <Typography
                key={item.label}
                level="body-sm"
                component={Link}
                to={item.href}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { color: 'primary.plainColor' },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Input
              size="sm"
              placeholder="Search news..."
              startDecorator={<IconSearch size={16} />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, minWidth: 180 }}
            />
            <Button
              size="sm"
              variant="outlined"
              component={Link}
              to="/signin"
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Sheet>

      {/* Content container */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
        {/* HERO SECTION */}
        <Grid container spacing={2.5}>
          <Grid xs={12} md={8}>
            <Card
              component={Link}
              to={`/articles/${heroMain.id}`}
              variant="outlined"
              sx={{
                p: 0,
                overflow: 'hidden',
                color: 'common.white',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <AspectRatio ratio="16/9">
                <Box
                  component="img"
                  src={heroMain.imageUrl}
                  alt={heroMain.title}
                  loading="lazy"
                />
              </AspectRatio>
              <Box sx={{ p: 3 }}>
                <Chip size="sm" color="primary" variant="solid">
                  {heroMain.category}
                </Chip>
                <Typography level="h2" sx={{ mt: 1.5, mb: 1 }}>
                  {heroMain.title}
                </Typography>
                <Typography level="body-sm" sx={{ mb: 1.5 }}>
                  {heroMain.excerpt}
                </Typography>
                <Meta article={heroMain} />
              </Box>
            </Card>
          </Grid>

          {/* right blue blogs */}
          <Grid xs={12} md={4}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              {heroSide.map((a) => (
                <Card
                  key={a.id}
                  component={Link}
                  to={`/articles/${a.id}`}
                  variant="outlined"
                  sx={{
                    p: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    color: 'common.white',
                    textDecoration: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1.2 }}>
                      <AspectRatio ratio="4/5">
                        <Box
                          component="img"
                          src={a.imageUrl}
                          alt={a.title}
                          loading="lazy"
                        />
                      </AspectRatio>
                    </Box>
                    <Box sx={{ flex: 2, p: 1.5 }}>
                      <Chip size="sm" variant="outlined" color="primary">
                        {a.category}
                      </Chip>
                      <Typography
                        level="body-sm"
                        fontWeight={600}
                        sx={{
                          mt: 0.75,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {a.title}
                      </Typography>
                      <Meta article={a} />
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Color banner */}
        <Card
          variant="soft"
          color="primary"
          sx={{
            mt: 3,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Typography level="title-lg">Modern Technology Fest Here</Typography>
          <Button
            variant="solid"
            size="sm"
            component={Link}
            to="/events/modern-technology-fest"
          >
            See Details
          </Button>
        </Card>

        {/* EDITORS CHOICE */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Typography level="title-lg">Editor&apos;s Choice</Typography>
              <Typography
                level="body-xs"
                color="primary"
                component={Link}
                to="/articles?filter=editors-choice"
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                View all
              </Typography>
            </Box>
          </Grid>
          {editorsChoice.map((a) => (
            <Grid key={a.id} xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ height: '100%', cursor: 'pointer', textDecoration: 'none' }}
                component={Link}
                to={`/articles/${a.id}`}
              >
                <AspectRatio ratio="16/10">
                  <Box
                    component="img"
                    src={a.imageUrl}
                    alt={a.title}
                    loading="lazy"
                  />
                </AspectRatio>
                <Stack spacing={0.75} sx={{ mt: 1 }}>
                  <Chip size="sm" variant="soft" color="primary">
                    {a.category}
                  </Chip>
                  <Typography level="title-sm">{a.title}</Typography>
                  <Meta article={a} />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* RECENT POSTS + RIGHT SIDEBAR */}
        <Grid container spacing={2.5}>
          <Grid xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Typography level="title-lg">Recent Posts</Typography>
              <Typography
                level="body-xs"
                color="primary"
                sx={{ cursor: 'pointer' }}
                component={Link}
                to="/articles"
              >
                View all
              </Typography>
            </Box>

            {/* Main recent card */}
            <Card
              variant="outlined"
              sx={{ mb: 2.5, cursor: 'pointer', textDecoration: 'none' }}
              component={Link}
              to={`/articles/${recentPosts[0].id}`}
            >
              <Grid container spacing={2}>
                <Grid xs={12} sm={7}>
                  <AspectRatio ratio="16/9">
                    <Box
                      component="img"
                      src={recentPosts[0].imageUrl}
                      alt={recentPosts[0].title}
                      loading="lazy"
                    />
                  </AspectRatio>
                </Grid>
                <Grid xs={12} sm={5}>
                  <Stack spacing={1}>
                    <Chip size="sm" color="primary" variant="soft">
                      {recentPosts[0].category}
                    </Chip>
                    <Typography level="title-md">
                      {recentPosts[0].title}
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      {recentPosts[0].excerpt}
                    </Typography>
                    <Meta article={recentPosts[0]} />
                  </Stack>
                </Grid>
              </Grid>
            </Card>

            {/* two small recent cards */}
            <Grid container spacing={2}>
              {recentPosts.slice(1).map((a) => (
                <Grid key={a.id} xs={12} sm={6}>
                  <Card
                    variant="outlined"
                    component={Link}
                    to={`/articles/${a.id}`}
                    sx={{ cursor: 'pointer', textDecoration: 'none' }}
                  >
                    <AspectRatio ratio="16/10">
                      <Box
                        component="img"
                        src={a.imageUrl}
                        alt={a.title}
                        loading="lazy"
                      />
                    </AspectRatio>
                    <Stack spacing={0.75} sx={{ mt: 1 }}>
                      <Chip size="sm" variant="soft" color="primary">
                        {a.category}
                      </Chip>
                      <Typography level="title-sm">{a.title}</Typography>
                      <Meta article={a} />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid xs={12} md={4}>
            <Stack spacing={2.5}>
              {/* Newsletter */}
              <Card
                variant="solid"
                color="neutral"
                sx={{
                  // bgcolor: '#0b1c3d',
                  color: 'common.white',
                }}
              >
                <Typography color='white' level="title-md" mb={0.5}>
                  Daily Newsletter
                </Typography>
                <Typography level="body-xs" color="white" mb={1.5}>
                  Get all the top stories from Tech News today.
                </Typography>
                <Stack spacing={1}>
                  <Input size="sm" placeholder="Your email" variant="soft" />
                  <Button size="sm" variant="solid">
                    Subscribe
                  </Button>
                </Stack>
              </Card>

              {/* Hot categories */}
              <Card variant="outlined">
                <Typography level="title-md" mb={1}>
                  Hot Categories
                </Typography>
                <Stack spacing={1}>
                  {['Gadgets', 'Technology', 'Design', 'Development'].map(
                    (cat, index) => (
                      <Sheet
                        key={cat}
                        variant="soft"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 1,
                          px: 1.5,
                          borderRadius: 'sm',
                          cursor: 'pointer',
                        }}
                        component={Link}
                        to={`/categories/${cat.toLowerCase()}`}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AspectRatio ratio="1" sx={{ width: 40 }}>
                            <Box
                              component="img"
                              src={`https://images.unsplash.com/photo-15${
                                index + 1
                              }8770660439-4636190af475?w=400&q=80`}
                              alt={cat}
                              loading="lazy"
                            />
                          </AspectRatio>
                          <Typography level="body-sm">{cat}</Typography>
                        </Box>
                        <Typography level="body-xs" color="neutral">
                          {10 + index * 3} posts
                        </Typography>
                      </Sheet>
                    ),
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Banner */}
        <Card
          variant="soft"
          color="primary"
          sx={{
            mt: 3,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Typography level="title-lg">Modern Technology Fest Here</Typography>
          <Button
            size="sm"
            variant="outlined"
            component={Link}
            to="/events/modern-technology-fest"
          >
            See Details
          </Button>
        </Card>

        {/* TRENDING */}
        <Grid container spacing={2.5}>
          <Grid xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Typography level="title-lg">Trending News</Typography>
              <Typography
                level="body-xs"
                color="primary"
                sx={{ cursor: 'pointer' }}
                component={Link}
                to="/articles?filter=trending"
              >
                View all
              </Typography>
            </Box>
            <Card
              variant="outlined"
              sx={{ mb: 2 }}
            >
              <AspectRatio ratio="16/9">
                <Box
                  component="img"
                  src={trendingMain.imageUrl}
                  alt={trendingMain.title}
                  loading="lazy"
                />
              </AspectRatio>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                <Chip size="sm" color="primary" variant="soft">
                  {trendingMain.category}
                </Chip>
                <Typography level="title-lg">
                  {trendingMain.title}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  {trendingMain.excerpt}
                </Typography>
                <Meta article={trendingMain} />
                <Button
                  size="sm"
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start', mt: 1 }}
                  component={Link}
                  to={`/articles/${trendingMain.id}`}
                >
                  Read more
                </Button>
              </Stack>
            </Card>

            {/* bottom trending grid */}
            <Grid container spacing={2}>
              {trendingGrid.map((a) => (
                <Grid key={a.id} xs={12} sm={3}>
                  <Card
                    variant="outlined"
                    sx={{ p: 0, cursor: 'pointer', textDecoration: 'none' }}
                    component={Link}
                    to={`/articles/${a.id}`}
                  >
                    <AspectRatio ratio="4/3">
                      <Box
                        component="img"
                        src={a.imageUrl}
                        alt={a.title}
                        loading="lazy"
                      />
                    </AspectRatio>
                    <Box sx={{ p: 1 }}>
                      <Chip size="sm" variant="soft" color="primary">
                        {a.category}
                      </Chip>
                      <Typography
                        level="body-sm"
                        fontWeight={600}
                        sx={{
                          mt: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {a.title}
                      </Typography>
                      <Meta article={a} />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* right green promo + popular posts */}
          <Grid xs={12} md={4}>
            <Stack spacing={2.5}>
              <Card
                variant="soft"
                sx={{
                  bgcolor: '#d9f99d',
                  borderColor: 'transparent',
                }}
              >
                <Typography level="title-sm" color="success">
                  Featured Product
                </Typography>
                <Typography level="h4" sx={{ mt: 0.5 }}>
                  iPhone 14 Pro Max 2023
                </Typography>
                <Typography level="body-sm" sx={{ mt: 0.5, mb: 1.5 }}>
                  Enhanced build, A16 Bionic chip, smart camera and always-on
                  display.
                </Typography>
                <Button size="sm" variant="solid" color="success">
                  Shop Online
                </Button>
              </Card>

              <Card variant="outlined">
                <Typography level="title-md" mb={1}>
                  Popular Posts
                </Typography>
                <Stack spacing={1.5}>
                  {popularSide.map((a) => (
                    <Box
                      key={a.id}
                      component={Link}
                      to={`/articles/${a.id}`}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        textDecoration: 'none',
                      }}
                    >
                      <AspectRatio ratio="4/3" sx={{ width: 80 }}>
                        <Box
                          component="img"
                          src={a.imageUrl}
                          alt={a.title}
                          loading="lazy"
                        />
                      </AspectRatio>
                      <Box sx={{ flex: 1 }}>
                        <Chip
                          size="sm"
                          variant="soft"
                          color="primary"
                          sx={{ mb: 0.5 }}
                        >
                          {a.category}
                        </Chip>
                        <Typography
                          level="body-sm"
                          fontWeight={600}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {a.title}
                        </Typography>
                        <Meta article={a} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* image strip */}
        <Grid container spacing={2.5} sx={{ mt: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} xs={12} sm={3}>
              <AspectRatio ratio="4/3">
                <Box
                  component="img"
                  src={`https://images.unsplash.com/photo-16${
                    i + 20
                  }7048676732-d65bc937f952?w=800&q=80`}
                  alt="Gallery"
                  loading="lazy"
                />
              </AspectRatio>
            </Grid>
          ))}
        </Grid>

        {/* WEEKLY BEST + right column */}
        <Grid container spacing={2.5} sx={{ mt: 3 }}>
          <Grid xs={12} md={8}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Typography level="title-lg">Weekly Best News</Typography>
              <Typography
                level="body-xs"
                color="primary"
                sx={{ cursor: 'pointer' }}
                component={Link}
                to="/articles?filter=weekly-best"
              >
                View all
              </Typography>
            </Box>
            <Card variant="outlined">
              <Stack divider={<Divider />} spacing={1.5}>
                {weeklyBest.map((a) => (
                  <Box
                    key={a.id}
                    component={Link}
                    to={`/articles/${a.id}`}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      py: 1.25,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    <AspectRatio ratio="4/3" sx={{ width: 140, flexShrink: 0 }}>
                      <Box
                        component="img"
                        src={a.imageUrl}
                        alt={a.title}
                        loading="lazy"
                      />
                    </AspectRatio>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        size="sm"
                        variant="soft"
                        color="primary"
                        sx={{ mb: 0.5 }}
                      >
                        {a.category}
                      </Chip>
                      <Typography level="title-sm">{a.title}</Typography>
                      <Typography
                        level="body-xs"
                        color="neutral"
                        sx={{ mt: 0.5 }}
                      >
                        {a.excerpt}
                      </Typography>
                      <Meta article={a} />
                      <Button
                        size="sm"
                        variant="plain"
                        sx={{ p: 0, mt: 0.5 }}
                        endDecorator={<IconHeart size={14} />}
                      >
                        Read More
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={2.5}>
              <Card
                variant="solid"
                color="primary"
                sx={{
                  background:
                    'linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #22c55e 100%)',
                  color: 'common.white',
                }}
              >
                <Typography color='white' level="title-md" mb={1}>
                  Automation Discount
                </Typography>
                <Typography color='white' level="body-sm" mb={1.5}>
                  20% off on all automation &amp; cloud infrastructure courses
                  this week only.
                </Typography>
                <Button size="sm" variant="soft">
                  Learn More
                </Button>
              </Card>

              <Card variant="outlined">
                <Typography level="title-md" mb={1}>
                  Popular Tech
                </Typography>
                <Stack spacing={1}>
                  {popularSide.slice(0, 3).map((a) => (
                    <Box
                      key={a.id}
                      component={Link}
                      to={`/articles/${a.id}`}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        textDecoration: 'none',
                      }}
                    >
                      <AspectRatio ratio="4/3" sx={{ width: 80 }}>
                        <Box
                          component="img"
                          src={a.imageUrl}
                          alt={a.title}
                          loading="lazy"
                        />
                      </AspectRatio>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          level="body-sm"
                          fontWeight={600}
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {a.title}
                        </Typography>
                        <Meta article={a} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Newsletter strip */}
      <Sheet
        variant="soft"
        sx={{
          mt: 4,
          py: 3,
          bgcolor: 'neutral.100',
          borderTop: '1px solid',
          borderColor: 'neutral.outlinedBorder',
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography level="title-lg">
              Get Our Latest News &amp; Updates
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Input placeholder="Name" size="sm" />
            <Input placeholder="Email" size="sm" type="email" />
            <Button size="sm">Subscribe Now</Button>
          </Box>
        </Box>
      </Sheet>

      {/* Footer */}
      <Sheet
        variant="solid"
        color="neutral"
        sx={{ bgcolor: '#020617', color: 'neutral.100', py: 4 }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
          }}
        >
          <Grid container spacing={3}>
            <Grid xs={12} md={3}>
              <Typography
                level="h4"
                mb={1}
                component={Link}
                to="/"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                zaira
              </Typography>
              <Typography level="body-xs" color="neutral.300">
                Beyond the buzz. We bring sharp stories, deep dives, and honest
                reviews straight from the world of technology &amp; design.
              </Typography>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography level="title-sm" mb={1}>
                Company
              </Typography>
              <Stack spacing={0.5}>
                <Typography
                  level="body-xs"
                  component={Link}
                  to="/about"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  About
                </Typography>
                <Typography level="body-xs">The Team</Typography>
                <Typography level="body-xs">Careers</Typography>
                <Typography level="body-xs">Jobs</Typography>
              </Stack>
            </Grid>
            <Grid xs={6} md={3}>
              <Typography level="title-sm" mb={1}>
                Explore
              </Typography>
              <Stack spacing={0.5}>
                <Typography
                  level="body-xs"
                  component={Link}
                  to="/articles"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Articles
                </Typography>
                <Typography level="body-xs">Reviews</Typography>
                <Typography level="body-xs">Tech</Typography>
                <Typography level="body-xs">Design</Typography>
              </Stack>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography level="title-sm" mb={1}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <IconBrandFacebook size={18} />
                <IconBrandTwitter size={18} />
                <IconBrandInstagram size={18} />
                <IconBrandLinkedin size={18} />
              </Box>
              <Typography level="body-xs" color="neutral.400">
                © 2024 Zaira News. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Sheet>
    </Box>
  );
}
