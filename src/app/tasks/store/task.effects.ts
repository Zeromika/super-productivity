import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TaskActionTypes } from './task.actions';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { PROJECT_FEATURE_NAME } from '../../project/store/project.reducer';
import { PersistenceService } from '../../core/persistence/persistence.service';
import { TASK_FEATURE_NAME } from './task.reducer';

// TODO send message to electron when current task changes here

@Injectable()
export class TaskEffects {
  @Effect({dispatch: false}) updateTask$: any = this._actions$
    .pipe(
      ofType(
        TaskActionTypes.AddTask,
        TaskActionTypes.DeleteTask,
        TaskActionTypes.AddSubTask,
        TaskActionTypes.SetCurrentTask,
        TaskActionTypes.UnsetCurrentTask,
        TaskActionTypes.UpdateTask,
      ),
      withLatestFrom(this._store$),
      tap(this._saveToLs.bind(this))
    );

  constructor(private _actions$: Actions,
              private _store$: Store<any>,
              private _persistenceService: PersistenceService) {
  }

  private _saveToLs(state) {
    const tasksFeatureState = state[1][TASK_FEATURE_NAME];
    const projectId = state[1][PROJECT_FEATURE_NAME].currentId;
    if (projectId) {
      this._persistenceService.saveTasksForProject(projectId, tasksFeatureState);
    } else {
      throw new Error('No current project id');
    }
  }
}


