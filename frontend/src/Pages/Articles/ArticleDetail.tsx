// src/Pages/Articles/ArticleDetail.tsx
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  Button,
  Stack,
  AspectRatio,
  Sheet,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Table,
} from '@mui/joy';
import {
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconStar,
  IconCheck,
  IconX,
  IconListSearch,
} from '@tabler/icons-react';

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
}

type Heading = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

// fallback content if article.content is empty
const defaultContent = `
# Game Changing Virtual Reality Console Technology To Serve The Community

Virtual reality (VR) is no longer just a playground for hardcore gamers. It's becoming a **shared space** for learning, collaboration, and social impact.

## Why This VR Console Is Different

Unlike traditional consoles that focus purely on entertainment, this platform was designed with *community* at its core:

* Local organizations can host virtual events for free
* Students can join immersive classrooms with low-cost hardware
* Remote teams can co-work in virtual offices without expensive tools

> “When people feel present together, even in a virtual space, collaboration becomes natural again.”

### Core Features

1. **Ultra-low latency streaming**
2. **Hand and eye tracking for natural interaction**
3. **Open SDK for community developers**
4. **Built-in accessibility options**

## Real-World Use Cases

### 1. Education & Training

Schools are using VR to:

* Take students on historical field trips
* Simulate labs that are too dangerous or expensive in real life
* Offer personalized learning environments

### 2. Healthcare & Therapy

Clinics are starting to experiment with:

* Guided meditation spaces
* Exposure therapy simulations
* Group support environments

### Pros & Cons Snapshot

**Pros:** Accessible pricing, Strong developer ecosystem, Community-focused features, Cross-platform support  
**Cons:** Requires stable internet, Hardware still not universal, Learning curve for new users

## Quick Comparison Table

| Feature               | This VR Console | Traditional Console |
|----------------------|-----------------|---------------------|
| Focus                | Community & Ed  | Entertainment       |
| Open SDK             | Yes             | Limited             |
| Cross-Device Support | High            | Medium              |
| Accessibility        | Built-in        | Varies              |

## Getting Started

To get started, you only need:

* A mid-range headset (or desktop client)
* Stable internet connection
* A free account to access community spaces

> “Technology should reduce distance, not increase it. This console is a step in that direction.”

### Final Thoughts

The real promise of VR isn't just better graphics — it's **better connection**.  
Used wisely, this console could turn virtual spaces into truly **shared public squares** for everyone.
`;

// slug helper
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// build content + headings
function buildArticleContent(content: string): {
  nodes: React.ReactNode[];
  headings: Heading[];
} {
  const sections = content.split('\n\n');
  const nodes: React.ReactNode[] = [];
  const headings: Heading[] = [];

  sections.forEach((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return;

    // headings
    if (trimmed.startsWith('# ')) {
      const text = trimmed.substring(2).trim();
      const id = slugify(text);
      headings.push({ id, text, level: 1 });
      nodes.push(
        <Typography
          key={index}
          id={id}
          level="h2"
          sx={{ fontSize: 32, fontWeight: 800, mb: 2, mt: 4 }}
        >
          {text}
        </Typography>,
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3).trim();
      const id = slugify(text);
      headings.push({ id, text, level: 2 });
      nodes.push(
        <Typography
          key={index}
          id={id}
          level="h3"
          sx={{ fontSize: 24, fontWeight: 700, mb: 1.5, mt: 3 }}
        >
          {text}
        </Typography>,
      );
      return;
    }
    if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4).trim();
      const id = slugify(text);
      headings.push({ id, text, level: 3 });
      nodes.push(
        <Typography
          key={index}
          id={id}
          level="h4"
          sx={{ fontSize: 20, fontWeight: 600, mb: 1, mt: 2.5 }}
        >
          {text}
        </Typography>,
      );
      return;
    }

    // image ![alt](url)
    if (trimmed.startsWith('![')) {
      const match = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        nodes.push(
          <AspectRatio
            key={index}
            ratio="16/9"
            sx={{ my: 3, borderRadius: 'lg', overflow: 'hidden' }}
          >
            <Box
              component="img"
              src={match[2]}
              alt={match[1]}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AspectRatio>,
        );
      }
      return;
    }

    // tables (simple markdown)
    if (trimmed.includes('|') && trimmed.split('\n').length > 1) {
      const rows = trimmed.split('\n').filter(r => r.trim());
      if (rows.length >= 2) {
        const headers = rows[0].split('|').slice(1, -1).map(h => h.trim());
        const dataRows = rows.slice(1).map(row =>
          row.split('|').slice(1, -1).map(cell => cell.trim()),
        );
        nodes.push(
          <Table
            key={index}
            size="sm"
            stickyHeader
            sx={{ my: 3, borderRadius: 'md', overflow: 'hidden' }}
          >
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>
                    <Typography level="body-sm" fontWeight={600}>
                      {h}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      <Typography level="body-sm">{cell}</Typography>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>,
        );
        return;
      }
    }

    // unordered / ordered lists
    if (trimmed.includes('\n* ') || trimmed.includes('\n1. ')) {
      const lines = trimmed
        .split('\n')
        .filter(
          l =>
            l.trim().startsWith('* ') ||
            /^\d+\./.test(l.trim()),
        );
      nodes.push(
        <List key={index} sx={{ my: 2, pl: 2 }}>
          {lines.map((line, i) => {
            const clean = line.replace(/^\* |\d+\. /, '');
            return (
              <ListItem key={i}>
                <Typography level="body-md">{clean}</Typography>
              </ListItem>
            );
          })}
        </List>,
      );
      return;
    }

    // rating: "Rating: 4.5/5 | text"
    if (trimmed.includes('Rating:') && trimmed.includes('/5')) {
      const parts = trimmed.split('|');
      nodes.push(
        <Stack
          key={index}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', my: 2 }}
        >
          <Chip
            size="sm"
            variant="soft"
            color="warning"
            startDecorator={<IconStar size={16} />}
          >
            {parts[0].trim()}
          </Chip>
          {parts[1] && (
            <Chip size="sm" variant="soft" color="primary">
              {parts[1].trim()}
            </Chip>
          )}
        </Stack>,
      );
      return;
    }

    // Pros / Cons
    if (trimmed.startsWith('**Pros:**')) {
      const pros = trimmed.replace('**Pros:**', '').split(',').map(p => p.trim());
      nodes.push(
        <Box key={index} sx={{ my: 3 }}>
          <Typography level="title-sm" color="success" sx={{ mb: 1 }}>
            Pros
          </Typography>
          <List sx={{ pl: 2 }}>
            {pros.map((pro, i) => (
              <ListItem
                key={i}
                startAction={<IconCheck size={16} color="green" />}
              >
                <Typography level="body-md">{pro}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>,
      );
      return;
    }

    if (trimmed.startsWith('**Cons:**')) {
      const cons = trimmed.replace('**Cons:**', '').split(',').map(c => c.trim());
      nodes.push(
        <Box key={index} sx={{ my: 3 }}>
          <Typography level="title-sm" color="danger" sx={{ mb: 1 }}>
            Cons
          </Typography>
          <List sx={{ pl: 2 }}>
            {cons.map((con, i) => (
              <ListItem
                key={i}
                startAction={<IconX size={16} color="red" />}
              >
                <Typography level="body-md">{con}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>,
      );
      return;
    }

    // blockquote
    if (trimmed.startsWith('>')) {
      nodes.push(
        <Sheet
          key={index}
          variant="soft"
          sx={{
            borderLeft: '4px solid',
            borderColor: 'primary.solidBg',
            pl: 2,
            py: 1,
            my: 3,
            fontStyle: 'italic',
          }}
        >
          <Typography level="body-md">
            {trimmed.substring(1).trim()}
          </Typography>
        </Sheet>,
      );
      return;
    }

    // paragraph
    nodes.push(
      <Typography
        key={index}
        level="body-lg"
        sx={{ mb: 2, lineHeight: 1.9, color: 'text.primary' }}
      >
        {trimmed}
      </Typography>,
    );
  });

  return { nodes, headings };
}

// Joy UI Table of Contents (Mantine style)
interface TableOfContentsJoyProps {
  headings: Heading[];
}

function TableOfContentsJoy({ headings }: TableOfContentsJoyProps) {
  const [active, setActive] = React.useState<string | null>(null);

  const handleClick = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
        <IconListSearch size={18} />
        <Typography level="title-sm">Table of contents</Typography>
      </Stack>
      <List sx={{ '--ListItem-paddingY': '4px' }}>
        {headings.map(h => (
          <ListItem
            key={h.id}
            onClick={() => handleClick(h.id)}
            sx={{
              pl:
                h.level === 1
                  ? 0
                  : h.level === 2
                  ? 1.5
                  : 3,
              cursor: 'pointer',
              '& .toc-link': {
                color: active === h.id ? 'primary.plainColor' : 'text.primary',
                fontWeight: active === h.id ? 600 : 400,
              },
              '&:hover .toc-link': {
                color: 'primary.plainColor',
              },
            }}
          >
            <Typography level="body-sm" className="toc-link">
              {h.text}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3002/articles/${id}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

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

  if (error || !article) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 2 }}>
        <Alert color="danger" variant="soft">
          {error || 'Article not found'}
        </Alert>
        <Button
          component={Link}
          to="/articles"
          startDecorator={<IconArrowLeft size={18} />}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Back to articles
        </Button>
      </Box>
    );
  }

  const contentToRender =
    article.content && article.content.trim().length > 0
      ? article.content
      : defaultContent;

  const { nodes, headings } = buildArticleContent(contentToRender);

  const breadcrumbs = [
    { label: 'Articles', href: '/articles' },
    { label: article.title, href: '#' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.body', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        {/* Breadcrumbs */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, fontSize: 12 }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={b.label}>
              {i > 0 && <Typography>/</Typography>}
              {b.href === '#' ? (
                <Typography color="neutral.plainColor">{b.label}</Typography>
              ) : (
                <Typography
                  component={Link}
                  to={b.href}
                  sx={{ textDecoration: 'none', color: 'primary.plainColor' }}
                >
                  {b.label}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Stack>

        <Grid container spacing={3}>
          {/* Main content */}
          <Grid xs={12} md={8.5}>
            <Card
              variant="outlined"
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 'lg',
              }}
            >
              {/* category */}
              {article.category && (
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 2 }}
                >
                  {article.category}
                </Chip>
              )}

              {/* title */}
              <Typography
                level="h1"
                sx={{
                  fontSize: { xs: 28, md: 34 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                {article.title}
              </Typography>

              {/* meta */}
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  flexWrap: 'wrap',
                  color: 'text.secondary',
                  mb: 3,
                  fontSize: 13,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUser size={16} />
                  <Typography level="body-sm">
                    {article.author || 'Anonymous'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconCalendar size={16} />
                  <Typography level="body-sm">
                    {new Date(article.published_date).toLocaleDateString(
                      'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' },
                    )}
                  </Typography>
                </Stack>
              </Stack>

              {/* hero image */}
              {article.image_url && (
                <AspectRatio
                  ratio="16/9"
                  sx={{ mb: 3, borderRadius: 'lg', overflow: 'hidden' }}
                >
                  <Box
                    component="img"
                    src={article.image_url}
                    alt={article.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AspectRatio>
              )}

              {/* article content */}
              <Box sx={{ mt: 1 }}>{nodes}</Box>

              {/* footer actions */}
              <Divider sx={{ mt: 4, mb: 2 }} />
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Button
                  component={Link}
                  to="/articles"
                  variant="outlined"
                  startDecorator={<IconArrowLeft size={18} />}
                >
                  Back to articles
                </Button>
                <Stack direction="row" spacing={1}>
                  <Button variant="soft" color="neutral">
                    Share article
                  </Button>
                  <Button variant="soft" color="neutral">
                    Save for later
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* sidebar with TOC + info */}
          <Grid xs={12} md={3.5}>
            <Stack
              spacing={2}
              sx={{ position: { md: 'sticky' }, top: { md: 24 } }}
            >
              {/* Table of contents */}
              {headings.length > 0 && (
                <Card variant="outlined" sx={{ borderRadius: 'lg' }}>
                  <TableOfContentsJoy headings={headings} />
                </Card>
              )}

              {/* Article info card */}
              <Card variant="soft">
                <Typography
                  level="title-sm"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.7,
                    mb: 1,
                  }}
                >
                  Article info
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Published
                    </Typography>
                    <Typography level="body-sm" fontWeight={500}>
                      {new Date(article.published_date).toLocaleDateString(
                        'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' },
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Author
                    </Typography>
                    <Typography level="body-sm" fontWeight={500}>
                      {article.author || 'Anonymous'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography level="body-xs" color="neutral">
                      Category
                    </Typography>
                    <Typography level="body-sm" fontWeight={500}>
                      {article.category || 'General'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              {/* placeholder related */}
              <Card variant="outlined">
                <Typography
                  level="title-sm"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.7,
                    mb: 1,
                  }}
                >
                  Related articles
                </Typography>
                <Typography level="body-sm" color="neutral">
                  More articles in {article.category || 'this category'} coming
                  soon...
                </Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ArticleDetail;
