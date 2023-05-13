interface TimerSemaphoreItemType {
  resolve: any
  reject: any
  fnToCall: any
  args: any[]
  retry: number
  callClass?: any
}

export default class TimerSemaphore {
  currentRequests: Array<TimerSemaphoreItemType>
  start: number
  timeBetweenRequest: number
  timeout: NodeJS.Timeout | undefined
  retry

  constructor(timeBetweenRequest = 0, retry = 0) {
    this.currentRequests = []
    this.start = Date.now()
    this.timeBetweenRequest = timeBetweenRequest
    this.retry = retry
  }

  callFunction(fnToCall: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        fnToCall,
        args,
        retry: this.retry,
      });
      this.tryNext()
    })
  }

  callClassFunction(callClass: any, fnToCall: any, ...args: any[]) {
    return new Promise((resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        fnToCall,
        args,
        retry: this.retry,
        callClass,
      });
      this.tryNext()
    })
  }

  tryNext() {
    if (!this.currentRequests.length) {
      this.timeout = undefined
      return;
    } else {
      if (this.start + this.timeBetweenRequest <= Date.now()) {
        const item = this.currentRequests.shift();
        if (item) {
          this.start = Date.now();
          //console.log(new Date(this.start), item.fnToCall, this.timeBetweenRequest)
          let req
          if (item.callClass) {
            req = item.fnToCall.apply(item.callClass, item.args) as any
          } else {
            req = item.fnToCall(...item.args) as any;
          }
          req.then((res: any) => item.resolve(res))
            .catch((err: any) => {
              if (item.retry) {
                this.currentRequests.push({
                  ...item,
                  retry: item.retry - 1,
                })
                this.tryNext()
              } else {
                item.reject(err)
              }
            })
          this.tryNext()

        }
      } else if (!this.timeout) {
        let timeRemaining = (this.start) + this.timeBetweenRequest - Date.now()
        if (timeRemaining < 1) timeRemaining = 100
        this.timeout = setTimeout(() => {
          this.timeout = undefined
          this.tryNext()
        }, timeRemaining)
      }
    }
  }
}
