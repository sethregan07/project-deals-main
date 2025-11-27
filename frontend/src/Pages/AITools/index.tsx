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
  Grid,
  Divider,
  List,
  ThemeIcon,
  Box,
  Anchor,
  Stack,
  Table,
  Progress,
  Rating
} from '@mantine/core';
import { motion } from 'framer-motion';
import { 
  IconCheck, 
  IconStar, 
  IconExternalLink, 
  IconBrain, 
  IconRobot, 
  IconCode,
  IconWriting,
  IconPalette,
  IconChartBar,
  IconMicrophone,
  IconVideo,
  IconSearch
} from '@tabler/icons-react';

interface AITool {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  pricing: string;
  free_tier_available: boolean;
  key_features: string[];
  pros: string[];
  cons: string[];
  best_for: string;
  editor_rating: number;
  ease_of_use: number;
  value_for_money: number;
  customer_support: number;
  website_url: string;
  image_url?: string;
}

const aiToolsData: AITool[] = [
  {
    id: 1,
    name: "ChatGPT",
    category: "AI Assistant",
    description: "Advanced conversational AI that can help with writing, coding, analysis, and creative tasks. Powered by GPT-4, it offers natural language understanding and generation capabilities.",
    rating: 4.8,
    pricing: "$20/month",
    free_tier_available: true,
    key_features: [
      "Natural conversation and Q&A",
      "Code generation and debugging",
      "Writing assistance and editing",
      "Math and reasoning capabilities",
      "Image analysis with GPT-4V"
    ],
    pros: [
      "Extremely versatile and capable",
      "Large knowledge base",
      "Excellent natural language understanding",
      "Regular updates and improvements",
      "Strong coding abilities"
    ],
    cons: [
      "Can sometimes generate incorrect information",
      "Subscription required for GPT-4",
      "Limited internet access in free version"
    ],
    best_for: "General purpose AI assistance, content creation, coding help",
    editor_rating: 4.9,
    ease_of_use: 4.8,
    value_for_money: 4.5,
    customer_support: 4.2,
    website_url: "https://chat.openai.com",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 2,
    name: "Claude",
    category: "AI Assistant",
    description: "Constitutional AI assistant focused on being helpful, harmless, and honest. Excels at long-form content, analysis, and complex reasoning tasks.",
    rating: 4.7,
    pricing: "$20/month",
    free_tier_available: true,
    key_features: [
      "Large context window (100K tokens)",
      "Constitutional AI principles",
      "Excellent for long documents",
      "Strong analytical capabilities",
      "Lower hallucination rate"
    ],
    pros: [
      "Very large context window",
      "More accurate than competitors",
      "Excellent for document analysis",
      "Strong ethical guidelines",
      "Great for academic work"
    ],
    cons: [
      "Less creative than ChatGPT",
      "Slower response times",
      "Limited tool integrations",
      "Newer platform with fewer features"
    ],
    best_for: "Academic research, document analysis, long-form content",
    editor_rating: 4.8,
    ease_of_use: 4.6,
    value_for_money: 4.6,
    customer_support: 4.3,
    website_url: "https://claude.ai",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 3,
    name: "Midjourney",
    category: "AI Image Generation",
    description: "Powerful AI image generator that creates stunning, artistic images from text descriptions. Known for high-quality artistic outputs and unique style.",
    rating: 4.6,
    pricing: "$10-$60/month",
    free_tier_available: false,
    key_features: [
      "High-quality artistic images",
      "Multiple style variations",
      "Image upscaling capabilities",
      "Community gallery",
      "Custom style training"
    ],
    pros: [
      "Exceptional image quality",
      "Artistic and unique outputs",
      "Strong community features",
      "Regular style updates",
      "Consistent high results"
    ],
    cons: [
      "No free tier available",
      "Discord-based interface",
      "Limited text-to-image control",
      "Can be expensive"
    ],
    best_for: "Artists, designers, creative professionals",
    editor_rating: 4.7,
    ease_of_use: 4.2,
    value_for_money: 4.0,
    customer_support: 4.1,
    website_url: "https://www.midjourney.com",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 4,
    name: "DALL-E 3",
    category: "AI Image Generation",
    description: "OpenAI's advanced image generation model integrated with ChatGPT. Creates detailed, accurate images from natural language descriptions.",
    rating: 4.5,
    pricing: "Included with ChatGPT Plus",
    free_tier_available: false,
    key_features: [
      "Natural language image generation",
      "Integration with ChatGPT",
      "High accuracy to prompts",
      "Commercial use rights",
      "Style variation capabilities"
    ],
    pros: [
      "Excellent prompt adherence",
      "Integrated with ChatGPT",
      "Commercial usage rights",
      "Natural language interface",
      "Consistent quality"
    ],
    cons: [
      "Requires ChatGPT subscription",
      "Limited artistic style options",
      "Slower generation than competitors",
      "Fewer customization options"
    ],
    best_for: "Content creators, marketers, ChatGPT users",
    editor_rating: 4.6,
    ease_of_use: 4.7,
    value_for_money: 4.3,
    customer_support: 4.4,
    website_url: "https://openai.com/dall-e-3",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 5,
    name: "GitHub Copilot",
    category: "AI Coding Assistant",
    description: "AI-powered code completion tool that helps developers write code faster. Integrates directly into IDEs and provides context-aware suggestions.",
    rating: 4.7,
    pricing: "$10/month",
    free_tier_available: true,
    key_features: [
      "Real-time code completion",
      "Multi-language support",
      "IDE integration",
      "Code explanation features",
      "Context-aware suggestions"
    ],
    pros: [
      "Excellent IDE integration",
      "High-quality code suggestions",
      "Supports many languages",
      "Improves productivity significantly",
      "Regular updates"
    ],
    cons: [
      "Subscription required for full features",
      "Can suggest incorrect code",
      "Privacy concerns with code",
      "Requires internet connection"
    ],
    best_for: "Developers, programmers, coding students",
    editor_rating: 4.8,
    ease_of_use: 4.5,
    value_for_money: 4.6,
    customer_support: 4.5,
    website_url: "https://github.com/features/copilot",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 6,
    name: "Jasper AI",
    category: "AI Writing Assistant",
    description: "Professional AI writing platform focused on marketing and business content. Offers templates for various content types and brand voice customization.",
    rating: 4.4,
    pricing: "$39-$125/month",
    free_tier_available: false,
    key_features: [
      "Marketing-focused templates",
      "Brand voice customization",
      "SEO optimization",
      "Content calendar planning",
      "Team collaboration features"
    ],
    pros: [
      "Excellent for marketing content",
      "Brand voice consistency",
      "SEO optimization features",
      "Professional templates",
      "Team collaboration tools"
    ],
    cons: [
      "Expensive pricing",
      "Limited free features",
      "Focused mainly on marketing",
      "Learning curve for advanced features"
    ],
    best_for: "Marketing teams, content creators, businesses",
    editor_rating: 4.5,
    ease_of_use: 4.3,
    value_for_money: 3.8,
    customer_support: 4.6,
    website_url: "https://www.jasper.ai",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 7,
    name: "Canva AI",
    category: "AI Design Assistant",
    description: "AI-powered design platform that makes graphic design accessible to everyone. Features AI text-to-image generation and automatic design suggestions.",
    rating: 4.5,
    pricing: "$15-$30/month",
    free_tier_available: true,
    key_features: [
      "Text-to-image generation",
      "Automatic design suggestions",
      "Brand kit integration",
      "Template library",
      "Magic design features"
    ],
    pros: [
      "Very user-friendly interface",
      "Large template library",
      "Good free tier",
      "Brand consistency tools",
      "Excellent for non-designers"
    ],
    cons: [
      "Limited advanced features",
      "Not suitable for professional designers",
      "AI features require subscription",
      "Less creative control"
    ],
    best_for: "Small businesses, non-designers, social media managers",
    editor_rating: 4.6,
    ease_of_use: 4.9,
    value_for_money: 4.4,
    customer_support: 4.5,
    website_url: "https://www.canva.com",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 8,
    name: "Grammarly",
    category: "AI Writing Assistant",
    description: "AI-powered writing assistant that helps improve grammar, style, and tone. Offers real-time suggestions and plagiarism detection.",
    rating: 4.6,
    pricing: "$12-$15/month",
    free_tier_available: true,
    key_features: [
      "Real-time grammar checking",
      "Style and tone suggestions",
      "Plagiarism detection",
      "Writing clarity improvements",
      "Browser and app integration"
    ],
    pros: [
      "Excellent grammar checking",
      "Wide application support",
      "Good free tier",
      "Improves writing quality",
      "Tone adjustment features"
    ],
    cons: [
      "Premium features expensive",
      "Can be overly aggressive",
      "Limited creative writing help",
      "Privacy concerns"
    ],
    best_for: "Students, professionals, content writers",
    editor_rating: 4.7,
    ease_of_use: 4.8,
    value_for_money: 4.2,
    customer_support: 4.4,
    website_url: "https://www.grammarly.com",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 9,
    name: "Notion AI",
    category: "AI Productivity Assistant",
    description: "AI assistant integrated into Notion workspace. Helps with writing, summarizing, brainstorming, and organizing information.",
    rating: 4.3,
    pricing: "$10/month add-on",
    free_tier_available: false,
    key_features: [
      "Workspace integration",
      "Content summarization",
      "Brainstorming assistance",
      "Task automation",
      "Knowledge base enhancement"
    ],
    pros: [
      "Seamless Notion integration",
      "Great for team collaboration",
      "Improves productivity",
      "Multiple AI functions",
      "Well-designed interface"
    ],
    cons: [
      "Requires Notion subscription",
      "Limited standalone use",
      "Can be slow at times",
      "Expensive add-on pricing"
    ],
    best_for: "Notion users, teams, project managers",
    editor_rating: 4.4,
    ease_of_use: 4.5,
    value_for_money: 3.9,
    customer_support: 4.3,
    website_url: "https://www.notion.so/product/ai",
    image_url: "/api/placeholder/64/64"
  },
  {
    id: 10,
    name: "Runway ML",
    category: "AI Video Generation",
    description: "Advanced AI platform for video creation and editing. Features text-to-video generation and AI-powered video editing tools.",
    rating: 4.2,
    pricing: "$12-$76/month",
    free_tier_available: true,
    key_features: [
      "Text-to-video generation",
      "AI video editing",
      "Green screen removal",
      "Motion tracking",
      "Video upscaling"
    ],
    pros: [
      "Innovative video AI features",
      "Good free tier",
      "Professional video tools",
      "Regular feature updates",
      "Creative possibilities"
    ],
    cons: [
      "Steep learning curve",
      "Can be expensive",
      "Limited video length",
      "Requires powerful hardware"
    ],
    best_for: "Video creators, filmmakers, marketing teams",
    editor_rating: 4.3,
    ease_of_use: 3.8,
    value_for_money: 4.0,
    customer_support: 4.2,
    website_url: "https://runwayml.com",
    image_url: "/api/placeholder/64/64"
  }
];

export default function AITools() {
  const [expandedTool, setExpandedTool] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All AI Tools', icon: <IconBrain size={16} /> },
    { id: 'ai-assistant', name: 'AI Assistants', icon: <IconRobot size={16} /> },
    { id: 'ai-image-generation', name: 'AI Image Generation', icon: <IconPalette size={16} /> },
    { id: 'ai-coding-assistant', name: 'AI Coding', icon: <IconCode size={16} /> },
    { id: 'ai-writing-assistant', name: 'AI Writing', icon: <IconWriting size={16} /> },
    { id: 'ai-design-assistant', name: 'AI Design', icon: <IconPalette size={16} /> },
    { id: 'ai-productivity-assistant', name: 'AI Productivity', icon: <IconChartBar size={16} /> },
    { id: 'ai-video-generation', name: 'AI Video', icon: <IconVideo size={16} /> }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? aiToolsData 
    : aiToolsData.filter(tool => tool.category === categories.find(cat => cat.id === selectedCategory)?.name);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.icon || <IconBrain size={16} />;
  };

  const RatingBar = ({ value, max = 5, label }: { value: number; max?: number; label: string }) => (
    <Group justify="space-between" mb={8}>
      <Text size="sm" c="dimmed">{label}</Text>
      <Group gap={4}>
        {[...Array(max)].map((_, i) => (
          <IconStar
            key={i}
            size={12}
            fill={i < value ? '#fbbf24' : 'none'}
            color={i < value ? '#fbbf24' : '#d1d5db'}
          />
        ))}
        <Text size="sm" fw={600}>{value.toFixed(1)}</Text>
      </Group>
    </Group>
  );

  const ComparisonCard = ({ tool, isExpanded }: { tool: AITool; isExpanded: boolean }) => (
    <Card shadow="sm" radius="md" withBorder style={{ marginBottom: isExpanded ? 24 : 16 }}>
      {/* Main comparison row */}
      <div style={{ padding: '20px 0' }}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Avatar
                size={48}
                radius="md"
                src={tool.image_url}
                alt={tool.name}
              />
              <div style={{ flex: 1 }}>
                <Group gap={4} mb={8}>
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      size={14}
                      fill={i < Math.floor(tool.rating) ? '#fbbf24' : 'none'}
                      color={i < Math.floor(tool.rating) ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                  <Text size="sm" c="dimmed">{tool.rating}</Text>
                </Group>
                <Title order={4} mb={4}>{tool.name}</Title>
                <Badge variant="light" color="blue" size="sm">
                  {tool.category}
                </Badge>
              </div>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">Pricing</Text>
            <Text fw={600} size="lg">{tool.pricing}</Text>
            {tool.free_tier_available && (
              <Badge variant="light" color="green" size="sm" mt={4}>
                Free Tier
              </Badge>
            )}
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Text size="sm" c="dimmed">Editor Rating</Text>
            <Group gap={4}>
              {[...Array(5)].map((_, i) => (
                <IconStar
                  key={i}
                  size={14}
                  fill={i < Math.floor(tool.editor_rating) ? '#fbbf24' : 'none'}
                  color={i < Math.floor(tool.editor_rating) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
              <Text fw={600}>{tool.editor_rating}</Text>
            </Group>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text size="sm" c="dimmed">Best For</Text>
            <Text fw={600} size="sm">{tool.best_for}</Text>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Button
              variant="light"
              color="blue"
              fullWidth
              rightSection={<IconExternalLink size={14} />}
              onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
            >
              {isExpanded ? 'Show Less' : 'Compare'}
            </Button>
          </Grid.Col>
        </Grid>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap={24}>
                {/* Description */}
                <div>
                  <Title order={4} mb={12}>Overview</Title>
                  <Text style={{ lineHeight: 1.6 }}>
                    {tool.description}
                  </Text>
                </div>

                {/* Key Features */}
                <div>
                  <Title order={4} mb={12}>Key Features</Title>
                  <List spacing={8}>
                    {tool.key_features.map((feature, index) => (
                      <List.Item
                        key={index}
                        icon={<ThemeIcon color="green" size={20} radius="xl"><IconCheck size={12} /></ThemeIcon>}
                      >
                        {feature}
                      </List.Item>
                    ))}
                  </List>
                </div>

                {/* Pros & Cons */}
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={4} mb={12}>Pros</Title>
                    <List spacing={8}>
                      {tool.pros.map((pro, index) => (
                        <List.Item
                          key={index}
                          icon={<ThemeIcon color="green" size={20} radius="xl"><IconCheck size={12} /></ThemeIcon>}
                        >
                          {pro}
                        </List.Item>
                      ))}
                    </List>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Title order={4} mb={12}>Cons</Title>
                    <List spacing={8}>
                      {tool.cons.map((con, index) => (
                        <List.Item
                          key={index}
                          icon={<ThemeIcon color="red" size={20} radius="xl">✗</ThemeIcon>}
                        >
                          {con}
                        </List.Item>
                      ))}
                    </List>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap={24}>
                {/* Rating Breakdown */}
                <Card p="lg" withBorder style={{ backgroundColor: '#f8fafc' }}>
                  <Title order={5} mb={16}>Rating Breakdown</Title>
                  <Stack gap={8}>
                    <RatingBar value={tool.editor_rating} label="Overall" />
                    <RatingBar value={tool.ease_of_use} label="Ease of Use" />
                    <RatingBar value={tool.value_for_money} label="Value for Money" />
                    <RatingBar value={tool.customer_support} label="Customer Support" />
                  </Stack>
                </Card>

                {/* Quick Stats */}
                <Card p="lg" withBorder style={{ backgroundColor: '#f8fafc' }}>
                  <Title order={5} mb={16}>Quick Stats</Title>
                  <Stack gap={12}>
                    <div>
                      <Text size="sm" c="dimmed">Pricing</Text>
                      <Text fw={600} size="lg">{tool.pricing}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Free Tier</Text>
                      <Badge variant={tool.free_tier_available ? "light" : "outline"} 
                             color={tool.free_tier_available ? "green" : "gray"}>
                        {tool.free_tier_available ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">Category</Text>
                      <Text fw={600}>{tool.category}</Text>
                    </div>
                  </Stack>
                </Card>

                {/* CTA Button */}
                <Button color="blue" size="lg" fullWidth rightSection={<IconExternalLink size={16} />}>
                  Visit Website
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </div>
      )}
    </Card>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '40px 20px' }}>
        <Container size="xl">
          <div style={{ textAlign: 'center' }}>
            <Title order={1} style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, color: 'white' }}>
              Best AI Tools of {new Date().getFullYear()}
            </Title>
            <Text size="lg" style={{ maxWidth: 600, margin: '0 auto', color: '#cbd5e1' }}>
              Comprehensive reviews and comparisons of the top AI tools for productivity, creativity, and business. 
              Find the perfect AI assistant for your needs.
            </Text>
          </div>
        </Container>
      </div>

      <Container size="xl" px="md" py="xl">
        {/* Category Filters */}
        <div style={{ marginBottom: 32 }}>
          <Title order={2} mb={16}>Filter by Category</Title>
          <Group gap={8}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "filled" : "light"}
                color="blue"
                size="sm"
                leftSection={category.icon}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </Group>
        </div>

        {/* Comparison Table */}
        <Box mb={48}>
          <div style={{ marginBottom: 24 }}>
            <Title order={2} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <IconBrain size={24} />
              {selectedCategory === 'all' ? 'All AI Tools Comparison' : categories.find(c => c.id === selectedCategory)?.name}
            </Title>
            <Text c="dimmed" size="lg">
              {selectedCategory === 'all' 
                ? 'Compare the best AI tools across all categories' 
                : `Compare the top ${categories.find(c => c.id === selectedCategory)?.name} tools`
              }
            </Text>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredTools.map((tool) => (
              <ComparisonCard 
                key={tool.id} 
                tool={tool} 
                isExpanded={expandedTool === tool.id}
              />
            ))}
          </div>
        </Box>

        {/* AI Tools Guide */}
        <Box mb={48}>
          <Title order={2} mb={24}>AI Tools Buying Guide</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="lg" withBorder style={{ height: '100%' }}>
                <Title order={4} mb={12}>How to Choose AI Tools</Title>
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  Consider your specific needs, budget, and technical requirements. 
                  Look for tools that integrate well with your existing workflow and offer good customer support.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="lg" withBorder style={{ height: '100%' }}>
                <Title order={4} mb={12}>Pricing Considerations</Title>
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  Many AI tools offer free tiers for basic use. Premium features typically cost $10-50 per month. 
                  Consider value for money based on your usage frequency.
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card p="lg" withBorder style={{ height: '100%' }}>
                <Title order={4} mb={12}>Privacy & Security</Title>
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  Review how AI tools handle your data. Look for encryption, 
                  data retention policies, and compliance with regulations like GDPR.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Frequently Asked Questions */}
        <Box mb={48}>
          <Title order={2} mb={24}>Frequently Asked Questions</Title>
          <Stack gap={16}>
            <Card p="lg" withBorder>
              <Title order={4} mb={8}>What are AI tools?</Title>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                AI tools are software applications that use artificial intelligence to perform tasks like writing, 
                image generation, coding, and analysis. They help automate complex tasks and enhance productivity.
              </Text>
            </Card>
            <Card p="lg" withBorder>
              <Title order={4} mb={8}>Are AI tools worth the cost?</Title>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                For most users, AI tools provide significant time savings and quality improvements that justify their cost. 
                Start with free tiers to evaluate their value for your specific needs.
              </Text>
            </Card>
            <Card p="lg" withBorder>
              <Title order={4} mb={8}>Can AI tools replace human workers?</Title>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                AI tools are designed to augment human capabilities rather than replace them. 
                They handle repetitive tasks and provide assistance, allowing humans to focus on creative and strategic work.
              </Text>
            </Card>
          </Stack>
        </Box>
      </Container>
    </div>
  );
}
