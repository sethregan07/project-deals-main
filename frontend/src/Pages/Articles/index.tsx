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
  CircularProgress,
  Alert,
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
  content: string;
  author?: string;
  image_url?: string;
  category?: string;
  published_date: string;
  created_at: string;
  updated_at: string;
  excerpt?: string;
  imageUrl?: string;
  date?: string;
  readTime?: string;
  views?: string;
}

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
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<{category: string, count: number}[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:3002/articles'),
          fetch('http://localhost:3002/categories')
        ]);

        if (!articlesRes.ok) throw new Error('Failed to fetch articles');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();

        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error || articles.length === 0) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 2 }}>
        <Alert color="danger" variant="soft">
          {error || 'No articles found'}
        </Alert>
      </Box>
    );
  }

  // Transform articles to match display format
  const transformArticle = (article: Article) => ({
    ...article,
    excerpt: article.content.substring(0, 150) + '...',
    imageUrl: article.image_url,
    date: new Date(article.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: `${Math.ceil(article.content.split(' ').length / 200)} min read`,
    views: `${Math.floor(Math.random() * 50) + 1}k views`, // Dummy views
  });

  const transformedArticles = articles.map(transformArticle);

  const heroMain = transformedArticles[0] || {};
  const heroSide = transformedArticles.slice(1, 4);
  const editorsChoice = transformedArticles.slice(4, 7);
  const recentPosts = transformedArticles.slice(7, 10);
  const trendingMain = transformedArticles[10] || transformedArticles[0] || {};
  const trendingGrid = transformedArticles.slice(11, 15);
  const weeklyBest = transformedArticles.slice(15, 19);
  const popularSide = transformedArticles.slice(19, 22);
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
            {recentPosts.length > 0 && (
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
            )}

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
                  {categories.slice(0, 4).map((cat, index) => (
                    <Sheet
                      key={cat.category}
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
                      to={`/categories/${cat.category.toLowerCase()}`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AspectRatio ratio="1" sx={{ width: 40 }}>
                          <Box
                            component="img"
                            src={`https://images.unsplash.com/photo-15${
                              index + 1
                            }8770660439-4636190af475?w=400&q=80`}
                            alt={cat.category}
                            loading="lazy"
                          />
                        </AspectRatio>
                        <Typography level="body-sm">{cat.category}</Typography>
                      </Box>
                      <Typography level="body-xs" color="neutral">
                        {cat.count} posts
                      </Typography>
                    </Sheet>
                  ))}
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
