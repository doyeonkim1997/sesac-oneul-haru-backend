// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { GoalRepository } from './goalRepository';

// @Injectable()
// export class GoalScheduleService {
//   private readonly logger = new Logger(GoalScheduleService.name);

//   constructor(private readonly goalRepository: GoalRepository) {}

//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   async handleCron() {
//     this.logger.debug('자정이 되었습니다. 목표 상태를 업데이트합니다.');

//     try{
//       const incpmpleteGoals = await this.goalRepository.findIncompleteGoals();
//     }

//     this.logger.debug(`처리된 미완료 목표 수: ${incompleteGoals.length}`);
//     } catch (error) {
//       this.logger.error('자정 작업 중 오류 발생', error);
//     }
// }
