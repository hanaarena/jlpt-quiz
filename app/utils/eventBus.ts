"use client";

class EventBus {
  private static instance: EventBus;
  private events: { [key: string]: Function[] };

  constructor() {
    this.events = {};
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, data?: any): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((callback) => callback(data));
  }
}

const eventBus = EventBus.getInstance();
export default eventBus;
