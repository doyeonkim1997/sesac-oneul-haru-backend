// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { GoalRepository } from './goal.repository';

// @Injectable()
// export class GoalScheduleService {
//   private readonly logger = new Logger(GoalScheduleService.name);

//   constructor(
//     private readonly goalRepository: GoalRepository,
//     // private readonly notificationService: NotificationService, // 알림 기능을 여기서 호출한다면 주석 해제
//   ) {}

//   // GO-06 자정 목표 처리: 자정이 되면 사용자가 추가한 목표는

//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   async handleMidnightGoalProcessing() {
//     this.logger.log('[Schedule] 자정 목표 처리 스케줄러 실행...');

//     try {
//       const todayMidnight = new Date();
//       todayMidnight.setHours(0, 0, 0, 0); // 오늘 00:00:00 (KST)

//       // 예를 들어, 오늘 자정보다 '생성일'이 이른 (즉, 어제까지 생성된) 미완료 목표들을 찾아 만료 처리
//       const updatedCount = await this.goalRepository.markAsExpired(todayMidnight);

//       this.logger.log(`✅ [Schedule] 자정 목표 처리 완료: ${updatedCount}개의 목표가 만료 처리되었습니다.`);

//       // AR-01 2번: 자정이 되면 "금일 목표를 완료해주지 못한다고 알려준다." 알림
//       // (만약 알림 기능을 여기서 호출한다면)
//       const expiredGoalsForNotification = await this.goalRepository.prisma.goal.findMany({
//         where: {
//           isExpired: true,
//           isCompleted: false, // 만료되었지만 아직 완료되지 않은 목표에 알림
//           updatedAt: { gte: todayMidnight }, // 방금 업데이트된 (만료 처리된) 목표만 대상으로
//         },
//         include: { user: true }
//       });
//       for (const goal of expiredGoalsForNotification) {
//         if (goal.user) {
//           await this.notificationService.sendGoalCompletionReminder(
//             goal.userId,
//             goal.user.nickName,
//             goal.title,
//             'MIDNIGHT'
//           );
//         }
//       }
//       this.logger.log('[Schedule] 자정 목표 미완료 알림 전송 완료.');

//     } catch (error) {
//       this.logger.error(`[Schedule] 자정 목표 처리 중 오류 발생: ${error.message}`, error.stack);
//     }
//   }
// }
