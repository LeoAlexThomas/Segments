export interface SegmentInterface {
  segment_name: string;
  schema: CustomInput[];
}

export interface CustomInput {
  label: string;
  value: string;
}
