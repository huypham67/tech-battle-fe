export type TopicStatus = 'ACTIVE' | 'INACTIVE';

export interface TopicResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconKey: string | null;
  status: TopicStatus;
  parentId: string | null;
}

export interface TopicTreeResponse extends TopicResponse {
  children: TopicTreeResponse[];
}
