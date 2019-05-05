import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getDate } from 'date-fns';
import { Project } from '../../domain';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public today = 'day';
  public projects$: Observable<Project[]>;

  constructor(
    private store$: Store<fromRoot.State>
  ) {
    this.projects$ = this.store$.select(fromRoot.getProjects);
  }

  @Output() navClick = new EventEmitter<void>();

  ngOnInit() {
    this.today = `day${getDate(new Date())}`;
  }

  onNavClick() {
    this.navClick.emit();
  }

  onPrjClick(prj: Project) {
    this.store$.dispatch(new actions.SelectProjectAction(prj));
    this.navClick.emit();
  }

}
