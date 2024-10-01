import { CreateQuestionDto } from 'src/module/question/dto/create-question.dto';

export const questions = [
  {
    index: 0,
    text: "Hi there! I'm Bolt. What's your name?",
    isDynamicallyGenerated: false,
  },
  {
    index: 1,
    text: 'Nice to meet you, {name}! I will ask you a few questions to get to know you better. Please answer each question to the best of your ability.',
    isDynamicallyGenerated: false,
  },
  {
    index: 2,
    text: 'What is your favorite breed of cat, and why?',
    isDynamicallyGenerated: false,
  },
  {
    index: 3,
    text: 'How do you think cats communicate with their owners?',
    isDynamicallyGenerated: false,
  },
  {
    index: 4,
    text: 'Have you ever owned a cat? If so, what was their name and personality like?',
    isDynamicallyGenerated: false,
  },
  {
    index: 5,
    text: 'Why do you think cats love to sleep in small, cozy places?',
    isDynamicallyGenerated: false,
  },
  {
    index: 6,
    text: 'What’s the funniest or strangest behavior you’ve ever seen a cat do?',
    isDynamicallyGenerated: false,
  },
  {
    index: 7,
    text: 'Do you prefer cats or kittens, and what’s the reason for your preference?',
    isDynamicallyGenerated: false,
  },
  {
    index: 8,
    text: 'Why do you think cats are known for being independent animals?',
    isDynamicallyGenerated: false,
  },
  {
    index: 9,
    text: 'How do you think cats manage to land on their feet when they fall?',
    isDynamicallyGenerated: false,
  },
  {
    index: 10,
    text: 'What’s your favorite fact or myth about cats?',
    isDynamicallyGenerated: false,
  },
  {
    index: 11,
    text: 'How would you describe the relationship between humans and cats in three words?',
    isDynamicallyGenerated: false,
  },
] as CreateQuestionDto[];
