import { z } from 'zod';

// ResourceType Enum
export const ResourceTypeSchema = z.enum([
  'documentation',
  'cheatsheet',
  'video',
  'exam_tip'
]);
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

// Resource Object
export const ResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  type: ResourceTypeSchema,
});
export type Resource = z.infer<typeof ResourceSchema>;

// ITILCategory Enum
export const ITILCategorySchema = z.enum([
  'concepts',
  'dimensions',
  'guiding_principles',
  'svs',
  'service_value_chain',
  'practices_detail',
  'practices_overview',
  'governance'
]);
export type ITILCategory = z.infer<typeof ITILCategorySchema>;

// NodeType Enum
export const NodeTypeSchema = z.enum([
  'concept_card',
  'process_gate',
  'practice_node',
  'cycle_hub'
]);
export type NodeType = z.infer<typeof NodeTypeSchema>;

// RoadmapNode Object
export const RoadmapNodeSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Node id must be kebab-case (lowercase letters, numbers, and hyphens only)"
  }),
  title: z.string(),
  category: ITILCategorySchema,
  nodeType: NodeTypeSchema,
  summary: z.string(),
  contentMarkdown: z.string(),
  prerequisites: z.array(z.string()),
  resources: z.array(ResourceSchema),
  width: z.number().default(260),
  height: z.number().default(120),
});
export type RoadmapNode = z.infer<typeof RoadmapNodeSchema>;

// RoadmapEdge Object
export const RoadmapEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  isFeedbackLoop: z.boolean().default(false),
});
export type RoadmapEdge = z.infer<typeof RoadmapEdgeSchema>;

// RoadmapPayload Object
export const RoadmapPayloadSchema = z.object({
  nodes: z.array(RoadmapNodeSchema),
  edges: z.array(RoadmapEdgeSchema),
});
export type RoadmapPayload = z.infer<typeof RoadmapPayloadSchema>;
