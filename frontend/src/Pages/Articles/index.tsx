import React, { useEffect, useState } from 'react';
import {
  Card,
  Text,
  Container,
  Title,
  Badge,
  Group,
  Avatar,
  Button,
  Divider,
  List,
  ThemeIcon,
  Anchor,
  Stack,
  Image,
  BackgroundImage,
  Center,
  SimpleGrid,
  AspectRatio,
  UnstyledButton,
  Spoiler,
  ScrollArea,
  Grid
} from '@mantine/core';
import { motion } from 'framer-motion';
import {
  IconBook,
  IconHash,
  IconChevronRight,
  IconEye,
  IconClock,
  IconStar,
  IconHeart,
  IconMessageCircle,
  IconCode,
  IconNews,
  IconFlame,
  IconAward,
  IconFolder,
  IconDatabase,
  IconCloud,
  IconArrowRight,
  IconTrendingUp,
  IconUsers,
  IconShield,
  IconFileText
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

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
  rating?: number;
  read_time?: number;
  views?: number;
  likes?: number;
}

interface ArticleSection {
  category: string;
  articles: Article[];
  icon: React.ReactNode;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const categories = ['all', 'Technology', 'Business', 'Design', 'Marketing', 'Development'];

  const categoryIcons: Record<string, React.ReactNode> = {
    'Technology': <IconFileText size={20} />,
    'Business': <IconTrendingUp size={20} />,
    'Design': <IconHeart size={20} />,
    'Marketing': <IconUsers size={20} />,
    'Development': <IconShield size={20} />
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3002/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        
        const transformedData = data.map((article: any, index: number) => ({
          ...article,
          rating: article.rating || (4.0 + Math.random() * 1.2).toFixed(1),
          read_time: Math.floor(5 + Math.random() * 15),
          views: Math.floor(1000 + Math.random() * 9000),
          likes: Math.floor(50 + Math.random() * 500),
          category: article.category || categories[index % categories.length]
        }));
        
        setArticles(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticles = articles.slice(0, 3);

  const articleSections: ArticleSection[] = categories
    .filter(cat => cat !== 'all')
    .map(category => ({
      category,
      articles: articles.filter(article => article.category === category),
      icon: categoryIcons[category] || <IconFileText size={20} />
    }))
    .filter(section => section.articles.length > 0);

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/${article.id}`);
  };

  const generateTableOfContents = (content: string) => {
    const lines = content.split('\n');
    const headings = lines
      .filter(line => line.startsWith('#'))
      .map((line, index) => {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+/, '').trim();
        return { level, text, id: `heading-${index}` };
      });
    return headings;
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack>
          <div style={{ height: 400, backgroundColor: '#f0f0f0', borderRadius: 8 }} />
          <SimpleGrid cols={3}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 300, backgroundColor: '#f0f0f0', borderRadius: 8 }} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <div style={{ padding: 16, backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: 8 }}>
          <Text c="red">Error loading articles: {error}</Text>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        {/* Hero Section with Featured Article */}
        {featuredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BackgroundImage
              src={featuredArticles[0].image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
              radius="lg"
              h={400}
            >
              <Center h={400} bg="rgba(0,0,0,0.6)" radius="lg">
                <Stack c="white" align="center" ta="center" p="xl">
                  <Badge size="lg" variant="filled" color="blue">
                    Featured Article
                  </Badge>
                  <Title order={1} size="h2">
                    {featuredArticles[0].title}
                  </Title>
                  <Text size="lg" maw={600}>
                    {featuredArticles[0].content.substring(0, 200)}...
                  </Text>
                  <Group>
                    <Avatar size="sm" />
                    <Text size="sm">{featuredArticles[0].author || 'Anonymous'}</Text>
                    <Text size="sm">•</Text>
                    <Text size="sm">{featuredArticles[0].published_date}</Text>
                  </Group>
                  <Button
                    variant="white"
                    color="dark"
                    rightSection={<IconArrowRight size={16} />}
                    onClick={() => handleArticleClick(featuredArticles[0])}
                  >
                    Read Full Article
                  </Button>
                </Stack>
              </Center>
            </BackgroundImage>
          </motion.div>
        )}

        {/* Table of Contents */}
        <Card withBorder p="lg" radius="md">
          <Title order={3} mb="md">
            <Group>
              <IconBook size={20} />
              Table of Contents
            </Group>
          </Title>
          <List spacing="sm">
            <List.Item icon={<IconChevronRight size={14} />}>
              <Anchor href="#featured">Featured Articles</Anchor>
            </List.Item>
            <List.Item icon={<IconChevronRight size={14} />}>
              <Anchor href="#categories">Categories</Anchor>
            </List.Item>
            <List.Item icon={<IconChevronRight size={14} />}>
              <Anchor href="#sections">Article Sections</Anchor>
            </List.Item>
            <List.Item icon={<IconChevronRight size={14} />}>
              <Anchor href="#latest">Latest Articles</Anchor>
            </List.Item>
          </List>
        </Card>

        {/* Category Filter */}
        <Group id="categories">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'filled' : 'light'}
              onClick={() => setSelectedCategory(category)}
              textTransform="capitalize"
            >
              {category}
            </Button>
          ))}
        </Group>

        {/* Main Content with Sections */}
        <Grid>
          <Grid.Col span={8}>
            <Stack spacing="xl">
              {/* Article Sections */}
              <div id="sections">
                  {articleSections.map((section, sectionIndex) => (
                    <motion.div
                      key={section.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                    >
                      <Card withBorder p="lg" radius="md" mb="xl">
                        <Title order={2} mb="md">
                          <Group>
                            {section.icon}
                            {section.category}
                            <Badge size="sm" variant="light">
                              {section.articles.length} articles
                            </Badge>
                          </Group>
                        </Title>
                        
                        <SimpleGrid cols={2} spacing="lg">
                          {section.articles.slice(0, 4).map((article) => (
                            <Card
                              key={article.id}
                              shadow="sm"
                              p="md"
                              radius="md"
                              withBorder
                              component={UnstyledButton}
                              style={{ cursor: 'pointer', textAlign: 'left' }}
                              onClick={() => handleArticleClick(article)}
                            >
                              <Stack spacing="xs">
                                <Group justify="space-between">
                                  <Badge color="blue" variant="light" size="sm">
                                    {article.category}
                                  </Badge>
                                  <Group spacing={4} c="dimmed">
                                    <IconEye size={12} />
                                    <Text size="xs">{article.views}</Text>
                                  </Group>
                                </Group>
                                
                                <Text fw={500} lineClamp={2} size="sm">
                                  {article.title}
                                </Text>
                                
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                  {article.content.substring(0, 100)}...
                                </Text>
                                
                                <Group justify="space-between">
                                  <Group spacing={4}>
                                    {[...Array(5)].map((_, i) => (
                                      <IconStar
                                        key={i}
                                        size={10}
                                        fill={i < Math.floor(article.rating || 0) ? 'currentColor' : 'none'}
                                        color={i < Math.floor(article.rating || 0) ? 'yellow' : 'gray'}
                                      />
                                    ))}
                                    <Text size="xs" c="dimmed">
                                      {article.rating}
                                    </Text>
                                  </Group>
                                  <Group spacing={4} c="dimmed">
                                    <IconClock size={10} />
                                    <Text size="xs">{article.read_time} min</Text>
                                  </Group>
                                </Group>
                              </Stack>
                            </Card>
                          ))}
                        </SimpleGrid>
                        
                        {section.articles.length > 4 && (
                          <Group justify="center" mt="md">
                            <Button
                              variant="light"
                              size="sm"
                              rightSection={<IconChevronRight size={14} />}
                              onClick={() => setSelectedCategory(section.category)}
                            >
                              View all {section.articles.length} {section.category} articles
                            </Button>
                          </Group>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* All Articles Grid */}
                <div id="latest">
                  <Title order={2} mb="md">
                    {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
                  </Title>
                  <SimpleGrid cols={2} spacing="lg">
                    {filteredArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card
                          shadow="sm"
                          p="lg"
                          radius="md"
                          withBorder
                          component={UnstyledButton}
                          style={{ cursor: 'pointer', textAlign: 'left' }}
                          onClick={() => handleArticleClick(article)}
                        >
                          <Card.Section>
                            <AspectRatio ratio={16/9}>
                              <Image
                                src={article.image_url || `https://images.unsplash.com/photo-${1486312338219 + index}?w=400&h=225&fit=crop`}
                                alt={article.title}
                                fallbackSrc="https://placehold.co/400x225"
                              />
                            </AspectRatio>
                          </Card.Section>

                          <Stack spacing="sm" mt="md">
                            <Group justify="space-between">
                              <Badge color="blue" variant="light" size="sm">
                                {article.category || 'General'}
                              </Badge>
                              <Group spacing={4} c="dimmed">
                                <IconEye size={12} />
                                <Text size="xs">{article.views}</Text>
                              </Group>
                            </Group>

                            <Text fw={500} lineClamp={2} size="lg">
                              {article.title}
                            </Text>

                            <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Show less">
                              <Text size="sm" c="dimmed">
                                {article.content}
                              </Text>
                            </Spoiler>

                            <Group justify="space-between">
                              <Group spacing="xs">
                                <Avatar size="xs" />
                                <Text size="xs" c="dimmed">
                                  {article.author || 'Anonymous'}
                                </Text>
                              </Group>
                              <Group spacing={4} c="dimmed">
                                <IconClock size={12} />
                                <Text size="xs">{article.read_time} min read</Text>
                              </Group>
                            </Group>

                            <Group justify="space-between">
                              <Group spacing={4}>
                                {[...Array(5)].map((_, i) => (
                                  <IconStar
                                    key={i}
                                    size={12}
                                    fill={i < Math.floor(article.rating || 0) ? 'currentColor' : 'none'}
                                    color={i < Math.floor(article.rating || 0) ? 'yellow' : 'gray'}
                                  />
                                ))}
                                <Text size="xs" c="dimmed">
                                  {article.rating}
                                </Text>
                              </Group>
                              <Group spacing={4}>
                                <IconHeart size={12} />
                                <Text size="xs" c="dimmed">{article.likes}</Text>
                                <IconMessageCircle size={12} />
                                <Text size="xs" c="dimmed">24</Text>
                              </Group>
                            </Group>
                          </Stack>
                        </Card>
                      </motion.div>
                    ))}
                  </SimpleGrid>
                </div>
              </Stack>
          </Grid.Col>

          {/* Right Sidebar - Fixed Table of Contents and Quick Links */}
          <Grid.Col span={4}>
            <Stack spacing="lg">
              {/* Enhanced Table of Contents */}
              <Card withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  <Group>
                    <IconBook size={16} />
                    Table of Contents
                  </Group>
                </Title>
                <List spacing="xs" size="sm">
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#featured" size="sm">Featured Articles</Anchor>
                  </List.Item>
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#categories" size="sm">Categories</Anchor>
                  </List.Item>
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#sections" size="sm">Article Sections</Anchor>
                  </List.Item>
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#latest" size="sm">Latest Articles</Anchor>
                  </List.Item>
                </List>
              </Card>

              {/* Quick Navigation */}
              <Card withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  <Group>
                    <IconHash size={16} />
                    Quick Navigation
                  </Group>
                </Title>
                <List spacing="xs" size="sm">
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#featured">Featured</Anchor>
                  </List.Item>
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#sections">Sections</Anchor>
                  </List.Item>
                  <List.Item icon={<IconChevronRight size={12} />}>
                    <Anchor href="#latest">Latest</Anchor>
                  </List.Item>
                </List>
              </Card>

              {/* Categories Overview */}
              <Card withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  <Group>
                    <IconBook size={16} />
                    Categories
                  </Group>
                </Title>
                <List spacing="xs" size="sm">
                  {articleSections.map((section) => (
                    <List.Item key={section.category} icon={section.icon}>
                      <Group justify="space-between">
                        <Text size="sm">{section.category}</Text>
                        <Badge size="xs" variant="light">
                          {section.articles.length}
                        </Badge>
                      </Group>
                    </List.Item>
                  ))}
                </List>
              </Card>

              {/* Popular Tags */}
              <Card withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  <Group>
                    <IconHash size={16} />
                    Popular Tags
                  </Group>
                </Title>
                <Group gap="xs">
                  {['React', 'TypeScript', 'Node.js', 'Design', 'Marketing', 'AI'].map((tag) => (
                    <Badge key={tag} variant="light" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </Card>

              {/* Newsletter Signup */}
              <Card withBorder p="md" radius="md">
                <Title order={4} mb="sm">
                  Stay Updated
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  Get the latest articles delivered to your inbox
                </Text>
                <Button variant="filled" size="sm" fullWidth>
                  Subscribe
                </Button>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Horizontal Tech Guides Section */}
        <Card withBorder p="lg" radius="md" mt="xl">
          <Title order={2} mb="md">
            <Group>
              <IconCode size={24} />
              Tech Guides
            </Group>
          </Title>
          <ScrollArea>
            <Group gap="lg" style={{ minWidth: 'max-content' }}>
              {[
                { title: 'React Best Practices', category: 'Frontend', readTime: '12 min', image: 'https://placehold.co/300x200' },
                { title: 'Node.js Security Guide', category: 'Backend', readTime: '8 min', image: 'https://placehold.co/300x200' },
                { title: 'TypeScript Advanced Patterns', category: 'Language', readTime: '15 min', image: 'https://placehold.co/300x200' },
                { title: 'Docker for Beginners', category: 'DevOps', readTime: '10 min', image: 'https://placehold.co/300x200' },
                { title: 'GraphQL vs REST', category: 'API', readTime: '6 min', image: 'https://placehold.co/300x200' },
              ].map((guide, index) => (
                <UnstyledButton
                  key={index}
                  onClick={() => navigate(`/articles/${index + 100}`)}
                  style={{ minWidth: 280 }}
                >
                  <Card withBorder p="md" radius="md" style={{ width: 280 }}>
                    <Card.Section>
                      <AspectRatio ratio={16/9}>
                        <Image src={guide.image} alt={guide.title} />
                      </AspectRatio>
                    </Card.Section>
                    <Stack spacing="xs" mt="sm">
                      <Badge size="xs" variant="light">{guide.category}</Badge>
                      <Text size="sm" fw={500} lineClamp={2}>{guide.title}</Text>
                      <Group spacing="xs">
                        <IconClock size={12} />
                        <Text size="xs" c="dimmed">{guide.readTime}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </UnstyledButton>
              ))}
            </Group>
          </ScrollArea>
        </Card>

        {/* Horizontal News Section */}
        <Card withBorder p="lg" radius="md" mt="lg">
          <Title order={2} mb="md">
            <Group>
              <IconNews size={24} />
              Latest News
            </Group>
          </Title>
          <ScrollArea>
            <Group gap="lg" style={{ minWidth: 'max-content' }}>
              {[
                { title: 'AI Breakthrough in Code Generation', category: 'AI/ML', time: '2 hours ago', image: 'https://placehold.co/300x200' },
                { title: 'New JavaScript Framework Released', category: 'Frontend', time: '4 hours ago', image: 'https://placehold.co/300x200' },
                { title: 'Cloud Computing Trends 2024', category: 'Cloud', time: '6 hours ago', image: 'https://placehold.co/300x200' },
                { title: 'Cybersecurity Alert Update', category: 'Security', time: '8 hours ago', image: 'https://placehold.co/300x200' },
                { title: 'Open Source Project Milestone', category: 'Community', time: '12 hours ago', image: 'https://placehold.co/300x200' },
              ].map((news, index) => (
                <UnstyledButton
                  key={index}
                  onClick={() => navigate(`/articles/${index + 200}`)}
                  style={{ minWidth: 280 }}
                >
                  <Card withBorder p="md" radius="md" style={{ width: 280 }}>
                    <Card.Section>
                      <AspectRatio ratio={16/9}>
                        <Image src={news.image} alt={news.title} />
                      </AspectRatio>
                    </Card.Section>
                    <Stack spacing="xs" mt="sm">
                      <Group justify="space-between">
                        <Badge size="xs" variant="light">{news.category}</Badge>
                        <Text size="xs" c="dimmed">{news.time}</Text>
                      </Group>
                      <Text size="sm" fw={500} lineClamp={2}>{news.title}</Text>
                    </Stack>
                  </Card>
                </UnstyledButton>
              ))}
            </Group>
          </ScrollArea>
        </Card>

        {/* Featured Stories Layout - Large Cards */}
        <Card withBorder p="md" radius="md" mt="lg">
          <Title order={2} mb="sm">
            <Group>
              <IconStar size={20} />
              Featured Stories
            </Group>
          </Title>
          <SimpleGrid cols={1} spacing="md">
            {[
              {
                title: 'The Future of Web Development: Trends to Watch in 2024',
                excerpt: 'Explore the cutting-edge technologies and frameworks that are shaping the future of web development, from AI-powered coding tools to revolutionary JavaScript frameworks.',
                author: 'Sarah Chen',
                date: '2024-01-15',
                category: 'Web Development',
                readTime: '8 min read',
                image: 'https://placehold.co/800x400',
                tags: ['JavaScript', 'AI', 'Frontend']
              },
              {
                title: 'Building Scalable Microservices: A Complete Guide',
                excerpt: 'Learn how to design, implement, and deploy microservices architecture that can handle millions of requests while maintaining performance and reliability.',
                author: 'Michael Rodriguez',
                date: '2024-01-12',
                category: 'Architecture',
                readTime: '12 min read',
                image: 'https://placehold.co/800x400',
                tags: ['Microservices', 'Docker', 'Kubernetes']
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
                  <UnstyledButton onClick={() => navigate(`/articles/${index + 300}`)} style={{ width: '100%', textAlign: 'left' }}>
                    <Card.Section>
                      <AspectRatio ratio={16/9}>
                        <Image src={story.image} alt={story.title} />
                      </AspectRatio>
                    </Card.Section>
                    <Stack p="md" spacing="sm">
                      <Group justify="space-between" align="flex-start">
                        <Badge size="xs" variant="light" color="blue">{story.category}</Badge>
                        <Text size="xs" c="dimmed">{story.readTime}</Text>
                      </Group>
                      <Title order={4} lineClamp={2}>{story.title}</Title>
                      <Text size="xs" c="dimmed" lineClamp={2}>{story.excerpt}</Text>
                      <Group gap="xs">
                        {story.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} size="xs" variant="outline">{tag}</Badge>
                        ))}
                      </Group>
                      <Group justify="space-between">
                        <Group spacing="xs">
                          <Avatar size="xs" radius="xl" />
                          <div>
                            <Text size="xs" fw={500}>{story.author}</Text>
                            <Text size="xs" c="dimmed">{story.date}</Text>
                          </div>
                        </Group>
                        <IconArrowRight size={14} />
                      </Group>
                    </Stack>
                  </UnstyledButton>
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        </Card>

        {/* Trending Topics - Horizontal Scroll */}
        <Card withBorder p="md" radius="md" mt="lg">
          <Title order={2} mb="sm">
            <Group>
              <IconFlame size={20} />
              Trending Topics
            </Group>
          </Title>
          <ScrollArea>
            <Group gap="md" style={{ minWidth: 'max-content' }}>
              {[
                { title: 'React 19 Features', count: '42 articles', color: 'cyan' },
                { title: 'AI Integration', count: '38 articles', color: 'grape' },
                { title: 'Cloud Native', count: '31 articles', color: 'blue' },
                { title: 'DevOps Best Practices', count: '28 articles', color: 'green' },
                { title: 'TypeScript Tips', count: '25 articles', color: 'orange' },
                { title: 'Security Updates', count: '22 articles', color: 'red' },
                { title: 'Performance Optimization', count: '19 articles', color: 'yellow' },
                { title: 'Mobile Development', count: '17 articles', color: 'pink' }
              ].map((topic, index) => (
                <UnstyledButton
                  key={index}
                  onClick={() => setSelectedCategory(topic.title)}
                  style={{ minWidth: 160 }}
                >
                  <Card withBorder p="md" radius="md" style={{ width: 160, minHeight: 100 }}>
                    <Stack spacing="xs" align="center" justify="center" style={{ height: '100%' }}>
                      <ThemeIcon size={32} color={topic.color} variant="light">
                        <IconHash size={16} />
                      </ThemeIcon>
                      <Text size="xs" fw={500} ta="center">{topic.title}</Text>
                      <Text size="xs" c="dimmed">{topic.count}</Text>
                    </Stack>
                  </Card>
                </UnstyledButton>
              ))}
            </Group>
          </ScrollArea>
        </Card>

        {/* Editor's Picks - Grid Layout */}
        <Card withBorder p="md" radius="md" mt="lg">
          <Title order={2} mb="sm">
            <Group>
              <IconAward size={20} />
              Editor's Picks
            </Group>
          </Title>
          <SimpleGrid cols={3} spacing="sm">
            {[
              {
                title: 'Understanding WebAssembly',
                excerpt: 'A deep dive into the technology that\'s changing web performance.',
                category: 'Technology',
                readTime: '6 min',
                rating: 4.8
              },
              {
                title: 'CSS Grid vs Flexbox',
                excerpt: 'When to use each layout system and how they work together.',
                category: 'CSS',
                readTime: '4 min',
                rating: 4.6
              },
              {
                title: 'Node.js Best Practices',
                excerpt: 'Essential patterns and tips for building robust applications.',
                category: 'Backend',
                readTime: '8 min',
                rating: 4.9
              },
              {
                title: 'GraphQL Fundamentals',
                excerpt: 'Getting started with GraphQL and building efficient APIs.',
                category: 'API',
                readTime: '7 min',
                rating: 4.7
              },
              {
                title: 'Vue 3 Composition API',
                excerpt: 'Mastering the new way of building Vue applications.',
                category: 'Frontend',
                readTime: '5 min',
                rating: 4.5
              },
              {
                title: 'Python for Data Science',
                excerpt: 'Essential libraries and techniques for data analysis.',
                category: 'Python',
                readTime: '10 min',
                rating: 4.8
              }
            ].map((pick, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <UnstyledButton onClick={() => navigate(`/articles/${index + 400}`)} style={{ width: '100%', textAlign: 'left' }}>
                  <Card withBorder p="sm" radius="md" h="100%">
                    <Stack spacing="xs" h="100%">
                      <Group justify="space-between">
                        <Badge size="xs" variant="dot">{pick.category}</Badge>
                        <Group gap={2}>
                          <IconStar size={10} color="yellow" />
                          <Text size="xs" c="dimmed">{pick.rating}</Text>
                        </Group>
                      </Group>
                      <Text size="xs" fw={500} lineClamp={2}>{pick.title}</Text>
                      <Text size="xs" c="dimmed" lineClamp={2}>{pick.excerpt}</Text>
                      <Group spacing="xs" mt="auto">
                        <IconClock size={8} />
                        <Text size="xs" c="dimmed">{pick.readTime}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </UnstyledButton>
              </motion.div>
            ))}
          </SimpleGrid>
        </Card>

        {/* Category Highlights - Mixed Layout */}
        <Card withBorder p="md" radius="md" mt="lg">
          <Title order={2} mb="sm">
            <Group>
              <IconFolder size={20} />
              Category Highlights
            </Group>
          </Title>
          <Stack spacing="md">
            {[
              {
                category: 'Frontend Development',
                icon: <IconCode size={16} />,
                color: 'blue',
                articles: [
                  { title: 'Advanced React Patterns', author: 'John Doe', date: '2024-01-10' },
                  { title: 'CSS Animation Techniques', author: 'Jane Smith', date: '2024-01-08' },
                  { title: 'State Management Comparison', author: 'Mike Johnson', date: '2024-01-05' }
                ]
              },
              {
                category: 'Backend Development',
                icon: <IconDatabase size={16} />,
                color: 'green',
                articles: [
                  { title: 'Database Design Principles', author: 'Sarah Lee', date: '2024-01-12' },
                  { title: 'API Security Best Practices', author: 'Tom Wilson', date: '2024-01-09' },
                  { title: 'Microservices Architecture', author: 'Chris Brown', date: '2024-01-07' }
                ]
              },
              {
                category: 'DevOps & Cloud',
                icon: <IconCloud size={16} />,
                color: 'orange',
                articles: [
                  { title: 'Kubernetes Deployment Guide', author: 'Alex Chen', date: '2024-01-11' },
                  { title: 'CI/CD Pipeline Setup', author: 'Lisa Wang', date: '2024-01-06' },
                  { title: 'Cloud Cost Optimization', author: 'David Kim', date: '2024-01-04' }
                ]
              }
            ].map((category, index) => (
              <Card key={index} withBorder p="sm" radius="md">
                <Group mb="xs">
                  <ThemeIcon size={28} color={category.color} variant="light">
                    {category.icon}
                  </ThemeIcon>
                  <Title order={5}>{category.category}</Title>
                  <Badge size="xs" variant="outline">{category.articles.length} articles</Badge>
                </Group>
                <List spacing="xs" size="xs">
                  {category.articles.map((article, articleIndex) => (
                    <List.Item key={articleIndex}>
                      <UnstyledButton onClick={() => navigate(`/articles/${index * 100 + articleIndex + 500}`)}>
                        <Group justify="space-between">
                          <Text size="xs" fw={500}>{article.title}</Text>
                          <Group spacing="xs">
                            <Text size="xs" c="dimmed">{article.author}</Text>
                            <Text size="xs" c="dimmed">•</Text>
                            <Text size="xs" c="dimmed">{article.date}</Text>
                          </Group>
                        </Group>
                      </UnstyledButton>
                    </List.Item>
                  ))}
                </List>
              </Card>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
