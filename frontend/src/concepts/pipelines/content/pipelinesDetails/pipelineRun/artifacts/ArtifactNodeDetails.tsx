import React from 'react';
import { Link } from 'react-router-dom';

import {
  Title,
  Flex,
  FlexItem,
  Stack,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';

import { Artifact } from '~/third_party/mlmd';
import { artifactsDetailsRoute } from '~/routes';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { getArtifactName } from '~/pages/pipelines/global/experiments/artifacts/utils';
import PipelinesTableRowTime from '~/concepts/pipelines/content/tables/PipelinesTableRowTime';
import PipelineRunDrawerRightContent from '~/concepts/pipelines/content/pipelinesDetails/pipelineRun/PipelineRunDrawerRightContent';

type ArtifactNodeDetailsProps = Pick<
  React.ComponentProps<typeof PipelineRunDrawerRightContent>,
  'upstreamTaskName'
> & {
  artifact: Artifact.AsObject;
};

export const ArtifactNodeDetails: React.FC<ArtifactNodeDetailsProps> = ({
  artifact,
  upstreamTaskName,
}) => {
  const { namespace } = usePipelinesAPI();
  const artifactName = getArtifactName(artifact);

  return (
    <Flex
      spaceItems={{ default: 'spaceItems2xl' }}
      direction={{ default: 'column' }}
      className="pf-v5-u-pt-lg pf-v5-u-pb-lg"
    >
      <FlexItem>
        <Stack hasGutter>
          <Title headingLevel="h3">Artifact details</Title>
          <DescriptionList
            isHorizontal
            horizontalTermWidthModifier={{ default: '15ch' }}
            data-testid="artifact-details-description-list"
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Upstream task</DescriptionListTerm>
              <DescriptionListDescription>{upstreamTaskName}</DescriptionListDescription>

              <DescriptionListTerm>Artifact name</DescriptionListTerm>
              <DescriptionListDescription>
                <Link to={artifactsDetailsRoute(namespace, artifact.id)}>{artifactName}</Link>
              </DescriptionListDescription>

              <DescriptionListTerm>Artifact type</DescriptionListTerm>
              <DescriptionListDescription>{artifact.type}</DescriptionListDescription>

              <DescriptionListTerm>Created at</DescriptionListTerm>
              <DescriptionListDescription>
                <PipelinesTableRowTime date={new Date(artifact.createTimeSinceEpoch)} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </Stack>
      </FlexItem>

      <FlexItem>
        <Stack hasGutter>
          <Title headingLevel="h3">Artifact URI</Title>
          <DescriptionList
            isHorizontal
            horizontalTermWidthModifier={{ default: '15ch' }}
            data-testid="artifact-uri-description-list"
          >
            <DescriptionListGroup>
              <DescriptionListTerm>{artifactName}</DescriptionListTerm>
              <DescriptionListDescription>{artifact.uri}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </Stack>
      </FlexItem>
    </Flex>
  );
};
