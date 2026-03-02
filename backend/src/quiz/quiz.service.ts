import { Injectable } from '@nestjs/common';
import {
  questions as ethicsQuestions,
  characters as ethicsCharacters,
  calculateResult as ethicsCalculateResult,
  type Dimension as EthicsDimension,
  type QuizResult as EthicsQuizResult,
} from './data/ethics.js';
import {
  questions as virtualQuestions,
  characters as virtualCharacters,
  calculateResult as virtualCalculateResult,
  type Dimension as VirtualDimension,
  type QuizResult as VirtualQuizResult,
} from './data/virtual.js';

type GenericQuizResult = EthicsQuizResult | VirtualQuizResult;

@Injectable()
export class QuizService {
  getQuestions(quizSlug: string = 'ethics') {
    if (quizSlug === 'virtual') return virtualQuestions;
    return ethicsQuestions;
  }

  getCharacters(quizSlug: string = 'ethics') {
    if (quizSlug === 'virtual') return virtualCharacters;
    return ethicsCharacters;
  }

  calculateFromAnswerList(
    quizSlug: string,
    answerList: { questionId: number; dimension: string }[],
  ): GenericQuizResult {
    if (quizSlug === 'virtual') {
      const answers: Record<number, VirtualDimension> = {};
      for (const a of answerList) {
        answers[a.questionId] = a.dimension as VirtualDimension;
      }
      return virtualCalculateResult(answers);
    }

    const answers: Record<number, EthicsDimension> = {};
    for (const a of answerList) {
      answers[a.questionId] = a.dimension as EthicsDimension;
    }
    return ethicsCalculateResult(answers);
  }
}
