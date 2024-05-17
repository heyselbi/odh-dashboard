import React from 'react';

import { Stack, StackItem } from '@patternfly/react-core';
import { Value as ProtoValue } from 'google-protobuf/google/protobuf/struct_pb';

import { Execution } from '~/third_party/mlmd';
import TaskDetailsInputOutput from '~/concepts/pipelines/content/pipelinesDetails/taskDetails/TaskDetailsInputOutput';
import { PipelineTask, PipelineTaskParam } from '~/concepts/pipelines/topology';
import { ExecutionDetailsPropertiesValueCode } from '~/pages/pipelines/global/experiments/executions/details/ExecutionDetailsPropertiesValue';
import { InputDefinitionParameterType } from '~/concepts/pipelines/kfTypes';
import { NoValue } from '~/components/NoValue';

type SelectedNodeInputOutputTabProps = {
  task: PipelineTask;
  execution: Execution.AsObject | undefined;
};

const SelectedNodeInputOutputTab: React.FC<SelectedNodeInputOutputTabProps> = ({
  task,
  execution,
}) => {
  const getExecutionFieldsMap = React.useCallback(
    (key: string) =>
      execution?.customPropertiesMap.find(([customPropKey]) => customPropKey === key)?.[1]
        .structValue?.fieldsMap || [],
    [execution?.customPropertiesMap],
  );

  const getExecutionValueFromInputType = React.useCallback(
    (executionValues: ProtoValue.AsObject | undefined, type: InputDefinitionParameterType) => {
      const { numberValue, boolValue, stringValue, listValue, structValue, nullValue } =
        executionValues || {};

      switch (type) {
        case InputDefinitionParameterType.DOUBLE:
        case InputDefinitionParameterType.INTEGER:
          return numberValue;
        case InputDefinitionParameterType.BOOLEAN:
          return boolValue ? 'True' : 'False';
        case InputDefinitionParameterType.STRING:
          try {
            const jsonStringValue = JSON.parse(stringValue ?? '');

            if (parseFloat(jsonStringValue)) {
              throw stringValue;
            }

            return (
              <ExecutionDetailsPropertiesValueCode
                code={JSON.stringify(jsonStringValue, null, 2)}
              />
            );
          } catch {
            return stringValue || <NoValue />;
          }
          break;
        case InputDefinitionParameterType.LIST:
          return <ExecutionDetailsPropertiesValueCode code={JSON.stringify(listValue, null, 2)} />;
        case InputDefinitionParameterType.STRUCT:
          return (
            <ExecutionDetailsPropertiesValueCode code={JSON.stringify(structValue, null, 2)} />
          );
        default:
          return nullValue;
      }
    },
    [],
  );

  const getParams = React.useCallback(
    (
      params: PipelineTaskParam[] | undefined,
      executionParamMapList: [string, ProtoValue.AsObject][],
    ) =>
      params?.map((taskParam) => {
        const { label, value, type } = taskParam;
        const executionParamMap = executionParamMapList.find(
          ([executionInputKey]) => taskParam.label === executionInputKey,
        );
        const { 1: executionParamValues } = executionParamMap || [];
        const executionValue = getExecutionValueFromInputType(executionParamValues, type);

        return {
          label,
          value: executionValue || value || type,
        };
      }),
    [getExecutionValueFromInputType],
  );

  if (!task.inputs && !task.outputs) {
    return <>No content</>;
  }

  return (
    <Stack hasGutter>
      {task.inputs && (
        <StackItem>
          <TaskDetailsInputOutput
            type="Input"
            artifacts={task.inputs.artifacts?.map((a) => ({ label: a.label, value: a.type }))}
            params={getParams(task.inputs.params, getExecutionFieldsMap('inputs'))}
          />
        </StackItem>
      )}
      {task.outputs && (
        <StackItem>
          <TaskDetailsInputOutput
            type="Output"
            artifacts={task.outputs.artifacts?.map((a) => ({ label: a.label, value: a.type }))}
            params={getParams(task.outputs.params, getExecutionFieldsMap('outputs'))}
          />
        </StackItem>
      )}
    </Stack>
  );
};
export default SelectedNodeInputOutputTab;
