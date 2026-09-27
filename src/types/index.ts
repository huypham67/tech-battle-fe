export type TopicStatus = 'ACTIVE' | 'INACTIVE';

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  status: TopicStatus;
  parentId: string | null;
}

export interface TopicTreeNode extends Topic {
  children: TopicTreeNode[];
}

export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}
