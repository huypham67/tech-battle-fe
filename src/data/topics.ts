import type { TopicTreeNode } from '@/types';

function createChild(parentId: string, name: string): TopicTreeNode {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    id: `${parentId}-${slug}`,
    name,
    slug,
    description: null,
    iconUrl: null,
    status: 'ACTIVE',
    parentId,
    children: [],
  };
}

function createTopic(
  id: string,
  name: string,
  description: string,
  childNames: string[],
): TopicTreeNode {
  return {
    id,
    name,
    slug: id,
    description,
    iconUrl: null,
    status: 'ACTIVE',
    parentId: null,
    children: childNames.map((childName) => createChild(id, childName)),
  };
}

export const TOPIC_TREE: TopicTreeNode[] = [
  createTopic('backend', 'Backend', 'Java, Spring Boot, REST và dịch vụ.', [
    'Java',
    'Spring Boot',
    'REST API',
    'Authentication',
    'Microservices',
  ]),
  createTopic('database', 'Database', 'SQL, transaction và tối ưu truy vấn.', [
    'SQL',
    'Index',
    'Transaction',
    'Query Optimization',
    'PostgreSQL',
  ]),
  createTopic('devops', 'DevOps', 'Linux, container, CI/CD và monitoring.', [
    'Linux',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'Monitoring',
  ]),
  createTopic('cloud', 'Cloud', 'Nền tảng và dịch vụ cloud phổ biến.', ['AWS', 'Azure', 'GCP']),
  createTopic('linux', 'Linux', 'Shell, permission, process và systemd.', [
    'Shell',
    'Permissions',
    'Processes',
    'systemd',
  ]),
  createTopic('networking', 'Networking', 'TCP/IP, DNS, HTTP và load balancing.', [
    'TCP/IP',
    'DNS',
    'HTTP',
    'Load Balancing',
  ]),
  createTopic('docker', 'Docker', 'Image, container, volume và network.', [
    'Images',
    'Containers',
    'Volumes',
    'Compose',
  ]),
  createTopic('kubernetes', 'Kubernetes', 'Pods, services, deployment và ingress.', [
    'Pods',
    'Services',
    'Networking',
    'Ingress',
    'Scheduling',
  ]),
];

export function getTopicTree(): TopicTreeNode[] {
  return TOPIC_TREE;
}
