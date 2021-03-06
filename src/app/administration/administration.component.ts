import { Component } from '@angular/core';

import { User } from 'src/backend/entities/user';
import { Task } from 'src/backend/entities/task';
import { TaskItem } from 'src/backend/entities/taskItem';
import { Project } from 'src/backend/entities/project';
import { Product } from 'src/backend/entities/product';
import { Schedule } from 'src/backend/entities/schedule';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { haveIntersection } from 'src/utils/array';
import { Role } from 'src/backend/entities/role';
import { MessageService } from 'primeng/api';
import { InputService, ANY_ROLE_ACCESS_KEY } from 'ngx-crud-forms';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  title = 'crud';

  actualPermissions = [];

  userEntity: any;
  roleEntity: any;
  taskEntity: any;
  taskItemEntity: any;
  productEntity: any;
  projectEntity: any;
  scheduleEntity: any;

  cols: any[];
  isNavbarCollapsed = true;
  currentSelection = 'modelSetup';
  allEntities: any[] = [];

  productFilter = {};
  userFilter = {};
  taskFilter = {};
  projectFilter = {};
  taskItemFilter = {};
  ganttEntities;
  calendarEvents;
  targetJobs;
  scheduleStart = new Date();
  backList = [];

  constructor(
    private messageService: MessageService,
    public authService: AuthenticationService,
    private inputService: InputService,
    public router: Router) {

    this.actualPermissions = this.authService.getRoles();

    this.userEntity = new User;
    this.roleEntity = new Role;
    this.taskEntity = new Task;
    this.taskItemEntity = new TaskItem;
    this.productEntity = new Product;
    this.projectEntity = new Project;
    this.scheduleEntity = new Schedule;

    this.allEntities.push({ name: 'User', entity: this.inputService.getFormElements(this.userEntity) });
    this.allEntities.push({ name: 'Task', entity: this.inputService.getFormElements(this.taskEntity) });
    this.allEntities.push({ name: 'TaskItem', entity: this.inputService.getFormElements(this.taskItemEntity) });
    this.allEntities.push({ name: 'Product', entity: this.inputService.getFormElements(this.productEntity) });
    this.allEntities.push({ name: 'Project', entity: this.inputService.getFormElements(this.projectEntity) });
    this.allEntities.push({ name: 'Schedule', entity: this.inputService.getFormElements(this.scheduleEntity) });
    this.allEntities.push({ name: 'Role', entity: this.inputService.getFormElements(this.roleEntity) });
  }

  projectSelected(project: Project) {
    this.productFilter = { where: { project: project.id } };
    this.backList.push(this.currentSelection);
    this.currentSelection = 'product';
  }

  userCellSelected(obj: any) {
    const colName = obj['col']['value'];
    this.taskFilter = { where: { [colName]: obj['data'] } };
    this.backList.push(this.currentSelection);
    this.currentSelection = 'task';
  }

  productCellSelected(obj) {
    const colName = obj['col']['value'];
    this.projectFilter = { where: { [colName]: obj['data'] } };
    this.backList.push(this.currentSelection);
    this.currentSelection = 'project';
  }

  taskCellSelected(obj) {
    const colName = obj['col']['value'];
    this.taskItemFilter = { where: { [colName]: obj['data'] } };
    this.backList.push(this.currentSelection);
    this.currentSelection = 'taskitem';
  }

  showSchedule(obj) {
    this.currentSelection = 'gantt';
    this.ganttEntities = obj;
  }

  showCalendar(obj) {
    this.currentSelection = 'calendar';
    this.calendarEvents = obj;
  }

  showPlanner(obj) {
    this.currentSelection = 'planner';
    this.targetJobs = obj.jobs;
    this.scheduleStart = obj.scheduleStart;
  }

  goBack() {
    if (this.backList.length !== 0) {
      this.currentSelection = this.backList.pop();
    }
  }

  onLogoutClicked() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  canReadEntity(entity) {
    const actualRoles = this.authService.getRoles();
    const allowedRoles = this.inputService.getPermissions(entity)['read'];

    if (allowedRoles.includes(ANY_ROLE_ACCESS_KEY)) {
      return true;
    }

    return haveIntersection(actualRoles, allowedRoles);
  }

  showToastMessage(isSuccess: boolean, title: string, message: string) {
    this.messageService.add({
      severity: isSuccess ? 'success' : 'error',
      summary: title,
      detail: message
    });
  }

  handleResult(result) {
    this.showToastMessage(result.success, result.title, result.message);
  }
}
