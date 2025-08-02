import React from 'react';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { TaskCard } from '../components/TaskCard';
import { AIToolsCard } from '../components/AIToolsCard';
import { Text } from 'react-native';

declare const console: any;

export function SlotRouter(slot: string): React.JSX.Element {
  console.log(`[SlotRouter] Resolving slot: ${slot}`);

  switch (slot) {
    case 'MOCK_DASHBOARD_ENTRY':
      return <ThoughtmarkCard />;
    case 'MOCK_TASKS_ENTRY':
      return <TaskCard />;
    case 'MOCK_AI_TOOLS_ENTRY':
      return <AIToolsCard />;
    default:
      return <Text>🔘 Unmapped slot: {slot}</Text>;
  }
}