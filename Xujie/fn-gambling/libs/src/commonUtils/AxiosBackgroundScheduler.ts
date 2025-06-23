// import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
//
// type Task = {
//   axiosInstance: AxiosInstance;
//   config: AxiosRequestConfig;
//   resolve: (res: AxiosResponse) => void;
//   reject: (err: any) => void;
//   priority: number;
// };
//
// interface InstanceOptions {
//   basePriority?: number;
//   maxConcurrent?: number;
// }
//
// export class AxiosBackgroundScheduler {
//   private queue: Task[] = [];
//   private runningCountMap = new Map<AxiosInstance, number>();
//   private instanceOptionsMap = new Map<AxiosInstance, InstanceOptions>();
//
//   /**
//    * 設定特定 instance 的排程選項
//    */
//   setInstanceOptions(instance: AxiosInstance, options: InstanceOptions) {
//     this.instanceOptionsMap.set(instance, {
//       basePriority: options.basePriority ?? 0,
//       maxConcurrent: options.maxConcurrent ?? 3,
//     });
//   }
//
//   /**
//    * 發出背景排程請求
//    * @param axiosInstance 對應的 Axios instance
//    * @param config 請求參數
//    * @param extraPriority 額外加權值
//    */
//   request(
//     axiosInstance: AxiosInstance,
//     config: AxiosRequestConfig,
//     extraPriority = 0
//   ): Promise<AxiosResponse> {
//     const options = this.instanceOptionsMap.get(axiosInstance) ?? {
//       basePriority: 0,
//       maxConcurrent: 3,
//     };
//
//     const totalPriority = (options.basePriority ?? 0) + extraPriority;
//
//     return new Promise((resolve, reject) => {
//       this.queue.push({
//         axiosInstance,
//         config,
//         resolve,
//         reject,
//         priority: totalPriority,
//       });
//
//       this.queue.sort((a, b) => b.priority - a.priority);
//       this.runNext();
//     });
//   }
//
//   private runNext() {
//     for (let i = 0; i < this.queue.length; i++) {
//       const task = this.queue[i];
//       const options = this.instanceOptionsMap.get(task.axiosInstance) ?? {
//         maxConcurrent: 3,
//       };
//       const runningCount = this.runningCountMap.get(task.axiosInstance) ?? 0;
//
//       if (runningCount < (options.maxConcurrent || 0)) {
//         this.queue.splice(i, 1); // 從 queue 中移除
//         this.executeTask(task);
//         break; // 只跑一個，避免競爭
//       }
//     }
//   }
//
//   private executeTask(task: Task) {
//     const current = this.runningCountMap.get(task.axiosInstance) ?? 0;
//     this.runningCountMap.set(task.axiosInstance, current + 1);
//
//     task
//       .axiosInstance(task.config)
//       .then(task.resolve)
//       .catch(task.reject)
//       .finally(() => {
//         const current = this.runningCountMap.get(task.axiosInstance) ?? 1;
//         this.runningCountMap.set(task.axiosInstance, current - 1);
//         this.runNext();
//       });
//   }
// }
//
// export const axiosScheduler = new AxiosBackgroundScheduler();
