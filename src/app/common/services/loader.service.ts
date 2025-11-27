import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;

  constructor() {}

  /**
   * Observable that components can subscribe to for loading state
   */
  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * Get current loading state synchronously
   */
  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Show the loader - increments active requests counter
   */
  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Hide the loader - decrements active requests counter
   * Only hides when all requests are complete
   */
  hide(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force hide the loader regardless of active requests
   * Use with caution - mainly for error scenarios
   */
  forceHide(): void {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Force show the loader
   */
  forceShow(): void {
    this.loadingSubject.next(true);
  }
}