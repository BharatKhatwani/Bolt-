import type { Step, StepType } from './types';

/*
 * Parse input XML and convert it into steps.
 */
export function parseXml(response: string): Step[] {
  // Extract the XML content between <boltArtifact> tags
  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
  if (!xmlMatch) return [];

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  // Extract artifact title
  const titleMatch = xmlMatch[0].match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  // Add initial artifact step
  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: '',
    type: 'CreateFolder', // string literal instead of enum
    status: 'pending'
  });

  // Regular expression to find boltAction elements
  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
  let match;

  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;
    const codeContent = content.trim();

    if (type === 'file') {
      // File creation step
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: 'CreateFile', // string literal
        status: 'pending',
        code: codeContent,
        path: filePath
      });
    } else if (type === 'shell' && codeContent) {
      // Shell command step
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: 'RunScript', // string literal
        status: 'pending',
        code: codeContent
      });
    }
  }

  return steps;
}
