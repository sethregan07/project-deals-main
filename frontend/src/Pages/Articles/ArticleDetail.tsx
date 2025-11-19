import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Text, Loader, Alert, Button, Group, Badge, Breadcrumbs, Anchor, Container, AspectRatio, Title, Table, List, Blockquote, Divider } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconUser, IconStar, IconCheck, IconX } from '@tabler/icons-react';

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

// Enhanced content renderer using Mantine components
function renderArticleContent(content: string) {
  const sections = content.split('\n\n');
  const elements: JSX.Element[] = [];

  sections.forEach((section, index) => {
    const trimmed = section.trim();

    // Headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <Title key={index} order={1} size="2.5rem" mb="lg" className="font-bold text-gray-900">
          {trimmed.substring(2)}
        </Title>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <Title key={index} order={2} size="2rem" mb="md" mt="xl" className="font-bold text-gray-800">
          {trimmed.substring(3)}
        </Title>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <Title key={index} order={3} size="1.5rem" mb="md" mt="lg" className="font-semibold text-gray-800">
          {trimmed.substring(4)}
        </Title>
      );
    }
    // Images
    else if (trimmed.startsWith('![')) {
      const match = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        elements.push(
          <AspectRatio key={index} ratio={16/9} mb="lg">
            <img
              src={match[2]}
              alt={match[1]}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </AspectRatio>
        );
      }
    }
    // Tables
    else if (trimmed.includes('|') && trimmed.split('\n').length > 1) {
      const rows = trimmed.split('\n').filter(row => row.trim());
      if (rows.length >= 2) {
        const headers = rows[0].split('|').slice(1, -1).map(h => h.trim());
        const dataRows = rows.slice(1).map(row =>
          row.split('|').slice(1, -1).map(cell => cell.trim())
        );

        elements.push(
          <Table key={index} striped highlightOnHover withTableBorder mb="lg">
            <Table.Thead>
              <Table.Tr>
                {headers.map((header, i) => (
                  <Table.Th key={i} className="font-semibold">{header}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dataRows.map((row, i) => (
                <Table.Tr key={i}>
                  {row.map((cell, j) => (
                    <Table.Td key={j}>{cell}</Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        );
      }
    }
    // Lists
    else if (trimmed.includes('\n* ') || trimmed.includes('\n1. ')) {
      const items = trimmed.split('\n').filter(line => line.trim().startsWith('* ') || /^\d+\./.test(line.trim()));
      elements.push(
        <List key={index} mb="lg" spacing="sm">
          {items.map((item, i) => {
            const cleanItem = item.replace(/^\* |\d+\. /, '');
            return (
              <List.Item key={i} className="text-lg leading-8">
                {cleanItem}
              </List.Item>
            );
          })}
        </List>
      );
    }
    // Rating lines
    else if (trimmed.includes('Rating:') && trimmed.includes('/5')) {
      const parts = trimmed.split('|');
      elements.push(
        <Group key={index} mb="md" align="center">
          <Badge size="lg" color="yellow" variant="light" leftSection={<IconStar size={14} />}>
            {parts[0].trim()}
          </Badge>
          {parts[1] && (
            <Badge size="lg" color="blue" variant="light">
              {parts[1].trim()}
            </Badge>
          )}
        </Group>
      );
    }
    // Pros/Cons sections
    else if (trimmed.startsWith('**Pros:**')) {
      const pros = trimmed.replace('**Pros:**', '').split(',').map(p => p.trim());
      elements.push(
        <div key={index} className="mb-6">
          <Text size="lg" fw={600} c="green" mb="sm">Pros:</Text>
          <List spacing="xs">
            {pros.map((pro, i) => (
              <List.Item key={i} icon={<IconCheck size={16} color="green" />}>
                {pro}
              </List.Item>
            ))}
          </List>
        </div>
      );
    } else if (trimmed.startsWith('**Cons:**')) {
      const cons = trimmed.replace('**Cons:**', '').split(',').map(c => c.trim());
      elements.push(
        <div key={index} className="mb-6">
          <Text size="lg" fw={600} c="red" mb="sm">Cons:</Text>
          <List spacing="xs">
            {cons.map((con, i) => (
              <List.Item key={i} icon={<IconX size={16} color="red" />}>
                {con}
              </List.Item>
            ))}
          </List>
        </div>
      );
    }
    // Blockquotes
    else if (trimmed.startsWith('>')) {
      elements.push(
        <Blockquote key={index} mb="lg" className="border-l-4 border-blue-500 pl-4 italic">
          {trimmed.substring(1).trim()}
        </Blockquote>
      );
    }
    // Regular paragraphs
    else if (trimmed) {
      elements.push(
        <Text key={index} size="lg" mb="lg" className="leading-8 text-gray-800">
          {trimmed}
        </Text>
      );
    }
  });

  return elements;
}

function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3002/articles/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const items = [
    { title: 'Articles', href: '/articles' },
    { title: article?.title || 'Loading...', href: '#' },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="xl" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-40 mt-10">
        <Alert color="red" title="Error">
          {error || 'Article not found'}
        </Alert>
        <Group mt="md">
          <Button component={Link} to="/articles" leftSection={<IconArrowLeft size={16} />}>
            Back to Articles
          </Button>
        </Group>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="lg" py="xl">
        <Breadcrumbs mb="xl">{items}</Breadcrumbs>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-8">
              {article.category && (
                <Badge
                  size="md"
                  variant="light"
                  color="blue"
                  mb="lg"
                  className="uppercase tracking-wide font-semibold"
                >
                  {article.category}
                </Badge>
              )}

              <Title
                order={1}
                size="2.5rem"
                mb="lg"
                className="leading-tight font-bold text-gray-900"
              >
                {article.title}
              </Title>

              <Group gap="xl" mb="xl" className="text-gray-600">
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm" fw={500}>
                    {article.author || 'Anonymous'}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text size="sm">
                    {new Date(article.published_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Group>
              </Group>
            </div>

            {/* Article Image */}
            {article.image_url && (
              <AspectRatio ratio={16/9} mb="xl">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </AspectRatio>
            )}

            {/* Article Content */}
            <div className="max-w-none">
              {renderArticleContent(article.content)}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Group justify="space-between">
                <Button
                  component={Link}
                  to="/articles"
                  variant="light"
                  leftSection={<IconArrowLeft size={16} />}
                >
                  Back to Articles
                </Button>
                <Group>
                  <Button variant="outline" color="gray">
                    Share Article
                  </Button>
                  <Button variant="outline" color="gray">
                    Save for Later
                  </Button>
                </Group>
              </Group>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Article Meta */}
              <Card withBorder shadow="sm" p="lg" mb="lg">
                <Title order={4} size="1rem" mb="md" className="uppercase tracking-wide text-gray-600">
                  Article Info
                </Title>
                <div className="space-y-3">
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Published
                    </Text>
                    <Text size="sm" fw={500}>
                      {new Date(article.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Author
                    </Text>
                    <Text size="sm" fw={500}>
                      {article.author || 'Anonymous'}
                    </Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" className="uppercase tracking-wide">
                      Category
                    </Text>
                    <Text size="sm" fw={500}>
                      {article.category || 'General'}
                    </Text>
                  </div>
                </div>
              </Card>

              {/* Related Articles Placeholder */}
              <Card withBorder shadow="sm" p="lg">
                <Title order={4} size="1rem" mb="md" className="uppercase tracking-wide text-gray-600">
                  Related Articles
                </Title>
                <Text size="sm" c="dimmed">
                  More articles in {article.category || 'this category'} coming soon...
                </Text>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ArticleDetail;