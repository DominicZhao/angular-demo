import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTaskComponent implements OnInit {

  public title = '';
  public prioritys = [
    {
      label: '紧急',
      value: 1
    },
    {
      label: '重要',
      value: 2
    },
    {
      label: '普通',
      value: 3
    }
  ];

  public myForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.myForm = this.fb.group({
      desc: [this.data.task ? this.data.task.desc : '', Validators.required],
      priority: [this.data.task ? this.data.task.priority : 3, Validators.required],
      owner: [this.data.task ? [this.data.task.owner] : [this.data.owner]],
      dueDate: [this.data.task ? this.data.task.dueDate : ''],
      reminder: [this.data.task ? this.data.task.reminder : ''],
      followers: [this.data.task ? [...this.data.task.participants] : []],
      remark: [this.data.task ? this.data.task.remark : ''],
    });
  }

  onSubmit(ev: Event, { value, valid }) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({
      ...value,
      ownerId: value.owner.length > 0 ? value.owner[0].id : null,
      participantIds: value.followers.map(f => f.id),
    });
  }

}
