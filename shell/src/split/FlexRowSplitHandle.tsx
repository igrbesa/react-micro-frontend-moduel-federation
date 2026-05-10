import type { FlexRowSplitHandleProps } from './useFlexRowSplit'

type Props = {
  className?: string
  'data-testid'?: string
  splitHandleProps: FlexRowSplitHandleProps
}

/** Presentational vertical drag handle for {@link useFlexRowSplit}. */
export function FlexRowSplitHandle({ className, 'data-testid': testId, splitHandleProps }: Props) {
  return <div className={className} data-testid={testId} {...splitHandleProps} />
}
