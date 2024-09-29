export class CreateQuestionDto {
  readonly text: string;
  readonly index: number;
  readonly isDynamicallyGenerated: boolean;
}
