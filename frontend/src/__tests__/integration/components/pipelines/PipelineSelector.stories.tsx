import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import PipelineSelector from '~/concepts/pipelines/content/pipelineSelector/PipelineSelector';
import { pipelineVersionSelectorColumns } from '~/concepts/pipelines/content/pipelineSelector/columns';
import { mockPipelineVersionsProxy } from '~/__mocks__/mockPipelineVersionsProxy';

export default {
  component: PipelineSelector,
} as Meta<typeof PipelineSelector>;

export const Default: StoryObj = {
  render: () => (
    <PipelineSelector
      columns={pipelineVersionSelectorColumns}
      data={mockPipelineVersionsProxy}
      onSelect={() => null}
      placeHolder="Select a pipeline version"
      searchHelperText={`Type a name to search your ${mockPipelineVersionsProxy.length} versions.`}
      isLoading={false}
    />
  ),
  play: async ({ canvasElement }) => {
    // load page and wait until settled
    const canvas = within(canvasElement);
    await canvas.findByText('Select a pipeline version', undefined, { timeout: 5000 });
    await userEvent.click(canvas.getByText('Select a pipeline version'));
  },
};
