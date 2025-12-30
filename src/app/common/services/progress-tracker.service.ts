import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProgressTracker {
  main_title: string;
  sub_title: string;
  process: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ProgressTrackerService {
  LiveProgressTracker$ = new BehaviorSubject<ProgressTracker>({
    main_title: 'Loading..',
    sub_title: 'please wait...',
    process: [],
  });

  // liveProgressConst = {
  //   GENERIC: {
  //     main_title: 'Loading..',
  //     sub_title: 'please wait...',
  //     process: [],
  //   },
  //   PARSING: {
  //     main_title: 'Parsing Query',
  //     sub_title: 'Analyzing and structuring your request',
  //     process: [
  //       {
  //         icon: 'search',
  //         step_name: 'Extracting query parameters',
  //       },
  //       {
  //         icon: 'analytics',
  //         step_name: 'Identifying requested metrics',
  //       },
  //       {
  //         icon: 'business',
  //         step_name: 'Detecting company entities',
  //       },
  //     ],
  //   },

  //   COMPANY_RESOLUTION: {
  //     main_title: 'Resolving Companies',
  //     sub_title: 'Validating and matching company identifiers',
  //     process: [
  //       {
  //         icon: 'fact_check',
  //         step_name: 'Verifying company identities',
  //       },
  //       {
  //         icon: 'link',
  //         step_name: 'Mapping to SEC database',
  //       },
  //     ],
  //   },

  //   BATCH_ANALYSIS: {
  //     main_title: 'Processing Financial Data',
  //     sub_title: 'Retrieving and analyzing financial statements',
  //     process: [
  //       {
  //         icon: 'cloud_download',
  //         step_name: 'Fetching SEC filings',
  //       },
  //       {
  //         icon: 'calculate',
  //         step_name: 'Extracting financial metrics',
  //       },
  //       {
  //         icon: 'table_chart',
  //         step_name: 'Structuring data tables',
  //       },
  //     ],
  //   },

  //   VARIANCE_ANALYSIS: {
  //     main_title: 'Performing Variance Analysis',
  //     sub_title: 'Computing period-over-period changes',
  //     process: [
  //       {
  //         icon: 'compare_arrows',
  //         step_name: 'Calculating quarterly variance',
  //       },
  //       {
  //         icon: 'trending_up',
  //         step_name: 'Identifying trends and anomalies',
  //       },
  //     ],
  //   },
  // };

  liveProgressConst = {
    GENERIC: {
      main_title: 'Loading..',
      sub_title: 'please wait...',
      process: [],
    },
    PARSING: {
      id: 1,
      main_title: 'Parsing Query',
      sub_title: 'Analyzing and structuring your request',
      process: [
        {
          id: 1.1,
          icon: 'crop_square',
          step_name: 'Analyzing and structuring your request',
        },
       
      ],
    },

    COMPANY_RESOLUTION: {
      id: 2,
      main_title: 'Resolving Companies',
      sub_title: 'Validating and matching company identifiers',
      process: [
         {
          id: 2.1,
          icon: 'check_box',
          step_name: 'Analyzing and structuring your request',
        },
        {
          id: 2.2,
          icon: 'crop_square',
          step_name: 'Verifying company identities',
        },
       
      ],
    },

    BATCH_ANALYSIS: {
      id: 3,
      main_title: 'Processing Financial Data',
      sub_title: 'Retrieving and analyzing financial statements',
      process: [
          {
            id: 3.1,
          icon: 'check_box',
          step_name: 'Analyzing and structuring your request',
        },
        {
          id: 3.2,
          icon: 'check_box',
          step_name: 'Verifying company identities',
        },
        {
          id: 3.3,
          icon: 'crop_square',
          step_name: 'Fetching SEC filings',
        },
        
      ],
    },

    VARIANCE_ANALYSIS: {
      
      main_title: 'Performing Variance Analysis',
      sub_title: 'Computing period-over-period changes',
      process: [
          {
            id: 4.1,
          icon: 'check_box',
          step_name: 'Analyzing and structuring your request',
        },
        {
          id:4.2,
          icon: 'check_box',
          step_name: 'Verifying company identities',
        },
        {
          id: 4.3,
          icon: 'check_box',
          step_name: 'Retrieving and analyzing financial statements',
        },
       
        {
          id: 4.4,
          icon: 'crop_square',
          step_name: 'Computing period-over-period changes',
        },
      ],
    },
  };

  updateLiveProgressTracker(data: any) {
    this.LiveProgressTracker$.next(data);
  }
}
