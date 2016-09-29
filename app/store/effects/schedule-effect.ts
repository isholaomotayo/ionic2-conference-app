/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */

import { Injectable } from '@angular/core';
import { Effect, StateUpdates, toPayload } from '@ngrx/effects';
import { ScheduleActions } from '../actions/schedule-action';
import { AppState } from '../reducers/index';
import { ConferenceService } from '../../core/providers/conference/conference-service';
import { TimelineFilter } from '../../core/providers/conference/timeline-filter-model';
import { ScheduleModel } from '../../core/providers/schedule/schedule-model';

@Injectable()
export class ScheduleEffect {

  constructor(private updates$: StateUpdates<AppState>,
              private scheduleActions: ScheduleActions,
              private conferenceService: ConferenceService) {
  }

  /*@Effect() loadCollectionOnInit$ = Observable.of(this.scheduleActions.loadCollection());*/

  @Effect() loadCollection$ = this.updates$
    .whenAction(ScheduleActions.LOAD_COLLECTION)
    .map<TimelineFilter>(toPayload)
    .switchMap((filter) => this.conferenceService.getTimeline(filter))
    .map((schedules: ScheduleModel) => this.scheduleActions.loadCollectionSuccess(schedules));

  @Effect() loadTracks$ = this.updates$
    .whenAction(ScheduleActions.LOAD_TRACKS)
    .switchMap(() => this.conferenceService.getTracks())
    .map((tracks: Array<string>) => this.scheduleActions.loadTracksSuccess(tracks));
}